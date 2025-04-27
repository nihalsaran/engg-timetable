// SuperAdminDashboard.js - Updated to integrate with Appwrite
import * as dashboardAPI from '../../../api/services/dashboard.api';

/**
 * Get dashboard metrics for SuperAdmin dashboard
 * This is a synchronous wrapper providing default values until real data loads
 * @returns {Object} Dashboard metrics
 */
export const getDashboardMetrics = () => {
  return {
    totalUsers: 0,
    totalDepartments: 0,
    activeSemesters: 0,
    conflictsToday: 0
  };
};

/**
 * Fetch dashboard statistics from backend API
 * @returns {Promise<Object>} Object containing dashboard statistics
 */
export const fetchDashboardStats = async () => {
  try {
    return await dashboardAPI.getDashboardMetrics();
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

/**
 * Get recent activity for the dashboard from backend
 * @returns {Promise<Array>} Recent activity entries
 */
export const getRecentActivity = async () => {
  try {
    const activities = await dashboardAPI.getRecentActivity();
    
    // Check if activities is an array before mapping over it
    if (!Array.isArray(activities)) {
      console.error("API returned non-array data for activities:", activities);
      return getRecentActivities();
    }
    
    // Format data to match component expectations
    return activities.map(activity => ({
      id: activity.id,
      user: activity.user,
      action: activity.action,
      time: formatTimestamp(activity.time)
    }));
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return getRecentActivities();
  }
};

/**
 * Format timestamp for display
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted time string
 */
const formatTimestamp = (timestamp) => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (err) {
    return "Unknown time";
  }
};

/**
 * Get default recent activities (mock data for fallback)
 * @returns {Array} Array of recent activities
 */
export const getRecentActivities = () => {
  return [
    { 
      id: 1,
      action: 'New Teacher Added',
      user: 'Admin',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      details: 'Dr. Richard Johnson was added to the Computer Science department.'
    },
    { 
      id: 2,
      action: 'Room Status Changed',
      user: 'Admin',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      details: 'Room CS301 status changed from Available to Maintenance.'
    },
    { 
      id: 3,
      action: 'Department Updated',
      user: 'Admin',
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      details: 'Electrical Engineering department details were updated.'
    },
    { 
      id: 4,
      action: 'Settings Updated',
      user: 'Admin',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      details: 'Academic calendar settings were updated for next semester.'
    },
    { 
      id: 5,
      action: 'New Room Added',
      user: 'Admin',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      details: 'Added new seminar hall SH201 in Main Block.'
    },
  ];
};

/**
 * Get semester progress data from backend
 * @returns {Promise<Array>} Semester progress information
 */
export const getSemesterProgress = async () => {
  try {
    const progressData = await dashboardAPI.getSemesterProgress();
    
    // Check if response is an array before returning it
    if (!Array.isArray(progressData)) {
      console.error("API returned non-array data for semester progress:", progressData);
      // Return mock data if response is not an array
      return [
        {
          id: 1,
          name: 'Spring 2025',
          progress: 75,
          startDate: 'Jan 10, 2025',
          endDate: 'May 30, 2025'
        },
        {
          id: 2,
          name: 'Summer 2025',
          progress: 10,
          startDate: 'Jun 15, 2025',
          endDate: 'Aug 25, 2025'
        }
      ];
    }
    
    return progressData;
  } catch (error) {
    console.error("Error fetching semester progress:", error);
    // Return mock data if fetch fails
    return [
      {
        id: 1,
        name: 'Spring 2025',
        progress: 75,
        startDate: 'Jan 10, 2025',
        endDate: 'May 30, 2025'
      },
      {
        id: 2,
        name: 'Summer 2025',
        progress: 10,
        startDate: 'Jun 15, 2025',
        endDate: 'Aug 25, 2025'
      }
    ];
  }
};

/**
 * Navigate to add new user screen
 * @returns {void}
 */
export const addNewUser = () => {
  console.log('Navigating to add new user screen');
  window.location.href = '/super-admin/user-management/new';
};

/**
 * Generate and download reports
 * @returns {void}
 */
export const generateReport = () => {
  console.log('Generating reports');
  window.location.href = '/super-admin/reports';
};

/**
 * Navigate to semester management
 * @returns {void}
 */
export const manageSemester = () => {
  console.log('Navigating to semester management');
  window.location.href = '/super-admin/settings';
};

/**
 * Get department distribution data from backend API
 * @returns {Promise<Array>} Department distribution data
 */
export const getDepartmentDistribution = async () => {
  try {
    const departments = await dashboardAPI.getDepartmentDistribution();
    
    // Check if response is an array before returning it
    if (!Array.isArray(departments)) {
      console.error("API returned non-array data for departments:", departments);
      // Return mock data if response is not an array
      return [
        { department: 'Computer Science', teachers: 12 },
        { department: 'Electrical Engineering', teachers: 9 },
        { department: 'Mechanical Engineering', teachers: 7 },
        { department: 'Civil Engineering', teachers: 5 },
        { department: 'Chemical Engineering', teachers: 4 }
      ];
    }
    
    return departments;
  } catch (error) {
    console.error("Error getting department distribution:", error);
    
    // Return mock data as fallback
    return [
      { department: 'Computer Science', teachers: 12 },
      { department: 'Electrical Engineering', teachers: 9 },
      { department: 'Mechanical Engineering', teachers: 7 },
      { department: 'Civil Engineering', teachers: 5 },
      { department: 'Chemical Engineering', teachers: 4 }
    ];
  }
};

/**
 * Get room utilization data from backend API
 * @returns {Promise<Array>} Room utilization data by type
 */
export const getRoomUtilization = async () => {
  try {
    const rooms = await dashboardAPI.getRoomUtilization();
    
    // Check if response is an array before returning it
    if (!Array.isArray(rooms)) {
      console.error("API returned non-array data for room utilization:", rooms);
      // Return mock data if response is not an array
      return [
        { type: 'Classroom', utilized: 75, available: 25 },
        { type: 'Lecture Hall', utilized: 60, available: 40 },
        { type: 'Computer Lab', utilized: 85, available: 15 },
        { type: 'Seminar Hall', utilized: 40, available: 60 },
        { type: 'Conference Room', utilized: 30, available: 70 }
      ];
    }
    
    return rooms;
  } catch (error) {
    console.error("Error getting room utilization:", error);
    
    // Return mock data as fallback
    return [
      { type: 'Classroom', utilized: 75, available: 25 },
      { type: 'Lecture Hall', utilized: 60, available: 40 },
      { type: 'Computer Lab', utilized: 85, available: 15 },
      { type: 'Seminar Hall', utilized: 40, available: 60 },
      { type: 'Conference Room', utilized: 30, available: 70 }
    ];
  }
};

/**
 * Log an activity to the backend
 * @param {string} action - Type of action
 * @param {string} details - Activity details
 * @returns {Promise<Object>} Created activity
 */
export const logActivityToBackend = async (action, details) => {
  try {
    // Only attempt to log to backend in production environments
    if (process.env.NODE_ENV === 'production') {
      return await dashboardAPI.logActivity(action, details);
    } else {
      // Just log locally in development to avoid API errors
      console.log(`[Activity Log] ${action}: ${details}`);
      return { success: true, local: true };
    }
  } catch (error) {
    // Log error but don't throw exception to prevent breaking the UI
    console.error("Error logging activity:", error);
    // Return a successful response to avoid breaking the UI flow
    return { success: false, error: error.message };
  }
};

// Export all functions as a service object
const SuperAdminDashboardService = {
  getDashboardMetrics,
  fetchDashboardStats,
  getRecentActivity,
  getRecentActivities,
  getSemesterProgress,
  getDepartmentDistribution,
  getRoomUtilization,
  addNewUser,
  generateReport,
  manageSemester,
  logActivityToBackend
};

export default SuperAdminDashboardService;