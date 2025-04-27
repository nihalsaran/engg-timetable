// Backend/src/controllers/user.controller.js
const { validationResult } = require('express-validator');
const userService = require('../../services/user/user.service');

/**
 * Get all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    
    return res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve users'
    });
  }
};

/**
 * Get user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await userService.getUserById(userId);
    
    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    
    return res.status(error.message === 'User not found' ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to retrieve user'
    });
  }
};

/**
 * Create a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createUser = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const userData = req.body;
    
    const newUser = await userService.createUser(userData);
    
    return res.status(201).json({
      success: true,
      user: newUser
    });
  } catch (error) {
    console.error('Create user error:', error);
    
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to create user'
    });
  }
};

/**
 * Update a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateUser = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { userId } = req.params;
    const userData = req.body;
    
    const updatedUser = await userService.updateUser(userId, userData);
    
    return res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    
    return res.status(error.message === 'User not found' ? 404 : 400).json({
      success: false,
      message: error.message || 'Failed to update user'
    });
  }
};

/**
 * Delete a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await userService.deleteUser(userId);
    
    return res.status(200).json({
      success: true,
      id: result.id
    });
  } catch (error) {
    console.error('Delete user error:', error);
    
    return res.status(error.message === 'User not found' ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to delete user'
    });
  }
};

/**
 * Update user status (active/inactive)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { active } = req.body;
    
    if (typeof active !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Status must be a boolean value'
      });
    }
    
    const result = await userService.updateUserStatus(userId, active);
    
    return res.status(200).json({
      success: true,
      id: result.id,
      active: result.active
    });
  } catch (error) {
    console.error('Update user status error:', error);
    
    return res.status(error.message === 'User not found' ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to update user status'
    });
  }
};

/**
 * Send password reset email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.sendPasswordReset = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email } = req.body;
    
    const result = await userService.sendPasswordReset(email);
    
    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Send password reset error:', error);
    
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to send password reset'
    });
  }
};

/**
 * Get available departments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDepartments = async (req, res) => {
  try {
    const departments = await userService.getDepartments();
    
    return res.status(200).json({
      success: true,
      departments
    });
  } catch (error) {
    console.error('Get departments error:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve departments'
    });
  }
};

/**
 * Get available user roles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getRoles = async (req, res) => {
  try {
    const roles = await userService.getRoles();
    
    return res.status(200).json({
      success: true,
      roles
    });
  } catch (error) {
    console.error('Get roles error:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve roles'
    });
  }
};