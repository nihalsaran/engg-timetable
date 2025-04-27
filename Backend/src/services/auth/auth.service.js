// Backend/src/services/auth/auth.service.js
const { auth, db, admin } = require('../../config/firebase.config');
const axios = require('axios');

/**
 * Login a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - User data
 */
exports.loginUser = async (email, password) => {
  try {
    // Get Firebase API key from environment variable
    const apiKey = process.env.FIREBASE_API_KEY;
    
    if (!apiKey) {
      throw new Error('Firebase API key is not configured in environment variables');
    }
    
    // Use Firebase Auth REST API to sign in
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        email,
        password,
        returnSecureToken: true
      }
    );
    
    // Extract user data from response
    const { localId: uid, email: userEmail, idToken } = response.data;
    
    // Get the user from Admin SDK to access additional properties
    const userRecord = await auth.getUser(uid);
    
    // Get user profile from Firestore
    const userProfileRef = db.collection('profiles').doc(uid);
    const userProfileSnap = await userProfileRef.get();
    
    let role = 'faculty'; // Default role
    let department = '';
    let name = userRecord.displayName || '';
    
    if (userProfileSnap.exists) {
      const profileData = userProfileSnap.data();
      role = profileData.role || role;
      department = profileData.department || department;
      name = profileData.name || name;
    }
    
    return {
      id: uid,
      email: userEmail,
      name,
      role,
      department,
      isAuthenticated: true,
      firebaseToken: idToken // This can be used for client-side Firebase operations
    };
  } catch (error) {
    console.error('Authentication failed:', error);
    
    // Handle Firebase Auth errors
    if (error.response && error.response.data && error.response.data.error) {
      const errorCode = error.response.data.error.message;
      
      switch (errorCode) {
        case 'EMAIL_NOT_FOUND':
        case 'INVALID_PASSWORD':
        case 'INVALID_LOGIN_CREDENTIALS':
          throw new Error('Invalid credentials. Please check your email and password.');
        case 'USER_DISABLED':
          throw new Error('This account has been disabled.');
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          throw new Error('Too many attempts. Please try again later.');
        default:
          throw new Error('Login failed: ' + errorCode);
      }
    }
    
    throw new Error('Login failed: ' + (error.message || 'Unknown error'));
  }
};

/**
 * Register a SuperAdmin user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Created user data
 */
exports.registerSuperAdmin = async (userData) => {
  try {
    // Create a new account in Firebase Auth
    const userCredential = await auth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.name
    });
    
    const user = userCredential;
    console.log('Account created successfully:', user.uid);
    
    // Create a document in Firestore with user profile data
    const documentId = user.uid;
    
    await db.collection('profiles').doc(documentId).set({
      userId: user.uid,
      name: userData.name,
      email: userData.email,
      role: 'superadmin',
      department: userData.department,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return {
      id: user.uid,
      documentId,
      name: userData.name,
      email: userData.email,
      department: userData.department,
      role: 'superadmin'
    };
  } catch (error) {
    console.error('SuperAdmin registration failed:', error);
    
    // Handle specific Firebase errors
    switch (error.code) {
      case 'auth/email-already-exists':
        throw new Error('An account with this email already exists');
      case 'auth/invalid-email':
        throw new Error('Invalid email address');
      case 'auth/invalid-password':
        throw new Error('Password is too weak');
      case 'auth/operation-not-allowed':
        throw new Error('Account creation is disabled');
      default:
        throw new Error(`Registration failed: ${error.message}`);
    }
  }
};

/**
 * Create a new user (by admin)
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - Created user data
 */
exports.createUser = async (userData) => {
  try {
    // Generate a random initial password
    const initialPassword = generateSecurePassword();
    
    // Create user in Firebase Authentication
    const user = await auth.createUser({
      email: userData.email,
      password: initialPassword,
      displayName: userData.name
    });
    
    // Create user profile in Firestore
    await db.collection('profiles').doc(user.uid).set({
      userId: user.uid,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // If user is an HOD, also create entry in teachers collection in Appwrite
    if (userData.role === 'hod') {
      // Note: You'll need to implement HOD data storage in Appwrite
      // This would typically be done in a separate service
      console.log('HOD user creation: Additional data should be stored in Appwrite');
    }
    
    // Send password reset email so user can set their own password
    const resetLink = await auth.generatePasswordResetLink(userData.email);
    
    return {
      id: user.uid,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      active: true,
      resetLink // You may want to remove this from the response in production
    };
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.code === 'auth/email-already-exists') {
      throw new Error('A user with this email already exists.');
    }
    
    throw new Error('Failed to create user: ' + error.message);
  }
};

/**
 * Handle password reset request
 * @param {string} email - User's email
 * @returns {Promise<Object>} - Result
 */
exports.handlePasswordReset = async (email) => {
  try {
    // Send password reset email using Firebase
    const resetLink = await auth.generatePasswordResetLink(email, {
      url: process.env.APP_URL + '/login' // Redirect URL after password reset
    });
    
    // You would typically send this link to the user via email
    // For this example, we'll just return success
    
    return { 
      success: true, 
      error: '',
      resetLink // You may want to remove this from the response in production
    };
  } catch (error) {
    console.error('Password reset request failed:', error);
    
    // Handle Firebase errors
    switch (error.code) {
      case 'auth/user-not-found':
        return { 
          success: false, 
          error: 'No account found with this email address.' 
        };
      case 'auth/invalid-email':
        return { 
          success: false, 
          error: 'Invalid email address.' 
        };
      case 'auth/too-many-requests':
        return { 
          success: false, 
          error: 'Too many requests. Please try again later.' 
        };
      default:
        return { 
          success: false, 
          error: 'Failed to send password reset email: ' + error.message 
        };
    }
  }
};

/**
 * Complete password reset with code and new password
 * @param {string} oobCode - Password reset code
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} - Result
 */
exports.completePasswordReset = async (oobCode, newPassword) => {
  try {
    // Get Firebase API key from environment variable
    const apiKey = process.env.FIREBASE_API_KEY;
    
    if (!apiKey) {
      throw new Error('Firebase API key is not configured in environment variables');
    }
    
    // Use Firebase Auth REST API to verify and apply the password reset
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${apiKey}`,
      {
        oobCode,
        newPassword
      }
    );
    
    return { 
      success: true, 
      error: '' 
    };
  } catch (error) {
    console.error('Password reset failed:', error);
    
    // Handle Firebase errors from REST API
    if (error.response && error.response.data && error.response.data.error) {
      const errorCode = error.response.data.error.message;
      
      switch (errorCode) {
        case 'EXPIRED_OOB_CODE':
          return { 
            success: false, 
            error: 'The password reset link has expired.' 
          };
        case 'INVALID_OOB_CODE':
          return { 
            success: false, 
            error: 'The password reset link is invalid.' 
          };
        case 'WEAK_PASSWORD':
          return { 
            success: false, 
            error: 'The password is too weak.' 
          };
        default:
          return { 
            success: false, 
            error: 'Failed to reset password: ' + errorCode 
          };
      }
    }
    
    return { 
      success: false, 
      error: 'Failed to reset password: ' + (error.message || 'Unknown error')
    };
  }
};

/**
 * Validate SuperAdmin registration secret key
 * @param {string} secretKey - Secret key to validate
 * @returns {Promise<boolean>} - Whether key is valid
 */
exports.validateSecretKey = async (secretKey) => {
  // Use the environment variable for the secret key
  const VALID_SECRET_KEY = process.env.SUPER_ADMIN_SECRET_KEY;
  
  return secretKey === VALID_SECRET_KEY;
};

/**
 * Helper function to generate a secure password
 * @returns {string} - Secure random password
 */
function generateSecurePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}