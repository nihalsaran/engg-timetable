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

/**
 * Get dashboard metrics for SuperAdmin
 * @returns {Promise<Object>} Dashboard metrics data
 */
export const getDashboardMetrics = async () => {
  try {
    const response = await api.get('/api/dashboard/metrics');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error.response?.data || error;
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
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get semester progress data
 * @returns {Promise<Object>} Semester progress information
 */
export const getSemesterProgress = async () => {
  try {
    const response = await api.get('/api/dashboard/semester-progress');
    return response.data;
  } catch (error) {
    console.error('Error fetching semester progress:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get department distribution data
 * @returns {Promise<Array>} Department distribution data
 */
export const getDepartmentDistribution = async () => {
  try {
    const response = await api.get('/api/dashboard/department-distribution');
    return response.data;
  } catch (error) {
    console.error('Error fetching department distribution:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get room utilization data
 * @returns {Promise<Array>} Room utilization data
 */
export const getRoomUtilization = async () => {
  try {
    const response = await api.get('/api/dashboard/room-utilization');
    return response.data;
  } catch (error) {
    console.error('Error fetching room utilization:', error);
    throw error.response?.data || error;
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
    const response = await api.post('/api/dashboard/log-activity', { action, details });
    return response.data;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error.response?.data || error;
  }
};