// Backend/src/services/hod/dashboard.service.js
const { db, admin } = require('../../config/firebase.config');
const { Client, Databases, Query, ID } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

// Appwrite database and collection IDs
const DB_ID = process.env.APPWRITE_DATABASE_ID || 'EnggTimetable';
const TEACHERS_COLLECTION = 'teachers';
const COURSES_COLLECTION = 'courses';
const TIMETABLE_COLLECTION = 'timetables';
const ACTIVITY_LOG_COLLECTION = 'activity_logs';

/**
 * Get dashboard metrics for HOD dashboard
 * @param {string} departmentId - The department ID of the HOD
 * @returns {Promise<Object>} Dashboard metrics
 */
exports.getDashboardMetrics = async (departmentId) => {
  try {
    if (!departmentId) {
      throw new Error('Department ID is required');
    }

    // Fetch faculty count for the department
    const facultyPromise = databases.listDocuments(
      DB_ID,
      TEACHERS_COLLECTION,
      [
        Query.equal('department', departmentId),
        Query.limit(500)
      ]
    );

    // Fetch courses for the department
    const coursesPromise = databases.listDocuments(
      DB_ID,
      COURSES_COLLECTION,
      [
        Query.equal('departmentId', departmentId),
        Query.limit(500)
      ]
    ).catch(() => ({ total: 0, documents: [] })); // Handle if collection doesn't exist yet

    // Fetch timetable status
    const timetablePromise = databases.listDocuments(
      DB_ID,
      TIMETABLE_COLLECTION,
      [
        Query.equal('departmentId', departmentId),
        Query.equal('status', 'active'),
        Query.limit(1)
      ]
    ).catch(() => ({ documents: [] })); // Handle if collection doesn't exist yet

    // Wait for all promises to resolve
    const [faculty, courses, timetable] = await Promise.all([
      facultyPromise,
      coursesPromise,
      timetablePromise
    ]);

    // Calculate new faculty members this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoStr = oneWeekAgo.toISOString();

    let newThisWeek = 0;
    faculty.documents.forEach(doc => {
      if (doc.createdAt && doc.createdAt > oneWeekAgoStr) {
        newThisWeek++;
      }
    });

    // Count pending approval courses
    let pendingApproval = 0;
    courses.documents.forEach(course => {
      if (course.status === 'pending') {
        pendingApproval++;
      }
    });

    // Calculate timetable completion percentage
    let timetableStatus = 'Not Started';
    let completionPercentage = 0;

    if (timetable.documents.length > 0) {
      const activeTimetable = timetable.documents[0];
      timetableStatus = activeTimetable.status === 'draft' ? 'In Progress' : 'Completed';
      completionPercentage = activeTimetable.completionPercentage || 
                           (activeTimetable.status === 'completed' ? 100 : 70);
    }

    return {
      faculty: {
        total: faculty.total,
        newThisWeek
      },
      courses: {
        total: courses.total,
        pendingApproval
      },
      timetable: {
        status: timetableStatus,
        completionPercentage
      }
    };
  } catch (error) {
    console.error("Error fetching HOD dashboard metrics:", error);
    
    // Return default metrics if error occurs
    return {
      faculty: {
        total: 0,
        newThisWeek: 0
      },
      courses: {
        total: 0,
        pendingApproval: 0
      },
      timetable: {
        status: 'Not Started',
        completionPercentage: 0
      }
    };
  }
};

/**
 * Get recent activity for the HOD dashboard
 * @param {string} departmentId - The department ID of the HOD
 * @param {number} limit - Number of activities to return
 * @returns {Promise<Array>} Recent activity entries
 */
exports.getRecentActivity = async (departmentId, limit = 5) => {
  try {
    if (!departmentId) {
      throw new Error('Department ID is required');
    }

    // Get activities from Appwrite activity log collection
    const activities = await databases.listDocuments(
      DB_ID,
      ACTIVITY_LOG_COLLECTION,
      [
        Query.equal('departmentId', departmentId),
        Query.orderDesc('timestamp'),
        Query.limit(limit)
      ]
    ).catch(() => ({ documents: [] })); // Handle if collection doesn't exist

    if (activities.documents.length > 0) {
      return activities.documents.map(activity => ({
        id: activity.$id,
        type: activity.type || 'general',
        description: activity.details,
        timeAgo: formatTimeAgo(new Date(activity.timestamp)),
        colorClass: getColorForActivityType(activity.type || 'general')
      }));
    }

    // If no activities found or collection doesn't exist, return mock data
    return getDefaultActivities();
  } catch (error) {
    console.error("Error fetching HOD recent activities:", error);
    // Return default activities if error occurs
    return getDefaultActivities();
  }
};

/**
 * Log an activity in the HOD department
 * @param {string} departmentId - The department ID
 * @param {string} userId - User ID performing the action
 * @param {string} user - Username 
 * @param {string} type - Activity type (faculty, course, timetable, etc.)
 * @param {string} details - Activity details
 * @returns {Promise<Object>} Created activity log entry
 */
exports.logActivity = async (departmentId, userId, user, type, details) => {
  try {
    // Create activity log entry
    const activity = await databases.createDocument(
      DB_ID,
      ACTIVITY_LOG_COLLECTION,
      ID.unique(),
      {
        departmentId,
        userId: userId || 'system',
        user: user || 'System',
        type: type || 'general',
        details: details,
        timestamp: new Date().toISOString()
      }
    ).catch(error => {
      console.error("Error creating activity log:", error);
      return null;
    });

    return activity;
  } catch (error) {
    console.error("Error logging HOD activity:", error);
    // Don't throw error, just log it - we don't want failed logging to break app flow
    return null;
  }
};

/**
 * Get default activities as fallback
 * @returns {Array} Array of default activities
 */
const getDefaultActivities = () => {
  return [
    {
      id: '1',
      type: 'faculty',
      description: 'Dr. Alex Johnson assigned to CS301',
      timeAgo: '2 hours ago',
      colorClass: 'bg-teal-500'
    },
    {
      id: '2',
      type: 'course',
      description: 'New course CS405 added',
      timeAgo: 'Yesterday',
      colorClass: 'bg-blue-500'
    },
    {
      id: '3',
      type: 'timetable',
      description: 'Timetable draft updated',
      timeAgo: '2 days ago',
      colorClass: 'bg-indigo-500'
    }
  ];
};

/**
 * Format timestamp to relative time (e.g., "2 hours ago")
 * @param {Date} date - Date to format
 * @returns {string} Formatted relative time string
 */
const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
};

/**
 * Get color class for different activity types
 * @param {string} type - Activity type
 * @returns {string} CSS color class
 */
const getColorForActivityType = (type) => {
  const colorMap = {
    faculty: 'bg-teal-500',
    course: 'bg-blue-500',
    timetable: 'bg-indigo-500',
    report: 'bg-purple-500',
    general: 'bg-gray-500'
  };
  
  return colorMap[type] || 'bg-gray-500';
};

/**
 * Get sidebar navigation items for HOD dashboard
 * @returns {Promise<Array>} Array of sidebar items
 */
exports.getSidebarItems = async () => {
  return [
    { label: 'Dashboard', icon: 'FiGrid', iconSize: 18, path: '/hod-dashboard' },
    { label: 'Courses', icon: 'FiBook', iconSize: 18, path: '/courses' },
    { label: 'Faculty', icon: 'FiUsers', iconSize: 18, path: '/faculty' },
    { label: 'Reports', icon: 'FiFileText', iconSize: 18, path: '/reports' },
    { label: 'Timetable', icon: 'FiCalendar', iconSize: 18, path: '/timetable' },
  ];
};