const Cart = require('../models/Cart');
const Item = require('../models/Item');

// Add item to cart
exports.addItemToCart = async (req, res) => {
    const { userId, itemId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.itemId.toString() === itemId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ itemId, quantity });
        }

        await cart.save();
        res.status(200).json({ message: 'Item added to cart successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart', error });
    }
};

// Get user's cart
exports.getCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ userId }).populate('items.itemId');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cart', error });
    }
};

// Checkout cart
exports.checkoutCart = async (req, res) => {
    const { userId } = req.body;

    try {
        const cart = await Cart.findOne({ userId }).populate('items.itemId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const unavailableItems = [];

        for (const item of cart.items) {
            const inventoryItem = await Item.findById(item.itemId);

            if (inventoryItem.stock < item.quantity) {
                unavailableItems.push(inventoryItem.name);
            }
        }

        if (unavailableItems.length > 0) {
            return res.status(400).json({ message: 'Not Available: ' + unavailableItems.join(', ') });
        }

        // Proceed with order processing (not implemented here)
        res.status(200).json({ message: 'Checkout successful', orderId: '12345' });
    } catch (error) {
        res.status(500).json({ message: 'Error during checkout', error });
    }
};