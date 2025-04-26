// ForgotPassword service for password recovery
import * as authAPI from '../../../api/services/auth.api';

/**
 * Request a password reset email for a user
 * @param {string} email - User's email address 
 * @returns {Promise<Object>} - Result of the password reset request
 */
export const requestPasswordReset = async (email) => {
  try {
    const result = await authAPI.forgotPassword({ email });
    
    return {
      success: true,
      message: 'Password reset email sent. Please check your inbox.'
    };
  } catch (error) {
    console.error('Password reset request failed:', error);
    throw error;
  }
};

/**
 * Complete the password reset process with the reset code and new password
 * @param {string} oobCode - The password reset code from the URL  
 * @param {string} password - The new password to set
 * @returns {Promise<Object>} - Result of the password reset
 */
export const completePasswordReset = async (oobCode, password) => {
  try {
    const result = await authAPI.resetPassword({ oobCode, password });
    
    return {
      success: true,
      message: 'Your password has been reset. You can now log in with your new password.'
    };
  } catch (error) {
    console.error('Password reset failed:', error);
    throw error;
  }
};

/**
 * Legacy function for submitting password reset form - maintained for backward compatibility
 * @param {string} email - User's email address
 * @param {Function} setIsLoading - State setter for loading indicator
 * @param {Function} setIsSubmitted - State setter for submission status
 * @param {Function} setErrorMessage - State setter for error message
 * @returns {Promise<void>}
 */
export const submitPasswordResetForm = async (email, setIsLoading, setIsSubmitted, setErrorMessage) => {
  try {
    setIsLoading(true);
    setErrorMessage('');
    
    await requestPasswordReset(email);
    
    setIsSubmitted(true);
  } catch (error) {
    console.error('Password reset failed:', error);
    setErrorMessage(error.message || 'Failed to send password reset email. Please try again.');
  } finally {
    setIsLoading(false);
  }
};