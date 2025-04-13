// SuperAdmin Registration Service - Uses Firebase backend
import { 
  auth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from '../../../firebase/config.js';
import { db, doc, setDoc, generateId } from '../../../firebase/config.js';

// Database collection for SuperAdmin users
const SUPERADMIN_COLLECTION = 'profiles';

// Registration code specifically for creating SuperAdmin accounts
export const registerSuperAdmin = async (userData) => {
  try {
    // Step 1: Create a new account in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    
    const user = userCredential.user;
    console.log('Account created successfully:', user.uid);
    
    // Step 2: Create a document in Firestore with user profile data
    let documentId = null;
    
    try {
      // Create document in Firestore
      documentId = user.uid; // Use Firebase Auth UID as document ID
      
      await setDoc(doc(db, SUPERADMIN_COLLECTION, documentId), {
        userId: user.uid,
        name: userData.name,
        email: userData.email,
        role: 'superadmin',
        department: userData.department,
        createdAt: new Date().toISOString()
      });
      
      console.log('SuperAdmin document created:', documentId);
    } catch (docError) {
      console.warn('Could not create document in Firestore, continuing with auth only:', docError);
      // Continue with just the auth account, without the database document
    }
    
    // Step 3: Create a session for the new user
    let sessionCreated = false;
    try {
      // User is already logged in after createUserWithEmailAndPassword
      // but we can ensure a fresh session by logging in again
      await signInWithEmailAndPassword(auth, userData.email, userData.password);
      sessionCreated = true;
      console.log('Session created successfully');
    } catch (sessionError) {
      console.error('Could not create session:', sessionError);
      // Continue without creating a session, user will need to log in manually
    }
    
    return {
      id: user.uid,
      documentId: documentId,
      name: userData.name,
      email: userData.email,
      role: 'superadmin',
      created: true,
      sessionCreated: sessionCreated // Include information about whether session was created
    };
  } catch (error) {
    console.error('SuperAdmin registration failed:', error);
    
    // Handle specific Firebase errors
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('An account with this email already exists');
      case 'auth/invalid-email':
        throw new Error('Invalid email address');
      case 'auth/weak-password':
        throw new Error('Password is too weak');
      case 'auth/operation-not-allowed':
        throw new Error('Account creation is disabled');
      default:
        throw new Error(`Registration failed: ${error.message}`);
    }
  }
};

// Validate registration secret key
export const validateSecretKey = async (secretKey) => {
  // In a real application, this would validate against a secure backend or Firebase
  // For now, let's use a hardcoded key (not secure for production!)
  const VALID_SECRET_KEY = 'super_admin_setup_2023';
  
  return secretKey === VALID_SECRET_KEY;
};