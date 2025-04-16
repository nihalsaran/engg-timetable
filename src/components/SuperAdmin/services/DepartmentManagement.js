// DepartmentManagement.js - Updated to integrate with Appwrite
import { databases, ID, Query } from '../../../appwrite/config';

// Appwrite database and collection IDs
const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'default';
const DEPARTMENTS_COLLECTION = 'departments';
const TEACHERS_COLLECTION = 'teachers';

// Mock data for fallback if Appwrite fails
const dummyDepartments = [
  { 
    id: '1', 
    name: 'Computer Science', 
    type: 'Engineering', 
    status: 'Active', 
    hod: 'Alice Johnson', 
    hodAvatar: 'https://via.placeholder.com/30',
    totalCourses: 12
  },
  { 
    id: '2', 
    name: 'Mechanical', 
    type: 'Engineering', 
    status: 'Inactive', 
    hod: 'Bob Smith', 
    hodAvatar: 'https://via.placeholder.com/30',
    totalCourses: 8
  },
  { 
    id: '3', 
    name: 'Mathematics', 
    type: 'Science', 
    status: 'Active', 
    hod: 'Charlie Brown', 
    hodAvatar: 'https://via.placeholder.com/30',
    totalCourses: 6
  },
];

// Department types for dropdown
export const departmentTypes = [
  'Engineering',
  'Science',
  'Arts',
  'Management',
  'Commerce',
  'Medicine',
  'Law'
];

// HOD options for department assignment
export const hodOptions = [
  { name: 'Alice Johnson', avatar: 'https://via.placeholder.com/30' },
  { name: 'Bob Smith', avatar: 'https://via.placeholder.com/30' },
  { name: 'Charlie Brown', avatar: 'https://via.placeholder.com/30' },
  { name: 'Diana Prince', avatar: 'https://via.placeholder.com/30' },
  { name: 'Edward Norton', avatar: 'https://via.placeholder.com/30' },
];

/**
 * Get all HOD options for department assignment
 * In a real implementation, this would fetch eligible teachers from the database
 * @returns {Array} Array of HOD options with name and avatar
 */
export const getHODOptions = async () => {
  try {
    // In a real implementation, this would fetch teachers who can be HODs
    const response = await databases.listDocuments(
      DB_ID,
      TEACHERS_COLLECTION,
      [Query.equal('canBeHOD', true)]
    );
    
    if (response.documents && response.documents.length > 0) {
      return response.documents.map(teacher => ({
        name: teacher.name,
        avatar: teacher.avatar || 'https://via.placeholder.com/30'
      }));
    } else {
      console.log("No HOD-eligible teachers found, using fallback data");
      return hodOptions; // Use fallback if no teachers are found
    }
  } catch (error) {
    console.error("Error fetching HOD options:", error);
    // Fallback to dummy data
    return hodOptions;
  }
};

/**
 * Get all departments from Appwrite
 * @returns {Promise} Promise object with department data
 */
export const getAllDepartments = async () => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      DEPARTMENTS_COLLECTION
    );
    
    // Transform Appwrite data format to match application needs
    return response.documents.map(dept => ({
      id: dept.$id,
      name: dept.name,
      type: dept.type,
      status: dept.status,
      hod: dept.hod,
      hodAvatar: dept.hodAvatar || 'https://via.placeholder.com/30',
      totalCourses: dept.totalCourses || 0
    }));
  } catch (error) {
    console.error("Error fetching departments:", error);
    // Fallback to dummy data if Appwrite fails
    return dummyDepartments;
  }
};

/**
 * Search departments by name
 * @param {string} searchTerm - Search term to filter departments
 * @returns {Promise} Filtered departments
 */
export const searchDepartments = async (searchTerm) => {
  try {
    if (!searchTerm) {
      return await getAllDepartments();
    }
    
    // Use Appwrite's search functionality
    const response = await databases.listDocuments(
      DB_ID,
      DEPARTMENTS_COLLECTION,
      [Query.search('name', searchTerm)]
    );
    
    return response.documents.map(dept => ({
      id: dept.$id,
      name: dept.name,
      type: dept.type,
      status: dept.status,
      hod: dept.hod,
      hodAvatar: dept.hodAvatar || 'https://via.placeholder.com/30',
      totalCourses: dept.totalCourses || 0
    }));
  } catch (error) {
    console.error("Error searching departments:", error);
    
    // Fallback to filtering dummy data
    if (!searchTerm) return dummyDepartments;
    
    return dummyDepartments.filter(dept => 
      dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
};

/**
 * Create a new department in Appwrite
 * @param {Object} departmentData - The department data to create
 * @returns {Promise} Promise object with the created department
 */
export const createDepartment = async (departmentData) => {
  try {
    const departmentId = ID.unique();
    const department = {
      name: departmentData.name,
      type: departmentData.type,
      status: departmentData.status || 'Active',
      hod: departmentData.hod,
      hodAvatar: departmentData.hodAvatar || 'https://via.placeholder.com/30',
      totalCourses: 0,
      createdAt: new Date().toISOString()
    };
    
    const response = await databases.createDocument(
      DB_ID,
      DEPARTMENTS_COLLECTION,
      departmentId,
      department
    );
    
    return {
      id: response.$id,
      ...department
    };
  } catch (error) {
    console.error("Error creating department:", error);
    // For UI continuity in case of error
    return {
      id: 'temp-' + Date.now(),
      ...departmentData,
      status: 'Active',
      totalCourses: 0
    };
  }
};

/**
 * Update an existing department in Appwrite
 * @param {Object} departmentData - Department data with id and updated fields
 * @returns {Promise} Promise object with updated department
 */
export const updateDepartment = async (departmentData) => {
  try {
    const updatedData = {
      name: departmentData.name,
      type: departmentData.type,
      status: departmentData.status,
      hod: departmentData.hod,
      hodAvatar: departmentData.hodAvatar || 'https://via.placeholder.com/30',
      updatedAt: new Date().toISOString()
    };
    
    await databases.updateDocument(
      DB_ID,
      DEPARTMENTS_COLLECTION,
      departmentData.id,
      updatedData
    );
    
    return departmentData;
  } catch (error) {
    console.error("Error updating department:", error);
    // Return the data anyway for UI continuity
    return departmentData;
  }
};

/**
 * Delete a department from Appwrite
 * @param {string} id - The ID of the department to delete
 * @returns {Promise} Promise object with result
 */
export const deleteDepartment = async (id) => {
  try {
    await databases.deleteDocument(
      DB_ID,
      DEPARTMENTS_COLLECTION,
      id
    );
    
    return { success: true, id };
  } catch (error) {
    console.error("Error deleting department:", error);
    return { success: false, error: error.message };
  }
};

// Export all functions as a service object
const DepartmentManagementService = {
  getAllDepartments,
  searchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  departmentTypes,
  hodOptions,
  getHODOptions,
};

export default DepartmentManagementService;