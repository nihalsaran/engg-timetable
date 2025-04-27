// Backend/src/controllers/hod/dashboard.controller.js
const dashboardService = require('../../services/hod/dashboard.service');

// Default department ID for development/testing when no authenticated user is found
const DEV_DEPARTMENT_ID = 'dev-department-123';

/**
 * Get dashboard metrics for HOD
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with dashboard metrics
 */
exports.getDashboardMetrics = async (req, res) => {
  try {
    // Get departmentId from the authenticated user or use development fallback
    const departmentId = req.user?.departmentId || DEV_DEPARTMENT_ID;
    
    const metrics = await dashboardService.getDashboardMetrics(departmentId);
    
    return res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error fetching HOD dashboard metrics:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard metrics'
    });
  }
};

/**
 * Get recent activity for HOD dashboard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with recent activity data
 */
exports.getRecentActivity = async (req, res) => {
  try {
    // Get departmentId from the authenticated user or use development fallback
    const departmentId = req.user?.departmentId || DEV_DEPARTMENT_ID;
    
    const limit = parseInt(req.query.limit) || 5;
    const activities = await dashboardService.getRecentActivity(departmentId, limit);
    
    return res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error fetching HOD recent activity:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch recent activity'
    });
  }
};

/**
 * Log a new activity in the HOD department
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response indicating success or failure
 */
exports.logActivity = async (req, res) => {
  try {
    const { type, details } = req.body;
    
    if (!details) {
      return res.status(400).json({
        success: false,
        message: 'Activity details are required'
      });
    }
    
    // Get user and department info from authenticated request or use defaults for testing
    const departmentId = req.user?.departmentId || DEV_DEPARTMENT_ID;
    const userId = req.user?.id || 'system';
    const userName = req.user?.name || 'System';
    
    const activity = await dashboardService.logActivity(
      departmentId,
      userId,
      userName,
      type,
      details
    );
    
    return res.status(201).json({
      success: true,
      message: 'Activity logged successfully',
      data: activity
    });
  } catch (error) {
    console.error('Error logging HOD activity:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to log activity'
    });
  }
};

/**
 * Get sidebar navigation items for HOD dashboard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with sidebar items
 */
exports.getSidebarItems = async (req, res) => {
  try {
    const sidebarItems = await dashboardService.getSidebarItems();
    
    return res.status(200).json({
      success: true,
      data: sidebarItems
    });
  } catch (error) {
    console.error('Error fetching sidebar items:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch sidebar items'
    });
  }
};

/**
 * Get all dashboard data in a single request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with all dashboard data
 */
exports.getAllDashboardData = async (req, res) => {
  try {
    // Get departmentId from the authenticated user or use development fallback
    const departmentId = req.user?.departmentId || DEV_DEPARTMENT_ID;
    
    // Fetch all data in parallel for better performance
    const [
      metrics,
      recentActivity,
      sidebarItems
    ] = await Promise.all([
      dashboardService.getDashboardMetrics(departmentId),
      dashboardService.getRecentActivity(departmentId, 5),
      dashboardService.getSidebarItems()
    ]);
    
    return res.status(200).json({
      success: true,
      data: {
        metrics,
        recentActivity,
        sidebarItems
      }
    });
  } catch (error) {
    console.error('Error fetching HOD dashboard data:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard data'
    });
  }
};