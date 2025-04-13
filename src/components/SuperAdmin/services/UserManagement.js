// User Management Service with Appwrite Integration
import { account, databases, ID, Query } from '../../../appwrite/config';
import { AppwriteException } from 'appwrite';

// Department data - would come from Database in production
const departments = [
  'Computer Science', 
  'Electrical Engineering', 
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering'
];

// User roles
const roles = ['admin', 'hod', 'tt_incharge', 'faculty'];
const roleDisplayNames = {
  'admin': 'Admin',
  'hod': 'HOD',
  'tt_incharge': 'TT Incharge',
  'faculty': 'Faculty'
};

/**
 * Fetch all users from the Appwrite database
 * @returns {Promise<Array>} Array of user objects
 */
export const getUsers = async () => {
  try {
    // Replace with your actual database and collection IDs
    const response = await databases.listDocuments(
      'your_database_id',  // replace with your database ID
      'profiles'           // replace with your collection ID
    );
    
    return response.documents.map(doc => ({
      id: doc.$id,
      userId: doc.userId,
      name: doc.name,
      email: doc.email,
      role: doc.role,
      department: doc.department,
      active: doc.active !== false, // default to true if not specified
      createdAt: doc.createdAt
    }));
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

/**
 * Create a new user in Appwrite and add their profile
 * @param {Object} userData User data to create
 * @returns {Promise<Object>} Created user data
 */
export const createUser = async (userData) => {
  try {
    // Create the user account in Appwrite
    // Generate a random initial password
    const initialPassword = generateSecurePassword();
    
    // Create user in Appwrite Authentication
    const newUser = await account.create(
      ID.unique(),
      userData.email,
      initialPassword,
      userData.name
    );
    
    // Create user profile in database
    const userProfile = await databases.createDocument(
      'your_database_id',  // replace with your database ID
      'profiles',          // replace with your collection ID
      ID.unique(),
      {
        userId: newUser.$id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        active: true,
        createdAt: new Date().toISOString()
      }
    );
    
    // Optionally send a password reset email so the user can set their own password
    try {
      await account.createRecovery(
        userData.email,
        'https://your-app-url.com/reset-password' // Update to your actual reset URL
      );
    } catch (recoveryError) {
      console.warn('Could not send password reset email:', recoveryError);
    }
    
    return {
      id: userProfile.$id,
      userId: newUser.$id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      active: true
    };
  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof AppwriteException) {
      if (error.code === 409) {
        throw new Error('A user with this email already exists.');
      }
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
    // Update user profile in database
    const updatedProfile = await databases.updateDocument(
      'your_database_id',  // replace with your database ID
      'profiles',          // replace with your collection ID
      id,
      {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        active: userData.active
      }
    );
    
    return {
      id: updatedProfile.$id,
      userId: updatedProfile.userId,
      name: updatedProfile.name,
      email: updatedProfile.email,
      role: updatedProfile.role,
      department: updatedProfile.department,
      active: updatedProfile.active
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user: ' + error.message);
  }
};

/**
 * Toggle user active status
 * @param {string} id User profile document ID
 * @param {boolean} active New active status
 * @returns {Promise<Object>}
 */
export const toggleUserStatus = async (id, active) => {
  try {
    const updatedProfile = await databases.updateDocument(
      'your_database_id',  // replace with your database ID
      'profiles',          // replace with your collection ID
      id,
      { active }
    );
    
    return {
      id: updatedProfile.$id,
      active: updatedProfile.active
    };
  } catch (error) {
    console.error('Error toggling user status:', error);
    throw new Error('Failed to update user status: ' + error.message);
  }
};

/**
 * Delete a user (both auth account and profile)
 * @param {string} id User profile document ID
 * @param {string} userId User account ID
 * @returns {Promise<{success: boolean, id: string}>}
 */
export const deleteUser = async (id, userId) => {
  try {
    // Note: Deleting users requires administrative privileges
    // In a client application, this should be done through a secure server function
    
    // 1. Delete user profile first
    await databases.deleteDocument(
      'your_database_id',  // replace with your database ID
      'profiles',          // replace with your collection ID
      id
    );
    
    // 2. Attempt to delete user account (this will likely fail in a client app without admin privileges)
    try {
      // This would typically be handled by a server-side function
      // await account.deleteUser(userId);
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
    await account.createRecovery(
      email,
      'https://your-app-url.com/reset-password' // Update to your actual reset URL
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset:', error);
    
    if (error instanceof AppwriteException && error.code === 404) {
      throw new Error('No user found with this email address.');
    }
    
    throw new Error('Failed to send password reset: ' + error.message);
  }
};

// Utility functions
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

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

export const getRoleBadgeColor = (role) => {
  switch (role) {
    case 'hod': return 'bg-indigo-100 text-indigo-800';
    case 'tt_incharge': return 'bg-purple-100 text-purple-800';
    case 'faculty': return 'bg-green-100 text-green-700';
    case 'admin': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getRoleIcon = (role) => {
  // Note: This function returns a reference to the icon component type,
  // The actual icons need to be imported in the component file
  return role;
};

/**
 * Generate a secure random password
 * @param {number} length Password length
 * @returns {string} A secure random password
 */
const generateSecurePassword = (length = 12) => {
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_-+=<>?';
  
  const allChars = lowerChars + upperChars + numbers + specialChars;
  let password = '';
  
  // Ensure at least one of each type
  password += lowerChars[Math.floor(Math.random() * lowerChars.length)];
  password += upperChars[Math.floor(Math.random() * upperChars.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];
  
  // Fill the rest with random characters
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};