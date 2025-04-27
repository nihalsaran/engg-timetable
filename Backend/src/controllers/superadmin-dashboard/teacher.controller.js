// Backend/src/controllers/teacher.controller.js
const { validationResult } = require('express-validator');
const teacherService = require('../../services/superadmin-dashboard/teacher.service');

/**
 * Get all teachers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await teacherService.getTeachers();
    
    return res.status(200).json({
      success: true,
      teachers
    });
  } catch (error) {
    console.error('Get teachers error:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve teachers'
    });
  }
};

/**
 * Get teacher by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getTeacherById = async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    const teacher = await teacherService.getTeacherById(teacherId);
    
    return res.status(200).json({
      success: true,
      teacher
    });
  } catch (error) {
    console.error('Get teacher error:', error);
    
    return res.status(error.message === 'Teacher not found' ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to retrieve teacher'
    });
  }
};

/**
 * Create a new teacher
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createTeacher = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const teacherData = req.body;
    
    const newTeacher = await teacherService.createTeacher(teacherData);
    
    return res.status(201).json({
      success: true,
      teacher: newTeacher
    });
  } catch (error) {
    console.error('Create teacher error:', error);
    
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to create teacher'
    });
  }
};

/**
 * Update a teacher
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateTeacher = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { teacherId } = req.params;
    const teacherData = req.body;
    
    const updatedTeacher = await teacherService.updateTeacher(teacherId, teacherData);
    
    return res.status(200).json({
      success: true,
      teacher: updatedTeacher
    });
  } catch (error) {
    console.error('Update teacher error:', error);
    
    return res.status(error.message === 'Teacher not found' ? 404 : 400).json({
      success: false,
      message: error.message || 'Failed to update teacher'
    });
  }
};

/**
 * Delete a teacher
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    const result = await teacherService.deleteTeacher(teacherId);
    
    return res.status(200).json({
      success: true,
      id: result.id
    });
  } catch (error) {
    console.error('Delete teacher error:', error);
    
    return res.status(error.message === 'Teacher not found' ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to delete teacher'
    });
  }
};

/**
 * Update teacher status (active/inactive)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateTeacherStatus = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { active } = req.body;
    
    if (typeof active !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Status must be a boolean value'
      });
    }
    
    const result = await teacherService.updateTeacherStatus(teacherId, active);
    
    return res.status(200).json({
      success: true,
      id: result.id,
      active: result.active
    });
  } catch (error) {
    console.error('Update teacher status error:', error);
    
    return res.status(error.message === 'Teacher not found' ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to update teacher status'
    });
  }
};

/**
 * Process faculty import
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.importTeachers = async (req, res) => {
  try {
    const teachersData = req.body;
    
    const result = await teacherService.processFacultyImport(teachersData);
    
    return res.status(200).json({
      success: true,
      results: result.results
    });
  } catch (error) {
    console.error('Import teachers error:', error);
    
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to import teachers'
    });
  }
};

/**
 * Get available subject areas
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getSubjectAreas = async (req, res) => {
  try {
    const subjectAreas = await teacherService.getSubjectAreas();
    
    return res.status(200).json({
      success: true,
      subjectAreas
    });
  } catch (error) {
    console.error('Get subject areas error:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve subject areas'
    });
  }
};

/**
 * Get available department options
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDepartments = async (req, res) => {
  try {
    const departments = await teacherService.getDepartments();
    
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
 * Get example JSON dataset for teacher import
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getExampleDataset = async (req, res) => {
  try {
    const exampleData = teacherService.getExampleJSONDataset();
    
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