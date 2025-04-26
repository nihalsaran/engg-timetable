// SuperAdmin Registration Service - Uses backend API
import * as authAPI from '../../../api/services/auth.api';

// Registration code specifically for creating SuperAdmin accounts
export const registerSuperAdmin = async (userData) => {
  try {
    // Register SuperAdmin through the API
    const response = await authAPI.registerSuperAdmin(userData);
    
    // Return the user data from the response
    return {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      role: 'superadmin',
      created: true,
      sessionCreated: !!response.token // Session created if we have a token
    };
  } catch (error) {
    console.error('SuperAdmin registration failed:', error);
    throw error;
  }
};

// Validate registration secret key
export const validateSecretKey = (secretKey) => {
  // The secret key will be validated by the backend during registration
  // So we just return true here, and let the API handle the actual validation
  return true;
};