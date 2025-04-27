// Backend/src/routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/dashboard/dashboard.controller');
const authMiddleware = require('../../middleware/auth.middleware');

// Protect all dashboard routes - require authentication
router.use(authMiddleware.verifyToken);

// Get all dashboard data in a single request (for better performance)
router.get('/all', dashboardController.getAllDashboardData);

// Individual endpoints for specific data
router.get('/metrics', dashboardController.getDashboardMetrics);
router.get('/activity', dashboardController.getRecentActivity);
router.get('/semester-progress', dashboardController.getSemesterProgress);
router.get('/department-distribution', dashboardController.getDepartmentDistribution);
router.get('/room-utilization', dashboardController.getRoomUtilization);

// Log new activity
router.post('/activity', dashboardController.logActivity);

module.exports = router;