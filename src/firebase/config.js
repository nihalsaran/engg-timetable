// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    confirmPasswordReset,
    onAuthStateChanged
} from 'firebase/auth';
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    Timestamp
} from 'firebase/firestore';

// Firebase configuration
// Replace with your actual Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyA0WHGL1wW8LeTovKp2-3ePuaewhrxuegs",
    authDomain: "engg-timetable.firebaseapp.com",
    projectId: "engg-timetable",
    storageBucket: "engg-timetable.firebasestorage.app",
    messagingSenderId: "1031775120184",
    appId: "1:1031775120184:web:bc79423c93a9c7799fafcd",
    measurementId: "G-8XZ2NLCZ9R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export the Firebase services
export {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    confirmPasswordReset,
    onAuthStateChanged,
    db,
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    Timestamp
};

// Helper function to generate unique IDs (similar to Appwrite's ID.unique())
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};