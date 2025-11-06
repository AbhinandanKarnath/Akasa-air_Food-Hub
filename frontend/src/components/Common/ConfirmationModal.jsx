import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCartItems([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, quantity = 1) => {
    console.log('Adding to cart:', item, 'Quantity:', quantity);
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === (item._id || item.id));
      
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === (item._id || item.id)
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        // Handle both MongoDB (_id) and mock data (id) formats
        const newItem = {
          id: item._id || item.id,
          _id: item._id || item.id,
          name: item.name,
          price: item.price,
          category: item.category,
          stock: item.stock,
          rating: item.rating,
          description: item.description,
          quantity: quantity
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId && item._id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        (item.id === itemId || item._id === itemId)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};