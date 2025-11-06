import React, { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { checkoutOrder, checkStockAvailability } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cartItems, clearCart, getCartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [stockCheck, setStockCheck] = useState(null);
  const [orderResult, setOrderResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    } else {
      checkStock();
    }
  }, [cartItems, navigate]);

  const checkStock = async () => {
    setLoading(true);
    try {
      const result = await checkStockAvailability(cartItems);
      setStockCheck(result);
    } catch (error) {
      console.error('Error checking stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const result = await checkoutOrder(cartItems);
      setOrderResult(result);
      
      if (result.success) {
        clearCart();
        // Show success message for 3 seconds then redirect
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setOrderResult({
        success: false,
        message: 'An error occurred during checkout'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stockCheck) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (orderResult) {
    return (
      <div className="container mx-auto p-4">
        <div className="card w-full max-w-md mx-auto bg-base-100 shadow-xl">
          <div className="card-body text-center">
            {orderResult.success ? (
              <>
                <div className="text-success text-6xl mb-4">✓</div>
                <h2 className="card-title justify-center text-success">Order Successful!</h2>
                <p className="mb-2">{orderResult.message}</p>
                <p className="text-sm text-gray-600">Order ID: {orderResult.orderId}</p>
                <p className="text-sm text-gray-600">Tracking ID: {orderResult.trackingId}</p>
                <div className="card-actions justify-center mt-4">
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/orders')}
                  >
                    View Orders
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-error text-6xl mb-4">✗</div>
                <h2 className="card-title justify-center text-error">Order Failed</h2>
                <p className="mb-4">{orderResult.message}</p>
                <div className="card-actions justify-center">
                  <button 
                    className="btn btn-primary"
                    onClick={() => setOrderResult(null)}
                  >
                    Try Again
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Order Summary</h2>
            
            <div className="space-y-4">
              {cartItems.map(item => {
                const stockItem = stockCheck?.data?.find(s => s.id === item.id);
                const isAvailable = stockItem?.available;
                
                return (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                      {!isAvailable && (
                        <p className="text-error text-sm">
                          {stockItem?.availableStock === 0 
                            ? 'Out of stock' 
                            : `Only ${stockItem?.availableStock} available`
                          }
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      {!isAvailable && (
                        <span className="badge badge-error badge-sm">Not Available</span>
                      )}
                    </div>
                  </div>
                );
              })}
              
              <div className="divider"></div>
              
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Actions */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Payment Details</h2>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Payment Method</span>
              </label>
              <select className="select select-bordered">
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>PayPal</option>
                <option>Cash on Delivery</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Delivery Address</span>
              </label>
              <textarea 
                className="textarea textarea-bordered" 
                placeholder="Enter your delivery address"
              ></textarea>
            </div>

            <div className="card-actions justify-end mt-6">
              <button 
                className="btn btn-outline" 
                onClick={() => navigate('/cart')}
              >
                Back to Cart
              </button>
              <button 
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                onClick={handleCheckout}
                disabled={loading || (stockCheck && !stockCheck.allAvailable)}
              >
                {loading ? 'Processing...' : `Pay $${getCartTotal().toFixed(2)}`}
              </button>
            </div>

            {stockCheck && !stockCheck.allAvailable && (
              <div className="alert alert-warning mt-4">
                <span>Some items are not available. Please update your cart.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;