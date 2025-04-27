// Backend/src/services/superadmin-dashboard/room.service.js
const { db } = require('../../config/firebase.config');
const { databases, ID, Query } = require('../../config/appwrite.config');

// Constants for Appwrite database
const DB_ID = process.env.APPWRITE_DATABASE_ID || 'default';
const ROOMS_COLLECTION = 'rooms';

// Faculty options for dropdown
const facultyOptions = [
  'Faculty of Engineering',
  'Faculty of Science',
  'Faculty of Social Science',
  'Faculty of Arts',
  'Faculty of Management',
  'Faculty of Law',
  'Faculty of Medicine',
  'Faculty of Education',
  'Common Facilities'
];

// Feature options
const featureOptions = [
  { id: 'Projector', name: 'Projector' },
  { id: 'SmartBoard', name: 'Smart Board' },
  { id: 'Computers', name: 'Computer System' },
  { id: 'AC', name: 'Air Conditioning' },
  { id: 'Wi-Fi', name: 'Wi-Fi' },
  { id: 'Audio System', name: 'Audio System' }
];

// Room types
const roomTypes = [
  'Classroom',
  'Lecture Hall',
  'Computer Lab',
  'Chemistry Lab',
  'Physics Lab',
  'Workshop',
  'Seminar Hall',
  'Conference Room'
];

// Building options
const buildings = [
  'CSE Block',
  'Main Block',
  'IT Block',
  'Mechanical Block',
  'Electronics Block',
  'Civil Block',
  'Admin Block',
  'Library Building'
];

// Status options
const statusOptions = [
  'Available',
  'Occupied',
  'Maintenance',
  'Reserved'
];

/**
 * Get all rooms
 * @returns {Promise<Array>} Promise resolving to array of rooms
 */
exports.getAllRooms = async () => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      ROOMS_COLLECTION
    );
    
    return response.documents.map(room => ({
      id: room.$id,
      roomNumber: room.number,
      number: room.number,
      type: room.type || 'Classroom',
      capacity: room.capacity,
      building: room.building || 'Main Block',
      floor: room.floor || 1,
      status: room.status || 'Available',
      faculty: room.faculty,
      features: room.features || [],
      createdAt: room.createdAt,
      updatedAt: room.updatedAt
    }));
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw new Error('Failed to fetch rooms');
  }
};

/**
 * Get room by ID
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>} Promise resolving to room object
 */
exports.getRoomById = async (roomId) => {
  try {
    const room = await databases.getDocument(
      DB_ID,
      ROOMS_COLLECTION,
      roomId
    );
    
    if (!room) {
      throw new Error('Room not found');
    }
    
    return {
      id: room.$id,
      roomNumber: room.number,
      number: room.number,
      type: room.type || 'Classroom',
      capacity: room.capacity,
      building: room.building || 'Main Block',
      floor: room.floor || 1,
      status: room.status || 'Available',
      faculty: room.faculty,
      features: room.features || [],
      createdAt: room.createdAt,
      updatedAt: room.updatedAt
    };
  } catch (error) {
    console.error('Error fetching room:', error);
    throw new Error(error.message || 'Failed to fetch room');
  }
};

/**
 * Create a new room
 * @param {Object} roomData - Room data
 * @returns {Promise<Object>} Promise resolving to created room
 */
exports.createRoom = async (roomData) => {
  try {
    // Validate required fields
    if (!roomData.number || !roomData.capacity || !roomData.faculty) {
      throw new Error('Missing required room fields');
    }
    
    const roomId = ID.unique();
    const room = {
      number: roomData.number,
      type: roomData.type || 'Classroom',
      capacity: parseInt(roomData.capacity),
      building: roomData.building || 'Main Block',
      floor: parseInt(roomData.floor || '1'),
      status: roomData.status || 'Available',
      faculty: roomData.faculty,
      features: roomData.features || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const response = await databases.createDocument(
      DB_ID,
      ROOMS_COLLECTION,
      roomId,
      room
    );
    
    return {
      id: response.$id,
      roomNumber: room.number,
      ...room
    };
  } catch (error) {
    console.error('Error creating room:', error);
    throw new Error(error.message || 'Failed to create room');
  }
};

/**
 * Update an existing room
 * @param {string} roomId - Room ID
 * @param {Object} roomData - Room data to update
 * @returns {Promise<Object>} Promise resolving to updated room
 */
exports.updateRoom = async (roomId, roomData) => {
  try {
    // Check if room exists
    await this.getRoomById(roomId);
    
    const updatedData = {
      number: roomData.number,
      type: roomData.type || 'Classroom',
      capacity: parseInt(roomData.capacity),
      building: roomData.building || 'Main Block',
      floor: parseInt(roomData.floor || '1'),
      status: roomData.status || 'Available',
      faculty: roomData.faculty,
      features: roomData.features || [],
      updatedAt: new Date().toISOString()
    };
    
    await databases.updateDocument(
      DB_ID,
      ROOMS_COLLECTION,
      roomId,
      updatedData
    );
    
    return {
      id: roomId,
      roomNumber: updatedData.number,
      ...updatedData
    };
  } catch (error) {
    console.error('Error updating room:', error);
    throw new Error(error.message || 'Failed to update room');
  }
};

/**
 * Delete a room
 * @param {string} roomId - Room ID to delete
 * @returns {Promise<Object>} Promise resolving to deleted room ID
 */
exports.deleteRoom = async (roomId) => {
  try {
    // Check if room exists
    await this.getRoomById(roomId);
    
    await databases.deleteDocument(
      DB_ID,
      ROOMS_COLLECTION,
      roomId
    );
    
    return { id: roomId };
  } catch (error) {
    console.error('Error deleting room:', error);
    throw new Error(error.message || 'Failed to delete room');
  }
};

/**
 * Filter rooms by query parameters
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Array>} Promise resolving to filtered rooms
 */
exports.filterRooms = async (filters = {}) => {
  try {
    // Get all rooms and filter on the server
    // For large datasets, this should be replaced with proper Appwrite queries
    const allRooms = await this.getAllRooms();
    
    return allRooms.filter(room => {
      // Filter by search term
      if (filters.searchTerm && 
          !room.number.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
          !room.faculty.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by faculty
      if (filters.faculty && room.faculty !== filters.faculty) {
        return false;
      }
      
      // Filter by feature
      if (filters.feature && !room.features.includes(filters.feature)) {
        return false;
      }
      
      // Filter by building
      if (filters.building && room.building !== filters.building) {
        return false;
      }
      
      // Filter by type
      if (filters.type && room.type !== filters.type) {
        return false;
      }
      
      // Filter by status
      if (filters.status && room.status !== filters.status) {
        return false;
      }
      
      return true;
    });
  } catch (error) {
    console.error('Error filtering rooms:', error);
    throw new Error('Failed to filter rooms');
  }
};

/**
 * Process room import from JSON
 * @param {Array} roomsData - Array of room data to import
 * @returns {Promise<Object>} Promise resolving to import results
 */
exports.processRoomImport = async (roomsData) => {
  try {
    if (!Array.isArray(roomsData)) {
      throw new Error('Invalid import data format. Expected array of rooms.');
    }
    
    const results = [];
    
    for (const roomData of roomsData) {
      try {
        // Validate required fields
        if (!roomData.number || !roomData.capacity || !roomData.faculty) {
          results.push({
            roomNumber: roomData.number || 'Unknown',
            success: false,
            error: 'Missing required fields'
          });
          continue;
        }
        
        // Create room
        const room = await this.createRoom({
          number: roomData.number,
          capacity: roomData.capacity,
          features: Array.isArray(roomData.features) ? roomData.features : [],
          faculty: roomData.faculty,
          type: roomData.type || 'Classroom',
          building: roomData.building || 'Main Block',
          floor: roomData.floor || 1,
          status: roomData.status || 'Available'
        });
        
        results.push({
          roomNumber: room.number,
          success: true
        });
      } catch (err) {
        results.push({
          roomNumber: roomData.number || 'Unknown',
          success: false,
          error: err.message
        });
      }
    }
    
    return {
      success: true,
      results
    };
  } catch (error) {
    console.error('Error processing room import:', error);
    throw new Error(error.message || 'Failed to process room import');
  }
};

/**
 * Get example JSON dataset
 * @returns {Object} Example room dataset
 */
exports.getExampleJSONDataset = () => {
  return [
    {
      "number": "CS101",
      "capacity": 60,
      "features": ["Projector", "AC", "Wi-Fi"],
      "faculty": "Faculty of Engineering",
      "type": "Classroom",
      "building": "CSE Block",
      "floor": 1,
      "status": "Available"
    },
    {
      "number": "LH201",
      "capacity": 120,
      "features": ["Projector", "SmartBoard", "Audio System"],
      "faculty": "Faculty of Science",
      "type": "Lecture Hall",
      "building": "Main Block",
      "floor": 2,
      "status": "Available"
    }
  ];
};

/**
 * Get all available features
 * @returns {Array} Array of feature objects
 */
exports.getFeatures = () => {
  return featureOptions;
};

/**
 * Get all available faculties
 * @returns {Array} Array of faculty names
 */
exports.getFaculties = () => {
  return facultyOptions;
};

/**
 * Get all available room types
 * @returns {Array} Array of room types
 */
exports.getRoomTypes = () => {
  return roomTypes;
};

/**
 * Get all available buildings
 * @returns {Array} Array of building names
 */
exports.getBuildings = () => {
  return buildings;
};

/**
 * Get all available status options
 * @returns {Array} Array of status options
 */
exports.getStatusOptions = () => {
  return statusOptions;
};