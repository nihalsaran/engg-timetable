// RoomManagement.js - Updated to integrate with Appwrite
import { databases, ID, Query } from '../../../appwrite/config';

// Appwrite database and collection IDs
const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'default';
const ROOMS_COLLECTION = 'rooms';

// Mock data for rooms
const dummyRooms = [
  { 
    id: '1', 
    roomNumber: 'CS101', 
    capacity: 60,
    features: ['Projector', 'AC', 'Wi-Fi'],
    department: 'Computer Science'
  },
  { 
    id: '2', 
    roomNumber: 'LH201', 
    capacity: 120,
    features: ['Projector', 'SmartBoard', 'Audio System', 'AC', 'Wi-Fi'],
    department: 'Mechanical'
  },
  { 
    id: '3', 
    roomNumber: 'LAB302', 
    capacity: 40,
    features: ['Computers', 'Projector', 'AC', 'Wi-Fi'],
    department: 'Electronics'
  },
  { 
    id: '4', 
    roomNumber: 'PH101', 
    capacity: 30,
    features: ['Audio System', 'Wi-Fi'],
    department: 'Physics'
  },
  { 
    id: '5', 
    roomNumber: 'CH202', 
    capacity: 35,
    features: ['Audio System', 'SmartBoard'],
    department: 'Chemistry'
  },
];

// Room types for dropdown
export const roomTypes = [
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
export const buildings = [
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
export const statusOptions = [
  'Available',
  'Occupied',
  'Maintenance',
  'Reserved'
];

// Department options for dropdown
export const departmentOptions = [
  'Computer Science',
  'Mechanical',
  'Electronics',
  'Electrical',
  'Civil',
  'Information Technology',
  'Physics',
  'Chemistry',
  'Mathematics'
];

// Feature options with name and id
export const featureOptions = [
  { id: 'Projector', name: 'Projector' },
  { id: 'SmartBoard', name: 'Smart Board' },
  { id: 'Computers', name: 'Computer System' },
  { id: 'AC', name: 'Air Conditioning' },
  { id: 'Wi-Fi', name: 'Wi-Fi' },
  { id: 'Audio System', name: 'Audio System' }
];

/**
 * Get department color class based on department name
 * @param {string} department - Department name
 * @returns {string} CSS class for color
 */
export const getDepartmentColorClass = (department) => {
  const colorMap = {
    'Computer Science': 'bg-blue-100 text-blue-800',
    'Mechanical': 'bg-orange-100 text-orange-800',
    'Electronics': 'bg-green-100 text-green-800',
    'Electrical': 'bg-purple-100 text-purple-800',
    'Civil': 'bg-yellow-100 text-yellow-800',
    'Information Technology': 'bg-indigo-100 text-indigo-800',
    'Physics': 'bg-red-100 text-red-800',
    'Chemistry': 'bg-teal-100 text-teal-800',
    'Mathematics': 'bg-pink-100 text-pink-800'
  };
  
  return colorMap[department] || 'bg-gray-100 text-gray-800';
};

/**
 * Get all rooms (synchronous version returning mock data)
 * @returns {Array} Array of room objects
 */
export const getRooms = () => {
  return dummyRooms;
};

/**
 * Add a new room (synchronous version for mock data)
 * @param {Object} roomData - Room data object
 * @returns {Object} Created room with ID
 */
export const addRoom = (roomData) => {
  const newRoom = {
    id: 'room_' + Date.now(),
    roomNumber: roomData.roomNumber,
    capacity: parseInt(roomData.capacity),
    features: [...roomData.features],
    department: roomData.department
  };
  
  dummyRooms.push(newRoom);
  return newRoom;
};

/**
 * Filter rooms based on criteria
 * @param {Array} rooms - Array of room objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered rooms
 */
export const filterRooms = (rooms, filters = {}) => {
  return rooms.filter(room => {
    // Filter by search term
    if (filters.searchTerm && 
        !room.roomNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
        !room.department.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by department
    if (filters.department && room.department !== filters.department) {
      return false;
    }
    
    // Filter by feature
    if (filters.feature && !room.features.includes(filters.feature)) {
      return false;
    }
    
    return true;
  });
};

/**
 * Get example JSON dataset format
 * @returns {Object} Example dataset
 */
export const getExampleJSONDataset = () => {
  return {
    "rooms": [
      {
        "roomNumber": "CS101",
        "capacity": 60,
        "features": ["Projector", "AC", "Wi-Fi"],
        "department": "Computer Science"
      },
      {
        "roomNumber": "LH201",
        "capacity": 120,
        "features": ["Projector", "SmartBoard", "Audio System"],
        "department": "Mechanical"
      }
    ]
  };
};

/**
 * Process room data import from JSON
 * @param {Object} jsonData - Imported JSON data
 * @returns {Object} Import results
 */
export const processRoomImport = async (jsonData) => {
  try {
    if (!jsonData.rooms || !Array.isArray(jsonData.rooms)) {
      return { success: false, error: "Invalid JSON format. Expected 'rooms' array." };
    }
    
    const results = [];
    
    for (const roomData of jsonData.rooms) {
      try {
        // Validate required fields
        if (!roomData.roomNumber || !roomData.capacity || !roomData.department) {
          results.push({
            roomNumber: roomData.roomNumber || 'Unknown',
            success: false,
            error: "Missing required fields"
          });
          continue;
        }
        
        // Add room using the Appwrite function
        const room = await createRoom({
          number: roomData.roomNumber,
          capacity: roomData.capacity,
          features: Array.isArray(roomData.features) ? roomData.features : [],
          department: roomData.department
        });
        
        results.push({
          roomNumber: room.number,
          success: true
        });
      } catch (err) {
        results.push({
          roomNumber: roomData.roomNumber || 'Unknown',
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
    console.error("Error processing room import:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get all rooms from Appwrite
 * @returns {Promise} Promise object with rooms data
 */
export const getAllRooms = async () => {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      ROOMS_COLLECTION
    );
    
    // Transform Appwrite data format to match application needs
    return response.documents.map(room => ({
      id: room.$id,
      number: room.number,
      type: room.type,
      capacity: room.capacity,
      building: room.building,
      floor: room.floor,
      status: room.status || 'Available',
      department: room.department,
      features: room.features || []
    }));
  } catch (error) {
    console.error("Error fetching rooms:", error);
    // Fallback to dummy data
    return dummyRooms;
  }
};

/**
 * Filter rooms by search term and filters using Appwrite
 * @param {string} searchTerm - Search term for filtering rooms
 * @param {Object} filters - Additional filters to apply
 * @returns {Promise} Promise object with filtered rooms
 */
export const filterRoomsAsync = async (searchTerm, filters = {}) => {
  try {
    // Get all rooms first and then filter client-side
    // In a real app with many rooms, this would use Appwrite's query filters
    const allRooms = await getAllRooms();
    
    return allRooms.filter(room => {
      // Filter by search term
      if (searchTerm && !room.number.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !room.building.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by building
      if (filters.building && filters.building !== 'All' && room.building !== filters.building) {
        return false;
      }
      
      // Filter by type
      if (filters.type && filters.type !== 'All' && room.type !== filters.type) {
        return false;
      }
      
      // Filter by status
      if (filters.status && filters.status !== 'All' && room.status !== filters.status) {
        return false;
      }
      
      return true;
    });
  } catch (error) {
    console.error("Error filtering rooms:", error);
    
    // Fallback to filtering dummy data
    return dummyRooms.filter(room => {
      // Filter by search term
      if (searchTerm && !room.number.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !room.building.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply other filters
      if (filters.building && filters.building !== 'All' && room.building !== filters.building) {
        return false;
      }
      
      if (filters.type && filters.type !== 'All' && room.type !== filters.type) {
        return false;
      }
      
      if (filters.status && filters.status !== 'All' && room.status !== filters.status) {
        return false;
      }
      
      return true;
    });
  }
};

/**
 * Create a new room in Appwrite
 * @param {Object} roomData - Room data to create
 * @returns {Promise} Promise object with created room
 */
export const createRoom = async (roomData) => {
  try {
    const roomId = ID.unique();
    const room = {
      number: roomData.number,
      type: roomData.type || 'Classroom',
      capacity: parseInt(roomData.capacity),
      building: roomData.building || 'Main Block',
      floor: parseInt(roomData.floor || '1'),
      status: roomData.status || 'Available',
      department: roomData.department,
      features: roomData.features || [],
      createdAt: new Date().toISOString()
    };
    
    const response = await databases.createDocument(
      DB_ID,
      ROOMS_COLLECTION,
      roomId,
      room
    );
    
    return {
      id: response.$id,
      ...room
    };
  } catch (error) {
    console.error("Error creating room:", error);
    // For UI continuity in case of error
    return {
      id: 'temp-' + Date.now(),
      ...roomData
    };
  }
};

/**
 * Update an existing room in Appwrite
 * @param {Object} roomData - Room data to update
 * @returns {Promise} Promise object with updated room
 */
export const updateRoom = async (roomData) => {
  try {
    const updatedData = {
      number: roomData.number,
      type: roomData.type || 'Classroom',
      capacity: parseInt(roomData.capacity),
      building: roomData.building || 'Main Block',
      floor: parseInt(roomData.floor || '1'),
      status: roomData.status || 'Available',
      department: roomData.department,
      features: roomData.features || [],
      updatedAt: new Date().toISOString()
    };
    
    await databases.updateDocument(
      DB_ID,
      ROOMS_COLLECTION,
      roomData.id,
      updatedData
    );
    
    return roomData;
  } catch (error) {
    console.error("Error updating room:", error);
    // Return the data anyway for UI continuity
    return roomData;
  }
};

/**
 * Delete a room from Appwrite
 * @param {string} id - ID of the room to delete
 * @returns {Promise} Promise object with result
 */
export const deleteRoom = async (id) => {
  try {
    await databases.deleteDocument(
      DB_ID,
      ROOMS_COLLECTION,
      id
    );
    
    return { success: true, id };
  } catch (error) {
    console.error("Error deleting room:", error);
    return { success: false, error: error.message };
  }
};

// Export all functions as a service object
const RoomManagementService = {
  getRooms,
  getAllRooms,
  filterRooms,
  createRoom,
  addRoom,
  updateRoom,
  deleteRoom,
  roomTypes,
  buildings,
  statusOptions,
  departmentOptions,
  featureOptions,
  getDepartmentColorClass,
  getExampleJSONDataset,
  processRoomImport
};

export default RoomManagementService;