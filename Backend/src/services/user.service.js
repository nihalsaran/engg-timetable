// Backend/src/services/user.service.js
const { auth, db, admin } = require('../config/firebase.config');
const { databases, ID, Query } = require('../config/appwrite.config');

// Appwrite database and collection IDs
const DB_ID = process.env.APPWRITE_DATABASE_ID || 'default';
const TEACHERS_COLLECTION = 'teachers';

/**
 * Get all users from the Firestore database
 * @returns {Promise<Array>} Array of user objects
 */
exports.getUsers = async () => {
  try {
    const profilesRef = db.collection('profiles');
    const snapshot = await profilesRef.get();
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId || doc.id,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        active: data.active !== false, // default to true if not specified
        createdAt: data.createdAt ? 
          // Handle different timestamp formats
          (typeof data.createdAt.toDate === 'function' ? 
            data.createdAt.toDate().toISOString() : 
            (data.createdAt instanceof Date ? 
              data.createdAt.toISOString() : 
              (typeof data.createdAt === 'string' ? 
                data.createdAt : 
                new Date().toISOString()
              )
            )
          ) : 
          new Date().toISOString()
      };
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};

/**
 * Get a single user by ID
 * @param {string} userId - User's ID
 * @returns {Promise<Object>} User data
 */
exports.getUserById = async (userId) => {
  try {
    const userRef = db.collection('profiles').doc(userId);
    const doc = await userRef.get();
    
    if (!doc.exists) {
      throw new Error('User not found');
    }
    
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId || doc.id,
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      active: data.active !== false,
      createdAt: data.createdAt ? 
        // Handle different timestamp formats
        (typeof data.createdAt.toDate === 'function' ? 
          data.createdAt.toDate().toISOString() : 
          (data.createdAt instanceof Date ? 
            data.createdAt.toISOString() : 
            (typeof data.createdAt === 'string' ? 
              data.createdAt : 
              new Date().toISOString()
            )
          )
        ) : 
        new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data to create
 * @returns {Promise<Object>} Created user data
 */
exports.createUser = async (userData) => {
  try {
    // Generate a random initial password
    const initialPassword = generateSecurePassword();
    
    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email: userData.email,
      password: initialPassword,
      displayName: userData.name
    });
    
    // Create user profile in Firestore
    const userProfileRef = db.collection('profiles').doc(userRecord.uid);
    await userProfileRef.set({
      userId: userRecord.uid,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // If user is an HOD, also create entry in teachers collection in Appwrite
    if (userData.role === 'hod') {
      await createTeacherForHOD(userData, userRecord.uid);
    }
    
    // Send password reset email so user can set their own password
    const resetLink = await auth.generatePasswordResetLink(userData.email, {
      url: process.env.APP_URL + '/login'
    });
    
    return {
      id: userRecord.uid,
      userId: userRecord.uid,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      active: true,
      resetLink: resetLink // You may want to remove this in production
    };
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.code === 'auth/email-already-exists') {
      throw new Error('A user with this email already exists.');
    }
    
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

/**
 * Update a user profile
 * @param {string} userId - The user's ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user data
 */
exports.updateUser = async (userId, userData) => {
  try {
    // Get the user to make sure they exist
    const userRecord = await auth.getUser(userId);
    
    // Update user in Firebase Auth if email has changed
    if (userData.email && userData.email !== userRecord.email) {
      await auth.updateUser(userId, {
        email: userData.email,
        displayName: userData.name
      });
    } else if (userData.name && userData.name !== userRecord.displayName) {
      await auth.updateUser(userId, {
        displayName: userData.name
      });
    }
    
    // Update user profile in Firestore
    const userProfileRef = db.collection('profiles').doc(userId);
    await userProfileRef.update({
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      active: userData.active !== false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // If the user is an HOD, update or create their record in the teachers collection
    if (userData.role === 'hod') {
      try {
        // Check if a teacher record already exists in Appwrite
        const teacherExists = await checkTeacherExists(userId);
        
        if (teacherExists) {
          await updateTeacherForHOD(userData, userId, teacherExists);
        } else {
          await createTeacherForHOD(userData, userId);
        }
      } catch (appwriteError) {
        console.error('Error updating HOD in teachers collection:', appwriteError);
        // Continue with the user update even if the Appwrite operation fails
      }
    }
    
    return {
      id: userId,
      userId: userId,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      active: userData.active !== false
    };
  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error.code === 'auth/user-not-found') {
      throw new Error('User not found.');
    }
    
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

/**
 * Delete a user
 * @param {string} userId - The user's ID
 * @returns {Promise<{success: boolean, id: string}>}
 */
exports.deleteUser = async (userId) => {
  try {
    // Get user data before deleting
    const userProfileRef = db.collection('profiles').doc(userId);
    const userSnapshot = await userProfileRef.get();
    
    if (!userSnapshot.exists) {
      throw new Error('User not found');
    }
    
    const userData = userSnapshot.data();
    
    // Delete user from Firebase Auth
    await auth.deleteUser(userId);
    
    // Delete user profile from Firestore
    await userProfileRef.delete();
    
    // If the user was an HOD, also delete the corresponding teacher record in Appwrite
    if (userData && userData.role === 'hod') {
      try {
        const teacherExists = await checkTeacherExists(userId);
        if (teacherExists) {
          await databases.deleteDocument(
            DB_ID,
            TEACHERS_COLLECTION,
            teacherExists
          );
        }
      } catch (appwriteError) {
        console.error('Error deleting HOD from teachers collection:', appwriteError);
        // Continue with the user deletion even if the Appwrite operation fails
      }
    }
    
    return { success: true, id: userId };
  } catch (error) {
    console.error('Error deleting user:', error);
    
    if (error.code === 'auth/user-not-found') {
      throw new Error('User not found.');
    }
    
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};

/**
 * Update a user's active status
 * @param {string} userId - The user's ID
 * @param {boolean} isActive - New active status
 * @returns {Promise<{success: boolean, id: string, active: boolean}>}
 */
exports.updateUserStatus = async (userId, isActive) => {
  try {
    // Verify the user exists
    await auth.getUser(userId);
    
    // Update user profile in Firestore
    const userProfileRef = db.collection('profiles').doc(userId);
    await userProfileRef.update({
      active: isActive === true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Get user data to check if they are an HOD
    const userSnapshot = await userProfileRef.get();
    const userData = userSnapshot.data();
    
    // If HOD, update status in Appwrite teachers collection
    if (userData && userData.role === 'hod') {
      try {
        const teacherExists = await checkTeacherExists(userId);
        if (teacherExists) {
          await databases.updateDocument(
            DB_ID,
            TEACHERS_COLLECTION,
            teacherExists,
            {
              active: isActive === true,
              status: isActive === true ? 'available' : 'unavailable',
              updatedAt: new Date().toISOString()
            }
          );
        }
      } catch (appwriteError) {
        console.error('Error updating HOD status in teachers collection:', appwriteError);
        // Continue with the user status update even if the Appwrite operation fails
      }
    }
    
    return { 
      success: true, 
      id: userId, 
      active: isActive === true 
    };
  } catch (error) {
    console.error('Error updating user status:', error);
    
    if (error.code === 'auth/user-not-found') {
      throw new Error('User not found.');
    }
    
    throw new Error(`Failed to update user status: ${error.message}`);
  }
};

/**
 * Send a password reset email to a user
 * @param {string} email - User's email
 * @returns {Promise<{success: boolean, message: string}>}
 */
exports.sendPasswordReset = async (email) => {
  try {
    // Verify the user exists
    try {
      await auth.getUserByEmail(email);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        throw new Error('No user found with this email address.');
      }
      throw error;
    }
    
    // Send password reset email
    const resetLink = await auth.generatePasswordResetLink(email, {
      url: process.env.APP_URL + '/login'
    });
    
    return { 
      success: true, 
      message: 'Password reset email sent successfully',
      resetLink: resetLink // You may want to remove this in production
    };
  } catch (error) {
    console.error('Error sending password reset:', error);
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

/**
 * Get available departments
 * @returns {Promise<Array<string>>} Array of department names
 */
exports.getDepartments = async () => {
  // In a production application, you would fetch this from a database
  // For this example, we'll return a static list
  return [
    'Computer Science', 
    'Electrical Engineering', 
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering'
  ];
};

/**
 * Get available user roles
 * @returns {Promise<Array<Object>>} Array of role objects with value and label
 */
exports.getRoles = async () => {
  // In a production application, you might fetch this from a database
  // or define it based on application configuration
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
};

// Helper Functions

/**
 * Generate a secure random password
 * @returns {string} A secure password
 */
function generateSecurePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Check if a teacher already exists in Appwrite for a given user ID
 * @param {string} userId - Firebase user ID
 * @returns {Promise<string|false>} Document ID if exists, false otherwise
 */
async function checkTeacherExists(userId) {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      TEACHERS_COLLECTION,
      [Query.equal('userId', userId)]
    );
    
    if (response.documents && response.documents.length > 0) {
      return response.documents[0].$id;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking if teacher exists:', error);
    throw error;
  }
}

/**
 * Create a teacher record in Appwrite for HOD users
 * @param {Object} userData - User data
 * @param {string} userId - Firebase user ID
 * @returns {Promise<Object>} Created teacher data
 */
async function createTeacherForHOD(userData, userId) {
  try {
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
}

/**
 * Update a teacher record in Appwrite for HOD users
 * @param {Object} userData - User data
 * @param {string} userId - Firebase user ID
 * @param {string} teacherId - Appwrite document ID for the teacher
 * @returns {Promise<Object>} Updated teacher data
 */
async function updateTeacherForHOD(userData, userId, teacherId) {
  try {
    const teacherData = {
      name: userData.name,
      email: userData.email,
      department: userData.department,
      active: userData.active !== false,
      status: userData.active !== false ? 'available' : 'unavailable',
      updatedAt: new Date().toISOString()
    };
    
    const response = await databases.updateDocument(
      DB_ID,
      TEACHERS_COLLECTION,
      teacherId,
      teacherData
    );
    
    console.log('HOD updated in teachers collection:', response.$id);
    return response;
  } catch (error) {
    console.error('Error updating HOD in teachers collection:', error);
    throw error;
  }
}