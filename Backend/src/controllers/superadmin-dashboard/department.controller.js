// Backend/src/controllers/dashboard/department.controller.js
const { validationResult } = require('express-validator');
const departmentService = require('../../services/dashboard/department.service');

/**
 * Get all departments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await departmentService.getAllDepartments();
    
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
 * Get department by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDepartmentById = async (req, res) => {
  try {
    const { departmentId } = req.params;
    
    const department = await departmentService.getDepartmentById(departmentId);
    
    return res.status(200).json({
      success: true,
      department
    });
  } catch (error) {
    console.error('Get department error:', error);
    
    return res.status(error.message === 'Department not found' ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to retrieve department'
    });
  }
};

/**
 * Create a new department
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createDepartment = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const departmentData = req.body;
    
    const newDepartment = await departmentService.createDepartment(departmentData);
    
    return res.status(201).json({
      success: true,
      department: newDepartment
    });
  } catch (error) {
    console.error('Create department error:', error);
    
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to create department'
    });
  }
};

/**
 * Update a department
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateDepartment = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { departmentId } = req.params;
    const departmentData = req.body;
    
    const updatedDepartment = await departmentService.updateDepartment(departmentId, departmentData);
    
    return res.status(200).json({
      success: true,
      department: updatedDepartment
    });
  } catch (error) {
    console.error('Update department error:', error);
    
    return res.status(error.message === 'Department not found' ? 404 : 400).json({
      success: false,
      message: error.message || 'Failed to update department'
    });
  }
};

/**
 * Delete a department
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    
    const result = await departmentService.deleteDepartment(departmentId);
    
    return res.status(200).json({
      success: true,
      id: result.id
    });
  } catch (error) {
    console.error('Delete department error:', error);
    
    return res.status(error.message === 'Department not found' ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to delete department'
    });
  }
};

/**
 * Update department status (active/inactive)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateDepartmentStatus = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { status } = req.body;
    
    if (status !== 'Active' && status !== 'Inactive') {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "Active" or "Inactive"'
      });
    }
    
    const result = await departmentService.updateDepartmentStatus(departmentId, status);
    
    return res.status(200).json({
      success: true,
      id: result.id,
      status: result.status
    });
  } catch (error) {
    console.error('Update department status error:', error);
    
    return res.status(error.message === 'Department not found' ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to update department status'
    });
  }
};

/**
 * Search departments by name
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.searchDepartments = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    
    const departments = await departmentService.searchDepartments(searchTerm);
    
    return res.status(200).json({
      success: true,
      departments
    });
  } catch (error) {
    console.error('Search departments error:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to search departments'
    });
  }
};

/**
 * Get available department types
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDepartmentTypes = async (req, res) => {
  try {
    const types = await departmentService.getDepartmentTypes();
    
    return res.status(200).json({
      success: true,
      types
    });
  } catch (error) {
    console.error('Get department types error:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve department types'
    });
  }
};

/**
 * Get HOD options for department assignment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getHODOptions = async (req, res) => {
  try {
    const hodOptions = await departmentService.getHODOptions();
    
    return res.status(200).json({
      success: true,
      hodOptions
    });
  } catch (error) {
    console.error('Get HOD options error:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve HOD options'
    });
  }
};