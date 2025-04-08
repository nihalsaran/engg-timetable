import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword'
import AdminDashboard from './components/AdminDashboard/AdminDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/hod-dashboard" element={<div className="p-8">HOD Dashboard (Coming Soon)</div>} />
        <Route path="/incharge-dashboard" element={<div className="p-8">Timetable Incharge Dashboard (Coming Soon)</div>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
