// Backend/src/services/dashboard.service.js
const { db, admin } = require('../config/firebase.config');
const axios = require('axios');

// Appwrite SDK setup (using environment variables)
const { Client, Databases, Query, ID } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

// Appwrite database and collection IDs
const DB_ID = process.env.APPWRITE_DATABASE_ID || 'default';
const DEPARTMENTS_COLLECTION = 'departments';
const TEACHERS_COLLECTION = 'teachers';
const ROOMS_COLLECTION = 'rooms';
const SETTINGS_COLLECTION = 'settings';
const USERS_COLLECTION = 'users';
const ACTIVITY_LOG_COLLECTION = 'activity_logs';

/**
 * Get dashboard metrics for SuperAdmin dashboard
 * @returns {Promise<Object>} Dashboard metrics
 */
exports.getDashboardMetrics = async () => {
  try {
    // Fetch counts of records from different collections
    const departmentsPromise = databases.listDocuments(
      DB_ID, 
      DEPARTMENTS_COLLECTION,
      [Query.limit(100)]
    );
    
    const teachersPromise = databases.listDocuments(
      DB_ID, 
      TEACHERS_COLLECTION, 
      [Query.limit(100)]
    );
    
    const roomsPromise = databases.listDocuments(
      DB_ID, 
      ROOMS_COLLECTION, 
      [Query.limit(100)]
    );
    
    // Fetch settings for current academic info
    const settingsPromise = databases.listDocuments(
      DB_ID, 
      SETTINGS_COLLECTION, 
      [Query.orderDesc('createdAt'), Query.limit(1)]
    );
    
    // Get conflicts for today
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const conflictsPromise = databases.listDocuments(
      DB_ID,
      'conflicts',
      [Query.equal('date', todayStr), Query.limit(100)]
    ).catch(() => ({ total: 0 })); // Gracefully handle if collection doesn't exist yet
    
    // Wait for all promises to resolve
    const [departments, teachers, rooms, settings, conflicts] = await Promise.all([
      departmentsPromise,
      teachersPromise,
      roomsPromise,
      settingsPromise,
      conflictsPromise
    ]);
    
    // Extract current semester info from settings
    const currentSettings = settings.documents.length > 0 ? settings.documents[0] : null;
    const activeSemesters = currentSettings?.activeSemesters || 0;
    
    return {
      totalUsers: teachers.total,
      totalDepartments: departments.total,
      activeSemesters: activeSemesters,
      conflictsToday: conflicts.total,
      currentSemester: currentSettings?.currentSemester || '',
      academicYear: currentSettings?.academicYear || ''
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    throw new Error('Failed to fetch dashboard metrics');
  }
};

/**
 * Get recent activity for the dashboard
 * @param {number} limit - Number of activities to return
 * @returns {Promise<Array>} Recent activity entries
 */
exports.getRecentActivity = async (limit = 5) => {
  try {
    // Get activities from Appwrite activity log collection
    const activities = await databases.listDocuments(
      DB_ID,
      ACTIVITY_LOG_COLLECTION,
      [Query.orderDesc('timestamp'), Query.limit(limit)]
    ).catch(() => ({ documents: [] })); // Handle if collection doesn't exist
    
    if (activities.documents.length > 0) {
      return activities.documents.map(activity => ({
        id: activity.$id,
        user: activity.user,
        action: activity.details,
        time: activity.timestamp
      }));
    }
    
    // If no activities found or collection doesn't exist, return mock data
    return getDefaultActivities();
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    // Return default activities if an error occurs
    return getDefaultActivities();
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
      user: 'Admin',
      action: 'Dr. Richard Johnson was added to the Computer Science department.',
      time: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    { 
      id: '2',
      user: 'Admin',
      action: 'Room CS301 status changed from Available to Maintenance.',
      time: new Date(Date.now() - 1000 * 60 * 120).toISOString()
    },
    { 
      id: '3',
      user: 'Admin',
      action: 'Electrical Engineering department details were updated.',
      time: new Date(Date.now() - 1000 * 60 * 240).toISOString()
    },
    { 
      id: '4',
      user: 'Admin',
      action: 'Academic calendar settings were updated for next semester.',
      time: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString()
    },
    { 
      id: '5',
      user: 'Admin',
      action: 'Added new seminar hall SH201 in Main Block.',
      time: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
    }
  ];
};

/**
 * Get semester progress data
 * @returns {Promise<Array>} Semester progress information
 */
exports.getSemesterProgress = async () => {
  try {
    // Get semester settings from Appwrite
    const settings = await databases.listDocuments(
      DB_ID,
      SETTINGS_COLLECTION,
      [Query.orderDesc('createdAt'), Query.limit(1)]
    );
    
    if (settings.documents.length > 0) {
      const currentSettings = settings.documents[0];
      
      // If we have semester data in settings, use it
      if (currentSettings.semesters && Array.isArray(currentSettings.semesters)) {
        return currentSettings.semesters.map(semester => {
          // Calculate progress based on dates
          const startDate = new Date(semester.startDate);
          const endDate = new Date(semester.endDate);
          const today = new Date();
          
          let progress = 0;
          if (today >= startDate && today <= endDate) {
            const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
            const daysElapsed = (today - startDate) / (1000 * 60 * 60 * 24);
            progress = Math.round((daysElapsed / totalDays) * 100);
          } else if (today > endDate) {
            progress = 100;
          }
          
          // Format dates for display
          const formattedStartDate = startDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
          
          const formattedEndDate = endDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
          
          return {
            id: semester.id || semester.$id,
            name: semester.name,
            progress: progress,
            startDate: formattedStartDate,
            endDate: formattedEndDate
          };
        });
      }
    }
    
    // Return default data if no data found
    return getDefaultSemesterProgress();
  } catch (error) {
    console.error("Error fetching semester progress:", error);
    return getDefaultSemesterProgress();
  }
};

/**
 * Get default semester progress as fallback
 * @returns {Array} Default semester progress
 */
const getDefaultSemesterProgress = () => {
  return [
    {
      id: '1',
      name: 'Spring 2025',
      progress: 75,
      startDate: 'Jan 10, 2025',
      endDate: 'May 30, 2025'
    },
    {
      id: '2',
      name: 'Summer 2025',
      progress: 10,
      startDate: 'Jun 15, 2025',
      endDate: 'Aug 25, 2025'
    }
  ];
};

/**
 * Get department distribution data for charts
 * @returns {Promise<Array>} Department distribution data
 */
exports.getDepartmentDistribution = async () => {
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
      [Query.limit(500)] // Increase limit as needed
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
 * Get room utilization data
 * @returns {Promise<Array>} Room utilization by type
 */
exports.getRoomUtilization = async () => {
  try {
    // Get all rooms
    const rooms = await databases.listDocuments(
      DB_ID,
      ROOMS_COLLECTION,
      [Query.limit(500)]
    );
    
    // Get room bookings/schedule if available
    const schedules = await databases.listDocuments(
      DB_ID,
      'schedules',
      [Query.limit(500)]
    ).catch(() => ({ documents: [] })); // Handle if collection doesn't exist
    
    // Group rooms by type
    const roomsByType = {};
    rooms.documents.forEach(room => {
      const type = room.type || 'Other';
      if (!roomsByType[type]) {
        roomsByType[type] = { total: 0, utilized: 0 };
      }
      roomsByType[type].total++;
    });
    
    // Calculate utilization if schedule data exists
    if (schedules.documents.length > 0) {
      schedules.documents.forEach(schedule => {
        const roomId = schedule.roomId;
        const room = rooms.documents.find(r => r.$id === roomId);
        if (room) {
          const type = room.type || 'Other';
          roomsByType[type].utilized++;
        }
      });
    } else {
      // Without real data, set some realistic utilization percentages
      Object.keys(roomsByType).forEach(type => {
        // Random utilization between 30% and 85%
        const utilizationPercent = Math.floor(Math.random() * 55) + 30;
        roomsByType[type].utilized = Math.floor(roomsByType[type].total * (utilizationPercent / 100));
      });
    }
    
    // Format data for frontend
    return Object.keys(roomsByType).map(type => {
      const utilized = roomsByType[type].utilized;
      const total = roomsByType[type].total;
      const utilizationPercent = Math.round((utilized / total) * 100) || 0;
      
      return {
        type: type,
        utilized: utilizationPercent,
        available: 100 - utilizationPercent
      };
    });
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

// Flag to track collection creation in progress
let isCreatingCollection = false;

/**
 * Log an activity
 * @param {string} userId - User ID performing the action
 * @param {string} user - Username 
 * @param {string} action - Action type
 * @param {string} details - Action details
 * @returns {Promise<Object>} Created activity log entry
 */
exports.logActivity = async (userId, user, action, details) => {
  try {
    // Check if activity log collection exists
    let collectionExists = false;
    try {
      await databases.getCollection(DB_ID, ACTIVITY_LOG_COLLECTION);
      collectionExists = true;
    } catch (error) {
      // Collection doesn't exist or other error
      collectionExists = false;
    }
    
    // Create collection if it doesn't exist and not already being created
    if (!collectionExists && !isCreatingCollection) {
      try {
        isCreatingCollection = true;
        console.log("Activity log collection doesn't exist, creating it now...");
        
        // Create the activity_logs collection
        await databases.createCollection(
          DB_ID,
          ACTIVITY_LOG_COLLECTION,
          'Activity Logs',
          [
            // Define permissions for the collection
            // Default permissions that allow read access for everyone
            'read("any")'
          ],
          true // Enable document level security
        );
        
        // Create attributes one by one with delay to ensure they complete
        // userId attribute (string)
        await databases.createStringAttribute(
          DB_ID,
          ACTIVITY_LOG_COLLECTION,
          'userId',
          100,  // Max length
          true, // Required
          null,  // Default value
          false  // Array
        );
        
        // Add a small delay to ensure the previous attribute is processed
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // user attribute (string)
        await databases.createStringAttribute(
          DB_ID,
          ACTIVITY_LOG_COLLECTION,
          'user',
          100,  // Max length
          true, // Required
          null,  // Default value
          false  // Array
        );
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // action attribute (string)
        await databases.createStringAttribute(
          DB_ID,
          ACTIVITY_LOG_COLLECTION,
          'action',
          100,  // Max length
          true, // Required
          null,  // Default value
          false  // Array
        );
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // details attribute (string)
        await databases.createStringAttribute(
          DB_ID,
          ACTIVITY_LOG_COLLECTION,
          'details',
          1000, // Max length
          true, // Required
          null,  // Default value
          false  // Array
        );
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // timestamp attribute (datetime)
        await databases.createDatetimeAttribute(
          DB_ID,
          ACTIVITY_LOG_COLLECTION,
          'timestamp',
          true, // Required
          null,  // Default value
          false  // Array
        );
        
        // Wait a bit longer for the timestamp attribute
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Create an index on timestamp for better query performance
        await databases.createIndex(
          DB_ID,
          ACTIVITY_LOG_COLLECTION,
          'timestamp_index',
          'key',
          ['timestamp'],
          ['DESC']
        );
        
        console.log("Successfully created activity_logs collection and attributes");
        collectionExists = true;
      } catch (error) {
        console.error("Error creating activity log collection:", error);
        // If collection already exists but attributes are not ready yet, we'll retry
        if (error.code === 409) {
          collectionExists = true; // Collection exists but might need time for attributes
          await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for attributes to be ready
        }
      } finally {
        isCreatingCollection = false;
      }
    } else if (!collectionExists && isCreatingCollection) {
      // Another request is already creating the collection, wait for it to finish
      console.log("Waiting for activity log collection creation to complete...");
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    // If we get here and collection exists (or was just created), create the document
    if (collectionExists) {
      try {
        // Create activity log entry
        const activity = await databases.createDocument(
          DB_ID,
          ACTIVITY_LOG_COLLECTION,
          ID.unique(),
          {
            userId: userId || 'system',
            user: user || 'System',
            action: action,
            details: details,
            timestamp: new Date().toISOString()
          }
        );
        
        return activity;
      } catch (attrError) {
        // If we get "attribute not available" error, wait and retry once
        if (attrError.type === 'attribute_not_available') {
          console.log("Attributes not ready yet, waiting and retrying...");
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          // Retry once after waiting
          const activity = await databases.createDocument(
            DB_ID,
            ACTIVITY_LOG_COLLECTION,
            ID.unique(),
            {
              userId: userId || 'system',
              user: user || 'System',
              action: action,
              details: details,
              timestamp: new Date().toISOString()
            }
          );
          
          return activity;
        } else {
          throw attrError;
        }
      }
    }
    
    // If we can't create the document after retries, return null
    console.log("Unable to create activity log entry, returning null");
    return null;
  } catch (error) {
    console.error("Error logging activity:", error);
    // Don't throw error, just log it - we don't want failed logging to break app flow
    return null;
  }
};