const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    name: String,
    price: Number,
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    total: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'delivered', 'cancelled'],
        default: 'pending'
    },
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        full: String
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'paypal', 'cash_on_delivery'],
        default: 'credit_card'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    orderNotes: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);