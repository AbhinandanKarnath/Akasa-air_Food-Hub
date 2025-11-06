import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Star, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../../hooks/useCart';

const ItemCard = ({ item }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      addToCart(item, quantity);
      toast.success(`${item.name} added to cart!`, {
        icon: '🛒',
      });
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (item.stock || 0)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Make sure we're checking the correct stock value
  const stockValue = item.stock || 0;
  const isOutOfStock = stockValue <= 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
        <div className="text-6xl opacity-80">
          {item.category === 'Fruit' && '🍎'}
          {item.category === 'Vegetable' && '🥕'}
          {item.category === 'Non-veg' && '🍗'}
          {item.category === 'Breads' && '🍞'}
        </div>
        
        {/* Stock Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            stockValue > 10 ? 'bg-green-100 text-green-800' : 
            stockValue > 0 ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {stockValue > 0 ? `${stockValue} left` : 'Out of stock'}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 text-xs font-medium bg-white bg-opacity-90 text-gray-700 rounded-full">
            {item.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-800 truncate">{item.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{item.rating || 4.5}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-3">
          <Clock className="h-4 w-4 mr-1" />
          <span>15-30 min</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-800">${item.price?.toFixed(2) || '0.00'}</span>
            <span className="text-sm text-gray-500 ml-1">each</span>
          </div>
          
          {/* Quantity Selector - Fixed button visibility */}
          {!isOutOfStock && (
            <div className="flex items-center bg-gray-100 rounded-lg border">
              <button
                onClick={decrementQuantity}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-l-lg transition-all duration-200"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-3 py-2 text-sm font-medium bg-white border-l border-r border-gray-200 min-w-[2.5rem] text-center text-black">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-r-lg transition-all duration-200"
                disabled={quantity >= stockValue}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Add to Cart Button - Fixed visibility */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className={`
            w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-200 
            flex items-center justify-center space-x-2 shadow-md
            ${isOutOfStock
              ? 'bg-gray-400 cursor-not-allowed opacity-60'
              : isAdding
              ? 'bg-orange-400 cursor-wait'
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:shadow-lg active:scale-95'
            }
          `}
        >
          {isAdding ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              <span className="font-semibold">
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ItemCard;