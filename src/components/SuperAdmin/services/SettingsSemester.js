// Dummy data for semesters
const dummySemesters = [
  { id: 1, name: 'Semester 1', status: 'Completed', startDate: '2024-01-15', endDate: '2024-05-15' },
  { id: 2, name: 'Semester 2', status: 'Completed', startDate: '2024-08-20', endDate: '2024-12-20' },
  { id: 3, name: 'Semester 3', status: 'Current', startDate: '2025-01-15', endDate: '2025-05-15' },
];

/**
 * Get all semesters
 * @returns {Array} Array of semester objects
 */
export const getAllSemesters = () => {
  // In a real app, this would be an API call
  return dummySemesters;
};

/**
 * Get current semester
 * @returns {Object} Current semester object
 */
export const getCurrentSemester = () => {
  // In a real app, this would be an API call
  return dummySemesters.find(sem => sem.status === 'Current');
};

/**
 * Get past semesters (not current)
 * @returns {Array} Array of past semester objects
 */
export const getPastSemesters = () => {
  // In a real app, this would be an API call
  return dummySemesters.filter(sem => sem.status !== 'Current');
};

/**
 * Get semester details by ID
 * @param {number} id - Semester ID
 * @returns {Object} Semester object
 */
export const getSemesterById = (id) => {
  // In a real app, this would be an API call
  return dummySemesters.find(sem => sem.id === id);
};

/**
 * Create a new semester
 * @param {Object} semesterData - New semester data
 * @returns {Promise} Promise that resolves when semester is created
 */
export const createNewSemester = async (semesterData) => {
  // In a real app, this would be an API call
  console.log('Creating new semester:', semesterData);
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: { ...semesterData, id: Date.now() } });
    }, 500);
  });
};

/**
 * Clone a semester from previous one
 * @param {boolean} cloneTimetable - Whether to clone timetable data
 * @returns {Promise} Promise that resolves when semester is cloned
 */
export const cloneSemester = async (cloneTimetable) => {
  // In a real app, this would be an API call
  console.log('Cloning semester with timetable:', cloneTimetable);
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        message: `Semester cloned successfully${cloneTimetable ? ' with timetable data' : ''}`
      });
    }, 500);
  });
};

/**
 * Get semester statistics
 * @param {number} semesterId - Semester ID
 * @returns {Object} Statistics object
 */
export const getSemesterStatistics = (semesterId) => {
  // In a real app, this would be an API call
  return {
    totalCourses: 32,
    facultyAssigned: 28,
    roomsUtilized: 18,
    conflictsResolved: '12/15'
  };
};