const express = require('express');
const Item = require('../models/Item');

const router = express.Router();

// Get all items or by category
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        let query = { isActive: true };
        
        if (category && category !== 'All') {
            query.category = category;
        }

        const items = await Item.find(query).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Error fetching items' });
    }
});

// Get single item
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item || !item.isActive) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ message: 'Error fetching item' });
    }
});

// Check stock availability
router.post('/check-stock', async (req, res) => {
    try {
        const { cartItems } = req.body;
        
        const stockCheck = await Promise.all(
            cartItems.map(async (cartItem) => {
                const item = await Item.findById(cartItem.id);
                return {
                    ...cartItem,
                    available: item ? item.stock >= cartItem.quantity : false,
                    availableStock: item ? item.stock : 0
                };
            })
        );

        res.json({
            success: true,
            data: stockCheck,
            allAvailable: stockCheck.every(item => item.available)
        });
    } catch (error) {
        console.error('Error checking stock:', error);
        res.status(500).json({ message: 'Error checking stock availability' });
    }
});

module.exports = router;