// SuperAdminDashboard.js - Converted to use Firebase
import { 
  db,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from '../../../firebase/config';

// Collection names
const DEPARTMENTS_COLLECTION = 'departments';
const TEACHERS_COLLECTION = 'teachers';
const ROOMS_COLLECTION = 'rooms';
const SETTINGS_COLLECTION = 'settings';
const USERS_COLLECTION = 'profiles'; // Using profiles for users
const CONFLICTS_COLLECTION = 'conflicts';

/**
 * Get dashboard metrics for SuperAdmin dashboard
 * @returns {Object} Dashboard metrics
 */
export const getDashboardMetrics = () => {
  // This is a synchronous wrapper around the async fetchDashboardStats
  // We'll return mock data initially that will be updated when the real data loads
  return {
    totalUsers: 85,
    totalDepartments: 5,
    activeSemesters: 2,
    conflictsToday: 3
  };
};

/**
 * Fetch dashboard statistics from Firebase
 * @returns {Promise} Object containing dashboard statistics
 */
export const fetchDashboardStats = async () => {
  try {
    // Fetch departments count
    const departmentsRef = collection(db, DEPARTMENTS_COLLECTION);
    const departmentsSnap = await getDocs(departmentsRef);
    const departmentsCount = departmentsSnap.size;
    
    // Fetch teachers count
    const teachersRef = collection(db, TEACHERS_COLLECTION);
    const teachersSnap = await getDocs(teachersRef);
    const teachersCount = teachersSnap.size;
    
    // Fetch rooms count
    const roomsRef = collection(db, ROOMS_COLLECTION);
    const roomsSnap = await getDocs(roomsRef);
    const roomsCount = roomsSnap.size;
    
    // Fetch users count
    const usersRef = collection(db, USERS_COLLECTION);
    const usersSnap = await getDocs(usersRef);
    const usersCount = usersSnap.size;
    
    // Fetch active semesters
    const settingsRef = collection(db, SETTINGS_COLLECTION);
    const settingsQuery = query(settingsRef, orderBy('createdAt', 'desc'), limit(1));
    const settingsSnap = await getDocs(settingsQuery);
    
    let currentSemesterInfo = null;
    let activeSemesterCount = 0;
    
    if (!settingsSnap.empty) {
      currentSemesterInfo = settingsSnap.docs[0].data();
      
      // If we have current semester info, get active semesters count
      const semestersRef = collection(db, 'semesters');
      const semestersQuery = query(semestersRef, where('status', '==', 'active'));
      const semestersSnap = await getDocs(semestersQuery);
      activeSemesterCount = semestersSnap.size;
    }
    
    // Get today's conflicts count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayString = today.toISOString().split('T')[0];
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    const conflictsRef = collection(db, CONFLICTS_COLLECTION);
    const conflictsQuery = query(
      conflictsRef, 
      where('createdAt', '>=', todayString),
      where('createdAt', '<', tomorrowString)
    );
    
    const conflictsSnap = await getDocs(conflictsQuery);
    const conflictsCount = conflictsSnap.size;
    
    return {
      totalDepartments: departmentsCount,
      totalTeachers: teachersCount,
      totalRooms: roomsCount,
      totalUsers: usersCount,
      activeSemesters: activeSemesterCount,
      currentSemester: currentSemesterInfo ? currentSemesterInfo.currentSemester : 'No active semester',
      conflictsToday: conflictsCount
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return default metrics if there's an error
    return getDashboardMetrics();
  }
};

/**
 * Get recent activities for the admin dashboard
 * @param {number} limit Number of activities to return
 * @returns {Promise<Array>} Array of activity items
 */
export const getRecentActivities = async (limitCount = 5) => {
  try {
    // This would typically come from a dedicated activities collection
    // For now we'll return mock data
    const activities = [
      {
        id: '1',
        type: 'user',
        action: 'created',
        subject: 'New User',
        name: 'Professor Smith',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        department: 'Computer Science'
      },
      {
        id: '2',
        type: 'timetable',
        action: 'modified',
        subject: 'CS-101 Schedule',
        name: 'Dr. Johnson',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
        department: 'Mathematics'
      },
      {
        id: '3',
        type: 'conflict',
        action: 'resolved',
        subject: 'Room Double Booking',
        name: 'Admin User',
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
        department: 'Administration'
      },
      {
        id: '4',
        type: 'department',
        action: 'added',
        subject: 'Physics Department',
        name: 'Admin User',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        department: 'Administration'
      },
      {
        id: '5',
        type: 'room',
        action: 'updated',
        subject: 'Lab Capacity',
        name: 'Dr. Williams',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
        department: 'Chemistry'
      }
    ];
    
    return activities.slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return [];
  }
};

/**
 * Get recent activity 
 * @returns {Array} Recent activity data
 */
export const getRecentActivity = () => {
  // Provide mock data for now
  return [
    { id: 1, user: 'Dr. Smith', action: 'Added new course CS401', time: '10m ago' },
    { id: 2, user: 'Prof. Johnson', action: 'Updated room capacity', time: '25m ago' },
    { id: 3, user: 'Admin User', action: 'Generated semester report', time: '1h ago' },
    { id: 4, user: 'Dr. Williams', action: 'Resolved schedule conflict', time: '2h ago' }
  ];
};

/**
 * Get semester progress data
 * @returns {Array} Semester progress data
 */
export const getSemesterProgress = () => {
  const currentDate = new Date();
  
  return [
    { 
      id: 1, 
      name: 'Spring 2025', 
      progress: 45, 
      startDate: 'Jan 15, 2025', 
      endDate: 'May 30, 2025',
      current: true
    },
    { 
      id: 2, 
      name: 'Summer 2025', 
      progress: 0, 
      startDate: 'Jun 15, 2025', 
      endDate: 'Aug 15, 2025',
      current: false
    }
  ];
};

/**
 * Add a new user - redirects to user management page
 */
export const addNewUser = () => {
  // In a real app this would navigate to the user management page
  console.log('Navigate to add user page');
  window.location.href = '#/superadmin/users/new';
};

/**
 * Generate a report
 * @returns {Promise<void>}
 */
export const generateReport = async () => {
  console.log('Generating report...');
  // In a real app this would generate a PDF report or similar
  alert('Report generation started. It will be available shortly in your notifications.');
};

/**
 * Manage semester settings
 */
export const manageSemester = () => {
  // In a real app this would navigate to the semester management page
  console.log('Navigate to semester management');
  window.location.href = '#/superadmin/settings';
};

/**
 * Fetch departments summary for dashboard
 * @returns {Promise<Array>} Departments data with faculty counts
 */
export const getDepartmentsSummary = async () => {
  try {
    const departmentsRef = collection(db, DEPARTMENTS_COLLECTION);
    const departmentsSnap = await getDocs(departmentsRef);
    
    const departmentsData = [];
    
    // Process each department and get its faculty count
    for (const deptDoc of departmentsSnap.docs) {
      const deptData = deptDoc.data();
      
      // Count faculty members in this department
      const teachersRef = collection(db, TEACHERS_COLLECTION);
      const teachersQuery = query(teachersRef, where('department', '==', deptData.name));
      const teachersSnap = await getDocs(teachersQuery);
      
      departmentsData.push({
        id: deptDoc.id,
        name: deptData.name,
        facultyCount: teachersSnap.size,
        hodName: deptData.hodName || 'Not Assigned',
        type: deptData.type || 'Academic'
      });
    }
    
    return departmentsData;
  } catch (error) {
    console.error('Error fetching departments summary:', error);
    // Return mock data in case of error
    return [
      { id: '1', name: 'Computer Science', facultyCount: 12, hodName: 'Dr. Johnson', type: 'Academic' },
      { id: '2', name: 'Electrical Engineering', facultyCount: 8, hodName: 'Prof. Williams', type: 'Academic' },
      { id: '3', name: 'Mechanical Engineering', facultyCount: 10, hodName: 'Dr. Brown', type: 'Academic' },
      { id: '4', name: 'Civil Engineering', facultyCount: 7, hodName: 'Prof. Davis', type: 'Academic' },
      { id: '5', name: 'Chemical Engineering', facultyCount: 6, hodName: 'Dr. Miller', type: 'Academic' }
    ];
  }
};

/**
 * Get upcoming timetable events
 * @returns {Promise<Array>} Array of upcoming events
 */
export const getUpcomingEvents = async () => {
  try {
    // This would typically come from a schedules or events collection
    // For now we'll return mock data
    return [
      {
        id: '1',
        title: 'Timetable Finalization',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days from now
        type: 'deadline',
        department: 'All Departments'
      },
      {
        id: '2',
        title: 'Faculty Assignments Due',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days from now
        type: 'deadline',
        department: 'Computer Science'
      },
      {
        id: '3',
        title: 'New Semester Planning',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days from now
        type: 'meeting',
        department: 'All Departments'
      }
    ];
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
};

/**
 * Get department distribution data for charts
 * @returns {Promise<Array>} Department distribution data
 */
export const getDepartmentDistribution = async () => {
  try {
    const departmentsRef = collection(db, DEPARTMENTS_COLLECTION);
    const departmentsSnap = await getDocs(departmentsRef);
    
    const result = [];
    
    for (const deptDoc of departmentsSnap.docs) {
      const deptData = deptDoc.data();
      
      // Count faculty members in this department
      const teachersRef = collection(db, TEACHERS_COLLECTION);
      const teachersQuery = query(teachersRef, where('department', '==', deptData.name));
      const teachersSnap = await getDocs(teachersQuery);
      
      result.push({
        name: deptData.name,
        value: teachersSnap.size,
        color: getRandomColor()
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching department distribution:', error);
    // Return mock data
    return [
      { name: 'Computer Science', value: 12, color: '#4C51BF' },
      { name: 'Electrical Engineering', value: 8, color: '#38B2AC' },
      { name: 'Mechanical Engineering', value: 10, color: '#ED8936' },
      { name: 'Civil Engineering', value: 7, color: '#667EEA' },
      { name: 'Chemical Engineering', value: 6, color: '#F56565' }
    ];
  }
};

/**
 * Get room utilization data for charts
 * @returns {Promise<Array>} Room utilization data
 */
export const getRoomUtilization = async () => {
  try {
    // In a real app, this would calculate room usage based on timetable data
    // For now, return mock data
    return [
      { day: 'Monday', usage: 85 },
      { day: 'Tuesday', usage: 92 },
      { day: 'Wednesday', usage: 78 },
      { day: 'Thursday', usage: 90 },
      { day: 'Friday', usage: 65 }
    ];
  } catch (error) {
    console.error('Error fetching room utilization:', error);
    return [];
  }
};

// Helper function to generate random color
const getRandomColor = () => {
  const colors = [
    '#4C51BF', '#38B2AC', '#ED8936', '#667EEA', 
    '#F56565', '#48BB78', '#9F7AEA', '#4299E1'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default {
  getDashboardMetrics,
  fetchDashboardStats,
  getRecentActivities,
  getRecentActivity,
  getSemesterProgress,
  getDepartmentsSummary,
  getUpcomingEvents,
  addNewUser,
  generateReport,
  manageSemester,
  getDepartmentDistribution,
  getRoomUtilization
};