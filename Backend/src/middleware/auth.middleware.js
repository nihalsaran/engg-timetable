// Backend/src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const { auth, db } = require('../config/firebase.config');

// Middleware to verify JWT token
exports.verifyToken = async (req, res, next) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token provided'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify if the user exists in Firebase
    const user = await auth.getUser(decoded.uid);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token - user not found'
      });
    }
    
    // Get user profile data
    const userProfile = await db.collection('profiles').doc(user.uid).get();
    
    // Save the user information in the request object
    req.user = {
      id: user.uid,
      email: user.email,
      name: user.displayName || '',
      role: userProfile.exists ? userProfile.data().role : 'faculty',
      isAuthenticated: true
    };
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid authentication token'
    });
  }
};

// Middleware to check if user is a SuperAdmin
exports.isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required'
    });
  }
  
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied: requires SuperAdmin privileges'
    });
  }
  
  next();
};

// Middleware to check if user is a HOD
exports.isHOD = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required'
    });
  }
  
  if (req.user.role !== 'hod' && req.user.role !== 'superadmin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied: requires HOD privileges'
    });
  }
  
  next();
};

// Middleware to check if user is a Timetable Incharge
exports.isTTIncharge = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required'
    });
  }
  
  if (req.user.role !== 'tt_incharge' && req.user.role !== 'superadmin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied: requires Timetable Incharge privileges'
    });
  }
  
  next();
};