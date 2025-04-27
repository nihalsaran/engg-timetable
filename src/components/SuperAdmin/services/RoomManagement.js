// RoomManagement.js - Updated to use backend API endpoints
import axios from 'axios';
import { API_BASE_URL } from '../../../api/config';

// API endpoint base
const ROOMS_API = `${API_BASE_URL}/api/rooms`;

/**
 * Get all rooms from backend
 * @returns {Promise} Promise object with rooms data
 */
export const getAllRooms = async () => {
  try {
    const response = await axios.get(ROOMS_API, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return response.data.rooms;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw new Error(error.response?.data?.message || 'Failed to fetch rooms');
  }
};

/**
 * Get room by ID
 * @param {string} roomId - Room ID
 * @returns {Promise} Promise object with room data
 */
export const getRoomById = async (roomId) => {
  try {
    const response = await axios.get(`${ROOMS_API}/${roomId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return response.data.room;
  } catch (error) {
    console.error("Error fetching room:", error);
    throw new Error(error.response?.data?.message || 'Failed to fetch room');
  }
};

/**
 * Create a new room
 * @param {Object} roomData - Room data to create
 * @returns {Promise} Promise object with created room
 */
export const createRoom = async (roomData) => {
  try {
    const response = await axios.post(ROOMS_API, roomData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.room;
  } catch (error) {
    console.error("Error creating room:", error);
    throw new Error(error.response?.data?.message || 'Failed to create room');
  }
};

/**
 * Update an existing room
 * @param {Object} roomData - Room data to update
 * @returns {Promise} Promise object with updated room
 */
export const updateRoom = async (roomData) => {
  try {
    const response = await axios.put(`${ROOMS_API}/${roomData.id}`, roomData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.room;
  } catch (error) {
    console.error("Error updating room:", error);
    throw new Error(error.response?.data?.message || 'Failed to update room');
  }
};

/**
 * Delete a room
 * @param {string} id - ID of the room to delete
 * @returns {Promise} Promise object with result
 */
export const deleteRoom = async (id) => {
  try {
    const response = await axios.delete(`${ROOMS_API}/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return { success: true, id: response.data.id };
  } catch (error) {
    console.error("Error deleting room:", error);
    return { success: false, error: error.response?.data?.message || 'Failed to delete room' };
  }
};

/**
 * Filter rooms by search term and filters
 * @param {Array} rooms - Array of room objects to filter locally
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered rooms
 */
export const filterRooms = (rooms, filters = {}) => {
  return rooms.filter(room => {
    // Filter by search term
    if (filters.searchTerm && 
        !room.roomNumber?.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
        !room.number?.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
        !room.faculty?.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
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
    
    return true;
  });
};

/**
 * Get faculties from backend
 * @returns {Promise} Promise object with faculties data
 */
export const getFaculties = async () => {
  try {
    const response = await axios.get(`${ROOMS_API}/data/faculties`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return response.data.faculties;
  } catch (error) {
    console.error("Error fetching faculties:", error);
    // Return default faculties as fallback
    return [
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
  }
};

/**
 * Get features from backend
 * @returns {Promise} Promise object with features data
 */
export const getFeatures = async () => {
  try {
    const response = await axios.get(`${ROOMS_API}/data/features`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return response.data.features;
  } catch (error) {
    console.error("Error fetching features:", error);
    // Return default features as fallback
    return [
      { id: 'Projector', name: 'Projector' },
      { id: 'SmartBoard', name: 'Smart Board' },
      { id: 'Computers', name: 'Computer System' },
      { id: 'AC', name: 'Air Conditioning' },
      { id: 'Wi-Fi', name: 'Wi-Fi' },
      { id: 'Audio System', name: 'Audio System' }
    ];
  }
};

/**
 * Get room types from backend
 * @returns {Promise} Promise object with room types data
 */
export const getRoomTypes = async () => {
  try {
    const response = await axios.get(`${ROOMS_API}/data/types`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return response.data.types;
  } catch (error) {
    console.error("Error fetching room types:", error);
    // Return default room types as fallback
    return [
      'Classroom',
      'Lecture Hall',
      'Computer Lab',
      'Chemistry Lab',
      'Physics Lab',
      'Workshop',
      'Seminar Hall',
      'Conference Room'
    ];
  }
};

/**
 * Get buildings from backend
 * @returns {Promise} Promise object with buildings data
 */
export const getBuildings = async () => {
  try {
    const response = await axios.get(`${ROOMS_API}/data/buildings`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return response.data.buildings;
  } catch (error) {
    console.error("Error fetching buildings:", error);
    // Return default buildings as fallback
    return [
      'CSE Block',
      'Main Block',
      'IT Block',
      'Mechanical Block',
      'Electronics Block',
      'Civil Block',
      'Admin Block',
      'Library Building'
    ];
  }
};

/**
 * Get status options from backend
 * @returns {Promise} Promise object with status options data
 */
export const getStatusOptions = async () => {
  try {
    const response = await axios.get(`${ROOMS_API}/data/status-options`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return response.data.statusOptions;
  } catch (error) {
    console.error("Error fetching status options:", error);
    // Return default status options as fallback
    return [
      'Available',
      'Occupied',
      'Maintenance',
      'Reserved'
    ];
  }
};

/**
 * Process room import
 * @param {Object} jsonData - JSON data to import
 * @returns {Promise} Promise object with import results
 */
export const processRoomImport = async (jsonData) => {
  try {
    const response = await axios.post(`${ROOMS_API}/import`, jsonData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    return {
      success: true,
      results: response.data.results
    };
  } catch (error) {
    console.error("Error importing rooms:", error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to import rooms'
    };
  }
};

/**
 * Get example JSON dataset
 * @returns {Promise} Promise object with example dataset
 */
export const getExampleJSONDataset = async () => {
  try {
    const response = await axios.get(`${ROOMS_API}/example/dataset`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return response.data.data;
  } catch (error) {
    console.error("Error fetching example dataset:", error);
    // Return default example dataset as fallback
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
  }
};

/**
 * Get faculty color class based on faculty name
 * @param {string} faculty - Faculty name
 * @returns {string} CSS class for color
 */
export const getFacultyColorClass = (faculty) => {
  const colorMap = {
    'Faculty of Engineering': 'bg-blue-100 text-blue-800',
    'Faculty of Science': 'bg-green-100 text-green-800',
    'Faculty of Social Science': 'bg-orange-100 text-orange-800',
    'Faculty of Arts': 'bg-purple-100 text-purple-800',
    'Faculty of Management': 'bg-yellow-100 text-yellow-800',
    'Faculty of Law': 'bg-indigo-100 text-indigo-800',
    'Faculty of Medicine': 'bg-red-100 text-red-800',
    'Faculty of Education': 'bg-teal-100 text-teal-800',
    'Common Facilities': 'bg-gray-100 text-gray-800'
  };
  
  return colorMap[faculty] || 'bg-gray-100 text-gray-800';
};

// For backward compatibility - will be deprecated
export const facultyOptions = [
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

// For backward compatibility - will be deprecated
export const featureOptions = [
  { id: 'Projector', name: 'Projector' },
  { id: 'SmartBoard', name: 'Smart Board' },
  { id: 'Computers', name: 'Computer System' },
  { id: 'AC', name: 'Air Conditioning' },
  { id: 'Wi-Fi', name: 'Wi-Fi' },
  { id: 'Audio System', name: 'Audio System' }
];

// For backward compatibility - will be deprecated
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

// For backward compatibility - will be deprecated
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

// For backward compatibility - will be deprecated
export const statusOptions = [
  'Available',
  'Occupied',
  'Maintenance',
  'Reserved'
];

// Export service as default export
const RoomManagementService = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  filterRooms,
  getFaculties,
  getFeatures,
  getRoomTypes,
  getBuildings,
  getStatusOptions,
  processRoomImport,
  getExampleJSONDataset,
  getFacultyColorClass,
  // Backwards compatibility
  facultyOptions,
  featureOptions,
  roomTypes,
  buildings,
  statusOptions
};

export default RoomManagementService;