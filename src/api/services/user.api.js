// src/api/services/user.api.js
import axios from 'axios';
import { API_BASE_URL } from '../config.js';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

// Add request interceptor to add authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Get all users
 * @returns {Promise<Array>} Array of user objects
 */
export const getUsers = async () => {
  try {
    const response = await api.get('/api/users');
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User data
 */
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}`);
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error.response?.data || error;
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post('/api/users', userData);
    return response.data.user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update a user
 * @param {string} userId - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/api/users/${userId}`, userData);
    return response.data.user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error.response?.data || error;
  }
};

/**
 * Delete a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Result object
 */
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update a user's status (active/inactive)
 * @param {string} userId - User ID
 * @param {boolean} isActive - New active status
 * @returns {Promise<Object>} Result object
 */
export const updateUserStatus = async (userId, isActive) => {
  try {
    const response = await api.patch(`/api/users/${userId}/status`, { active: isActive });
    return response.data;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error.response?.data || error;
  }
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise<Object>} Result object
 */
export const sendPasswordReset = async (email) => {
  try {
    const response = await api.post('/api/users/password-reset', { email });
    return response.data;
  } catch (error) {
    console.error('Error sending password reset:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get available departments
 * @returns {Promise<Array>} Array of department names
 */
export const getDepartments = async () => {
  try {
    const response = await api.get('/api/users/departments');
    return response.data.departments;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get available roles
 * @returns {Promise<Array>} Array of role objects
 */
export const getRoles = async () => {
  try {
    const response = await api.get('/api/users/roles');
    return response.data.roles;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error.response?.data || error;
  }
};