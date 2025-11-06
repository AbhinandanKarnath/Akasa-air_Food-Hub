const Item = require('../models/Item');

// Fetch all items or filter by category
exports.getItems = async (req, res) => {
    const { category } = req.query;
    try {
        const query = category ? { category } : {};
        const items = await Item.find(query);
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items', error });
    }
};

// Fetch a single item by ID
exports.getItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item', error });
    }
};

// Add a new item to the inventory (Admin only)
exports.addItem = async (req, res) => {
    const newItem = new Item(req.body);
    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error adding item', error });
    }
};

// Update an existing item (Admin only)
exports.updateItem = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error updating item', error });
    }
};

// Delete an item from the inventory (Admin only)
exports.deleteItem = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedItem = await Item.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error });
    }
};