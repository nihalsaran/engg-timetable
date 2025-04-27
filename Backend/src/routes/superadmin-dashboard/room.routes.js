// Backend/src/routes/superadmin-dashboard/room.routes.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const roomController = require('../../controllers/superadmin-dashboard/room.controller');
const { verifyToken, isSuperAdmin } = require('../../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(verifyToken);

// Validation middleware for room creation/update
const validateRoom = [
  body('number').notEmpty().withMessage('Room number is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  body('faculty').notEmpty().withMessage('Faculty is required'),
  body('features').isArray().withMessage('Features must be an array')
];

// Get all rooms (accessible to authorized users)
router.get('/', roomController.getAllRooms);

// Filter rooms
router.get('/filter', roomController.filterRooms);

// Get room by ID
router.get('/:roomId', roomController.getRoomById);

// Create a new room (SuperAdmin only)
router.post('/', isSuperAdmin, validateRoom, roomController.createRoom);

// Update an existing room (SuperAdmin only)
router.put('/:roomId', isSuperAdmin, validateRoom, roomController.updateRoom);

// Delete a room (SuperAdmin only)
router.delete('/:roomId', isSuperAdmin, roomController.deleteRoom);

// Import rooms from JSON (SuperAdmin only)
router.post('/import', isSuperAdmin, roomController.importRooms);

// Get example JSON dataset
router.get('/example/dataset', roomController.getExampleDataset);

// Get reference data
router.get('/data/features', roomController.getFeatures);
router.get('/data/faculties', roomController.getFaculties);
router.get('/data/types', roomController.getRoomTypes);
router.get('/data/buildings', roomController.getBuildings);
router.get('/data/status-options', roomController.getStatusOptions);

module.exports = router;