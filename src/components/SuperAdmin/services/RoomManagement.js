// Dummy data for rooms
const dummyRooms = [
  { 
    id: 1, 
    roomNumber: 'A101', 
    capacity: 60, 
    features: ['AC', 'Projector', 'SmartBoard'], 
    department: 'Computer Science'
  },
  { 
    id: 2, 
    roomNumber: 'B201', 
    capacity: 40, 
    features: ['Projector', 'Wi-Fi'], 
    department: 'Mechanical Engineering'
  },
  { 
    id: 3, 
    roomNumber: 'C302', 
    capacity: 30, 
    features: ['AC', 'Computers', 'SmartBoard'], 
    department: 'Computer Science'
  },
  { 
    id: 4, 
    roomNumber: 'A105', 
    capacity: 60, 
    features: ['Projector', 'SmartBoard'], 
    department: 'Electrical Engineering'
  },
  { 
    id: 5, 
    roomNumber: 'D101', 
    capacity: 80, 
    features: ['AC', 'Projector', 'Audio System'], 
    department: 'Physics'
  },
];

// Department options
export const departmentOptions = ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Physics', 'Mathematics'];

// Feature options (without icons - UI elements will be handled in the component)
export const featureOptions = [
  { id: 'AC', name: 'AC' },
  { id: 'Projector', name: 'Projector' },
  { id: 'SmartBoard', name: 'SmartBoard' },
  { id: 'Wi-Fi', name: 'Wi-Fi' },
  { id: 'Computers', name: 'Computers' },
  { id: 'Audio System', name: 'Audio System' }
];

// Get all rooms
export const getRooms = () => {
  return [...dummyRooms];
};

// Add a new room
export const addRoom = (roomData) => {
  const newRoom = {
    id: dummyRooms.length + 1,
    roomNumber: roomData.roomNumber,
    capacity: parseInt(roomData.capacity),
    features: roomData.features,
    department: roomData.department
  };
  dummyRooms.push(newRoom);
  return newRoom;
};

// Update an existing room
export const updateRoom = (roomId, roomData) => {
  const index = dummyRooms.findIndex(room => room.id === roomId);
  if (index !== -1) {
    const updatedRoom = {
      ...dummyRooms[index],
      roomNumber: roomData.roomNumber,
      capacity: parseInt(roomData.capacity),
      features: roomData.features,
      department: roomData.department
    };
    dummyRooms[index] = updatedRoom;
    return updatedRoom;
  }
  return null;
};

// Delete a room
export const deleteRoom = (roomId) => {
  const index = dummyRooms.findIndex(room => room.id === roomId);
  if (index !== -1) {
    dummyRooms.splice(index, 1);
    return true;
  }
  return false;
};

// Filter rooms based on criteria
export const filterRooms = (rooms, { department, feature, searchTerm }) => {
  let filtered = [...rooms];
  
  // Apply department filter
  if (department) {
    filtered = filtered.filter(room => room.department === department);
  }
  
  // Apply feature filter
  if (feature) {
    filtered = filtered.filter(room => room.features.includes(feature));
  }
  
  // Apply search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(room => 
      room.roomNumber.toLowerCase().includes(term) || 
      room.department.toLowerCase().includes(term)
    );
  }
  
  return filtered;
};

// Get department color class
export const getDepartmentColorClass = (department) => {
  switch (department) {
    case 'Computer Science':
      return 'bg-blue-100 text-blue-800';
    case 'Mechanical Engineering':
      return 'bg-red-100 text-red-800';
    case 'Electrical Engineering':
      return 'bg-amber-100 text-amber-800';
    case 'Civil Engineering':
      return 'bg-green-100 text-green-800';
    case 'Physics':
      return 'bg-purple-100 text-purple-800';
    case 'Mathematics':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Get example JSON dataset for download
export const getExampleJSONDataset = () => {
  return [
    {
      "roomNumber": "E101",
      "capacity": 50,
      "features": ["AC", "Projector", "Wi-Fi"],
      "department": "Computer Science"
    },
    {
      "roomNumber": "E102",
      "capacity": 35,
      "features": ["SmartBoard", "Computers"],
      "department": "Electrical Engineering"
    },
    {
      "roomNumber": "E103",
      "capacity": 60,
      "features": ["AC", "Projector", "Audio System"],
      "department": "Physics"
    }
  ];
};

// Process room import from JSON file
export const processRoomImport = async (jsonData) => {
  try {
    // Validate that jsonData is an array
    if (!Array.isArray(jsonData)) {
      return { 
        success: false, 
        error: 'Invalid data format. Expected an array of rooms.'
      };
    }

    const results = [];
    let successCount = 0;

    // Process each room in the array
    for (const room of jsonData) {
      try {
        // Validate required fields
        if (!room.roomNumber) {
          results.push({ 
            roomNumber: room.roomNumber || 'Unknown', 
            success: false, 
            error: 'Room number is required' 
          });
          continue;
        }

        if (!room.capacity || isNaN(parseInt(room.capacity))) {
          results.push({ 
            roomNumber: room.roomNumber, 
            success: false, 
            error: 'Valid capacity is required' 
          });
          continue;
        }

        if (!room.department || !departmentOptions.includes(room.department)) {
          results.push({ 
            roomNumber: room.roomNumber, 
            success: false, 
            error: `Department must be one of: ${departmentOptions.join(', ')}` 
          });
          continue;
        }

        // Validate features if present
        if (room.features && Array.isArray(room.features)) {
          const validFeatures = featureOptions.map(f => f.id);
          const invalidFeatures = room.features.filter(f => !validFeatures.includes(f));
          if (invalidFeatures.length > 0) {
            results.push({ 
              roomNumber: room.roomNumber, 
              success: false, 
              error: `Invalid features: ${invalidFeatures.join(', ')}` 
            });
            continue;
          }
        }

        // Prepare room data
        const roomData = {
          roomNumber: room.roomNumber,
          capacity: parseInt(room.capacity),
          features: Array.isArray(room.features) ? room.features : [],
          department: room.department
        };

        // Check if room already exists
        const existingRoomIndex = dummyRooms.findIndex(r => 
          r.roomNumber.toLowerCase() === roomData.roomNumber.toLowerCase()
        );

        let savedRoom;
        if (existingRoomIndex !== -1) {
          // Update existing room
          savedRoom = updateRoom(dummyRooms[existingRoomIndex].id, roomData);
        } else {
          // Add new room
          savedRoom = addRoom(roomData);
        }

        if (savedRoom) {
          results.push({ 
            roomNumber: room.roomNumber, 
            success: true, 
            action: existingRoomIndex !== -1 ? 'updated' : 'added'
          });
          successCount++;
        } else {
          results.push({ 
            roomNumber: room.roomNumber, 
            success: false, 
            error: 'Failed to save room' 
          });
        }
      } catch (err) {
        results.push({ 
          roomNumber: room.roomNumber || 'Unknown', 
          success: false, 
          error: err.message || 'Error processing room'
        });
      }
    }

    return {
      success: true,
      results: results,
      summary: `Processed ${results.length} rooms. Successfully imported ${successCount} rooms.`
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Failed to process room data',
    };
  }
};