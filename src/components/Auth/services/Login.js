// Authentication service for login functionality
import { account } from '../../../appwrite/config';
import { AppwriteException } from 'appwrite';

// Session storage keys
const SESSION_KEY = 'appwriteSession';
const USER_DATA_KEY = 'userData';

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
    // Create an email session with Appwrite
    const session = await account.createEmailSession(
      credentials.email,
      credentials.password
    );
    
    // Get account information after successful login
    const userData = await account.get();
    
    // Store session data in localStorage for persistence
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    
    const userObject = {
      id: userData.$id,
      email: userData.email,
      name: userData.name,
      // The role information would need to come from a custom attribute or a separate database
      role: userData.labels?.includes('admin') ? 'admin' : 
            userData.labels?.includes('hod') ? 'hod' : 
            userData.labels?.includes('tt_incharge') ? 'tt_incharge' : 'faculty',
      isAuthenticated: true
    };
    
    // Store user data for quick access
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userObject));
    
    return userObject;
  } catch (error) {
    console.error('Authentication failed:', error);
    if (error instanceof AppwriteException) {
      // Handle specific Appwrite errors
      switch (error.code) {
        case 401:
          throw new Error('Invalid credentials. Please check your email and password.');
        case 429:
          throw new Error('Too many attempts. Please try again later.');
        default:
          throw new Error('Login failed. ' + error.message);
      }
    }
    throw new Error('Login failed. Please check your credentials and try again.');
  }
};

/**
 * Logs out the current user
 * @returns {Promise<boolean>}
 */
export const logoutUser = async () => {
  try {
    // Delete the current session
    await account.deleteSession('current');
    
    // Clear local storage
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    
    // Even if server logout fails, clear local storage
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    
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
    const cachedUserData = localStorage.getItem(USER_DATA_KEY);
    if (cachedUserData) {
      // Return cached data to avoid unnecessary API calls
      return JSON.parse(cachedUserData);
    }
    
    // If no cached data, try to get from server
    const userData = await account.get();
    
    const userObject = {
      id: userData.$id,
      email: userData.email,
      name: userData.name,
      role: userData.labels?.includes('admin') ? 'admin' : 
            userData.labels?.includes('hod') ? 'hod' : 
            userData.labels?.includes('tt_incharge') ? 'tt_incharge' : 'faculty',
      isAuthenticated: true
    };
    
    // Update cache
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userObject));
    
    return userObject;
  } catch (error) {
    // If API call fails, clear any stale data
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    
    // User is not logged in
    return null;
  }
};

/**
 * Check if user session is valid
 * @returns {Promise<boolean>}
 */
export const checkSession = async () => {
  try {
    // First check if we have a session in localStorage
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) {
      return false;
    }
    
    // Verify with server that the session is still valid
    await account.get();
    return true;
  } catch (error) {
    // Session is invalid, clean up
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    return false;
  }
};

/**
 * Initialize client with JWT if available
 * Call this when the application starts
 */
export const initializeAuth = () => {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (sessionData) {
      // Session exists, we're potentially logged in
      // The Appwrite SDK will automatically use the stored cookies
      console.log('Session found, user might be authenticated');
      return true;
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
  }
  return false;
};