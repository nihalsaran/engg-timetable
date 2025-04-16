// SuperAdminDashboard.js - Updated to integrate with Appwrite
import { databases, ID, Query } from '../../../appwrite/config';

// Appwrite database and collection IDs
const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'default';
const DEPARTMENTS_COLLECTION = 'departments';
const TEACHERS_COLLECTION = 'teachers';
const ROOMS_COLLECTION = 'rooms';
const SETTINGS_COLLECTION = 'settings';
const USERS_COLLECTION = 'users';

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
 * Fetch dashboard statistics from Appwrite
 * @returns {Promise} Object containing dashboard statistics
 */
export const fetchDashboardStats = async () => {
  try {
    // Fetch counts of records from different collections
    const departmentsPromise = databases.listDocuments(
      DB_ID, 
      DEPARTMENTS_COLLECTION,
      [Query.limit(100)] // Changed from 0 to 100
    );
    
    const teachersPromise = databases.listDocuments(
      DB_ID, 
      TEACHERS_COLLECTION, 
      [Query.limit(100)] // Changed from 0 to 100
    );
    
    const roomsPromise = databases.listDocuments(
      DB_ID, 
      ROOMS_COLLECTION, 
      [Query.limit(100)] // Changed from 0 to 100
    );
    
    // Fetch settings for current academic info
    const settingsPromise = databases.listDocuments(
      DB_ID, 
      SETTINGS_COLLECTION, 
      [Query.orderDesc('createdAt'), Query.limit(1)]
    );
    
    // Wait for all promises to resolve
    const [departments, teachers, rooms, settings] = await Promise.all([
      departmentsPromise,
      teachersPromise,
      roomsPromise,
      settingsPromise
    ]);
    
    // Extract current semester info from settings
    const currentSettings = settings.documents.length > 0 ? settings.documents[0] : null;
    const currentSemester = currentSettings?.currentSemester || 'Not Set';
    const academicYear = currentSettings?.academicYear || 'Not Set';
    
    // Calculate active teachers
    const activeTeachersPromise = databases.listDocuments(
      DB_ID, 
      TEACHERS_COLLECTION, 
      [Query.equal('active', true), Query.limit(100)] // Changed from 0 to 100
    );
    
    const activeTeachers = await activeTeachersPromise;
    
    return {
      totalDepartments: departments.total,
      totalTeachers: teachers.total,
      activeTeachers: activeTeachers.total,
      totalRooms: rooms.total,
      currentSemester,
      academicYear
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    
    // Return mock data as fallback
    return {
      totalDepartments: 5,
      totalTeachers: 48,
      activeTeachers: 42,
      totalRooms: 25,
      currentSemester: 'Spring 2025',
      academicYear: '2024-2025'
    };
  }
};

/**
 * Get recent activity for the dashboard
 * @returns {Array} Recent activity entries
 */
export const getRecentActivity = () => {
  const activities = getRecentActivities();
  // Format data to match component expectations
  return activities.map(activity => ({
    id: activity.id,
    user: activity.user,
    action: activity.details,
    time: formatTimestamp(activity.timestamp)
  }));
};

/**
 * Format timestamp for display
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted time string
 */
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Get recent activities (mock data for now)
 * In a real application, this would fetch from an activity log collection
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
 * Get semester progress data
 * @returns {Array} Semester progress information
 */
export const getSemesterProgress = () => {
  // Mock data for semester progress
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
};

/**
 * Navigate to add new user screen
 * @returns {void}
 */
export const addNewUser = () => {
  // In a real implementation, this would use a router to navigate
  console.log('Navigating to add new user screen');
  // For now, we'll redirect to the user management page
  window.location.href = '/super-admin/user-management/new';
};

/**
 * Generate and download reports
 * @returns {void}
 */
export const generateReport = () => {
  console.log('Generating reports');
  // In a real implementation, this would generate and offer to download reports
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
 * Update settings data in Appwrite
 * @param {Object} settingsData - Settings data to update
 * @returns {Promise} Promise with updated settings
 */
export const updateSettings = async (settingsData) => {
  try {
    // Check if settings document exists
    const existingSettings = await databases.listDocuments(
      DB_ID,
      SETTINGS_COLLECTION,
      [Query.orderDesc('createdAt'), Query.limit(1)]
    );
    
    let response;
    
    if (existingSettings.documents.length > 0) {
      // Update existing settings
      const settingId = existingSettings.documents[0].$id;
      response = await databases.updateDocument(
        DB_ID,
        SETTINGS_COLLECTION,
        settingId,
        {
          ...settingsData,
          updatedAt: new Date().toISOString()
        }
      );
    } else {
      // Create new settings document
      response = await databases.createDocument(
        DB_ID,
        SETTINGS_COLLECTION,
        ID.unique(),
        {
          ...settingsData,
          createdAt: new Date().toISOString()
        }
      );
    }
    
    return {
      success: true,
      settings: {
        id: response.$id,
        ...settingsData
      }
    };
  } catch (error) {
    console.error("Error updating settings:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate department distribution data for chart
 * @returns {Promise} Department distribution data
 */
export const getDepartmentDistribution = async () => {
  try {
    // Get all departments
    const departments = await databases.listDocuments(
      DB_ID,
      DEPARTMENTS_COLLECTION
    );
    
    // Get all teachers to count by department
    const teachers = await databases.listDocuments(
      DB_ID,
      TEACHERS_COLLECTION,
      [Query.limit(100)] // Adjust limit as needed
    );
    
    // Count teachers by department
    const departmentCounts = {};
    departments.documents.forEach(dept => {
      departmentCounts[dept.name] = 0;
    });
    
    teachers.documents.forEach(teacher => {
      if (teacher.department && departmentCounts[teacher.department] !== undefined) {
        departmentCounts[teacher.department]++;
      }
    });
    
    // Format data for chart
    return Object.keys(departmentCounts).map(department => ({
      department,
      teachers: departmentCounts[department]
    }));
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
 * Get room utilization data (currently mock data)
 * In a real application, this would analyze room bookings from a schedule collection
 * @returns {Array} Room utilization data by type
 */
export const getRoomUtilization = async () => {
  // This would be replaced with actual Appwrite implementation
  // when a scheduling system is implemented
  return [
    { type: 'Classroom', utilized: 75, available: 25 },
    { type: 'Lecture Hall', utilized: 60, available: 40 },
    { type: 'Computer Lab', utilized: 85, available: 15 },
    { type: 'Seminar Hall', utilized: 40, available: 60 },
    { type: 'Conference Room', utilized: 30, available: 70 }
  ];
};

// Export all functions as a service object
const SuperAdminDashboardService = {
  getDashboardMetrics,
  fetchDashboardStats,
  getRecentActivity,
  getRecentActivities,
  getSemesterProgress,
  updateSettings,
  getDepartmentDistribution,
  getRoomUtilization,
  addNewUser,
  generateReport,
  manageSemester
};

export default SuperAdminDashboardService;