import React, { useState, useEffect } from 'react';
import { FiUsers, FiCalendar, FiAlertTriangle } from 'react-icons/fi';
import { BsBuilding } from 'react-icons/bs';
import SuperAdminDashboardService from './services/SuperAdminDashboard';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Import logger if you have a centralized logging service
// import logger from '../../services/logger';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalDepartments: 0,
    activeSemesters: 0,
    conflictsToday: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [semesterProgress, setSemesterProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departmentData, setDepartmentData] = useState([]);
  const [roomUtilization, setRoomUtilization] = useState([]);
  
  useEffect(() => {
    // Fetch all dashboard data
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Initially set metrics from sync function to show something right away
        setMetrics(SuperAdminDashboardService.getDashboardMetrics());
        
        // Log page view for analytics - no need to await or handle errors for logging
        SuperAdminDashboardService.logActivityToBackend(
          'PageView', 
          'SuperAdmin viewed the dashboard'
        ).catch(err => console.log('Failed to log activity', err));
        
        try {
          // Attempt to fetch all data in a single request for better performance
          const allData = await SuperAdminDashboardService.fetchDashboardStats().catch(() => ({}));
          
          // Update state with the actual metrics, fallback to 0 if any value is missing
          setMetrics({
            totalUsers: allData.totalUsers || 0,
            totalDepartments: allData.totalDepartments || 0,
            activeSemesters: allData.activeSemesters || 0,
            conflictsToday: allData.conflictsToday || 0
          });
          
          // Use Promise.allSettled instead of Promise.all to prevent one failure from failing all
          const results = await Promise.allSettled([
            SuperAdminDashboardService.getRecentActivity(),
            SuperAdminDashboardService.getSemesterProgress(),
            SuperAdminDashboardService.getDepartmentDistribution(),
            SuperAdminDashboardService.getRoomUtilization()
          ]);
          
          // Handle each result individually so we can use data from successful promises
          if (results[0].status === 'fulfilled' && Array.isArray(results[0].value)) {
            setRecentActivity(results[0].value);
          }
          
          if (results[1].status === 'fulfilled' && Array.isArray(results[1].value)) {
            setSemesterProgress(results[1].value);
          }
          
          if (results[2].status === 'fulfilled' && Array.isArray(results[2].value)) {
            setDepartmentData(results[2].value);
          }
          
          if (results[3].status === 'fulfilled' && Array.isArray(results[3].value)) {
            setRoomUtilization(results[3].value);
          }
          
        } catch (err) {
          console.error("Error loading dashboard data:", err);
          // Show a toast notification for the error
          toast.error("Failed to load some dashboard data. Please try refreshing.");
          
          // Set fallback data for sections that might have failed
          // Each service method now has built-in fallback data
          const activities = await SuperAdminDashboardService.getRecentActivity().catch(() => []);
          const progress = await SuperAdminDashboardService.getSemesterProgress().catch(() => []);
          const departments = await SuperAdminDashboardService.getDepartmentDistribution().catch(() => []);
          const rooms = await SuperAdminDashboardService.getRoomUtilization().catch(() => []);
          
          // Only set state if we got valid array data back
          if (Array.isArray(activities) && activities.length) setRecentActivity(activities);
          if (Array.isArray(progress) && progress.length) setSemesterProgress(progress);
          if (Array.isArray(departments) && departments.length) setDepartmentData(departments);
          if (Array.isArray(rooms) && rooms.length) setRoomUtilization(rooms);
          
          setError("Some dashboard data could not be loaded. Please try refreshing the page.");
        }
      } catch (err) {
        console.error("Fatal error loading dashboard:", err);
        setError("Failed to load dashboard data. Please try again later.");
        // Log error for monitoring
        // logger.error("Dashboard load failure", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  // Event handlers
  const handleAddNewUser = () => {
    try {
      // Navigate to User Management page
      navigate('/admin/users');
      
      // Log the action without awaiting to avoid UI delay
      SuperAdminDashboardService.logActivityToBackend(
        'Navigation', 
        'SuperAdmin navigated to Add User page'
      );
      
      // Show success toast
      toast.success("Navigating to User Management");
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Navigation failed. Please try again.");
    }
  };
  
  const handleGenerateReport = () => {
    try {
      // Navigate to Reports & Analytics page
      navigate('/admin/reports');
      
      // Log the action without awaiting to avoid UI delay
      SuperAdminDashboardService.logActivityToBackend(
        'Navigation', 
        'SuperAdmin navigated to Reports & Analytics page'
      );
      
      // Show success toast
      toast.success("Generating reports...");
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Failed to navigate to Reports. Please try again.");
    }
  };
  
  const handleManageSemester = () => {
    try {
      // Navigate to Settings & Semester page
      navigate('/admin/settings');
      
      // Log the action without awaiting to avoid UI delay
      SuperAdminDashboardService.logActivityToBackend(
        'Navigation', 
        'SuperAdmin navigated to Semester Management page'
      );
      
      // Show success toast
      toast.success("Opening semester management");
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Navigation failed. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center">
          <div className="p-3 bg-blue-100 rounded-full mr-4">
            <FiUsers className="text-blue-600 text-2xl" />
          </div>
          <div>
            <h2 className="text-sm text-gray-500 font-medium">Total Users</h2>
            <p className="text-2xl font-bold">
              {isLoading ? (
                <span className="inline-block w-12 h-6 bg-gray-200 animate-pulse rounded"></span>
              ) : (
                metrics.totalUsers
              )}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center">
          <div className="p-3 bg-purple-100 rounded-full mr-4">
            <BsBuilding className="text-purple-600 text-2xl" />
          </div>
          <div>
            <h2 className="text-sm text-gray-500 font-medium">Total Departments</h2>
            <p className="text-2xl font-bold">
              {isLoading ? (
                <span className="inline-block w-12 h-6 bg-gray-200 animate-pulse rounded"></span>
              ) : (
                metrics.totalDepartments
              )}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center">
          <div className="p-3 bg-teal-100 rounded-full mr-4">
            <FiCalendar className="text-teal-600 text-2xl" />
          </div>
          <div>
            <h2 className="text-sm text-gray-500 font-medium">Active Semesters</h2>
            <p className="text-2xl font-bold">
              {isLoading ? (
                <span className="inline-block w-12 h-6 bg-gray-200 animate-pulse rounded"></span>
              ) : (
                metrics.activeSemesters
              )}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center">
          <div className="p-3 bg-red-100 rounded-full mr-4">
            <FiAlertTriangle className="text-red-600 text-2xl" />
          </div>
          <div>
            <h2 className="text-sm text-gray-500 font-medium">Conflicts Today</h2>
            <p className="text-2xl font-bold">
              {isLoading ? (
                <span className="inline-block w-12 h-6 bg-gray-200 animate-pulse rounded"></span>
              ) : (
                metrics.conflictsToday
              )}
            </p>
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
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center border-b border-gray-100 pb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse mr-3"></div>
                  <div className="flex-1">
                    <p className="w-24 h-4 bg-gray-200 animate-pulse rounded mb-2"></p>
                    <p className="w-32 h-3 bg-gray-200 animate-pulse rounded"></p>
                  </div>
                  <span className="w-10 h-3 bg-gray-200 animate-pulse rounded"></span>
                </div>
              ))}
            </div>
          ) : (
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
          )}
        </div>

        {/* Semester Progress Widget */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Semester Progress Overview</h2>
            <button className="text-blue-600 text-sm">Details</button>
          </div>
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="w-20 h-4 bg-gray-200 animate-pulse rounded"></span>
                    <span className="w-8 h-4 bg-gray-200 animate-pulse rounded"></span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5"></div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span className="w-16 h-3 bg-gray-200 animate-pulse rounded"></span>
                    <span className="w-16 h-3 bg-gray-200 animate-pulse rounded"></span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* Call-to-Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <button 
          onClick={handleAddNewUser}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-semibold hover:opacity-90 transition flex items-center gap-2"
          disabled={isLoading}
        >
          <span>➕</span> Add New User
        </button>
        <button 
          onClick={handleGenerateReport}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition flex items-center gap-2"
          disabled={isLoading}
        >
          <span>📊</span> Generate Report
        </button>
        <button 
          onClick={handleManageSemester}
          className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
          disabled={isLoading}
        >
          <span>⚙️</span> Manage Semester
        </button>
      </div>
    </div>
  );
}
