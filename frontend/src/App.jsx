import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './hooks/useCart';
import { initializeAuth } from './utils/auth';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import OrderHistory from './components/Orders/OrderHistory';

const App = () => {
  useEffect(() => {
    // Initialize auth token on app start
    initializeAuth();
  }, []);

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<OrderHistory />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;