// Backend/src/routes/teacher.routes.js
const express = require('express');
const { body } = require('express-validator');
const teacherController = require('../../controllers/superadmin-dashboard/teacher.controller');
const { verifyToken, isSuperAdmin, isHOD } = require('../../middleware/auth.middleware');

const router = express.Router();

// Authentication middleware for all teacher routes
router.use(verifyToken);

// Get all teachers - accessible by SuperAdmin, HOD, and TTIncharge
router.get('/', teacherController.getTeachers);

// Get teacher by ID - accessible by SuperAdmin, HOD, and TTIncharge
router.get('/:teacherId', teacherController.getTeacherById);

// Create new teacher - restricted to SuperAdmin and HOD
router.post(
  '/',
  [
    isSuperAdmin,
    // Validation middleware
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('department').isString().trim().notEmpty().withMessage('Department is required'),
    body('expertise').optional().isArray().withMessage('Expertise must be an array'),
    body('qualification').optional().isString().trim(),
    body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number'),
    body('active').optional().isBoolean().withMessage('Active status must be a boolean')
  ],
  teacherController.createTeacher
);

// Update teacher - restricted to SuperAdmin and HOD
router.put(
  '/:teacherId',
  [
    isSuperAdmin,
    // Validation middleware
    body('name').optional().isString().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('department').optional().isString().trim().notEmpty().withMessage('Department cannot be empty'),
    body('expertise').optional().isArray().withMessage('Expertise must be an array'),
    body('qualification').optional().isString().trim(),
    body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number'),
    body('active').optional().isBoolean().withMessage('Active status must be a boolean')
  ],
  teacherController.updateTeacher
);

// Delete teacher - restricted to SuperAdmin
router.delete('/:teacherId', isSuperAdmin, teacherController.deleteTeacher);

// Update teacher status (active/inactive) - restricted to SuperAdmin
router.patch(
  '/:teacherId/status',
  [
    isSuperAdmin,
    body('active').isBoolean().withMessage('Active status must be a boolean')
  ],
  teacherController.updateTeacherStatus
);

// Import teachers in bulk - restricted to SuperAdmin
router.post('/import', isSuperAdmin, teacherController.importTeachers);

// Get subject areas - accessible by SuperAdmin, HOD, and TTIncharge
router.get('/data/subject-areas', teacherController.getSubjectAreas);

// Get departments - accessible by SuperAdmin, HOD, and TTIncharge
router.get('/data/departments', teacherController.getDepartments);

// Get example dataset for import - accessible by SuperAdmin
router.get('/data/example-dataset', isSuperAdmin, teacherController.getExampleDataset);

module.exports = router;