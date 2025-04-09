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

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/hod-dashboard" element={<HODDashboard />} />

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
