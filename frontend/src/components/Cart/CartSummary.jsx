import React from 'react';
import { useCart } from '../../hooks/useCart';

const CartSummary = () => {
  const { cartItems, getCartTotal, getCartItemCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Cart Summary</h2>
          <p>Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Cart Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Items ({getCartItemCount()})</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <div className="divider"></div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;