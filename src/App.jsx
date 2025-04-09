import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword'
import SuperAdminDashboard from './components/SuperAdminDashboard'
import UserManagement from './components/UserManagement'
import SuperAdminLayout from './components/SuperAdminLayout'
import DepartmentManagement from './components/DepartmentManagement'
import RoomManagement from './components/RoomManagement'
import ReportsAnalytics from './components/ReportsAnalytics'
import SettingsSemester from './components/SettingsSemester'
import HODDashboard from './components/HODDashboard'
import CourseManagement from './components/CourseManagement'
import HODLayout from './components/HODLayout'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<HODLayout />}>
          <Route path="/hod-dashboard" element={<HODDashboard />} />
          <Route path="/courses" element={<CourseManagement />} />
          <Route path="/faculty" element={<div>Faculty Management</div>} />
          <Route path="/reports" element={<div>Reports</div>} />
          <Route path="/timetable" element={<div>Timetable</div>} />
        </Route>

        <Route path="/" element={<SuperAdminLayout />}>
          <Route path="admin-dashboard" element={<SuperAdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="departments" element={<DepartmentManagement />} />
          <Route path="rooms" element={<RoomManagement />} />
          <Route path="reports" element={<ReportsAnalytics />} />
          <Route path="settings" element={<SettingsSemester />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
