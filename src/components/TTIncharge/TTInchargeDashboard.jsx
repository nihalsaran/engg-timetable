import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiAlertTriangle, 
  FiPlusCircle, 
  FiUpload, 
  FiDownload, 
  FiCheckCircle, 
  FiEdit, 
  FiClock, 
  FiLayers,
  FiGrid,
  FiTool,
  FiFileText,
  FiHome
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function TTInchargeDashboard() {
  const navigate = useNavigate();
  
  // Example timetable status
  const [timetableStatus, setTimetableStatus] = useState('Draft'); // Draft or Published
  const [conflicts, setConflicts] = useState(3); // Number of conflicts detected
  
  // Semester progress calculation
  const startDate = new Date('2025-01-15');
  const endDate = new Date('2025-05-15');
  const currentDate = new Date('2025-04-10'); // Current date
  const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
  const progressPercentage = Math.min(100, Math.round((daysElapsed / totalDays) * 100));
  
  // Card hover animation
  const cardHoverAnimation = {
    rest: { scale: 1, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' },
    hover: { scale: 1.03, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)' }
  };
  
  // Handle navigation to builder
  const navigateToBuilder = () => {
    navigate('/timetable-builder');
  };
  
  // Handle navigation to conflicts
  const navigateToConflicts = () => {
    navigate('/conflicts');
  };

  // Handle navigation to room availability
  const navigateToRoomAvailability = () => {
    navigate('/room-availability');
  };
  
  // Handle publish timetable
  const handlePublishTimetable = () => {
    setTimetableStatus('Published');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Timetable Incharge Dashboard</h1>
      
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Semester Progress */}
        <motion.div 
          className="rounded-2xl p-6 bg-white shadow-md flex items-center space-x-4 overflow-hidden"
          initial="rest"
          whileHover="hover"
          animate="rest"
          variants={cardHoverAnimation}
        >
          <div className="bg-blue-100 p-3 rounded-full">
            <FiCalendar size={24} className="text-blue-600" />
          </div>
          <div className="flex-grow">
            <h2 className="text-lg font-semibold text-gray-700">Current Semester</h2>
            <p className="text-xl font-bold text-blue-600">Spring 2025</p>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="text-xs font-semibold text-gray-500">{progressPercentage}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Week {Math.ceil(daysElapsed / 7)} of {Math.ceil(totalDays / 7)}
            </p>
          </div>
        </motion.div>

        {/* Timetable Status */}
        <motion.div 
          className="rounded-2xl p-6 bg-white shadow-md flex items-center space-x-4"
          initial="rest"
          whileHover="hover"
          animate="rest"
          variants={cardHoverAnimation}
        >
          <div className="bg-purple-100 p-3 rounded-full">
            <FiClock size={24} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Timetable Status</h2>
            <div className="flex items-center">
              <span 
                className={`px-3 py-1 rounded-full text-sm font-bold mt-1 ${
                  timetableStatus === 'Published' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {timetableStatus === 'Published' ? 
                  <span className="flex items-center gap-1">
                    <FiCheckCircle size={16} />
                    Published
                  </span> : 
                  <span className="flex items-center gap-1">
                    <FiEdit size={16} />
                    Draft
                  </span>
                }
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {timetableStatus === 'Published' 
                ? 'Published on April 5, 2025' 
                : 'Last edited 2 hours ago'}
            </p>
          </div>
        </motion.div>

        {/* Conflicts Detected */}
        <motion.div 
          className="rounded-2xl p-6 bg-white shadow-md flex items-center space-x-4"
          initial="rest"
          whileHover="hover"
          animate="rest"
          variants={cardHoverAnimation}
        >
          <div className="bg-amber-100 p-3 rounded-full">
            <FiAlertTriangle size={24} className="text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Conflicts Detected</h2>
            <p className="text-3xl font-bold text-amber-600">{conflicts}</p>
            <p className="text-sm text-gray-500">
              {conflicts === 0 
                ? 'All clear!' 
                : conflicts === 1 
                  ? '1 conflict requires resolution' 
                  : `${conflicts} conflicts require resolution`}
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Widget Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Build Timetable */}
        <motion.div 
          className="rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md hover:shadow-lg cursor-pointer"
          onClick={navigateToBuilder}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FiGrid size={24} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-blue-800">🧩 Build Timetable</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Create and manage your institution's schedule efficiently. Drag and drop interface for easy slot assignments.
          </p>
          <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow hover:shadow-lg transition flex items-center justify-center gap-2 mt-2">
            <FiPlusCircle size={18} />
            <span>Start Building</span>
          </button>
        </motion.div>

        {/* Resolve Conflicts */}
        <motion.div 
          className="rounded-2xl p-6 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md hover:shadow-lg cursor-pointer"
          onClick={navigateToConflicts}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <FiTool size={24} className="text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-amber-800">🛠 Resolve Conflicts</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Identify and resolve scheduling conflicts such as room overlaps, faculty double-bookings, and more.
          </p>
          <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium shadow hover:shadow-lg transition flex items-center justify-center gap-2 mt-2">
            <FiAlertTriangle size={18} />
            <span>View {conflicts} Conflicts</span>
          </button>
        </motion.div>

        {/* Room Availability */}
        <motion.div 
          className="rounded-2xl p-6 bg-gradient-to-br from-teal-50 to-green-50 shadow-md hover:shadow-lg cursor-pointer"
          onClick={navigateToRoomAvailability}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-teal-100 p-3 rounded-full">
              <FiHome size={24} className="text-teal-600" />
            </div>
            <h2 className="text-xl font-semibold text-teal-800">🏠 Room Availability</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Check the availability of rooms for scheduling and ensure optimal utilization of resources.
          </p>
          <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-green-500 text-white font-medium shadow hover:shadow-lg transition flex items-center justify-center gap-2 mt-2">
            <FiHome size={18} />
            <span>Check Availability</span>
          </button>
        </motion.div>

        {/* Export Schedule */}
        <motion.div 
          className="rounded-2xl p-6 bg-gradient-to-br from-green-50 to-teal-50 shadow-md hover:shadow-lg cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FiFileText size={24} className="text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-green-800">📄 Export Schedule</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Download and share the timetable in various formats including PDF, Excel, or publish it directly to the portal.
          </p>
          <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium shadow hover:shadow-lg transition flex items-center justify-center gap-2 mt-2">
            <FiDownload size={18} />
            <span>Export Options</span>
          </button>
        </motion.div>
      </div>
      
      {/* CTA Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <motion.button 
          onClick={navigateToBuilder}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 
                   text-white font-semibold shadow-lg flex items-center gap-2"
        >
          <FiPlusCircle size={20} />
          <span>➕ Create New Timetable</span>
        </motion.button>
        
        {timetableStatus === 'Draft' && (
          <motion.button 
            onClick={handlePublishTimetable}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-teal-600 
                     text-white font-semibold shadow-lg flex items-center gap-2"
          >
            <FiUpload size={20} />
            <span>📤 Publish Timetable</span>
          </motion.button>
        )}
      </div>
      
      {/* Recent Updates Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Updates</h2>
          <button className="text-sm text-indigo-600 hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
              <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-indigo-500' : idx === 1 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
              <div className="flex-1">
                <p className="text-gray-800">
                  {idx === 0 
                    ? 'Room B201 scheduling conflict resolved' 
                    : idx === 1 
                      ? 'Faculty workload balancing completed' 
                      : 'New course CS480 added to timetable'
                  }
                </p>
                <p className="text-xs text-gray-500">
                  {idx === 0 ? '30 minutes ago' : idx === 1 ? '2 hours ago' : 'Yesterday'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}