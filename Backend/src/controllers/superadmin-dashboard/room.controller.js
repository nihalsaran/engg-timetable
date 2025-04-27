// Backend/src/controllers/superadmin-dashboard/room.controller.js
const { validationResult } = require('express-validator');
const roomService = require('../../services/superadmin-dashboard/room.service');

/**
 * Get all rooms
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await roomService.getAllRooms();
    
    return res.status(200).json({
      success: true,
      rooms
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve rooms'
    });
  }
};

/**
 * Get room by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const room = await roomService.getRoomById(roomId);
    
    return res.status(200).json({
      success: true,
      room
    });
  } catch (error) {
    console.error('Get room error:', error);
    
    return res.status(error.message === 'Room not found' ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to retrieve room'
    });
  }
};

/**
 * Create a new room
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createRoom = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const roomData = req.body;
    
    const newRoom = await roomService.createRoom(roomData);
    
    return res.status(201).json({
      success: true,
      room: newRoom
    });
  } catch (error) {
    console.error('Create room error:', error);
    
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to create room'
    });
  }
};

/**
 * Update a room
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateRoom = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { roomId } = req.params;
    const roomData = req.body;
    
    const updatedRoom = await roomService.updateRoom(roomId, roomData);
    
    return res.status(200).json({
      success: true,
      room: updatedRoom
    });
  } catch (error) {
    console.error('Update room error:', error);
    
    return res.status(error.message === 'Room not found' ? 404 : 400).json({
      success: false,
      message: error.message || 'Failed to update room'
    });
  }
};

/**
 * Delete a room
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const result = await roomService.deleteRoom(roomId);
    
    return res.status(200).json({
      success: true,
      id: result.id
    });
  } catch (error) {
    console.error('Delete room error:', error);
    
    return res.status(error.message === 'Room not found' ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to delete room'
    });
  }
};

/**
 * Filter rooms by query parameters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.filterRooms = async (req, res) => {
  try {
    const filters = {
      searchTerm: req.query.search || '',
      faculty: req.query.faculty || '',
      feature: req.query.feature || '',
      building: req.query.building || '',
      type: req.query.type || '',
      status: req.query.status || ''
    };
    
    const rooms = await roomService.filterRooms(filters);
    
    return res.status(200).json({
      success: true,
      rooms
    });
  } catch (error) {
    console.error('Filter rooms error:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to filter rooms'
    });
  }
};

/**
 * Process room import from JSON
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.importRooms = async (req, res) => {
  try {
    const roomsData = req.body.rooms || req.body;
    
    const result = await roomService.processRoomImport(roomsData);
    
    return res.status(200).json({
      success: true,
      results: result.results
    });
  } catch (error) {
    console.error('Import rooms error:', error);
    
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to import rooms'
    });
  }
};

/**
 * Get example JSON dataset
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getExampleDataset = async (req, res) => {
  try {
    const exampleData = roomService.getExampleJSONDataset();
    
    return res.status(200).json({
      success: true,
      data: exampleData
    });
  } catch (error) {
    console.error('Get example dataset error:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve example dataset'
    });
  }
};

/**
 * Get all available features
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getFeatures = async (req, res) => {
  try {
    const features = roomService.getFeatures();
    
    return res.status(200).json({
      success: true,
      features
    });
  } catch (error) {
    console.error('Get features error:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve features'
    });
  }
};

/**
 * Get all available faculties
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getFaculties = async (req, res) => {
  try {
    const faculties = roomService.getFaculties();
    
    return res.status(200).json({
      success: true,
      faculties
    });
  } catch (error) {
    console.error('Get faculties error:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve faculties'
    });
  }
};

/**
 * Get all available room types
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getRoomTypes = async (req, res) => {
  try {
    const types = roomService.getRoomTypes();
    
    return res.status(200).json({
      success: true,
      types
    });
  } catch (error) {
    console.error('Get room types error:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve room types'
    });
  }
};

/**
 * Get all available buildings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getBuildings = async (req, res) => {
  try {
    const buildings = roomService.getBuildings();
    
    return res.status(200).json({
      success: true,
      buildings
    });
  } catch (error) {
    console.error('Get buildings error:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve buildings'
    });
  }
};

/**
 * Get all available status options
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getStatusOptions = async (req, res) => {
  try {
    const statusOptions = roomService.getStatusOptions();
    
    return res.status(200).json({
      success: true,
      statusOptions
    });
  } catch (error) {
    console.error('Get status options error:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve status options'
    });
  }
};