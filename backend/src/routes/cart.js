const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/auth');

// Route to add an item to the cart
router.post('/add', authMiddleware, cartController.addItemToCart);

// Route to remove an item from the cart
router.delete('/remove/:itemId', authMiddleware, cartController.removeItemFromCart);

// Route to get the user's cart
router.get('/', authMiddleware, cartController.getCart);

// Route to checkout the cart
router.post('/checkout', authMiddleware, cartController.checkoutCart);

module.exports = router;