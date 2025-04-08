import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<div className="p-8">Admin Dashboard (Coming Soon)</div>} />
        <Route path="/hod-dashboard" element={<div className="p-8">HOD Dashboard (Coming Soon)</div>} />
        <Route path="/incharge-dashboard" element={<div className="p-8">Timetable Incharge Dashboard (Coming Soon)</div>} />
        <Route path="/forgot-password" element={<div className="p-8">Password Reset (Coming Soon)</div>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
