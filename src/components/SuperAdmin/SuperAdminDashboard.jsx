import React, { useState, useEffect } from 'react';
import { FiUsers, FiCalendar, FiAlertTriangle } from 'react-icons/fi';
import { BsBuilding } from 'react-icons/bs';
import { 
  getDashboardMetrics, 
  getRecentActivity, 
  getSemesterProgress,
  addNewUser,
  generateReport,
  manageSemester
} from './services/SuperAdminDashboard';

export default function SuperAdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalDepartments: 0,
    activeSemesters: 0,
    conflictsToday: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [semesterProgress, setSemesterProgress] = useState([]);
  
  useEffect(() => {
    // Fetch dashboard data
    setMetrics(getDashboardMetrics());
    setRecentActivity(getRecentActivity());
    setSemesterProgress(getSemesterProgress());
  }, []);

  // Event handlers
  const handleAddNewUser = () => addNewUser();
  const handleGenerateReport = () => generateReport();
  const handleManageSemester = () => manageSemester();

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center">
          <div className="p-3 bg-blue-100 rounded-full mr-4">
            <FiUsers className="text-blue-600 text-2xl" />
          </div>
          <div>
            <h2 className="text-sm text-gray-500 font-medium">Total Users</h2>
            <p className="text-2xl font-bold">{metrics.totalUsers}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center">
          <div className="p-3 bg-purple-100 rounded-full mr-4">
            <BsBuilding className="text-purple-600 text-2xl" />
          </div>
          <div>
            <h2 className="text-sm text-gray-500 font-medium">Total Departments</h2>
            <p className="text-2xl font-bold">{metrics.totalDepartments}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center">
          <div className="p-3 bg-teal-100 rounded-full mr-4">
            <FiCalendar className="text-teal-600 text-2xl" />
          </div>
          <div>
            <h2 className="text-sm text-gray-500 font-medium">Active Semesters</h2>
            <p className="text-2xl font-bold">{metrics.activeSemesters}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center">
          <div className="p-3 bg-red-100 rounded-full mr-4">
            <FiAlertTriangle className="text-red-600 text-2xl" />
          </div>
          <div>
            <h2 className="text-sm text-gray-500 font-medium">Conflicts Today</h2>
            <p className="text-2xl font-bold">{metrics.conflictsToday}</p>
          </div>
        </div>
      </div>

      {/* Widgets Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent User Activity Widget */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Recent User Activity</h2>
            <button className="text-blue-600 text-sm">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center border-b border-gray-100 pb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-300 to-teal-300 flex items-center justify-center text-white font-medium mr-3">
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.user}</p>
                  <p className="text-gray-600 text-sm">{activity.action}</p>
                </div>
                <span className="text-gray-400 text-xs">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Semester Progress Widget */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Semester Progress Overview</h2>
            <button className="text-blue-600 text-sm">Details</button>
          </div>
          <div className="space-y-6">
            {semesterProgress.map((semester) => (
              <div key={semester.id}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{semester.name}</span>
                  <span className="text-gray-500 text-sm">{semester.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-teal-500 h-2.5 rounded-full" 
                    style={{ width: `${semester.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{semester.startDate}</span>
                  <span>{semester.endDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call-to-Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <button 
          onClick={handleAddNewUser}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-semibold hover:opacity-90 transition flex items-center gap-2">
          <span>➕</span> Add New User
        </button>
        <button 
          onClick={handleGenerateReport}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition flex items-center gap-2">
          <span>📊</span> Generate Report
        </button>
        <button 
          onClick={handleManageSemester}
          className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
          <span>⚙️</span> Manage Semester
        </button>
      </div>
    </div>
  );
}
