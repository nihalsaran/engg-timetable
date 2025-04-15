// TeacherManagement.js - Updated to integrate with Appwrite
import { databases, ID, Query } from '../../../appwrite/config';
import { auth, createUserWithEmailAndPassword } from '../../../firebase/config';

// Appwrite database and collection IDs
const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'default';
const TEACHERS_COLLECTION = 'teachers';

// Subject areas that teachers can specialize in
export const subjectAreas = [
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

// Department options
export const departments = [
  'Computer Science', 
  'Electrical Engineering', 
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering'
];

// Sample teachers data for fallback if Appwrite fails
export const dummyTeachers = [
  { id: 1, name: 'Dr. Jane Smith', email: 'jane@univ.edu', department: 'Computer Science', expertise: ['Algorithms & Data Structures', 'Artificial Intelligence'], qualification: 'Ph.D Computer Science', experience: 8, active: true },
  { id: 2, name: 'Prof. Michael Johnson', email: 'michael@univ.edu', department: 'Electrical Engineering', expertise: ['Computer Networks', 'Embedded Systems'], qualification: 'Ph.D Electrical Engineering', experience: 12, active: true },
  { id: 3, name: 'Dr. Sarah Williams', email: 'sarah@univ.edu', department: 'Computer Science', expertise: ['Database Systems', 'Web Development'], qualification: 'Ph.D Information Systems', experience: 6, active: false },
];

/**
 * Fetches all faculty members from Appwrite
 * @returns {Promise} Promise object with faculty data
 */
export const fetchTeachers = async () => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      TEACHERS_COLLECTION
    );
    
    const teachers = response.documents.map(doc => ({
      id: doc.$id,
      name: doc.name,
      email: doc.email,
      department: doc.department,
      expertise: doc.expertise || [],
      qualification: doc.qualification,
      experience: doc.experience,
      active: doc.active,
      userId: doc.userId
    }));

    return {
      success: true,
      teachers,
      error: null
    };
  } catch (error) {
    console.error('Error fetching teachers from Appwrite:', error);
    return {
      success: false,
      teachers: dummyTeachers,
      error: 'Failed to load teachers'
    };
  }
};

/**
 * Create a new teacher using Firebase for auth and Appwrite for data
 * @param {Object} teacherData - The teacher data to create
 * @returns {Promise} Promise object with result
 */
export const createTeacher = async (teacherData) => {
  try {
    // Create user account in Firebase Auth
    const { name, email, password } = teacherData;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    
    // Create teacher document in Appwrite
    const teacherId = ID.unique();
    const facultyData = {
      userId,
      name: teacherData.name,
      email: teacherData.email,
      department: teacherData.department,
      expertise: teacherData.expertise,
      qualification: teacherData.qualification,
      experience: parseInt(teacherData.experience),
      active: teacherData.active,
      role: 'Faculty',
      maxHours: 40, // Default max teaching hours per week
      status: 'available',
      createdAt: new Date().toISOString()
    };
    
    const response = await databases.createDocument(
      DB_ID,
      TEACHERS_COLLECTION,
      teacherId,
      facultyData
    );
    
    return {
      success: true,
      faculty: {
        id: response.$id,
        ...facultyData
      },
      error: null
    };
  } catch (error) {
    console.error('Error creating teacher:', error);
    return {
      success: false,
      faculty: null,
      error: error.message || 'Failed to create teacher'
    };
  }
};

/**
 * Update an existing teacher in Appwrite
 * @param {string} id - The teacher ID to update
 * @param {Object} teacherData - The teacher data to update
 * @returns {Promise} Promise object with result
 */
export const updateTeacher = async (id, teacherData) => {
  try {
    // Password updates should be handled with Firebase Auth
    if (teacherData.password) {
      console.log("Password updates should be handled separately with Firebase Auth");
    }
    
    // Update teacher document in Appwrite
    const updatedData = {
      name: teacherData.name,
      department: teacherData.department,
      expertise: teacherData.expertise,
      qualification: teacherData.qualification,
      experience: parseInt(teacherData.experience),
      active: teacherData.active,
      updatedAt: new Date().toISOString()
    };
    
    const response = await databases.updateDocument(
      DB_ID,
      TEACHERS_COLLECTION,
      id,
      updatedData
    );
    
    return {
      success: true,
      faculty: {
        id: response.$id,
        ...updatedData
      },
      error: null
    };
  } catch (error) {
    console.error('Error updating teacher in Appwrite:', error);
    return {
      success: false,
      faculty: null,
      error: error.message || 'Failed to update teacher'
    };
  }
};

/**
 * Delete a teacher from Appwrite
 * @param {string} id - The teacher ID to delete
 * @returns {Promise} Promise object with result
 */
export const deleteTeacher = async (id) => {
  try {
    // Note: This only removes the teacher from Appwrite, not from Firebase Auth
    await databases.deleteDocument(
      DB_ID,
      TEACHERS_COLLECTION,
      id
    );
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('Error deleting teacher from Appwrite:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete teacher'
    };
  }
};

/**
 * Process faculty bulk import from JSON file using Appwrite
 * @param {Array} jsonData - Array of faculty data from JSON file
 * @returns {Promise} Promise with results of import operation
 */
export const processFacultyImport = async (jsonData) => {
  try {
    // Validate the JSON structure
    if (!Array.isArray(jsonData)) {
      throw new Error('Invalid JSON format. Expected an array of faculty members.');
    }
    
    // Process each faculty member in the dataset
    const results = [];
    for (const faculty of jsonData) {
      // Basic validation
      if (!faculty.name || !faculty.email || !faculty.department) {
        results.push({
          name: faculty.name || 'Unknown',
          success: false,
          error: 'Missing required fields (name, email, or department)'
        });
        continue;
      }
      
      try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          faculty.email, 
          faculty.password || 'DefaultPass123!'
        );
        const userId = userCredential.user.uid;
        
        // Create teacher document in Appwrite
        const teacherId = ID.unique();
        const facultyData = {
          userId,
          name: faculty.name,
          email: faculty.email,
          department: faculty.department,
          expertise: faculty.expertise || [],
          qualification: faculty.qualification || '',
          experience: parseInt(faculty.experience) || 0,
          active: faculty.active !== undefined ? faculty.active : true,
          role: 'Faculty',
          maxHours: faculty.maxHours || 40, // Default max teaching hours per week
          status: 'available',
          createdAt: new Date().toISOString()
        };
        
        await databases.createDocument(
          DB_ID,
          TEACHERS_COLLECTION,
          teacherId,
          facultyData
        );
        
        results.push({
          name: faculty.name,
          success: true
        });
      } catch (err) {
        results.push({
          name: faculty.name,
          success: false,
          error: err.message
        });
      }
    }
    
    return {
      success: true,
      results,
      error: null
    };
  } catch (error) {
    console.error('Error processing faculty import:', error);
    return {
      success: false,
      results: null,
      error: error.message || 'Error processing faculty import'
    };
  }
};

/**
 * Generate example JSON faculty dataset for download
 * @returns {Object} Example faculty dataset
 */
export const getExampleJSONDataset = () => {
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
};

/**
 * Generate avatar initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (up to 2 characters)
 */
export const getInitials = (name) => {
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
export const getAvatarBg = (name) => {
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
  subjectAreas,
  departments,
  dummyTeachers
};

export default TeacherManagementService;