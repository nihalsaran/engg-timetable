// Backend/src/services/dashboard/department.service.js
const { db, admin } = require('../../config/firebase.config');
const { databases, ID, Query } = require('../../config/appwrite.config');

// Appwrite database and collection IDs
const DB_ID = process.env.APPWRITE_DATABASE_ID || 'default';
const DEPARTMENTS_COLLECTION = 'departments';
const TEACHERS_COLLECTION = 'teachers';

/**
 * Get all departments
 * @returns {Promise<Array>} Array of department objects
 */
exports.getAllDepartments = async () => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      DEPARTMENTS_COLLECTION
    );
    
    if (!response || !response.documents) {
      return [];
    }
    
    return response.documents.map(dept => ({
      id: dept.$id,
      name: dept.name,
      type: dept.type || 'Engineering',
      status: dept.status || 'Active',
      hod: dept.hod,
      hodAvatar: dept.hodAvatar || 'https://via.placeholder.com/30',
      totalCourses: dept.totalCourses || 0
    }));
  } catch (error) {
    console.error('Error fetching departments from Appwrite:', error);
    throw new Error('Failed to load departments');
  }
};

/**
 * Get a department by ID
 * @param {string} id - Department ID
 * @returns {Promise<Object>} Department object
 */
exports.getDepartmentById = async (id) => {
  try {
    const department = await databases.getDocument(
      DB_ID,
      DEPARTMENTS_COLLECTION,
      id
    );
    
    return {
      id: department.$id,
      name: department.name,
      type: department.type || 'Engineering',
      status: department.status || 'Active',
      hod: department.hod,
      hodAvatar: department.hodAvatar || 'https://via.placeholder.com/30',
      totalCourses: department.totalCourses || 0,
      description: department.description || '',
      createdAt: department.createdAt,
      updatedAt: department.updatedAt
    };
  } catch (error) {
    console.error(`Error fetching department with ID ${id}:`, error);
    throw new Error('Department not found');
  }
};

/**
 * Create a new department
 * @param {Object} departmentData - Department data to create
 * @returns {Promise<Object>} Created department object
 */
exports.createDepartment = async (departmentData) => {
  try {
    const departmentId = ID.unique();
    const department = {
      name: departmentData.name,
      type: departmentData.type,
      status: departmentData.status || 'Active',
      hod: departmentData.hod,
      hodAvatar: departmentData.hodAvatar || 'https://via.placeholder.com/30',
      description: departmentData.description || '',
      totalCourses: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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
    console.error('Error creating department:', error);
    throw new Error(error.message || 'Failed to create department');
  }
};

/**
 * Update an existing department
 * @param {string} id - Department ID
 * @param {Object} departmentData - Updated department data
 * @returns {Promise<Object>} Updated department
 */
exports.updateDepartment = async (id, departmentData) => {
  try {
    // First get the department to check if it exists
    const existingDepartment = await databases.getDocument(
      DB_ID,
      DEPARTMENTS_COLLECTION,
      id
    );
    
    if (!existingDepartment) {
      throw new Error('Department not found');
    }
    
    // Update department document in Appwrite
    const updatedData = {
      name: departmentData.name || existingDepartment.name,
      type: departmentData.type || existingDepartment.type,
      status: departmentData.status !== undefined ? departmentData.status : existingDepartment.status,
      hod: departmentData.hod || existingDepartment.hod,
      hodAvatar: departmentData.hodAvatar || existingDepartment.hodAvatar,
      description: departmentData.description || existingDepartment.description,
      updatedAt: new Date().toISOString()
    };
    
    const response = await databases.updateDocument(
      DB_ID,
      DEPARTMENTS_COLLECTION,
      id,
      updatedData
    );
    
    return {
      id: response.$id,
      ...updatedData,
      totalCourses: existingDepartment.totalCourses || 0,
      createdAt: existingDepartment.createdAt
    };
  } catch (error) {
    console.error(`Error updating department with ID ${id}:`, error);
    throw new Error(error.message || 'Failed to update department');
  }
};

/**
 * Delete a department
 * @param {string} id - Department ID to delete
 * @returns {Promise<{id: string}>} Deleted department ID
 */
exports.deleteDepartment = async (id) => {
  try {
    // First check if the department exists
    const existingDepartment = await databases.getDocument(
      DB_ID,
      DEPARTMENTS_COLLECTION,
      id
    );
    
    if (!existingDepartment) {
      throw new Error('Department not found');
    }
    
    // Delete the department from Appwrite
    await databases.deleteDocument(
      DB_ID,
      DEPARTMENTS_COLLECTION,
      id
    );
    
    return { id };
  } catch (error) {
    console.error(`Error deleting department with ID ${id}:`, error);
    throw new Error(error.message || 'Failed to delete department');
  }
};

/**
 * Search departments by name
 * @param {string} searchTerm - Search term to filter departments
 * @returns {Promise<Array>} Filtered departments
 */
exports.searchDepartments = async (searchTerm) => {
  try {
    if (!searchTerm) {
      return this.getAllDepartments();
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
      type: dept.type || 'Engineering',
      status: dept.status || 'Active',
      hod: dept.hod,
      hodAvatar: dept.hodAvatar || 'https://via.placeholder.com/30',
      totalCourses: dept.totalCourses || 0
    }));
  } catch (error) {
    console.error('Error searching departments:', error);
    throw new Error('Failed to search departments');
  }
};

/**
 * Get available department types
 * @returns {Promise<Array<string>>} Array of department types
 */
exports.getDepartmentTypes = async () => {
  return [
    'Engineering',
    'Science',
    'Arts',
    'Management',
    'Commerce',
    'Medicine',
    'Law'
  ];
};

/**
 * Get HOD options for department assignment
 * @returns {Promise<Array>} Array of eligible HOD options with name and avatar
 */
exports.getHODOptions = async () => {
  try {
    // Fetch teachers who can be HODs
    const response = await databases.listDocuments(
      DB_ID,
      TEACHERS_COLLECTION,
      [Query.equal('role', 'hod')]
    );
    
    if (response.documents && response.documents.length > 0) {
      return response.documents.map(teacher => ({
        id: teacher.$id,
        name: teacher.name,
        avatar: teacher.avatar || 'https://via.placeholder.com/30',
        email: teacher.email,
        department: teacher.department
      }));
    }
    
    // Fallback: return all teachers if no specific HOD role is set
    const allTeachers = await databases.listDocuments(
      DB_ID,
      TEACHERS_COLLECTION
    );
    
    return allTeachers.documents.map(teacher => ({
      id: teacher.$id,
      name: teacher.name,
      avatar: teacher.avatar || 'https://via.placeholder.com/30',
      email: teacher.email,
      department: teacher.department
    }));
  } catch (error) {
    console.error('Error fetching HOD options:', error);
    
    // Fallback to default HOD options in case of error
    return [
      { id: '1', name: 'Alice Johnson', avatar: 'https://via.placeholder.com/30', email: 'alice@example.com' },
      { id: '2', name: 'Bob Smith', avatar: 'https://via.placeholder.com/30', email: 'bob@example.com' },
      { id: '3', name: 'Charlie Brown', avatar: 'https://via.placeholder.com/30', email: 'charlie@example.com' },
      { id: '4', name: 'Diana Prince', avatar: 'https://via.placeholder.com/30', email: 'diana@example.com' },
      { id: '5', name: 'Edward Norton', avatar: 'https://via.placeholder.com/30', email: 'edward@example.com' }
    ];
  }
};

/**
 * Update department status (active/inactive)
 * @param {string} id - Department ID
 * @param {string} status - New status ('Active' or 'Inactive')
 * @returns {Promise<Object>} Updated department
 */
exports.updateDepartmentStatus = async (id, status) => {
  try {
    if (status !== 'Active' && status !== 'Inactive') {
      throw new Error('Status must be either "Active" or "Inactive"');
    }
    
    // First get the department to check if it exists
    const existingDepartment = await databases.getDocument(
      DB_ID,
      DEPARTMENTS_COLLECTION,
      id
    );
    
    if (!existingDepartment) {
      throw new Error('Department not found');
    }
    
    // Update only the status
    const response = await databases.updateDocument(
      DB_ID,
      DEPARTMENTS_COLLECTION,
      id,
      {
        status: status,
        updatedAt: new Date().toISOString()
      }
    );
    
    return {
      id: response.$id,
      status: status
    };
  } catch (error) {
    console.error(`Error updating department status with ID ${id}:`, error);
    throw new Error(error.message || 'Failed to update department status');
  }
};