const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Item = require('../models/Item');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { userId, cartId } = req.body;

        // Find the cart and check item availability
        const cart = await Cart.findById(cartId).populate('items.itemId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const unavailableItems = cart.items.filter(item => item.itemId.stock < item.quantity);
        if (unavailableItems.length > 0) {
            return res.status(400).json({ message: 'Some items are not available', unavailableItems });
        }

        // Create the order
        const order = new Order({
            userId,
            items: cart.items,
            totalAmount: cart.items.reduce((total, item) => total + (item.itemId.price * item.quantity), 0),
            status: 'Pending',
        });

        await order.save();

        // Update item stock
        for (const item of cart.items) {
            await Item.findByIdAndUpdate(item.itemId, { $inc: { stock: -item.quantity } });
        }

        res.status(201).json({ message: 'Order created successfully', orderId: order._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get order history for a user
exports.getOrderHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId }).populate('items.itemId');

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get order details by order ID
exports.getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate('items.itemId');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};