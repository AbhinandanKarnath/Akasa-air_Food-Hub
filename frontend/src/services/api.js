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

// Profile API calls
export const getUserProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put('/profile', profileData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put('/profile/password', passwordData);
  return response.data;
};

// Items API calls
export const fetchItemsByCategory = async (category = 'All') => {
  console.log('Fetching items for category:', category);
  const response = await api.get(`/inventory?category=${category}`);
  console.log('API Response:', response.data);
  
  // Transform MongoDB _id to id for frontend compatibility
  const items = response.data.map(item => ({
    ...item,
    id: item._id || item.id,
    _id: item._id || item.id
  }));
  
  console.log('Transformed items:', items);
  return items;
};

export const fetchAllItems = async () => {
  const response = await api.get('/inventory');
  console.log('All items response:', response.data);
  
  // Transform MongoDB _id to id for frontend compatibility
  const items = response.data.map(item => ({
    ...item,
    id: item._id || item.id,
    _id: item._id || item.id
  }));
  
  return items;
};

// Check stock availability
export const checkStockAvailability = async (cartItems) => {
  const response = await api.post('/inventory/check-stock', { cartItems });
  return response.data;
};

// Validate stock availability - FIXED to use axios
export const validateStock = async (cartItems) => {
  try {
    const response = await api.post('/orders/validate-stock', { items: cartItems });
    return response.data;
  } catch (error) {
    console.error('Stock validation error:', error);
    throw new Error(error.response?.data?.message || 'Stock validation failed');
  }
};

// Create order - FIXED to use axios
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders/create', orderData);
    return response.data;
  } catch (error) {
    console.error('Create order error:', error);
    throw new Error(error.response?.data?.message || 'Order creation failed');
  }
};

// Get user orders - FIXED to use axios
export const getUserOrders = async () => {
  try {
    const response = await api.get('/orders/my-orders');
    return response.data;
  } catch (error) {
    console.error('Get orders error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
};

// Get order history (alias)
export const getOrderHistory = async () => {
  return getUserOrders();
};

// Checkout function
export const checkoutOrder = async (cartItems, orderData = {}) => {
  try {
    const response = await api.post('/orders/create', {
      items: cartItems,
      ...orderData
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.message
      };
    }
    return {
      success: false,
      message: 'Failed to process order. Please try again.'
    };
  }
};

export default api;