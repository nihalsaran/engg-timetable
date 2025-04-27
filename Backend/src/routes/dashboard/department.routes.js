// Backend/src/routes/dashboard/department.routes.js
const express = require('express');
const { body } = require('express-validator');
const departmentController = require('../../controllers/dashboard/department.controller');
const { verifyToken, isSuperAdmin, isHOD } = require('../../middleware/auth.middleware');

const router = express.Router();

// Authentication middleware for all department routes
router.use(verifyToken);

// Get all departments - accessible by SuperAdmin, HOD, and TTIncharge
router.get('/', departmentController.getAllDepartments);

// Get department by ID - accessible by SuperAdmin, HOD, and TTIncharge
router.get('/:departmentId', departmentController.getDepartmentById);

// Create new department - restricted to SuperAdmin
router.post(
  '/',
  [
    isSuperAdmin,
    // Validation middleware
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('type').isString().trim().notEmpty().withMessage('Type is required'),
    body('hod').optional().isString().trim(),
    body('description').optional().isString().trim(),
    body('status').optional().isString().isIn(['Active', 'Inactive']).withMessage('Status must be either "Active" or "Inactive"')
  ],
  departmentController.createDepartment
);

// Update department - restricted to SuperAdmin
router.put(
  '/:departmentId',
  [
    isSuperAdmin,
    // Validation middleware
    body('name').optional().isString().trim().notEmpty().withMessage('Name cannot be empty'),
    body('type').optional().isString().trim().notEmpty().withMessage('Type cannot be empty'),
    body('hod').optional().isString().trim(),
    body('description').optional().isString().trim(),
    body('status').optional().isString().isIn(['Active', 'Inactive']).withMessage('Status must be either "Active" or "Inactive"')
  ],
  departmentController.updateDepartment
);

// Delete department - restricted to SuperAdmin
router.delete('/:departmentId', isSuperAdmin, departmentController.deleteDepartment);

// Update department status (active/inactive) - restricted to SuperAdmin
router.patch(
  '/:departmentId/status',
  [
    isSuperAdmin,
    body('status').isString().trim().isIn(['Active', 'Inactive']).withMessage('Status must be either "Active" or "Inactive"')
  ],
  departmentController.updateDepartmentStatus
);

// Search departments - accessible by SuperAdmin, HOD, and TTIncharge
router.get('/search/query', departmentController.searchDepartments);

// Get department types - accessible by SuperAdmin, HOD, and TTIncharge
router.get('/data/types', departmentController.getDepartmentTypes);

// Get HOD options - accessible by SuperAdmin, HOD, and TTIncharge
router.get('/data/hod-options', departmentController.getHODOptions);

module.exports = router;