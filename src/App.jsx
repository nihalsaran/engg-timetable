import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect, createContext, useContext } from 'react'
import Login from './components/Auth/Login'
import ForgotPassword from './components/Auth/ForgotPassword'
import SuperAdminRegistration from './components/Auth/SuperAdminRegistration'
// Import SuperAdmin components
import SuperAdminDashboard from './components/SuperAdmin/SuperAdminDashboard'
import UserManagement from './components/SuperAdmin/UserManagement'
import TeacherManagement from './components/SuperAdmin/TeacherManagement'
import SuperAdminLayout from './components/SuperAdmin/SuperAdminLayout'
import DepartmentManagement from './components/SuperAdmin/DepartmentManagement'
import RoomManagement from './components/SuperAdmin/RoomManagement'
import ReportsAnalytics from './components/SuperAdmin/ReportsAnalytics'
import SettingsSemester from './components/SuperAdmin/SettingsSemester'
// Import HOD components
import HODDashboard from './components/HOD/HODDashboard'
import CourseManagement from './components/HOD/CourseManagement'
import HODLayout from './components/HOD/HODLayout'
import FacultyAssignment from './components/HOD/FacultyAssignment'
import TimetableViewer from './components/HOD/TimetableViewer'
import FacultyLoadReports from './components/HOD/FacultyLoadReports'
// Import TT Incharge components
import TTInchargeLayout from './components/TTIncharge/TTInchargeLayout'
import TTInchargeDashboard from './components/TTIncharge/TTInchargeDashboard'
import TimetableBuilder from './components/TTIncharge/TimetableBuilder'
import Conflicts from './components/TTIncharge/Conflicts'
import RoomAvailability from './components/TTIncharge/RoomAvailability'
import FacultyTimetable from './components/TTIncharge/FacultyTimetable'
// Import authentication functions
import { getCurrentUser, checkSession, isAuthenticated } from './components/Auth/services/Login'

// Create Authentication Context
export const AuthContext = createContext(null);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const { user, loading, sessionChecked } = useContext(AuthContext);

  // Wait for both loading to complete and session check before making any decisions
  if (loading || !sessionChecked) {
    return <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>;
  }
  
  // Not logged in - save the location they were trying to access
  if (!user) {
    // Use replace here to avoid adding the redirect to the browser history
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if allowedRoles are specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case 'superadmin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'hod':
        return <Navigate to="/hod/dashboard" replace />;
      case 'tt_incharge':
        return <Navigate to="/tt/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // User is authenticated and authorized
  return children;
};

// Helper function to get default path for a role
export const getRoleDefaultPath = (role) => {
  switch(role) {
    case 'superadmin':
      return '/admin/dashboard';
    case 'hod':
      return '/hod/dashboard';
    case 'tt_incharge':
      return '/tt/dashboard';
    default:
      return '/login';
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setLoading(true);
        
        // First check if we have a token
        if (!isAuthenticated()) {
          setUser(null);
          setLoading(false);
          setSessionChecked(true);
          return;
        }
        
        // Then verify if the session is valid
        const isValid = await checkSession();
        
        if (isValid) {
          // Get user data if session is valid
          const userData = await getCurrentUser();
          setUser(userData);
        } else {
          // Clear user data if session is invalid
          setUser(null);
        }
      } catch (error) {
        console.error("Authentication verification failed:", error);
        // Clear any invalid auth data
        setUser(null);
      } finally {
        setLoading(false);
        setSessionChecked(true);
      }
    };
    
    verifyAuth();
  }, []);

  // Handle network-related auth issues
  useEffect(() => {
    const handleOnline = async () => {
      // When coming back online, verify auth state if user was previously logged in
      if (isAuthenticated()) {
        try {
          const isValid = await checkSession();
          if (!isValid && user) {
            // Session expired while offline
            setUser(null);
          }
        } catch (error) {
          console.error("Network reconnection auth check failed:", error);
        }
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, sessionChecked }}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/super-admin-registration" element={<SuperAdminRegistration />} />

          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* HOD Routes with /hod/* path prefix */}
          <Route 
            path="/hod/*" 
            element={
              <ProtectedRoute allowedRoles={['hod']}>
                <HODLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<HODDashboard />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="assign-faculty" element={<FacultyAssignment />} />
            <Route path="reports" element={<FacultyLoadReports/>} />
            <Route path="timetable" element={<TimetableViewer />} />
          </Route>

          {/* TT Incharge Routes with /tt/* path prefix */}
          <Route 
            path="/tt/*" 
            element={
              <ProtectedRoute allowedRoles={['tt_incharge']}>
                <TTInchargeLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<TTInchargeDashboard />} />
            <Route path="timetable-builder" element={<TimetableBuilder/> } />
            <Route path="conflicts" element={<Conflicts />} />
            <Route path="rooms" element={<RoomAvailability />} />
            <Route path="room-availability" element={<RoomAvailability />} />
            <Route path="faculty-timetable" element={<FacultyTimetable />} />
          </Route>

          {/* SuperAdmin Routes with /admin/* path prefix */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="faculty" element={<TeacherManagement />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="rooms" element={<RoomManagement />} />
            <Route path="reports" element={<ReportsAnalytics />} />
            <Route path="settings" element={<SettingsSemester />} />
          </Route>
          
          {/* Catch-all route for invalid paths */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
