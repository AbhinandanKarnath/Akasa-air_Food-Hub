const express = require('express');
const Order = require('../models/Order');
const Item = require('../models/Item');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's order history
router.get('/', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.item', 'name category price')
            .sort({ createdAt: -1 });

        const formattedOrders = orders.map(order => ({
            id: order._id,
            status: order.status,
            total: order.total,
            date: order.createdAt,
            deliveryAddress: order.deliveryAddress?.full || 'Not specified',
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            items: order.items.map(item => ({
                id: item.item._id,
                name: item.name || item.item.name,
                category: item.item.category,
                quantity: item.quantity,
                price: item.price
            }))
        }));

        res.json({ data: formattedOrders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching order history' });
    }
});

// Create new order
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { items, deliveryAddress, paymentMethod, orderNotes } = req.body;

        // Validate items and calculate total
        let total = 0;
        const orderItems = [];

        for (const cartItem of items) {
            const item = await Item.findById(cartItem.id);
            if (!item || !item.isActive) {
                return res.status(400).json({ message: `Item ${cartItem.name} not found` });
            }
            
            if (item.stock < cartItem.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${item.name}. Available: ${item.stock}` 
                });
            }

            orderItems.push({
                item: item._id,
                name: item.name,
                price: item.price,
                quantity: cartItem.quantity
            });

            total += item.price * cartItem.quantity;
        }

        // Create order
        const order = new Order({
            user: req.user._id,
            items: orderItems,
            total,
            deliveryAddress: {
                full: deliveryAddress || req.user.address || 'Default address'
            },
            paymentMethod: paymentMethod || 'credit_card',
            paymentStatus: 'paid',
            orderNotes
        });

        await order.save();

        // Update item stock
        for (const cartItem of items) {
            await Item.findByIdAndUpdate(
                cartItem.id,
                { $inc: { stock: -cartItem.quantity } }
            );
        }

        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            orderId: order._id,
            trackingId: order._id,
            order: {
                id: order._id,
                status: order.status,
                total: order.total,
                date: order.createdAt,
                items: orderItems
            }
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to process order. Please try again.' 
        });
    }
});

module.exports = router;