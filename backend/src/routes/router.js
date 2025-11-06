const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// Validate stock availability
router.post('/validate-stock', auth, async (req, res) => {
  try {
    const { items } = req.body;
    const outOfStock = [];

    console.log('Validating stock for items:', items);

    for (const cartItem of items) {
      const itemId = cartItem.id || cartItem._id;
      const item = await Item.findById(itemId);
      
      if (!item) {
        outOfStock.push({
          id: itemId,
          name: cartItem.name || 'Unknown Item',
          requested: cartItem.quantity,
          available: 0,
          reason: 'Item not found'
        });
      } else if (item.stock < cartItem.quantity) {
        outOfStock.push({
          id: itemId,
          name: item.name,
          requested: cartItem.quantity,
          available: item.stock,
          reason: 'Insufficient stock'
        });
      }
    }

    console.log('Stock validation result:', { outOfStock });

    res.json({
      success: true,
      outOfStock,
      allAvailable: outOfStock.length === 0
    });
  } catch (error) {
    console.error('Stock validation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Stock validation failed', 
      error: error.message 
    });
  }
});

// Create new order
router.post('/create', auth, async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress } = req.body;

    console.log('Creating order for user:', req.user.id);
    console.log('Order data:', { items, totalAmount, deliveryAddress });

    // Validate stock again before creating order
    const outOfStock = [];
    const orderItems = [];

    for (const cartItem of items) {
      const item = await Item.findById(cartItem.item);
      if (!item) {
        outOfStock.push({
          name: cartItem.name || 'Unknown Item',
          requested: cartItem.quantity,
          available: 0
        });
      } else if (item.stock < cartItem.quantity) {
        outOfStock.push({
          name: item.name,
          requested: cartItem.quantity,
          available: item.stock
        });
      } else {
        orderItems.push({
          item: item._id,
          name: item.name,
          price: cartItem.price || item.price,
          quantity: cartItem.quantity
        });
      }
    }

    if (outOfStock.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Some items are out of stock',
        outOfStock
      });
    }

    // Create order
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      estimatedDelivery: new Date(Date.now() + 45 * 60000) // 45 minutes
    });

    await order.save();

    // Deduct stock from inventory
    for (const orderItem of orderItems) {
      await Item.findByIdAndUpdate(
        orderItem.item,
        { $inc: { stock: -orderItem.quantity } }
      );
    }

    console.log('Order created successfully:', order);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Order creation failed', 
      error: error.message 
    });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    console.log('Fetching orders for user:', req.user.id);
    
    const orders = await Order.find({ user: req.user.id })
      .populate('items.item')
      .sort({ createdAt: -1 });

    console.log(`Found ${orders.length} orders`);

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch orders', 
      error: error.message 
    });
  }
});

// Get single order
router.get('/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user.id
    }).populate('items.item');

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Fetch single order error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch order', 
      error: error.message 
    });
  }
});

// Update order status
router.patch('/:orderId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid status' 
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Status update failed', 
      error: error.message 
    });
  }
});

module.exports = router;