// User Management Service using Backend API
import * as userAPI from '../../../api/services/user.api';

/**
 * Fetch all users from the backend
 * @returns {Promise<Array>} Array of user objects
 */
export const getUsers = async () => {
  try {
    return await userAPI.getUsers();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error.message || 'Failed to fetch users';
  }
};

/**
 * Get departments from the backend
 * @returns {Promise<Array>} Array of department names
 */
export const getDepartments = async () => {
  try {
    return await userAPI.getDepartments();
  } catch (error) {
    console.error('Error fetching departments:', error);
    // Fallback to static list if API fails
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
 * Get user roles from the backend
 * @returns {Promise<Array>} Array of role objects with value and label
 */
export const getRoles = async () => {
  try {
    return await userAPI.getRoles();
  } catch (error) {
    console.error('Error fetching roles:', error);
    // Fallback to static list if API fails
    const roles = ['superadmin', 'hod', 'tt_incharge'];
    const roleDisplayNames = {
      'superadmin': 'Admin',
      'hod': 'HOD',
      'tt_incharge': 'TT Incharge'
    };
    
    return roles.map(role => ({
      value: role,
      label: roleDisplayNames[role] || role
    }));
  }
};

/**
 * Create a new user through the backend API
 * @param {Object} userData User data to create
 * @returns {Promise<Object>} Created user data
 */
export const createUser = async (userData) => {
  try {
    const newUser = await userAPI.createUser(userData);
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error.message || 'Failed to create user';
  }
};

/**
 * Update a user through the backend API
 * @param {string} id User ID
 * @param {Object} userData Updated user data
 * @returns {Promise<Object>} Updated user data
 */
export const updateUser = async (id, userData) => {
  try {
    const updatedUser = await userAPI.updateUser(id, userData);
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error.message || 'Failed to update user';
  }
};

/**
 * Delete a user through the backend API
 * @param {string} id User ID
 * @returns {Promise<Object>} Success result
 */
export const deleteUser = async (id) => {
  try {
    return await userAPI.deleteUser(id);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error.message || 'Failed to delete user';
  }
};

/**
 * Toggle a user's active status
 * @param {string} id User ID
 * @param {boolean} isActive New active status
 * @returns {Promise<Object>} Success result
 */
export const toggleUserStatus = async (id, isActive) => {
  try {
    return await userAPI.updateUserStatus(id, isActive);
  } catch (error) {
    console.error('Error toggling user status:', error);
    throw error.message || 'Failed to update user status';
  }
};

/**
 * Send a password reset email
 * @param {string} email User's email
 * @returns {Promise<Object>} Success result
 */
export const sendPasswordReset = async (email) => {
  try {
    return await userAPI.sendPasswordReset(email);
  } catch (error) {
    console.error('Error sending password reset:', error);
    throw error.message || 'Failed to send password reset';
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