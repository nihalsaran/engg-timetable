// src/api/services/auth.api.js
/**
 * Authentication API Service
 * 
 * This service handles all API calls to the backend authentication endpoints
 */
import axios from 'axios';

// Base API URL - should come from environment variables in production
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // Include cookies if needed
});

// Add auth token to requests if available
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

/**
 * Login a user with email and password
 * @param {Object} credentials - User credentials
 * @returns {Promise<Object>} - Response with user data and token
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error.response?.data?.message || 'Login failed';
  }
};

/**
 * Register a new SuperAdmin
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Response with created user data
 */
export const registerSuperAdmin = async (userData) => {
  try {
    const response = await api.post('/auth/register/super-admin', userData);
    return response.data;
  } catch (error) {
    console.error('SuperAdmin registration API error:', error);
    throw error.response?.data?.message || 'Registration failed';
  }
};

/**
 * Request a password reset for a user
 * @param {Object} data - Password reset request data
 * @returns {Promise<Object>} - Response
 */
export const forgotPassword = async (data) => {
  try {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  } catch (error) {
    console.error('Forgot password API error:', error);
    throw error.response?.data?.message || 'Password reset request failed';
  }
};

/**
 * Complete a password reset with code and new password
 * @param {Object} data - Password reset data
 * @returns {Promise<Object>} - Response
 */
export const resetPassword = async (data) => {
  try {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  } catch (error) {
    console.error('Reset password API error:', error);
    throw error.response?.data?.message || 'Password reset failed';
  }
};

/**
 * Get the current logged-in user
 * @returns {Promise<Object>} - User data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data.user;
  } catch (error) {
    console.error('Get current user API error:', error);
    return null;
  }
};

/**
 * Logout the current user
 * @returns {Promise<Object>} - Response
 */
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout API error:', error);
    return { success: true };
  }
};

/**
 * Check if user session is valid
 * @returns {Promise<boolean>} - Whether session is valid
 */
export const checkSession = async () => {
  try {
    // First check if we have a token before making an API call
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    
    const response = await api.get('/auth/check-session', {
      // Adding a cache-busting parameter to prevent browsers from caching this check
      params: { _t: new Date().getTime() }
    });
    return response.data.valid;
  } catch (error) {
    // Only treat actual auth failures as invalid sessions
    // Network errors should not invalidate sessions
    if (error.response) {
      console.error('Check session API error with response:', error.response.status);
      return false;
    } else {
      // Assume the session is still valid if there's a network error
      // This prevents logout when using back button with poor connectivity
      console.error('Check session network error:', error);
      return true;
    }
  }
};

/**
 * Create a new user (admin function)
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - Created user data
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post('/auth/users', userData);
    return response.data.user;
  } catch (error) {
    console.error('Create user API error:', error);
    throw error.response?.data?.message || 'Failed to create user';
  }
};