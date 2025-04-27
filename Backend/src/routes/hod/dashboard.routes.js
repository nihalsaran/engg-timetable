// Backend/src/routes/hod/dashboard.routes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/hod/dashboard.controller');
const { verifyToken, isHOD } = require('../../middleware/auth.middleware');

// Development route for testing without authentication
if (process.env.NODE_ENV !== 'production') {
  router.get('/dev/all', dashboardController.getAllDashboardData);
}

// Apply auth middleware to all regular routes
router.use(verifyToken);
router.use(isHOD);

// Dashboard metrics routes
router.get('/metrics', dashboardController.getDashboardMetrics);
router.get('/activities', dashboardController.getRecentActivity);
router.post('/activities', dashboardController.logActivity);
router.get('/sidebar', dashboardController.getSidebarItems);

// Get all dashboard data in a single request
router.get('/all', dashboardController.getAllDashboardData);

module.exports = router;