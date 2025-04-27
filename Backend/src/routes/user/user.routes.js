// Backend/src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../../controllers/user/user.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// All routes require authentication and superadmin privileges
router.use(authMiddleware.verifyToken, authMiddleware.isSuperAdmin);

// Get all users
router.get('/', userController.getUsers);

// Get available departments
router.get('/departments', userController.getDepartments);

// Get available roles
router.get('/roles', userController.getRoles);

// Get user by ID
router.get('/:userId', userController.getUserById);

// Create a new user
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('role', 'Role is required').isIn(['superadmin', 'hod', 'tt_incharge']),
  check('department', 'Department is required').not().isEmpty()
], userController.createUser);

// Update a user
router.put('/:userId', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('role', 'Role is required').isIn(['superadmin', 'hod', 'tt_incharge']),
  check('department', 'Department is required').not().isEmpty()
], userController.updateUser);

// Update user status
router.patch('/:userId/status', userController.updateUserStatus);

// Delete a user
router.delete('/:userId', userController.deleteUser);

// Send password reset email
router.post('/password-reset', [
  check('email', 'Please include a valid email').isEmail()
], userController.sendPasswordReset);

module.exports = router;