// Added mock auth service for temporary use
const mockAuthService = {
  resetPassword: async (email) => {
    console.log('Mock auth: Password reset requested for', email);
    // Return a mock successful response
    return { success: true };
  }
};

/**
 * Handle password reset request
 * @param {string} email - User email address for password reset
 * @returns {Promise<{success: boolean, error: string}>}
 */
export const handlePasswordReset = async (email) => {
  try {
    // Using mockAuthService instead of authService
    const response = await mockAuthService.resetPassword(email);
    
    if (response.success) {
      return { 
        success: true, 
        error: '' 
      };
    } else {
      return { 
        success: false, 
        error: 'Failed to process your request. Please try again.' 
      };
    }
  } catch (error) {
    console.error('Password reset request failed:', error);
    return { 
      success: false, 
      error: 'An error occurred while processing your request. Please try again later.' 
    };
  }
};

export default {
  handlePasswordReset
};