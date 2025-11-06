import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  CreditCard,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/Common/ConfirmationModal';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [isClearing, setIsClearing] = useState(false);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId) => {
    const item = cartItems.find(item => (item.id === itemId || item._id === itemId));
    setItemToRemove(item);
    setShowRemoveConfirmation(true);
  };

  const confirmRemoveItem = async () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove.id || itemToRemove._id);
      toast.success(`${itemToRemove.name} removed from cart`);
      setItemToRemove(null);
      setShowRemoveConfirmation(false);
    }
  };

  const handleClearCart = () => {
    setShowClearConfirmation(true);
  };

  const confirmClearCart = async () => {
    setIsClearing(true);
    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      clearCart();
      toast.success('Cart cleared successfully');
      setShowClearConfirmation(false);
    } catch (error) {
      toast.error('Failed to clear cart');
    } finally {
      setIsClearing(false);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="mb-8">
              <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
              <p className="text-gray-600">Add some delicious items to get started!</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-full transition-all duration-200 shadow-md"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
                <p className="text-gray-600">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
              </div>
            </div>
            
            {/* Clear Cart Button */}
            <button
              onClick={handleClearCart}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-all duration-200 font-medium"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear Cart</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div key={item.id || item._id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center space-x-4">
                    {/* Item Image Placeholder */}
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center text-3xl">
                      {item.category === 'Fruit' && '🍎'}
                      {item.category === 'Vegetable' && '🥕'}
                      {item.category === 'Non-veg' && '🍗'}
                      {item.category === 'Breads' && '🍞'}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                      <p className="text-gray-500 text-sm">{item.category}</p>
                      <p className="text-orange-600 font-bold text-lg">${item.price?.toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center bg-gray-100 rounded-lg border">
                        <button
                          onClick={() => handleQuantityChange(item.id || item._id, item.quantity - 1)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-l-lg transition-all duration-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 font-medium bg-white border-l border-r border-gray-200 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id || item._id, item.quantity + 1)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-r-lg transition-all duration-200"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id || item._id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="mt-4 flex justify-between items-center border-t pt-4">
                    <span className="text-gray-600">Item Total:</span>
                    <span className="font-bold text-lg text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-8">
                <h2 className="font-bold text-xl text-gray-800 mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>$3.99</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg text-gray-800">
                      <span>Total</span>
                      <span>${(getCartTotal() + 3.99 + (getCartTotal() * 0.08)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Proceed to Checkout</span>
                </button>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate('/')}
                    className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearConfirmation}
        onClose={() => setShowClearConfirmation(false)}
        onConfirm={confirmClearCart}
        title="Clear Cart"
        message={`Are you sure you want to clear your cart? This will remove all ${cartItems.length} item${cartItems.length !== 1 ? 's' : ''} and cannot be undone.`}
        confirmText="Clear Cart"
        cancelText="Keep Items"
        type="danger"
        loading={isClearing}
      />

      {/* Remove Item Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRemoveConfirmation}
        onClose={() => {
          setShowRemoveConfirmation(false);
          setItemToRemove(null);
        }}
        onConfirm={confirmRemoveItem}
        title="Remove Item"
        message={`Are you sure you want to remove "${itemToRemove?.name}" from your cart?`}
        confirmText="Remove"
        cancelText="Keep Item"
        type="warning"
      />
    </div>
  );
};

export default CartPage;