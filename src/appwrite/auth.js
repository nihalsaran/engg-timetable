import { Account, ID } from 'appwrite';
import client from './config';

// Initialize the Account service
const account = new Account(client);

class AuthService {
    // Create a new user account
    async createAccount(email, password, name) {
        try {
            const newUser = await account.create(
                ID.unique(),
                email,
                password,
                name
            );
            
            if (newUser) {
                // Auto login after successful registration
                return this.login(email, password);
            } else {
                return { success: false, message: 'Account creation failed' };
            }
        } catch (error) {
            console.error('Account creation error:', error);
            throw error;
        }
    }

    // Login user
    async login(email, password) {
        try {
            const session = await account.createEmailSession(email, password);
            return { success: true, session };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Get the current logged in user details
    async getCurrentUser() {
        try {
            const user = await account.get();
            return { success: true, user };
        } catch (error) {
            console.error('Get current user error:', error);
            return { success: false, user: null };
        }
    }

    // Logout user
    async logout() {
        try {
            await account.deleteSession('current');
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }
    
    // Check if user is logged in
    async isAuthenticated() {
        try {
            const user = await this.getCurrentUser();
            return user.success;
        } catch (error) {
            return false;
        }
    }
    
    // Password reset
    async resetPassword(email) {
        try {
            await account.createRecovery(email, 'https://yourdomain.com/reset-password');
            return { success: true };
        } catch (error) {
            console.error('Password reset error:', error);
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;