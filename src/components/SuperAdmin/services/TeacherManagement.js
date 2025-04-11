import authService from '../../../appwrite/auth';
import facultyService from '../../../appwrite/database/facultyService';

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

// Sample teachers data for development
export const dummyTeachers = [
  { id: 1, name: 'Dr. Jane Smith', email: 'jane@univ.edu', department: 'Computer Science', expertise: ['Algorithms & Data Structures', 'Artificial Intelligence'], qualification: 'Ph.D Computer Science', experience: 8, active: true },
  { id: 2, name: 'Prof. Michael Johnson', email: 'michael@univ.edu', department: 'Electrical Engineering', expertise: ['Computer Networks', 'Embedded Systems'], qualification: 'Ph.D Electrical Engineering', experience: 12, active: true },
  { id: 3, name: 'Dr. Sarah Williams', email: 'sarah@univ.edu', department: 'Computer Science', expertise: ['Database Systems', 'Web Development'], qualification: 'Ph.D Information Systems', experience: 6, active: false },
];

/**
 * Fetches all faculty members from the database
 * @returns {Promise} Promise object with faculty data
 */
export const fetchTeachers = async () => {
  try {
    const response = await facultyService.getAllFaculty();
    return {
      success: response.success,
      teachers: response.faculty,
      error: null
    };
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return {
      success: false,
      teachers: null,
      error: 'Failed to load teachers'
    };
  }
};

/**
 * Create a new teacher
 * @param {Object} teacherData - The teacher data to create
 * @returns {Promise} Promise object with result
 */
export const createTeacher = async (teacherData) => {
  try {
    // Create user account first
    const { name, email, password } = teacherData;
    const userResult = await authService.createAccount(email, password, name);
    
    if (!userResult.success) {
      throw new Error('Failed to create user account');
    }
    
    // Now create the teacher profile in the faculty collection
    const facultyData = {
      userId: userResult.user.$id, // Link to the auth user
      name: teacherData.name,
      email: teacherData.email,
      department: teacherData.department,
      expertise: teacherData.expertise,
      qualification: teacherData.qualification,
      experience: parseInt(teacherData.experience),
      active: teacherData.active,
      role: 'Faculty',
      maxHours: 40, // Default max teaching hours per week
      status: 'available'
    };
    
    const facultyResult = await facultyService.createFaculty(facultyData);
    
    return {
      success: facultyResult.success,
      faculty: facultyResult.faculty,
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
 * Update an existing teacher
 * @param {string} id - The teacher ID to update
 * @param {Object} teacherData - The teacher data to update
 * @returns {Promise} Promise object with result
 */
export const updateTeacher = async (id, teacherData) => {
  try {
    const facultyData = {
      name: teacherData.name,
      department: teacherData.department,
      expertise: teacherData.expertise,
      qualification: teacherData.qualification,
      experience: parseInt(teacherData.experience),
      active: teacherData.active
    };
    
    const result = await facultyService.updateFaculty(id, facultyData);
    
    // Update password if provided 
    // Note: This would typically require a separate API call
    if (teacherData.password) {
      // Password update logic would go here
      console.log("Password update would happen here");
    }
    
    return {
      success: result.success,
      faculty: result.faculty,
      error: null
    };
  } catch (error) {
    console.error('Error updating teacher:', error);
    return {
      success: false,
      faculty: null,
      error: error.message || 'Failed to update teacher'
    };
  }
};

/**
 * Delete a teacher
 * @param {string} id - The teacher ID to delete
 * @returns {Promise} Promise object with result
 */
export const deleteTeacher = async (id) => {
  try {
    const result = await facultyService.deleteFaculty(id);
    
    return {
      success: result.success,
      error: null
    };
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete teacher'
    };
  }
};

/**
 * Process faculty bulk import from JSON file
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
        // Create user account
        const userResult = await authService.createAccount(
          faculty.email, 
          faculty.password || 'defaultPassword123',
          faculty.name
        );
        
        if (!userResult.success) {
          results.push({
            name: faculty.name,
            success: false,
            error: 'Failed to create user account'
          });
          continue;
        }
        
        // Create faculty profile
        const teacherData = {
          userId: userResult.user.$id,
          name: faculty.name,
          email: faculty.email,
          department: faculty.department,
          expertise: faculty.expertise || [],
          qualification: faculty.qualification || '',
          experience: parseInt(faculty.experience || 0),
          active: faculty.active !== undefined ? faculty.active : true,
          role: 'Faculty',
          maxHours: faculty.maxHours || 40,
          status: 'available'
        };
        
        const facultyResult = await facultyService.createFaculty(teacherData);
        
        if (facultyResult.success) {
          results.push({
            name: faculty.name,
            success: true
          });
        } else {
          results.push({
            name: faculty.name,
            success: false,
            error: 'Failed to create faculty profile'
          });
        }
        
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