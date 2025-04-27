// DepartmentManagement.js - Updated to use backend APIs and correct auth
import axios from 'axios';

// API base URL
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with base URL and auth handling
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
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

// Department types for dropdown (fallback if API fails)
export const departmentTypes = [
  'Engineering',
  'Science',
  'Arts',
  'Management',
  'Commerce',
  'Medicine',
  'Law'
];

// HOD options for department assignment (fallback if API fails)
export const hodOptions = [
  { name: 'Alice Johnson', avatar: 'https://via.placeholder.com/30' },
  { name: 'Bob Smith', avatar: 'https://via.placeholder.com/30' },
  { name: 'Charlie Brown', avatar: 'https://via.placeholder.com/30' },
  { name: 'Diana Prince', avatar: 'https://via.placeholder.com/30' },
  { name: 'Edward Norton', avatar: 'https://via.placeholder.com/30' },
];

/**
 * Get all HOD options for department assignment
 * @returns {Promise<Array>} Array of HOD options with name and avatar
 */
export const getHODOptions = async () => {
  try {
    const response = await api.get('/departments/data/hod-options');

    if (response.data.success) {
      return response.data.hodOptions;
    } else {
      console.log("Failed to get HOD options, using fallback data");
      return hodOptions;
    }
  } catch (error) {
    console.error("Error fetching HOD options:", error);
    // Fallback to dummy data
    return hodOptions;
  }
};

/**
 * Get all departments from backend
 * @returns {Promise} Promise object with department data
 */
export const getAllDepartments = async () => {
  try {
    const response = await api.get('/departments');

    if (response.data.success) {
      return response.data.departments;
    } else {
      throw new Error(response.data.message || 'Failed to fetch departments');
    }
  } catch (error) {
    console.error("Error fetching departments:", error);
    
    // Return empty array or throw an error based on your error handling strategy
    return [];
  }
};

/**
 * Search departments by name
 * @param {string} searchTerm - Search term to filter departments
 * @returns {Promise} Filtered departments
 */
export const searchDepartments = async (searchTerm) => {
  try {
    // If search term is empty, get all departments
    if (!searchTerm) {
      return await getAllDepartments();
    }
    
    const response = await api.get('/departments/search/query', {
      params: { searchTerm }
    });

    if (response.data.success) {
      return response.data.departments;
    } else {
      throw new Error(response.data.message || 'Failed to search departments');
    }
  } catch (error) {
    console.error("Error searching departments:", error);
    
    // Return empty array or throw an error based on your error handling strategy
    return [];
  }
};

/**
 * Create a new department through the backend API
 * @param {Object} departmentData - The department data to create
 * @returns {Promise} Promise object with the created department
 */
export const createDepartment = async (departmentData) => {
  try {
    const response = await api.post('/departments', departmentData);

    if (response.data.success) {
      return response.data.department;
    } else {
      throw new Error(response.data.message || 'Failed to create department');
    }
  } catch (error) {
    console.error("Error creating department:", error);
    throw error; // Propagate error to be handled by the component
  }
};

/**
 * Update an existing department through the backend API
 * @param {Object} departmentData - Department data with id and updated fields
 * @returns {Promise} Promise object with updated department
 */
export const updateDepartment = async (departmentData) => {
  try {
    const response = await api.put(`/departments/${departmentData.id}`, departmentData);

    if (response.data.success) {
      return response.data.department;
    } else {
      throw new Error(response.data.message || 'Failed to update department');
    }
  } catch (error) {
    console.error("Error updating department:", error);
    throw error; // Propagate error to be handled by the component
  }
};

/**
 * Delete a department through the backend API
 * @param {string} id - The ID of the department to delete
 * @returns {Promise} Promise object with result
 */
export const deleteDepartment = async (id) => {
  try {
    const response = await api.delete(`/departments/${id}`);

    if (response.data.success) {
      return { success: true, id: response.data.id };
    } else {
      throw new Error(response.data.message || 'Failed to delete department');
    }
  } catch (error) {
    console.error("Error deleting department:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Update a department's status
 * @param {string} id - The department ID
 * @param {string} status - New status ('Active' or 'Inactive')
 * @returns {Promise} Promise object with result
 */
export const updateDepartmentStatus = async (id, status) => {
  try {
    const response = await api.patch(`/departments/${id}/status`, { status });

    if (response.data.success) {
      return { 
        success: true, 
        id: response.data.id, 
        status: response.data.status 
      };
    } else {
      throw new Error(response.data.message || 'Failed to update department status');
    }
  } catch (error) {
    console.error("Error updating department status:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get available department types from the backend
 * @returns {Promise<Array>} Department types
 */
export const getDepartmentTypes = async () => {
  try {
    const response = await api.get('/departments/data/types');

    if (response.data.success) {
      return response.data.types;
    } else {
      console.log("Failed to get department types, using fallback data");
      return departmentTypes;
    }
  } catch (error) {
    console.error("Error fetching department types:", error);
    // Fallback to dummy data
    return departmentTypes;
  }
};

// Export all functions as a service object
const DepartmentManagementService = {
  getAllDepartments,
  searchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  updateDepartmentStatus,
  getDepartmentTypes,
  getHODOptions,
};

export default DepartmentManagementService;