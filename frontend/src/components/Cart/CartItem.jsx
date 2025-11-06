import React from 'react';
import { useCart } from '../../hooks/useCart';

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(item.id);
        } else {
            updateQuantity(item.id, newQuantity);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-slate-700">
            <div className="flex items-center space-x-4">
                {/* Item Image Placeholder */}
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xl">{item.name[0]}</span>
                </div>
                
                {/* Item Details */}
                <div>
                    <h3 className="font-medium text-lg">{item.name}</h3>
                    <p className="text-gray-500 text-sm">{item.category}</p>
                    <p className="font-bold text-primary">${item.price.toFixed(2)} each</p>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                    <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => handleQuantityChange(item.quantity - 1)}
                    >
                        -
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => handleQuantityChange(item.quantity + 1)}
                    >
                        +
                    </button>
                </div>

                {/* Item Total */}
                <div className="text-right min-w-[80px]">
                    <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                </div>

                {/* Remove Button */}
                <button 
                    className="btn btn-sm btn-error btn-outline"
                    onClick={() => removeFromCart(item.id)}
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

export default CartItem;