// Backend/src/services/teacher.service.js
const { auth, db, admin } = require('../config/firebase.config');
const { databases, ID, Query } = require('../config/appwrite.config');

// Appwrite database and collection IDs
const DB_ID = process.env.APPWRITE_DATABASE_ID || 'default';
const TEACHERS_COLLECTION = 'teachers';

// Subject areas that teachers can specialize in
const SUBJECT_AREAS = [
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
const DEPARTMENTS = [
  'Computer Science', 
  'Electrical Engineering', 
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering'
];

/**
 * Get all teachers
 * @returns {Promise<Array>} Array of teacher objects
 */
exports.getTeachers = async () => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      TEACHERS_COLLECTION
    );
    
    if (!response || !response.documents) {
      return [];
    }
    
    return response.documents.map(doc => ({
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
  } catch (error) {
    console.error('Error fetching teachers from Appwrite:', error);
    throw new Error('Failed to load teachers');
  }
};

/**
 * Get a teacher by ID
 * @param {string} id - Teacher ID
 * @returns {Promise<Object>} Teacher object
 */
exports.getTeacherById = async (id) => {
  try {
    const teacher = await databases.getDocument(
      DB_ID,
      TEACHERS_COLLECTION,
      id
    );
    
    return {
      id: teacher.$id,
      name: teacher.name,
      email: teacher.email,
      department: teacher.department,
      expertise: teacher.expertise || [],
      qualification: teacher.qualification,
      experience: teacher.experience,
      active: teacher.active,
      userId: teacher.userId,
      maxHours: teacher.maxHours || 40,
      status: teacher.status || 'available'
    };
  } catch (error) {
    console.error(`Error fetching teacher with ID ${id}:`, error);
    throw new Error('Teacher not found');
  }
};

/**
 * Create a new teacher
 * @param {Object} teacherData - Teacher data to create
 * @returns {Promise<Object>} Created teacher
 */
exports.createTeacher = async (teacherData) => {
  try {
    // Create user account in Firebase Auth
    const { name, email, password } = teacherData;
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name
    });
    
    const userId = userRecord.uid;
    
    // Create teacher document in Appwrite
    const teacherId = ID.unique();
    const facultyData = {
      userId,
      name: teacherData.name,
      email: teacherData.email,
      department: teacherData.department,
      expertise: teacherData.expertise || [],
      qualification: teacherData.qualification || '',
      experience: parseInt(teacherData.experience) || 0,
      active: teacherData.active !== false, // Default to true if not specified
      role: 'faculty',
      maxHours: teacherData.maxHours || 40, // Default max teaching hours per week
      status: 'available',
      createdAt: new Date().toISOString()
    };
    
    // Set user role in Firestore
    await db.collection('profiles').doc(userId).set({
      name,
      email,
      role: 'faculty',
      department: teacherData.department,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    const response = await databases.createDocument(
      DB_ID,
      TEACHERS_COLLECTION,
      teacherId,
      facultyData
    );
    
    return {
      id: response.$id,
      ...facultyData
    };
  } catch (error) {
    console.error('Error creating teacher:', error);
    throw new Error(error.message || 'Failed to create teacher');
  }
};

/**
 * Update an existing teacher
 * @param {string} id - Teacher ID
 * @param {Object} teacherData - Updated teacher data
 * @returns {Promise<Object>} Updated teacher
 */
exports.updateTeacher = async (id, teacherData) => {
  try {
    // First get the teacher to check if it exists and get the userId
    const existingTeacher = await databases.getDocument(
      DB_ID,
      TEACHERS_COLLECTION,
      id
    );
    
    if (!existingTeacher) {
      throw new Error('Teacher not found');
    }
    
    // Password updates should be handled separately
    if (teacherData.password) {
      await auth.updateUser(existingTeacher.userId, {
        password: teacherData.password
      });
    }
    
    // Update teacher profile in Firestore if name or department changed
    if (teacherData.name || teacherData.department) {
      const updateData = {};
      
      if (teacherData.name) {
        updateData.name = teacherData.name;
        // Also update display name in Firebase Auth
        await auth.updateUser(existingTeacher.userId, {
          displayName: teacherData.name
        });
      }
      
      if (teacherData.department) {
        updateData.department = teacherData.department;
      }
      
      if (Object.keys(updateData).length > 0) {
        await db.collection('profiles').doc(existingTeacher.userId).update(updateData);
      }
    }
    
    // Update teacher document in Appwrite
    const updatedData = {
      name: teacherData.name || existingTeacher.name,
      department: teacherData.department || existingTeacher.department,
      expertise: teacherData.expertise || existingTeacher.expertise,
      qualification: teacherData.qualification || existingTeacher.qualification,
      experience: parseInt(teacherData.experience) || existingTeacher.experience,
      active: teacherData.active !== undefined ? teacherData.active : existingTeacher.active,
      maxHours: teacherData.maxHours || existingTeacher.maxHours,
      updatedAt: new Date().toISOString()
    };
    
    const response = await databases.updateDocument(
      DB_ID,
      TEACHERS_COLLECTION,
      id,
      updatedData
    );
    
    return {
      id: response.$id,
      ...updatedData,
      userId: existingTeacher.userId
    };
  } catch (error) {
    console.error(`Error updating teacher with ID ${id}:`, error);
    throw new Error(error.message || 'Failed to update teacher');
  }
};

/**
 * Delete a teacher
 * @param {string} id - Teacher ID to delete
 * @returns {Promise<{id: string}>} Deleted teacher ID
 */
exports.deleteTeacher = async (id) => {
  try {
    // First get the teacher to check if it exists and get the userId
    const existingTeacher = await databases.getDocument(
      DB_ID,
      TEACHERS_COLLECTION,
      id
    );
    
    if (!existingTeacher) {
      throw new Error('Teacher not found');
    }
    
    // Note: This only removes the teacher from Appwrite, not from Firebase Auth
    // For security reasons, we don't delete the Firebase Auth user
    // Consider just deactivating the user in a production environment
    await databases.deleteDocument(
      DB_ID,
      TEACHERS_COLLECTION,
      id
    );
    
    return { id };
  } catch (error) {
    console.error(`Error deleting teacher with ID ${id}:`, error);
    throw new Error(error.message || 'Failed to delete teacher');
  }
};

/**
 * Update teacher status (active/inactive)
 * @param {string} id - Teacher ID
 * @param {boolean} active - Active status
 * @returns {Promise<Object>} Updated teacher
 */
exports.updateTeacherStatus = async (id, active) => {
  try {
    if (typeof active !== 'boolean') {
      throw new Error('Status must be a boolean value');
    }
    
    // First get the teacher to check if it exists
    const existingTeacher = await databases.getDocument(
      DB_ID,
      TEACHERS_COLLECTION,
      id
    );
    
    if (!existingTeacher) {
      throw new Error('Teacher not found');
    }
    
    // Update the active status in Appwrite
    const response = await databases.updateDocument(
      DB_ID,
      TEACHERS_COLLECTION,
      id,
      {
        active,
        updatedAt: new Date().toISOString()
      }
    );
    
    // Disable the user in Firebase Auth if setting to inactive
    if (existingTeacher.userId) {
      await auth.updateUser(existingTeacher.userId, {
        disabled: !active
      });
    }
    
    return {
      id: response.$id,
      active
    };
  } catch (error) {
    console.error(`Error updating teacher status with ID ${id}:`, error);
    throw new Error(error.message || 'Failed to update teacher status');
  }
};

/**
 * Process faculty bulk import from JSON file
 * @param {Array} teachersData - Array of teacher data
 * @returns {Promise<Object>} Import results
 */
exports.processFacultyImport = async (teachersData) => {
  try {
    // Validate the data structure
    if (!Array.isArray(teachersData)) {
      throw new Error('Invalid data format. Expected an array of faculty members.');
    }
    
    // Process each faculty member in the dataset
    const results = [];
    for (const teacherData of teachersData) {
      // Basic validation
      if (!teacherData.name || !teacherData.email || !teacherData.department) {
        results.push({
          name: teacherData.name || 'Unknown',
          success: false,
          error: 'Missing required fields (name, email, or department)'
        });
        continue;
      }
      
      try {
        // Create user in Firebase Auth
        const userRecord = await auth.createUser({
          email: teacherData.email,
          password: teacherData.password || 'DefaultPass123!',
          displayName: teacherData.name
        });
        
        const userId = userRecord.uid;
        
        // Create profile in Firestore
        await db.collection('profiles').doc(userId).set({
          name: teacherData.name,
          email: teacherData.email,
          role: 'faculty',
          department: teacherData.department,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        // Create teacher document in Appwrite
        const teacherId = ID.unique();
        const facultyData = {
          userId,
          name: teacherData.name,
          email: teacherData.email,
          department: teacherData.department,
          expertise: teacherData.expertise || [],
          qualification: teacherData.qualification || '',
          experience: parseInt(teacherData.experience) || 0,
          active: teacherData.active !== undefined ? teacherData.active : true,
          role: 'faculty',
          maxHours: teacherData.maxHours || 40, // Default max teaching hours per week
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
          name: teacherData.name,
          success: true
        });
      } catch (err) {
        results.push({
          name: teacherData.name,
          success: false,
          error: err.message
        });
      }
    }
    
    return {
      success: true,
      results
    };
  } catch (error) {
    console.error('Error processing faculty import:', error);
    throw new Error(error.message || 'Error processing faculty import');
  }
};

/**
 * Get available subject areas
 * @returns {Promise<Array>} Array of subject areas
 */
exports.getSubjectAreas = async () => {
  return SUBJECT_AREAS;
};

/**
 * Get available department options
 * @returns {Promise<Array>} Array of departments
 */
exports.getDepartments = async () => {
  try {
    // Try to get departments from Appwrite
    const response = await databases.listDocuments(
      DB_ID,
      'departments'
    );
    
    if (response && response.documents && response.documents.length > 0) {
      return response.documents.map(dept => dept.name);
    }
    
    // Fallback to predefined departments
    return DEPARTMENTS;
  } catch (error) {
    console.error('Error fetching departments:', error);
    // Fallback to predefined departments
    return DEPARTMENTS;
  }
};

/**
 * Generate example JSON faculty dataset for download
 * @returns {Array} Example faculty dataset
 */
exports.getExampleJSONDataset = () => {
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