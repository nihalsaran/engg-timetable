// Backend/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Login route
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], authController.login);

// Register route (only for SuperAdmin registration)
router.post('/register/super-admin', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters')
    .isLength({ min: 6 }),
  check('department', 'Department is required').not().isEmpty(),
  check('secretKey', 'Secret key is required').not().isEmpty()
], authController.registerSuperAdmin);

// Create user route (for admin to create users)
router.post('/users', 
  authMiddleware.verifyToken,
  authMiddleware.isSuperAdmin,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('role', 'Role is required').isIn(['superadmin', 'hod', 'tt_incharge']),
    check('department', 'Department is required').not().isEmpty()
  ], 
  authController.createUser
);

// Forgot password route
router.post('/forgot-password', [
  check('email', 'Please include a valid email').isEmail()
], authController.forgotPassword);

// Reset password route
router.post('/reset-password', [
  check('oobCode', 'Password reset code is required').not().isEmpty(),
  check('password', 'Please enter a password with 6 or more characters')
    .isLength({ min: 6 })
], authController.resetPassword);

// Get current user profile
router.get('/me', authMiddleware.verifyToken, authController.getCurrentUser);

// Logout route
router.post('/logout', authController.logout);

// Check token validity
router.get('/check-session', authController.checkSession);

module.exports = router;