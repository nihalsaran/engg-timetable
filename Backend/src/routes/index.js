// Backend/src/routes/index.js
const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth/auth.routes');
const dashboardRoutes = require('./superadmin-dashboard/dashboard.routes');
const departmentRoutes = require('./superadmin-dashboard/department.routes');
const teacherRoutes = require('./superadmin-dashboard/teacher.routes');
const roomRoutes = require('./superadmin-dashboard/room.routes');
const userRoutes = require('./superadmin-dashboard/user.routes');
const hodDashboardRoutes = require('./hod/dashboard.routes');

// Register routes
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/departments', departmentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/rooms', roomRoutes);
router.use('/users', userRoutes);
router.use('/hod/dashboard', hodDashboardRoutes);

module.exports = router;
