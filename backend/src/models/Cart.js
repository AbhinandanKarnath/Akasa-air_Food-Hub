import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [cartItemSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;