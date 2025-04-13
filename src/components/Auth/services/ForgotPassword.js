// Password reset service using Appwrite
import { account } from '../../../appwrite/config';
import { AppwriteException } from 'appwrite';

/**
 * Handle password reset request using Appwrite
 * @param {string} email - User email address for password reset
 * @returns {Promise<{success: boolean, error: string}>}
 */
export const handlePasswordReset = async (email) => {
  try {
    // Create password recovery using Appwrite
    // The URL should be your frontend URL where user will be redirected to reset password
    await account.createRecovery(
      email,
      'https://your-app-url.com/reset-password' // Update this URL to your actual reset password page
    );
    
    return { 
      success: true, 
      error: '' 
    };
  } catch (error) {
    console.error('Password reset request failed:', error);
    
    if (error instanceof AppwriteException) {
      // Handle specific Appwrite errors
      switch (error.code) {
        case 404:
          return { 
            success: false, 
            error: 'No account found with this email address.' 
          };
        default:
          return { 
            success: false, 
            error: 'An error occurred: ' + error.message
          };
      }
    }
    
    return { 
      success: false, 
      error: 'An error occurred while processing your request. Please try again later.' 
    };
  }
};

/**
 * Complete the password reset process using token and password
 * @param {string} userId - User ID received from the URL
 * @param {string} secret - Secret code received from the URL
 * @param {string} password - New password
 * @param {string} passwordAgain - Confirmation of the new password
 * @returns {Promise<{success: boolean, error: string}>}
 */
export const completePasswordReset = async (userId, secret, password, passwordAgain) => {
  try {
    if (password !== passwordAgain) {
      return {
        success: false,
        error: 'Passwords do not match.'
      };
    }

    await account.updateRecovery(userId, secret, password, passwordAgain);
    
    return {
      success: true,
      error: ''
    };
  } catch (error) {
    console.error('Password reset completion failed:', error);
    
    if (error instanceof AppwriteException) {
      // Handle specific Appwrite errors
      switch (error.code) {
        case 401:
          return {
            success: false,
            error: 'Invalid or expired reset link.'
          };
        default:
          return {
            success: false,
            error: 'An error occurred: ' + error.message
          };
      }
    }
    
    return {
      success: false,
      error: 'An error occurred while resetting your password. Please try again.'
    };
  }
};

/**
 * Submit password reset form handler
 * This function handles the form submission, loading state, and success state
 * @param {string} email - User email address for password reset
 * @param {Function} setIsLoading - State setter for loading indicator
 * @param {Function} setIsSubmitted - State setter for form submission status
 * @param {Function} setError - State setter for error message (optional)
 * @returns {Promise<void>}
 */
export const submitPasswordResetForm = async (email, setIsLoading, setIsSubmitted, setError = null) => {
  setIsLoading(true);
  try {
    const result = await handlePasswordReset(email);
    
    if (result.success) {
      setIsSubmitted(true);
    } else if (setError) {
      setError(result.error);
    } else {
      console.error('Password reset error:', result.error);
    }
  } catch (error) {
    console.error('Password reset request failed:', error);
    if (setError) {
      setError('An unexpected error occurred. Please try again.');
    }
  } finally {
    setIsLoading(false);
  }
};

export default {
  handlePasswordReset,
  completePasswordReset,
  submitPasswordResetForm
};