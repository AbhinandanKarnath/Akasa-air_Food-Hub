import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { CreditCard, MapPin, Clock, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { createOrder, validateStock } from '../services/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stockIssues, setStockIssues] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    zipCode: '',
    phone: ''
  });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cartItems.length, navigate, orderSuccess]);

  const handleAddressChange = (e) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [e.target.name]: e.target.value
    });
  };

  const validateStockAvailability = async () => {
    try {
      const stockValidation = await validateStock(cartItems);
      if (stockValidation.outOfStock.length > 0) {
        setStockIssues(stockValidation.outOfStock);
        return false;
      }
      setStockIssues([]);
      return true;
    } catch (error) {
      toast.error('Failed to validate stock availability');
      return false;
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    try {
      // Validate stock first
      const stockValid = await validateStockAvailability();
      if (!stockValid) {
        setLoading(false);
        return;
      }

      // Validate address
      if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.phone) {
        toast.error('Please fill in all delivery address fields');
        setLoading(false);
        return;
      }

      // Create order
      const orderData = {
        items: cartItems.map(item => ({
          item: item.id || item._id,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        })),
        totalAmount: getCartTotal() + 3.99, // Include delivery fee
        deliveryAddress
      };

      const response = await createOrder(orderData);
      
      if (response.success) {
        setOrderDetails(response.order);
        setOrderSuccess(true);
        clearCart();
        toast.success('🎉 Order placed successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess && orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-white/20">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed! 🎉</h1>
            <p className="text-gray-700">Your delicious food is on its way</p>
          </div>
          
          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700 font-medium">Order ID</p>
            <p className="text-lg font-bold text-orange-600">{orderDetails.trackingId}</p>
          </div>

          <div className="space-y-2 mb-6 text-left">
            <div className="flex justify-between text-gray-800">
              <span>Total Amount:</span>
              <span className="font-bold">${orderDetails.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-800">
              <span>Estimated Delivery:</span>
              <span className="font-medium">30-45 minutes</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/orders')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="p-2 text-gray-700 hover:text-gray-900 hover:bg-white/80 rounded-full transition-all mr-4 shadow-sm"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Checkout
          </h1>
        </div>

        {/* Stock Issues Alert */}
        {stockIssues.length > 0 && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 rounded-xl shadow-sm">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-bold text-red-900">Stock Issues Detected</p>
                <p className="text-red-800 text-sm font-medium">The following items are out of stock:</p>
                <ul className="mt-2 text-sm text-red-800">
                  {stockIssues.map((item, index) => (
                    <li key={index} className="font-medium">• {item.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-orange-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                  value={deliveryAddress.street}
                  onChange={handleAddressChange}
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                  value={deliveryAddress.city}
                  onChange={handleAddressChange}
                  required
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code"
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                  value={deliveryAddress.zipCode}
                  onChange={handleAddressChange}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500"
                  value={deliveryAddress.phone}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id || item._id} className="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-red-200 rounded-lg flex items-center justify-center text-2xl">
                        {item.category === 'Fruit' && '🍎'}
                        {item.category === 'Vegetable' && '🥕'}
                        {item.category === 'Non-veg' && '🍗'}
                        {item.category === 'Breads' && '🍞'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-700 font-medium">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900 text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl sticky top-8 border border-white/20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-800">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-800">
                  <span className="font-medium">Delivery Fee</span>
                  <span className="font-bold">$3.99</span>
                </div>
                <div className="border-t-2 border-gray-300 pt-3">
                  <div className="flex justify-between font-bold text-xl text-gray-900">
                    <span>Total</span>
                    <span>${(getCartTotal() + 3.99).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4 p-3 bg-blue-100 rounded-xl flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-700" />
                <div>
                  <p className="text-sm font-bold text-blue-900">Estimated Delivery</p>
                  <p className="text-sm text-blue-800 font-medium">30-45 minutes</p>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || stockIssues.length > 0}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center space-x-2 ${
                  loading || stockIssues.length > 0
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl active:scale-98'
                }`}
              >
                <CreditCard className="h-5 w-5" />
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Place Order - ${(getCartTotal() + 3.99).toFixed(2)}</span>
                )}
              </button>

              <p className="text-xs text-gray-600 text-center mt-3 font-medium">
                🔒 Secure checkout • Payment processed safely
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;