// Authentication service for login functionality
import * as authAPI from '../../../api/services/auth.api';

/**
 * Attempts to authenticate a user with the provided credentials
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} - Promise resolving to user data on successful login
 * @throws {Error} - If authentication fails
 */
export const loginUser = async (credentials) => {
  try {
    // Use our API service to login instead of directly using Firebase
    const response = await authAPI.login(credentials);
    
    // Store user data for quick access
    const userObject = response.user;
    localStorage.setItem('userData', JSON.stringify(userObject));
    
    // Store the JWT token for authentication
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return userObject;
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
};

/**
 * Logs out the current user
 * @returns {Promise<boolean>}
 */
export const logoutUser = async () => {
  try {
    // Use our API service to logout
    await authAPI.logout();
    
    // Clear local storage
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    
    // Even if server logout fails, clear local storage
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    
    throw new Error('Logout failed: ' + error.message);
  }
};

/**
 * Gets the current user information
 * @returns {Promise<Object|null>} - Promise resolving to user data or null if not logged in
 */
export const getCurrentUser = async () => {
  try {
    // Try to get cached user data first
    const cachedUserData = localStorage.getItem('userData');
    if (cachedUserData) {
      // Return cached data to avoid unnecessary API calls
      return JSON.parse(cachedUserData);
    }
    
    // Otherwise, get the current user from the API
    const userData = await authAPI.getCurrentUser();
    
    if (userData) {
      // Update cache
      localStorage.setItem('userData', JSON.stringify(userData));
      return userData;
    }
    
    return null;
  } catch (error) {
    // User is not logged in
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    return null;
  }
};

/**
 * Check if user session is valid
 * @returns {Promise<boolean>}
 */
export const checkSession = async () => {
  try {
    // Check if we have a token
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    
    // Use the API to check if the session is valid
    const isValid = await authAPI.checkSession();
    
    if (!isValid) {
      // Clean up on invalid session
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
    }
    
    return isValid;
  } catch (error) {
    console.error('Session check failed:', error);
    // Only clear tokens on server rejection, not on network errors
    // This helps prevent logout when just navigating with poor connection
    if (error.response) {
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
    }
    return false;
  }
};

/**
 * Initialize client with authentication
 * Call this when the application starts
 */
export const initializeAuth = () => {
  // Nothing needed here anymore, as we'll use JWT tokens
  return true;
};

/**
 * Get the current authentication token
 * @returns {string|null} - The token or null if not available
 */
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};