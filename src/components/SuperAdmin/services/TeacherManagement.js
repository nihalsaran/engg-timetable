// TeacherManagement.js - Updated to use backend API instead of direct Appwrite/Firebase access
import axios from 'axios';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Subject areas that teachers can specialize in (now loaded from backend)
let cachedSubjectAreas = null;

// Department options (now loaded from backend)
let cachedDepartments = null;

// Sample teachers data for fallback if API fails
const dummyTeachers = [
  { id: 1, name: 'Dr. Jane Smith', email: 'jane@univ.edu', department: 'Computer Science', expertise: ['Algorithms & Data Structures', 'Artificial Intelligence'], qualification: 'Ph.D Computer Science', experience: 8, active: true },
  { id: 2, name: 'Prof. Michael Johnson', email: 'michael@univ.edu', department: 'Electrical Engineering', expertise: ['Computer Networks', 'Embedded Systems'], qualification: 'Ph.D Electrical Engineering', experience: 12, active: true },
  { id: 3, name: 'Dr. Sarah Williams', email: 'sarah@univ.edu', department: 'Computer Science', expertise: ['Database Systems', 'Web Development'], qualification: 'Ph.D Information Systems', experience: 6, active: false },
];

/**
 * Set the auth token for API requests
 * @param {string} token - JWT auth token
 */
const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

/**
 * Initialize the service with token from local storage
 */
const initService = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthHeader(token);
  }
};

// Initialize the service when imported
initService();

/**
 * Fetches all faculty members from backend API
 * @returns {Promise} Promise object with faculty data
 */
const fetchTeachers = async () => {
  try {
    const response = await axios.get(`${API_URL}/teachers`);
    
    if (response.data.success) {
      return {
        success: true,
        teachers: response.data.teachers,
        error: null
      };
    } else {
      return {
        success: false,
        teachers: dummyTeachers,
        error: response.data.message || 'Failed to load teachers'
      };
    }
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return {
      success: false,
      teachers: dummyTeachers,
      error: error.response?.data?.message || 'Failed to load teachers'
    };
  }
};

/**
 * Create a new teacher using backend API
 * @param {Object} teacherData - The teacher data to create
 * @returns {Promise} Promise object with result
 */
const createTeacher = async (teacherData) => {
  try {
    const response = await axios.post(`${API_URL}/teachers`, teacherData);
    
    if (response.data.success) {
      return {
        success: true,
        faculty: response.data.teacher,
        error: null
      };
    } else {
      return {
        success: false,
        faculty: null,
        error: response.data.message || 'Failed to create teacher'
      };
    }
  } catch (error) {
    console.error('Error creating teacher:', error);
    return {
      success: false,
      faculty: null,
      error: error.response?.data?.message || 'Failed to create teacher'
    };
  }
};

/**
 * Update an existing teacher using backend API
 * @param {string} id - The teacher ID to update
 * @param {Object} teacherData - The teacher data to update
 * @returns {Promise} Promise object with result
 */
const updateTeacher = async (id, teacherData) => {
  try {
    const response = await axios.put(`${API_URL}/teachers/${id}`, teacherData);
    
    if (response.data.success) {
      return {
        success: true,
        faculty: response.data.teacher,
        error: null
      };
    } else {
      return {
        success: false,
        faculty: null,
        error: response.data.message || 'Failed to update teacher'
      };
    }
  } catch (error) {
    console.error('Error updating teacher:', error);
    return {
      success: false,
      faculty: null,
      error: error.response?.data?.message || 'Failed to update teacher'
    };
  }
};

/**
 * Delete a teacher using backend API
 * @param {string} id - The teacher ID to delete
 * @returns {Promise} Promise object with result
 */
const deleteTeacher = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/teachers/${id}`);
    
    if (response.data.success) {
      return {
        success: true,
        error: null
      };
    } else {
      return {
        success: false,
        error: response.data.message || 'Failed to delete teacher'
      };
    }
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete teacher'
    };
  }
};

/**
 * Process faculty bulk import using backend API
 * @param {Array} jsonData - Array of faculty data from JSON file
 * @returns {Promise} Promise with results of import operation
 */
const processFacultyImport = async (jsonData) => {
  try {
    const response = await axios.post(`${API_URL}/teachers/import`, jsonData);
    
    if (response.data.success) {
      return {
        success: true,
        results: response.data.results,
        error: null
      };
    } else {
      return {
        success: false,
        results: null,
        error: response.data.message || 'Failed to import teachers'
      };
    }
  } catch (error) {
    console.error('Error processing faculty import:', error);
    return {
      success: false,
      results: null,
      error: error.response?.data?.message || 'Failed to import teachers'
    };
  }
};

/**
 * Get subject areas from backend API with caching
 * @returns {Promise<Array>} Array of subject areas
 */
const getSubjectAreas = async () => {
  // Return cached data if available
  if (cachedSubjectAreas) {
    return cachedSubjectAreas;
  }
  
  try {
    const response = await axios.get(`${API_URL}/teachers/data/subject-areas`);
    
    if (response.data.success) {
      // Cache the data
      cachedSubjectAreas = response.data.subjectAreas;
      return response.data.subjectAreas;
    } else {
      // Fallback to hardcoded subject areas
      return [
        'Algorithms & Data Structures',
        'Artificial Intelligence',
        'Computer Networks',
        'Database Systems',
        'Operating Systems',
        'Software Engineering',
        'Web Development',
        'Machine Learning',
        'Embedded Systems',
        'Cybersecurity',
        'Cloud Computing',
        'Mobile Development',
        'Computer Architecture',
        'Theoretical Computer Science',
        'Graphics & Visualization'
      ];
    }
  } catch (error) {
    console.error('Error fetching subject areas:', error);
    // Fallback to hardcoded subject areas
    return [
      'Algorithms & Data Structures',
      'Artificial Intelligence',
      'Computer Networks',
      'Database Systems',
      'Operating Systems',
      'Software Engineering',
      'Web Development',
      'Machine Learning',
      'Embedded Systems',
      'Cybersecurity',
      'Cloud Computing',
      'Mobile Development',
      'Computer Architecture',
      'Theoretical Computer Science',
      'Graphics & Visualization'
    ];
  }
};

/**
 * Get departments from backend API with caching
 * @returns {Promise<Array>} Array of departments
 */
const getDepartments = async () => {
  // Return cached data if available
  if (cachedDepartments) {
    return cachedDepartments;
  }
  
  try {
    const response = await axios.get(`${API_URL}/teachers/data/departments`);
    
    if (response.data.success) {
      // Cache the data
      cachedDepartments = response.data.departments;
      return response.data.departments;
    } else {
      // Fallback to hardcoded departments
      return [
        'Computer Science', 
        'Electrical Engineering', 
        'Mechanical Engineering',
        'Civil Engineering',
        'Chemical Engineering'
      ];
    }
  } catch (error) {
    console.error('Error fetching departments:', error);
    // Fallback to hardcoded departments
    return [
      'Computer Science', 
      'Electrical Engineering', 
      'Mechanical Engineering',
      'Civil Engineering',
      'Chemical Engineering'
    ];
  }
};

/**
 * Generate example JSON faculty dataset for download
 * @returns {Promise<Object>} Example faculty dataset
 */
const getExampleJSONDataset = async () => {
  try {
    const response = await axios.get(`${API_URL}/teachers/data/example-dataset`);
    
    if (response.data.success) {
      return response.data.data;
    } else {
      return [
        {
          "name": "Dr. John Doe",
          "email": "john.doe@university.edu",
          "password": "securePassword123",
          "department": "Computer Science",
          "expertise": ["Algorithms & Data Structures", "Artificial Intelligence"],
          "qualification": "Ph.D Computer Science",
          "experience": 10,
          "active": true,
          "maxHours": 40
        },
        {
          "name": "Dr. Jane Smith",
          "email": "jane.smith@university.edu",
          "password": "securePassword456",
          "department": "Electrical Engineering",
          "expertise": ["Computer Networks", "Embedded Systems"],
          "qualification": "Ph.D Electrical Engineering",
          "experience": 8,
          "active": true,
          "maxHours": 35
        }
      ];
    }
  } catch (error) {
    console.error('Error fetching example dataset:', error);
    // Return fallback data
    return [
      {
        "name": "Dr. John Doe",
        "email": "john.doe@university.edu",
        "password": "securePassword123",
        "department": "Computer Science",
        "expertise": ["Algorithms & Data Structures", "Artificial Intelligence"],
        "qualification": "Ph.D Computer Science",
        "experience": 10,
        "active": true,
        "maxHours": 40
      },
      {
        "name": "Dr. Jane Smith",
        "email": "jane.smith@university.edu",
        "password": "securePassword456",
        "department": "Electrical Engineering",
        "expertise": ["Computer Networks", "Embedded Systems"],
        "qualification": "Ph.D Electrical Engineering",
        "experience": 8,
        "active": true,
        "maxHours": 35
      }
    ];
  }
};

/**
 * Generate avatar initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (up to 2 characters)
 */
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Generate background color for avatar based on name
 * @param {string} name - User's name
 * @returns {string} CSS class for background color
 */
const getAvatarBg = (name) => {
  const colors = [
    'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 
    'bg-red-500', 'bg-orange-500', 'bg-amber-500',
    'bg-yellow-500', 'bg-lime-500', 'bg-green-500',
    'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500',
    'bg-sky-500', 'bg-blue-500', 'bg-violet-500'
  ];
  
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Export all functions as a service object
const TeacherManagementService = {
  fetchTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  processFacultyImport,
  getExampleJSONDataset,
  getInitials,
  getAvatarBg,
  getSubjectAreas,
  getDepartments,
  dummyTeachers
};

export default TeacherManagementService;