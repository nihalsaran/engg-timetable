// src/api/services/dashboard.api.js
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

// Add response interceptor to handle response format consistently
api.interceptors.response.use(
  (response) => {
    // If the response has a data.data structure (from our backend format)
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    // Otherwise just return the data as is
    return response.data;
  },
  (error) => {
    // Enhance error object with more details for better debugging
    const enhancedError = {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
      original: error
    };
    return Promise.reject(enhancedError);
  }
);

/**
 * Get dashboard metrics for SuperAdmin
 * @returns {Promise<Object>} Dashboard metrics data
 */
export const getDashboardMetrics = async () => {
  try {
    return await api.get('/api/dashboard/metrics');
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
};

/**
 * Get recent activity
 * @param {number} limit - Maximum number of activities to retrieve
 * @returns {Promise<Array>} Recent activities
 */
export const getRecentActivity = async (limit = 5) => {
  try {
    const response = await api.get(`/api/dashboard/activity?limit=${limit}`);
    // Make sure we always return an array
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
};

/**
 * Get semester progress data
 * @returns {Promise<Array>} Semester progress information
 */
export const getSemesterProgress = async () => {
  try {
    const response = await api.get('/api/dashboard/semester-progress');
    // Make sure we always return an array
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Error fetching semester progress:', error);
    return [];
  }
};

/**
 * Get department distribution data
 * @returns {Promise<Array>} Department distribution data
 */
export const getDepartmentDistribution = async () => {
  try {
    const response = await api.get('/api/dashboard/department-distribution');
    // Make sure we always return an array
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Error fetching department distribution:', error);
    return [];
  }
};

/**
 * Get room utilization data
 * @returns {Promise<Array>} Room utilization data
 */
export const getRoomUtilization = async () => {
  try {
    const response = await api.get('/api/dashboard/room-utilization');
    // Make sure we always return an array
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Error fetching room utilization:', error);
    return [];
  }
};

/**
 * Log an activity
 * @param {string} action - Action type
 * @param {string} details - Activity details
 * @returns {Promise<Object>} Created activity
 */
export const logActivity = async (action, details) => {
  try {
    // Try the expected endpoint first
    try {
      const response = await api.post('/api/dashboard/log-activity', { action, details });
      return response;
    } catch (error) {
      // If the first endpoint fails with 404, try the alternate endpoint
      if (error.status === 404) {
        console.log('Falling back to alternate activity logging endpoint');
        const response = await api.post('/api/dashboard/activity', { action, details });
        return response;
      }
      throw error;
    }
  } catch (error) {
    console.error('Error logging activity:', error);
    // Return a minimal fake response to prevent UI from breaking
    return { success: false, error: error.message || 'Error logging activity' };
  }
};