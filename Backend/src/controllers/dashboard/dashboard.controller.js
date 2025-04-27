// Backend/src/controllers/dashboard.controller.js
const dashboardService = require('../../services/dashboard/dashboard.service');

/**
 * Get dashboard metrics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with dashboard metrics
 */
exports.getDashboardMetrics = async (req, res) => {
  try {
    const metrics = await dashboardService.getDashboardMetrics();
    
    return res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard metrics'
    });
  }
};

/**
 * Get recent activity
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with recent activity data
 */
exports.getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const activities = await dashboardService.getRecentActivity(limit);
    
    return res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch recent activity'
    });
  }
};

/**
 * Get semester progress
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with semester progress data
 */
exports.getSemesterProgress = async (req, res) => {
  try {
    const progress = await dashboardService.getSemesterProgress();
    
    return res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error fetching semester progress:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch semester progress'
    });
  }
};

/**
 * Get department distribution
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with department distribution data
 */
exports.getDepartmentDistribution = async (req, res) => {
  try {
    const distribution = await dashboardService.getDepartmentDistribution();
    
    return res.status(200).json({
      success: true,
      data: distribution
    });
  } catch (error) {
    console.error('Error fetching department distribution:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch department distribution'
    });
  }
};

/**
 * Get room utilization
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response with room utilization data
 */
exports.getRoomUtilization = async (req, res) => {
  try {
    const utilization = await dashboardService.getRoomUtilization();
    
    return res.status(200).json({
      success: true,
      data: utilization
    });
  } catch (error) {
    console.error('Error fetching room utilization:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch room utilization'
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
    // Fetch all data in parallel for better performance
    const [
      metrics,
      recentActivity,
      semesterProgress,
      departmentDistribution,
      roomUtilization
    ] = await Promise.all([
      dashboardService.getDashboardMetrics(),
      dashboardService.getRecentActivity(5),
      dashboardService.getSemesterProgress(),
      dashboardService.getDepartmentDistribution(),
      dashboardService.getRoomUtilization()
    ]);
    
    return res.status(200).json({
      success: true,
      data: {
        metrics,
        recentActivity,
        semesterProgress,
        departmentDistribution,
        roomUtilization
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard data'
    });
  }
};

/**
 * Log a new activity
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response indicating success or failure
 */
exports.logActivity = async (req, res) => {
  try {
    const { action, details } = req.body;
    
    if (!action || !details) {
      return res.status(400).json({
        success: false,
        message: 'Action and details are required'
      });
    }
    
    // Get user info from authenticated request
    const userId = req.user?.id || 'system';
    const userName = req.user?.name || 'System';
    
    const activity = await dashboardService.logActivity(
      userId,
      userName,
      action,
      details
    );
    
    return res.status(201).json({
      success: true,
      message: 'Activity logged successfully',
      data: activity
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to log activity'
    });
  }
};