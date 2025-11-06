const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Fruit', 'Vegetable', 'Non-veg', 'Breads', 'Dairy', 'Beverages']
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 4.5,
        min: 0,
        max: 5
    },
    nutritionalInfo: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Item', itemSchema);