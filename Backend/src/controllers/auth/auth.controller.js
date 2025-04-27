// Backend/src/controllers/auth.controller.js
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { auth, db } = require('../../config/firebase.config');
const authService = require('../../services/auth/auth.service');

// Login controller
exports.login = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Login using the auth service
    const user = await authService.loginUser(email, password);
    
    // Generate JWT token
    const token = jwt.sign(
      { uid: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Return user data and token
    return res.status(200).json({
      success: true,
      user,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    
    return res.status(400).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

// SuperAdmin Registration controller
exports.registerSuperAdmin = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, password, department, secretKey } = req.body;

  try {
    // Validate secret key
    const isValidKey = await authService.validateSecretKey(secretKey);
    
    if (!isValidKey) {
      return res.status(401).json({
        success: false,
        message: 'Invalid secret key'
      });
    }
    
    // Register SuperAdmin user
    const result = await authService.registerSuperAdmin({ 
      name, 
      email, 
      password, 
      department 
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { uid: result.id, email: result.email, role: 'superadmin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Return success response with user data and token
    return res.status(201).json({
      success: true,
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: 'superadmin',
        department: result.department,
        isAuthenticated: true
      },
      token
    });
  } catch (error) {
    console.error('SuperAdmin registration error:', error);
    
    return res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

// Create user controller (for admins to create users)
exports.createUser = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, role, department } = req.body;

  try {
    // Create user using the auth service
    const newUser = await authService.createUser({ 
      name, 
      email, 
      role, 
      department 
    });
    
    // Return success response with new user data
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

// Forgot password controller
exports.forgotPassword = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email } = req.body;

  try {
    // Send password reset email
    const result = await authService.handlePasswordReset(email);
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Password reset email sent'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.error || 'Failed to send password reset email'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to process password reset'
    });
  }
};

// Reset password controller
exports.resetPassword = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { oobCode, password } = req.body;

  try {
    // Complete password reset
    const result = await authService.completePasswordReset(oobCode, password);
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Password has been reset successfully'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.error || 'Failed to reset password'
      });
    }
  } catch (error) {
    console.error('Reset password error:', error);
    
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to reset password'
    });
  }
};

// Get current user controller
exports.getCurrentUser = async (req, res) => {
  // User information is already set in the req object by the auth middleware
  return res.status(200).json({
    success: true,
    user: req.user
  });
};

// Logout controller
exports.logout = (req, res) => {
  // JWT is stateless, so we don't need to do anything on the server
  // The frontend just needs to remove the token
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// Check session controller
exports.checkSession = async (req, res) => {
  try {
    // Get token from headers
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(200).json({ 
        success: false, 
        valid: false,
        message: 'No token provided'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if the user exists in Firebase
      await auth.getUser(decoded.uid);
      
      return res.status(200).json({
        success: true,
        valid: true
      });
    } catch (tokenError) {
      return res.status(200).json({
        success: false,
        valid: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Check session error:', error);
    
    return res.status(500).json({
      success: false,
      valid: false,
      message: 'Server error'
    });
  }
};