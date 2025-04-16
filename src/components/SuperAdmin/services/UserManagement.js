// User Management Service with Firebase Integration
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
  generateId
} from '../../../firebase/config.js';
import { databases, ID } from '../../../appwrite/config.js';

// Appwrite database and collection IDs
const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'default';
const TEACHERS_COLLECTION = 'teachers';

// Department data - would come from Database in production
const departments = [
  'Computer Science', 
  'Electrical Engineering', 
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering'
];

// User roles
const roles = ['superadmin', 'hod', 'tt_incharge'];
const roleDisplayNames = {
  'superadmin': 'Admin',
  'hod': 'HOD',
  'tt_incharge': 'TT Incharge'
};

/**
 * Fetch all users from the Firestore database
 * @returns {Promise<Array>} Array of user objects
 */
export const getUsers = async () => {
  try {
    const profilesRef = collection(db, 'profiles');
    const querySnapshot = await getDocs(profilesRef);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId || doc.id,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        active: data.active !== false, // default to true if not specified
        createdAt: data.createdAt
      };
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getDepartments = () => {
  return departments;
};

export const getRoles = () => {
  return roles.map(role => ({
    value: role,
    label: roleDisplayNames[role] || role
  }));
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
 * Create a new user in Firebase and add their profile
 * @param {Object} userData User data to create
 * @returns {Promise<Object>} Created user data
 */
export const createUser = async (userData) => {
  try {
    // Generate a random initial password
    const initialPassword = generateSecurePassword();
    
    // Create user in Firebase Authentication (requires admin SDK in a real app)
    // This example shows client-side approach, but in production you'd use Cloud Functions
    // for security reasons
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      initialPassword
    );
    
    const user = userCredential.user;
    
    // Create user profile in Firestore
    const userProfileRef = doc(db, 'profiles', user.uid);
    await setDoc(userProfileRef, {
      userId: user.uid,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      active: true,
      createdAt: new Date().toISOString()
    });
    
    // If user is an HOD, also create entry in teachers collection in Appwrite
    if (userData.role === 'hod') {
      await createTeacherForHOD(userData, user.uid);
    }
    
    // Send password reset email so user can set their own password
    try {
      await sendPasswordResetEmail(auth, userData.email, {
        url: window.location.origin + '/login'
      });
    } catch (recoveryError) {
      console.warn('Could not send password reset email:', recoveryError);
    }
    
    return {
      id: user.uid,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      active: true
    };
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('A user with this email already exists.');
    }
    throw new Error('Failed to create user: ' + error.message);
  }
};

/**
 * Update a user profile in the database
 * @param {string} id The profile document ID
 * @param {Object} userData Updated user data
 * @returns {Promise<Object>} Updated user data
 */
export const updateUser = async (id, userData) => {
  try {
    // Update user profile in Firestore
    const userProfileRef = doc(db, 'profiles', id);
    await updateDoc(userProfileRef, {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      active: userData.active !== false
    });
    
    // If the user is an HOD, update or create their record in the teachers collection
    if (userData.role === 'hod') {
      try {
        // Try to find if this user already has a teacher record in Appwrite
        const teacherQuery = await databases.listDocuments(
          DB_ID,
          TEACHERS_COLLECTION,
          [Query.equal('userId', id)]
        );
        
        // If a record exists, update it
        if (teacherQuery.documents && teacherQuery.documents.length > 0) {
          const teacherId = teacherQuery.documents[0].$id;
          
          await databases.updateDocument(
            DB_ID,
            TEACHERS_COLLECTION,
            teacherId,
            {
              name: userData.name,
              email: userData.email,
              department: userData.department,
              active: userData.active !== false,
              updatedAt: new Date().toISOString()
            }
          );
        } else {
          // If no record exists, create one
          await createTeacherForHOD(userData, id);
        }
      } catch (appwriteError) {
        console.error('Error updating HOD in teachers collection:', appwriteError);
        // Continue with the user update even if the Appwrite operation fails
      }
    }
    
    return {
      id,
      ...userData,
      active: userData.active !== false
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user: ' + error.message);
  }
};

/**
 * Delete a user from the database
 * @param {string} id The profile document ID
 * @returns {Promise<{success: boolean, id: string}>}
 */
export const deleteUser = async (id) => {
  try {
    // Delete user profile from Firestore
    const userProfileRef = doc(db, 'profiles', id);
    const userSnap = await getDoc(userProfileRef);
    const userData = userSnap.data();
    
    await deleteDoc(userProfileRef);
    
    // If the user was an HOD, also delete the corresponding teacher record in Appwrite
    if (userData && userData.role === 'hod') {
      try {
        // Find the teacher record in Appwrite
        const teacherQuery = await databases.listDocuments(
          DB_ID,
          TEACHERS_COLLECTION,
          [Query.equal('userId', id)]
        );
        
        // Delete the teacher record if found
        if (teacherQuery.documents && teacherQuery.documents.length > 0) {
          const teacherId = teacherQuery.documents[0].$id;
          await databases.deleteDocument(
            DB_ID,
            TEACHERS_COLLECTION,
            teacherId
          );
          console.log('HOD deleted from teachers collection:', teacherId);
        }
      } catch (appwriteError) {
        console.error('Error deleting HOD from teachers collection:', appwriteError);
        // Continue with the user deletion even if the Appwrite operation fails
      }
    }
    
    // In a real application, you would use Firebase Admin SDK
    // to delete the user from Firebase Authentication
    // This requires server-side code (Cloud Functions)
    try {
      // This is a placeholder - in production, you would call a Cloud Function
      console.log('User account deletion should be handled by server');
    } catch (authError) {
      console.warn('Could not delete auth account (requires admin privileges):', authError);
    }
    
    return { success: true, id };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user: ' + error.message);
  }
};

/**
 * Send a password reset email to a user
 * @param {string} email User's email
 * @returns {Promise<{success: boolean}>}
 */
export const sendPasswordReset = async (email) => {
  try {
    // Send password reset email
    await sendPasswordResetEmail(auth, email, {
      url: window.location.origin + '/login'
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset:', error);
    
    if (error.code === 'auth/user-not-found') {
      throw new Error('No user found with this email address.');
    }
    
    throw new Error('Failed to send password reset: ' + error.message);
  }
};

/**
 * Toggle a user's active status
 * @param {string} id The profile document ID
 * @param {boolean} isActive New active status
 * @returns {Promise<{success: boolean}>}
 */
export const toggleUserStatus = async (id, isActive) => {
  try {
    const userProfileRef = doc(db, 'profiles', id);
    await updateDoc(userProfileRef, {
      active: isActive
    });
    return { success: true };
  } catch (error) {
    console.error('Error toggling user status:', error);
    throw new Error('Failed to update user status: ' + error.message);
  }
};

/**
 * Get user initials from full name
 * @param {string} name Full name
 * @returns {string} Initials (up to two characters)
 */
export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Get a color for user avatar background based on name
 * @param {string} name User's name
 * @returns {string} CSS class name for background color
 */
export const getAvatarBg = (name) => {
  if (!name) return 'bg-gray-400';
  
  // Simple hash function to ensure consistent colors
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Color options
  const colors = [
    'bg-indigo-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-teal-500'
  ];
  
  // Get color based on hash
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Get a color for role badge based on role
 * @param {string} role User role
 * @returns {string} CSS class name for badge color
 */
export const getRoleBadgeColor = (role) => {
  switch (role) {
    case 'superadmin':
      return 'bg-purple-100 text-purple-800';
    case 'hod':
      return 'bg-blue-100 text-blue-800';
    case 'tt_incharge':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Create a teacher record in Appwrite for HOD users
 * @param {Object} userData User data to create teacher record
 * @param {string} userId Firebase user ID
 * @returns {Promise<Object>} Created teacher data
 */
const createTeacherForHOD = async (userData, userId) => {
  try {
    // Create teacher document in Appwrite
    const teacherId = ID.unique();
    const teacherData = {
      userId: userId,
      name: userData.name,
      email: userData.email,
      department: userData.department,
      expertise: [], // Default empty expertise array
      qualification: 'HOD', // Default qualification
      experience: 0, // Default experience
      active: userData.active !== false,
      role: 'HOD', // Mark as HOD
      maxHours: 20, // Default max teaching hours for HOD
      status: 'available',
      canBeHOD: true, // Flag to indicate this person can be HOD
      createdAt: new Date().toISOString()
    };
    
    const response = await databases.createDocument(
      DB_ID,
      TEACHERS_COLLECTION,
      teacherId,
      teacherData
    );
    
    console.log('HOD added to teachers collection:', response.$id);
    return response;
  } catch (error) {
    console.error('Error adding HOD to teachers collection:', error);
    throw error;
  }
};