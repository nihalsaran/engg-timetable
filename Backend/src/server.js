// Backend/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Import routes - updated to use new folder structure
const authRoutes = require('./routes/auth/auth.routes');
const dashboardRoutes = require('./routes/superadmin-dashboard/dashboard.routes');
const departmentRoutes = require('./routes/superadmin-dashboard/department.routes');
const userRoutes = require('./routes/superadmin-dashboard/user.routes');
const teacherRoutes = require('./routes/superadmin-dashboard/teacher.routes');
const roomRoutes = require('./routes/superadmin-dashboard/room.routes');

// Initialize Express
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Your frontend URL
  credentials: true // Allow cookies
})); 
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/rooms', roomRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Engineering Timetable API Server',
    status: 'Running'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;