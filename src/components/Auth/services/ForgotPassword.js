// Password reset service using Firebase
import { auth, sendPasswordResetEmail, confirmPasswordReset } from '../../../firebase/config.js';

/**
 * Handle password reset request using Firebase
 * @param {string} email - User email address for password reset
 * @returns {Promise<{success: boolean, error: string}>}
 */
export const handlePasswordReset = async (email) => {
  try {
    // Send password reset email using Firebase
    await sendPasswordResetEmail(auth, email, {
      url: window.location.origin + '/login' // Redirect URL after password reset
    });
    
    return { 
      success: true, 
      error: '' 
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
          error: 'An error occurred while processing your request.' 
        };
    }
  }
};

/**
 * Complete password reset with new password
 * @param {string} oobCode - The action code from the reset email
 * @param {string} password - The new password
 * @returns {Promise<{success: boolean, error: string}>}
 */
export const completePasswordReset = async (oobCode, password) => {
  try {
    // Confirm password reset using Firebase
    await confirmPasswordReset(auth, oobCode, password);
    
    return {
      success: true,
      error: ''
    };
  } catch (error) {
    console.error('Password reset completion failed:', error);
    
    // Handle Firebase errors
    switch (error.code) {
      case 'auth/expired-action-code':
        return {
          success: false,
          error: 'The password reset link has expired.'
        };
      case 'auth/invalid-action-code':
        return {
          success: false,
          error: 'Invalid or already used password reset link.'
        };
      case 'auth/weak-password':
        return {
          success: false,
          error: 'Password is too weak. Please choose a stronger password.'
        };
      default:
        return {
          success: false,
          error: 'An error occurred while resetting your password. Please try again.'
        };
    }
  }
};

/**
 * Submit password reset form handler
 * This function handles the form submission, loading state, and success state
 * @param {string} email - User email address for password reset
 * @param {Function} setIsLoading - State setter for loading indicator
 * @param {Function} setIsSubmitted - State setter for form submission status
 * @param {Function} setError - State setter for error messages
 */
export const submitPasswordResetForm = async (email, setIsLoading, setIsSubmitted, setError) => {
  setIsLoading(true);
  setError('');
  
  try {
    const result = await handlePasswordReset(email);
    
    if (result.success) {
      setIsSubmitted(true);
    } else {
      setError(result.error || 'Failed to send password reset email. Please try again.');
    }
  } catch (error) {
    setError('An unexpected error occurred. Please try again later.');
    console.error('Password reset submission error:', error);
  } finally {
    setIsLoading(false);
  }
};

export default {
  handlePasswordReset,
  completePasswordReset,
  submitPasswordResetForm
};