// TeacherManagement.js - Firebase Integration
import { 
  auth, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from '../../../firebase/config.js';
import { 
  db, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from '../../../firebase/config.js';

// Collection names
const TEACHERS_COLLECTION = 'teachers';
const PROFILES_COLLECTION = 'profiles';

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

// Sample teachers data for fallback
export const dummyTeachers = [
  { id: 1, name: 'Dr. Jane Smith', email: 'jane@univ.edu', department: 'Computer Science', expertise: ['Algorithms & Data Structures', 'Artificial Intelligence'], qualification: 'Ph.D Computer Science', experience: 8, active: true },
  { id: 2, name: 'Prof. Michael Johnson', email: 'michael@univ.edu', department: 'Electrical Engineering', expertise: ['Computer Networks', 'Embedded Systems'], qualification: 'Ph.D Electrical Engineering', experience: 12, active: true },
  { id: 3, name: 'Dr. Sarah Williams', email: 'sarah@univ.edu', department: 'Computer Science', expertise: ['Database Systems', 'Web Development'], qualification: 'Ph.D Information Systems', experience: 6, active: false },
];

/**
 * Fetch all teachers from Firestore database
 * @returns {Promise<Object>} Object with success status and teachers array
 */
export const fetchTeachers = async () => {
  try {
    const teachersRef = collection(db, TEACHERS_COLLECTION);
    const querySnapshot = await getDocs(teachersRef);
    
    const teachers = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        department: data.department,
        expertise: data.expertise || [],
        qualification: data.qualification,
        experience: data.experience || 0,
        active: data.active !== false, // default to true if not specified
        userId: data.userId
      };
    });

    return {
      success: true,
      teachers,
      error: null
    };
  } catch (error) {
    console.error('Error fetching teachers from Firebase:', error);
    return {
      success: false,
      teachers: [],
      error: 'Failed to load teachers'
    };
  }
};

/**
 * Create a new teacher using Firebase for auth and data storage
 * @param {Object} teacherData - The teacher data to create
 * @returns {Promise} Promise object with result
 */
export const createTeacher = async (teacherData) => {
  try {
    // Generate a random initial password
    const initialPassword = generateSecurePassword();
    
    // Create user account in Firebase Auth
    const { name, email } = teacherData;
    const userCredential = await createUserWithEmailAndPassword(auth, email, initialPassword);
    const userId = userCredential.user.uid;
    
    // Create teacher document in Firestore
    const teacherRef = doc(db, TEACHERS_COLLECTION, userId);
    const facultyData = {
      userId,
      name: teacherData.name,
      email: teacherData.email,
      department: teacherData.department,
      expertise: teacherData.expertise || [],
      qualification: teacherData.qualification || '',
      experience: parseInt(teacherData.experience) || 0,
      active: teacherData.active !== false,
      role: 'Faculty',
      maxHours: 40, // Default max teaching hours per week
      status: 'available',
      createdAt: new Date().toISOString()
    };
    
    await setDoc(teacherRef, facultyData);
    
    // Create a basic user profile document
    await setDoc(doc(db, PROFILES_COLLECTION, userId), {
      userId,
      name: teacherData.name,
      email: teacherData.email,
      role: 'Faculty',
      department: teacherData.department,
      active: teacherData.active !== false,
      createdAt: new Date().toISOString()
    });
    
    // Send password reset email so the faculty can set their own password
    try {
      await sendPasswordResetEmail(auth, email, {
        url: window.location.origin + '/login'
      });
    } catch (recoveryError) {
      console.warn('Could not send password reset email:', recoveryError);
    }
    
    return {
      success: true,
      faculty: {
        id: userId,
        ...facultyData
      },
      error: null
    };
  } catch (error) {
    console.error('Error creating teacher in Firebase:', error);
    
    let errorMessage = 'Failed to create faculty account';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'A user with this email already exists';
    }
    
    return {
      success: false,
      faculty: null,
      error: errorMessage
    };
  }
};

/**
 * Update an existing teacher's information
 * @param {Object} teacherData - Updated teacher data
 * @returns {Promise} Promise object with result
 */
export const updateTeacher = async (teacherData) => {
  try {
    const teacherId = teacherData.id;
    
    // Update the teacher document in Firestore
    const teacherRef = doc(db, TEACHERS_COLLECTION, teacherId);
    const teacherDocSnap = await getDoc(teacherRef);
    
    if (!teacherDocSnap.exists()) {
      throw new Error('Teacher not found');
    }
    
    const updateData = {
      name: teacherData.name,
      department: teacherData.department,
      expertise: teacherData.expertise || [],
      qualification: teacherData.qualification || '',
      experience: parseInt(teacherData.experience) || 0,
      active: teacherData.active !== false,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(teacherRef, updateData);
    
    // If the teacher record has a userId, update the corresponding profile document
    const existingData = teacherDocSnap.data();
    if (existingData.userId) {
      const profileRef = doc(db, PROFILES_COLLECTION, existingData.userId);
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        await updateDoc(profileRef, {
          name: teacherData.name,
          department: teacherData.department,
          active: teacherData.active !== false,
          updatedAt: new Date().toISOString()
        });
      }
    }
    
    return {
      success: true,
      faculty: {
        id: teacherId,
        ...existingData,
        ...updateData
      },
      error: null
    };
  } catch (error) {
    console.error('Error updating teacher in Firebase:', error);
    return {
      success: false,
      faculty: null,
      error: 'Failed to update faculty information'
    };
  }
};

/**
 * Delete a teacher by ID
 * @param {string} teacherId - ID of the teacher to delete
 * @returns {Promise} Promise object with result
 */
export const deleteTeacher = async (teacherId) => {
  try {
    // Get the teacher document to check for userId
    const teacherRef = doc(db, TEACHERS_COLLECTION, teacherId);
    const teacherSnap = await getDoc(teacherRef);
    
    if (!teacherSnap.exists()) {
      throw new Error('Teacher not found');
    }
    
    const teacherData = teacherSnap.data();
    
    // Delete the teacher document
    await deleteDoc(teacherRef);
    
    // If there's a userId, delete the profile document and try to delete the Auth user
    if (teacherData.userId) {
      // Delete profile document
      const profileRef = doc(db, PROFILES_COLLECTION, teacherData.userId);
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        await deleteDoc(profileRef);
      }
      
      // Note: Deleting the Firebase Auth user requires the Admin SDK in a Cloud Function
      // This would be implemented server-side in production
    }
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error('Error deleting teacher from Firebase:', error);
    return {
      success: false,
      error: 'Failed to delete faculty member'
    };
  }
};

/**
 * Get a teacher by ID
 * @param {string} teacherId - ID of the teacher to fetch
 * @returns {Promise<Object>} Teacher data
 */
export const getTeacherById = async (teacherId) => {
  try {
    const teacherRef = doc(db, TEACHERS_COLLECTION, teacherId);
    const docSnap = await getDoc(teacherRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data
      };
    } else {
      throw new Error('Teacher not found');
    }
  } catch (error) {
    console.error('Error fetching teacher:', error);
    throw error;
  }
};

/**
 * Search teachers by name, department, or expertise
 * @param {string} searchTerm - Term to search for
 * @returns {Promise<Array>} Matching teachers
 */
export const searchTeachers = async (searchTerm) => {
  try {
    if (!searchTerm || searchTerm.trim() === '') {
      return await fetchTeachers();
    }
    
    const searchTermLower = searchTerm.toLowerCase().trim();
    const teachersRef = collection(db, TEACHERS_COLLECTION);
    const querySnapshot = await getDocs(teachersRef);
    
    // Client-side filtering since Firestore doesn't support complex text search
    const filteredTeachers = querySnapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data
        };
      })
      .filter(teacher => 
        (teacher.name && teacher.name.toLowerCase().includes(searchTermLower)) ||
        (teacher.department && teacher.department.toLowerCase().includes(searchTermLower)) ||
        (teacher.expertise && teacher.expertise.some(exp => 
          exp.toLowerCase().includes(searchTermLower)
        ))
      );
    
    return {
      success: true,
      teachers: filteredTeachers,
      error: null
    };
  } catch (error) {
    console.error('Error searching teachers:', error);
    return {
      success: false,
      teachers: [],
      error: 'Failed to search teachers'
    };
  }
};

// Helper function to generate a secure password
const generateSecurePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
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


//example json data for faculty
const getExampleJSONDataset = ()=>{
  return {
    "faculty":[
      { id: 1, name: 'Dr. Jane Smith', email: 'jane@univ.edu', department: 'Computer Science', expertise: ['Algorithms & Data Structures', 'Artificial Intelligence'], qualification: 'Ph.D Computer Science', experience: 8, active: true },
      { id: 2, name: 'Prof. Michael Johnson', email: 'michael@univ.edu', department: 'Electrical Engineering', expertise: ['Computer Networks', 'Embedded Systems'], qualification: 'Ph.D Electrical Engineering', experience: 12, active: true },
      { id: 3, name: 'Dr. Sarah Williams', email: 'sarah@univ.edu', department: 'Computer Science', expertise: ['Database Systems', 'Web Development'], qualification: 'Ph.D Information Systems', experience: 6, active: false },
    ]
  }
}

// Export all functions as a service object
const TeacherManagementService = {
  fetchTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherById,
  searchTeachers,
  getInitials,
  getAvatarBg,
  subjectAreas,
  departments,
  dummyTeachers,
  getExampleJSONDataset
};

export default TeacherManagementService;