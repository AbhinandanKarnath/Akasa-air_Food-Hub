import axios from 'axios';

const API_URL = 'http://localhost:5001/api'; // Updated to match your backend port

export const registerUser = async (email, password, name) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, { email, password, name });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
    return !!getToken();
};

// Set auth token in axios headers
export const setAuthToken = (token) => {
    if (token) {
        // Apply to every request
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
    } else {
        // Delete auth header
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
    }
};

// Initialize auth token on app start
export const initializeAuth = () => {
    const token = getToken();
    if (token) {
        setAuthToken(token);
    }
};

// Check if token is expired (basic check)
export const isTokenExpired = () => {
    const token = getToken();
    if (!token) return true;
    
    try {
        // Basic JWT decode to check expiration
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp < currentTime;
    } catch (error) {
        return true;
    }
};

// Refresh token or logout if expired
export const checkAuthStatus = () => {
    if (isTokenExpired()) {
        logoutUser();
        return false;
    }
    return true;
};