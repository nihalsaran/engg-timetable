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
    localStorage.removeItem('authToken');
    
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    
    // Even if server logout fails, clear local storage
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    
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
    localStorage.removeItem('authToken');
    return null;
  }
};

/**
 * Check if user session is valid
 * @returns {Promise<boolean>}
 */
export const checkSession = async () => {
  try {
    // Use the API to check if the session is valid
    return await authAPI.checkSession();
  } catch (error) {
    // Session is invalid, clean up
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
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