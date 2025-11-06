import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Mock data for items
const mockItems = [
  { id: 1, name: 'Apple', category: 'Fruit', price: 2.50, stock: 50, image: '/images/apple.jpg' },
  { id: 2, name: 'Banana', category: 'Fruit', price: 1.20, stock: 30, image: '/images/banana.jpg' },
  { id: 3, name: 'Carrot', category: 'Vegetable', price: 1.80, stock: 25, image: '/images/carrot.jpg' },
  { id: 4, name: 'Chicken Breast', category: 'Non-veg', price: 8.99, stock: 15, image: '/images/chicken.jpg' },
  { id: 5, name: 'White Bread', category: 'Breads', price: 2.99, stock: 20, image: '/images/bread.jpg' },
  { id: 6, name: 'Tomato', category: 'Vegetable', price: 3.50, stock: 40, image: '/images/tomato.jpg' },
];

// Mock data for orders
const mockOrders = [
  {
    id: 'ORD001',
    status: 'delivered',
    total: 15.50,
    date: '2024-11-01T10:30:00Z',
    items: [
      { id: 1, name: 'Apple', quantity: 2, price: 2.50 },
      { id: 3, name: 'Carrot', quantity: 1, price: 1.80 }
    ]
  },
  {
    id: 'ORD002',
    status: 'pending',
    total: 12.99,
    date: '2024-11-05T14:15:00Z',
    items: [
      { id: 4, name: 'Chicken Breast', quantity: 1, price: 8.99 },
      { id: 5, name: 'White Bread', quantity: 1, price: 2.99 }
    ]
  }
];

// Items API calls
export const fetchItemsByCategory = async (category = 'All') => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (category === 'All') {
    return mockItems;
  }
  return mockItems.filter(item => item.category === category);
};

export const fetchAllItems = async () => {
  return mockItems;
};

// Check stock availability
export const checkStockAvailability = async (cartItems) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const stockCheck = cartItems.map(cartItem => {
    const item = mockItems.find(item => item.id === cartItem.id);
    return {
      ...cartItem,
      available: item ? item.stock >= cartItem.quantity : false,
      availableStock: item ? item.stock : 0
    };
  });
  
  return {
    success: true,
    data: stockCheck,
    allAvailable: stockCheck.every(item => item.available)
  };
};

// Orders API calls
export const getOrderHistory = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    data: mockOrders
  };
};

export const createOrder = async (orderData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newOrder = {
    id: `ORD${Date.now()}`,
    ...orderData,
    status: 'pending',
    date: new Date().toISOString()
  };
  
  mockOrders.unshift(newOrder);
  
  return {
    data: newOrder,
    message: 'Order created successfully'
  };
};

// Checkout function
export const checkoutOrder = async (cartItems) => {
  try {
    // First check stock availability
    const stockCheck = await checkStockAvailability(cartItems);
    
    if (!stockCheck.allAvailable) {
      return {
        success: false,
        message: 'Some items are out of stock',
        stockCheck: stockCheck.data
      };
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order
    const orderData = {
      items: cartItems,
      total: total,
      status: 'pending'
    };
    
    const orderResponse = await createOrder(orderData);
    
    // Update stock (simulate deducting from inventory)
    cartItems.forEach(cartItem => {
      const item = mockItems.find(item => item.id === cartItem.id);
      if (item) {
        item.stock -= cartItem.quantity;
      }
    });
    
    return {
      success: true,
      message: 'Order placed successfully!',
      orderId: orderResponse.data.id,
      trackingId: orderResponse.data.id,
      order: orderResponse.data
    };
    
  } catch (error) {
    return {
      success: false,
      message: 'Failed to process order. Please try again.',
      error: error.message
    };
  }
};

// Cart API calls (for persistent cart across devices)
export const saveCart = async (cartItems) => {
  // This would normally save to backend
  localStorage.setItem('cart', JSON.stringify(cartItems));
  return { success: true };
};

export const getCart = async () => {
  // This would normally fetch from backend
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export default api;