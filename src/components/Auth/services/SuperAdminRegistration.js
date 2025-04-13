// SuperAdmin Registration Service - Uses Appwrite backend
import { account, databases, ID } from '../../../appwrite/config';
import { AppwriteException } from 'appwrite';

// Database and collection IDs for SuperAdmin users
const DATABASE_ID = '67f7e3ad000625b7800d';
const SUPERADMIN_COLLECTION_ID = '67fb53550031901f06b4';

// Registration code specifically for creating SuperAdmin accounts
export const registerSuperAdmin = async (userData) => {
  try {
    // Step 1: Create a new account in Appwrite Auth
    const newAccount = await account.create(
      ID.unique(),
      userData.email,
      userData.password,
      userData.name
    );
    
    console.log('Account created successfully:', newAccount.$id);
    
    // Step 2: Try to create a document with minimal required data
    let documentId = null;
    
    try {
      // Create document with minimal data (Appwrite requires at least one attribute)
      const userDocument = await databases.createDocument(
        DATABASE_ID,
        SUPERADMIN_COLLECTION_ID,
        ID.unique(), // Generate unique ID for document
        {
          // Provide at least one attribute to satisfy Appwrite requirements
          role: 'superadmin'
        }
      );
      
      documentId = userDocument.$id;
      console.log('SuperAdmin document created:', documentId);
    } catch (docError) {
      console.warn('Could not create document in collection, continuing with auth only:', docError);
      // Continue with just the auth account, without the database document
    }
    
    // Step 3: Create a session for the new user using the correct method for current SDK version
    try {
      // Try the modern SDK method first
      await account.createSession(
        userData.email,
        userData.password
      );
      console.log('Session created successfully');
    } catch (sessionError) {
      console.warn('Could not create session using modern SDK method:', sessionError);
      try {
        // Fall back to older SDK method if available
        if (typeof account.createEmailSession === 'function') {
          await account.createEmailSession(
            userData.email,
            userData.password
          );
          console.log('Session created using legacy method');
        } else {
          console.warn('No suitable session creation method available');
        }
      } catch (fallbackError) {
        console.warn('Could not create session using fallback method:', fallbackError);
        // Continue without creating a session, user will need to log in manually
      }
    }
    
    return {
      id: newAccount.$id,
      documentId: documentId,
      name: userData.name,
      email: userData.email,
      role: 'superadmin',
      created: true
    };
  } catch (error) {
    console.error('SuperAdmin registration failed:', error);
    
    // Handle specific Appwrite errors
    if (error instanceof AppwriteException) {
      switch (error.code) {
        case 401:
          throw new Error('Authorization failed: Check your Appwrite collection permissions');
        case 409:
          throw new Error('An account with this email already exists');
        case 400:
          throw new Error(`Validation failed: ${error.message}`);
        default:
          throw new Error(`Registration failed: ${error.message}`);
      }
    }
    
    throw new Error('Registration failed. Please try again later.');
  }
};

// Validate registration secret key
export const validateSecretKey = (secretKey) => {
  // In a real application, this would be more secure
  // For example, validating against an environment variable or server-side check
  const validSecretKey = "super-admin-secret-key-2025"; // Replace with actual secure key
  
  return secretKey === validSecretKey;
};