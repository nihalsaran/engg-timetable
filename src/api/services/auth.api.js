// src/api/services/auth.api.js
/**
 * Authentication API Service
 * 
 * This service handles all API calls to the backend authentication endpoints
 */

// Base API URL - should come from environment variables in production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Login a user with email and password
 * @param {Object} credentials - User credentials
 * @returns {Promise<Object>} - Response with user data and token
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials),
      credentials: 'include'  // Include cookies if needed
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Store the token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

/**
 * Register a new SuperAdmin
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Response with created user data
 */
export const registerSuperAdmin = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register/super-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    // Store the token if provided
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  } catch (error) {
    console.error('SuperAdmin registration API error:', error);
    throw error;
  }
};

/**
 * Request a password reset for a user
 * @param {Object} data - Password reset request data
 * @returns {Promise<Object>} - Response
 */
export const forgotPassword = async (data) => {
  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Password reset request failed');
    }
    
    return responseData;
  } catch (error) {
    console.error('Forgot password API error:', error);
    throw error;
  }
};

/**
 * Complete a password reset with code and new password
 * @param {Object} data - Password reset data
 * @returns {Promise<Object>} - Response
 */
export const resetPassword = async (data) => {
  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Password reset failed');
    }
    
    return responseData;
  } catch (error) {
    console.error('Reset password API error:', error);
    throw error;
  }
};

/**
 * Get the current logged-in user
 * @returns {Promise<Object>} - User data
 */
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return null;
    }
    
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token is invalid or expired, clear it
        localStorage.removeItem('authToken');
        return null;
      }
      
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get user data');
    }
    
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Get current user API error:', error);
    // Clear token on error
    localStorage.removeItem('authToken');
    return null;
  }
};

/**
 * Logout the current user
 * @returns {Promise<Object>} - Response
 */
export const logout = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return { success: true };
    }
    
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Clear token from localStorage
    localStorage.removeItem('authToken');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Logout API error:', error);
    // Clear token even if logout fails on server
    localStorage.removeItem('authToken');
    return { success: true };
  }
};

/**
 * Check if user session is valid
 * @returns {Promise<boolean>} - Whether session is valid
 */
export const checkSession = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return false;
    }
    
    const response = await fetch(`${API_URL}/auth/check-session`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!data.valid) {
      // Clear invalid token
      localStorage.removeItem('authToken');
    }
    
    return data.valid;
  } catch (error) {
    console.error('Check session API error:', error);
    // Clear token on error
    localStorage.removeItem('authToken');
    return false;
  }
};

/**
 * Create a new user (admin function)
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - Created user data
 */
export const createUser = async (userData) => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/auth/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create user');
    }
    
    return data.user;
  } catch (error) {
    console.error('Create user API error:', error);
    throw error;
  }
};