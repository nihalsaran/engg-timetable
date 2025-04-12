import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Auth/Login'
import ForgotPassword from './components/Auth/ForgotPassword'
import SuperAdminDashboard from './components/SuperAdmin/SuperAdminDashboard'
import UserManagement from './components/SuperAdmin/UserManagement'
import TeacherManagement from './components/SuperAdmin/TeacherManagement'
import SuperAdminLayout from './components/SuperAdmin/SuperAdminLayout'
import DepartmentManagement from './components/SuperAdmin/DepartmentManagement'
import RoomManagement from './components/SuperAdmin/RoomManagement'
import ReportsAnalytics from './components/SuperAdmin/ReportsAnalytics'
import SettingsSemester from './components/SuperAdmin/SettingsSemester'
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* HOD Routes with /hod/* path prefix */}
        <Route path="/hod/*" element={<HODLayout />}>
          <Route path="dashboard" element={<HODDashboard />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="assign-faculty" element={<FacultyAssignment />} />
          <Route path="reports" element={<FacultyLoadReports/>} />
          <Route path="timetable" element={<TimetableViewer />} />
        </Route>

        {/* TT Incharge Routes with /tt/* path prefix */}
        <Route path="/tt/*" element={<TTInchargeLayout />}>
          <Route path="dashboard" element={<TTInchargeDashboard />} />
          <Route path="timetable-builder" element={<TimetableBuilder/> } />
          <Route path="conflicts" element={<Conflicts />} />
          <Route path="rooms" element={<RoomAvailability />} />
          <Route path="room-availability" element={<RoomAvailability />} />
          <Route path="faculty-timetable" element={<FacultyTimetable />} />
        </Route>

        {/* SuperAdmin Routes with /admin/* path prefix */}
        <Route path="/admin/*" element={<SuperAdminLayout />}>
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="faculty" element={<TeacherManagement />} />
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
