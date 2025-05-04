// Import Firebase configuration
import { 
  db, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit 
} from '../firebase/config.js';

// Collection references
const SEMESTERS_COLLECTION = 'semesters';
const SETTINGS_COLLECTION = 'settings';

/**
 * Global service to fetch and manage semester data across the application
 */

/**
 * Determine if current date is in odd or even semester period
 * Odd semesters (1,3,5,7): July to December
 * Even semesters (2,4,6,8): January to May
 * @param {Date} date - Date to check (defaults to current date)
 * @returns {string} 'odd' or 'even'
 */
export const getCurrentSemesterPeriod = (date = new Date()) => {
  const month = date.getMonth(); // 0-based (0 = January, 11 = December)
  
  // July (6) to December (11) is odd semester period
  if (month >= 6 && month <= 11) {
    return 'odd';
  } 
  // January (0) to May (4) is even semester period
  else if (month >= 0 && month <= 4) {
    return 'even';
  }
  // June (5) is transition period, default to upcoming odd semester
  else {
    return 'odd';
  }
};

/**
 * Get the list of semester numbers for the current period
 * @param {string} period - 'odd' or 'even'
 * @returns {Array} Array of semester numbers
 */
export const getSemesterNumbersForPeriod = (period) => {
  if (period === 'odd') {
    return [1, 3, 5, 7];
  } else {
    return [2, 4, 6, 8];
  }
};

/**
 * Get the appropriate semester numbers based on current date
 * @returns {Array} Array of semester numbers
 */
export const getCurrentSemesterNumbers = () => {
  const period = getCurrentSemesterPeriod();
  return getSemesterNumbersForPeriod(period);
};

/**
 * Get the active semester from Firebase
 * @returns {Promise<Object|null>} Active semester or null
 */
export const getActiveSemester = async () => {
  try {
    // First try to get from active status
    const semestersRef = collection(db, SEMESTERS_COLLECTION);
    const activeSemesterQuery = query(semestersRef, where('status', '==', 'active'));
    const activeSemesterSnapshot = await getDocs(activeSemesterQuery);
    
    if (!activeSemesterSnapshot.empty) {
      const doc = activeSemesterSnapshot.docs[0];
      return {
        id: doc.id,
        name: doc.data().name,
        status: 'active'
      };
    }
    
    // If no active semester found, get the most recent one
    const semestersQuery = query(semestersRef, orderBy('createdAt', 'desc'), limit(1));
    const semestersSnapshot = await getDocs(semestersQuery);
    
    if (!semestersSnapshot.empty) {
      const doc = semestersSnapshot.docs[0];
      return {
        id: doc.id,
        name: doc.data().name,
        status: doc.data().status || 'inactive'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching active semester:', error);
    return null;
  }
};

/**
 * Get all semesters from Firebase
 * @returns {Promise<Array>} Array of semester objects
 */
export const getAllSemesters = async () => {
  try {
    const semestersRef = collection(db, SEMESTERS_COLLECTION);
    const semestersQuery = query(semestersRef, orderBy('createdAt', 'desc'));
    const semesterSnapshot = await getDocs(semestersQuery);
    
    if (semesterSnapshot.empty) {
      return [];
    }
    
    return semesterSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      status: doc.data().status || 'inactive'
    }));
  } catch (error) {
    console.error('Error fetching all semesters:', error);
    return [];
  }
};

/**
 * Get default semesters when no semesters are available in the database
 * @returns {Array} Default semesters array
 */
export const getDefaultSemesters = () => {
  const currentPeriod = getCurrentSemesterPeriod();
  const semesterNumbers = getSemesterNumbersForPeriod(currentPeriod);
  
  return semesterNumbers.map(num => `Semester ${num}`);
};

/**
 * Store selected semester in local storage
 * @param {string} semesterName - Name of the semester to store
 */
export const storeSelectedSemester = (semesterName) => {
  try {
    localStorage.setItem('selectedSemester', semesterName);
  } catch (error) {
    console.error('Error storing selected semester:', error);
  }
};

/**
 * Get selected semester from local storage
 * @returns {string|null} Selected semester name or null
 */
export const getSelectedSemesterFromStorage = () => {
  try {
    return localStorage.getItem('selectedSemester');
  } catch (error) {
    console.error('Error getting selected semester from storage:', error);
    return null;
  }
};