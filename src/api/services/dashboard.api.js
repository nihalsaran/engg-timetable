// src/api/services/dashboard.api.js
import axios from 'axios';

// Get API base URL from environment variables
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with base URL and auth header support
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // For cookies if needed
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
 * Get all dashboard data in a single request
 * @returns {Promise<Object>} Dashboard data
 */
export const getAllDashboardData = async () => {
  try {
    const response = await api.get('/dashboard/all');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error.response?.data?.message || 'Failed to fetch dashboard data';
  }
};

/**
 * Get dashboard metrics
 * @returns {Promise<Object>} Dashboard metrics
 */
export const getDashboardMetrics = async () => {
  try {
    const response = await api.get('/dashboard/metrics');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error.response?.data?.message || 'Failed to fetch dashboard metrics';
  }
};

/**
 * Get recent activity
 * @param {number} limit - Number of activities to return
 * @returns {Promise<Array>} Recent activities
 */
export const getRecentActivity = async (limit = 5) => {
  try {
    const response = await api.get(`/dashboard/activity?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error.response?.data?.message || 'Failed to fetch recent activity';
  }
};

/**
 * Get semester progress
 * @returns {Promise<Array>} Semester progress data
 */
export const getSemesterProgress = async () => {
  try {
    const response = await api.get('/dashboard/semester-progress');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching semester progress:', error);
    throw error.response?.data?.message || 'Failed to fetch semester progress';
  }
};

/**
 * Get department distribution
 * @returns {Promise<Array>} Department distribution data
 */
export const getDepartmentDistribution = async () => {
  try {
    const response = await api.get('/dashboard/department-distribution');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching department distribution:', error);
    throw error.response?.data?.message || 'Failed to fetch department distribution';
  }
};

/**
 * Get room utilization
 * @returns {Promise<Array>} Room utilization data
 */
export const getRoomUtilization = async () => {
  try {
    const response = await api.get('/dashboard/room-utilization');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching room utilization:', error);
    throw error.response?.data?.message || 'Failed to fetch room utilization';
  }
};

/**
 * Log a new activity
 * @param {string} action - Type of action
 * @param {string} details - Activity details
 * @returns {Promise<Object>} Created activity
 */
export const logActivity = async (action, details) => {
  try {
    const response = await api.post('/dashboard/activity', { action, details });
    return response.data.data;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error.response?.data?.message || 'Failed to log activity';
  }
};

// Export all functions
const dashboardAPI = {
  getAllDashboardData,
  getDashboardMetrics,
  getRecentActivity,
  getSemesterProgress,
  getDepartmentDistribution,
  getRoomUtilization,
  logActivity
};

export default dashboardAPI;