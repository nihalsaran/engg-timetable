import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword'
import AdminDashboard from './components/AdminDashboard/AdminDashboard'
import DepartmentManagement from './components/DepartmentManagement/DepartmentManagement'
import HODDashboard from './components/AdminDashboard/HODDashboard'
import DepartmentTimetableOverview from './components/AdminDashboard/DepartmentTimetableOverview'
import FacultyWorkloadManagement from './components/AdminDashboard/FacultyWorkloadManagement'
import CourseAssignment from './components/AdminDashboard/CourseAssignment'

const UserManagement = lazy(() => import('./components/UserManagement/UserManagement.jsx'))
const SystemConfiguration = lazy(() => import('./components/AdminDashboard/SystemConfiguration.jsx'))
const ReportsDashboard = lazy(() => import('./components/AdminDashboard/ReportsDashboard.jsx'))

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="p-6 space-y-4">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-1/2"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
      </div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/hod-dashboard" element={<HODDashboard />} />
          <Route path="/incharge-dashboard" element={<div className="p-8">Timetable Incharge Dashboard (Coming Soon)</div>} />
          <Route path="/departments" element={<DepartmentManagement />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/system-configuration" element={<Suspense fallback={<div className="p-6 space-y-4">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-1/2"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          </div>}><SystemConfiguration /></Suspense>} />
          <Route path="/reports" element={<ReportsDashboard />} />
          <Route path="/department-timetable" element={<DepartmentTimetableOverview />} />
          <Route path="/faculty-workload" element={<FacultyWorkloadManagement />} />
          <Route path="/course-assignment" element={<CourseAssignment />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
