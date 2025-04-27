// src/api/services/hod.dashboard.api.js
import axios from 'axios';
import { API_BASE_URL } from '../config';

// Create API client with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Include cookies in requests for authentication
});

// Check if in development mode
const isDev = import.meta.env.DEV || process.env.NODE_ENV === 'development';

/**
 * Fetch all dashboard data in a single request
 * @returns {Promise<Object>} All dashboard data
 */
export const fetchAllDashboardData = async () => {
  try {
    // Use dev route in development
    const endpoint = isDev ? '/api/hod/dashboard/dev/all' : '/api/hod/dashboard/all';
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching HOD dashboard data:', error);
    throw error;
  }
};

/**
 * Fetch dashboard metrics
 * @returns {Promise<Object>} Dashboard metrics
 */
export const fetchDashboardMetrics = async () => {
  try {
    const response = await apiClient.get('/api/hod/dashboard/metrics');
    return response.data;
  } catch (error) {
    console.error('Error fetching HOD dashboard metrics:', error);
    throw error;
  }
};

/**
 * Fetch recent activities
 * @param {number} limit - Number of activities to fetch
 * @returns {Promise<Object>} Recent activities
 */
export const fetchRecentActivities = async (limit = 5) => {
  try {
    const response = await apiClient.get(`/api/hod/dashboard/activities?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching HOD recent activities:', error);
    throw error;
  }
};

/**
 * Fetch sidebar navigation items
 * @returns {Promise<Object>} Sidebar items
 */
export const fetchSidebarItems = async () => {
  try {
    const response = await apiClient.get('/api/hod/dashboard/sidebar');
    return response.data;
  } catch (error) {
    console.error('Error fetching HOD sidebar items:', error);
    throw error;
  }
};

/**
 * Log a new activity
 * @param {string} type - Activity type (faculty, course, timetable, etc.)
 * @param {string} details - Activity details
 * @returns {Promise<Object>} Created activity
 */
export const logActivity = async (type, details) => {
  try {
    const response = await apiClient.post('/api/hod/dashboard/activities', {
      type,
      details
    });
    return response.data;
  } catch (error) {
    console.error('Error logging HOD activity:', error);
    throw error;
  }
};