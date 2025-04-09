import React, { useState } from 'react';
import { FiGrid, FiBook, FiUsers, FiFileText, FiCalendar, FiBell, FiSearch, FiChevronDown } from 'react-icons/fi';

export default function HODDashboard() {
  const [activeSidebarItem, setActiveSidebarItem] = useState('Dashboard');
  
  const sidebarItems = [
    { label: 'Dashboard', icon: <FiGrid size={18} /> },
    { label: 'Courses', icon: <FiBook size={18} /> },
    { label: 'Faculty', icon: <FiUsers size={18} /> },
    { label: 'Reports', icon: <FiFileText size={18} /> },
    { label: 'Timetable', icon: <FiCalendar size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left sidebar */}
      <aside className="w-20 lg:w-64 bg-gradient-to-b from-teal-800 to-blue-900 text-white flex flex-col transition-all duration-300">
        <div className="flex items-center justify-center h-16 border-b border-teal-700">
          <h1 className="font-bold text-lg hidden lg:block">HOD Portal</h1>
          <span className="block lg:hidden font-bold text-xl">H</span>
        </div>
        <nav className="flex-1 p-3">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveSidebarItem(item.label)}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-left mb-2 transition
                ${activeSidebarItem === item.label 
                  ? 'bg-white/10 font-semibold' 
                  : 'hover:bg-white/5'}`}
            >
              <div>{item.icon}</div>
              <span className="hidden lg:block">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white shadow flex items-center justify-between p-4">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-800">Computer Science Department</h2>
            <div className="ml-4 flex items-center border rounded-lg px-3 py-1 cursor-pointer hover:bg-gray-50">
              <span className="text-gray-600 mr-1">Spring 2025</span>
              <FiChevronDown className="text-gray-500" />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-48"
              />
            </div>
            <div className="relative">
              <FiBell size={20} className="text-gray-500 cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src="https://via.placeholder.com/40"
                alt="Profile"
                className="rounded-full h-10 w-10 object-cover border-2 border-teal-500"
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium">Dr. Sarah Johnson</p>
                <p className="text-xs text-gray-500">HOD, Computer Science</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main area */}
        <main className="flex-1 p-6 space-y-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl p-6 bg-white shadow-md hover:shadow-xl transition flex items-center space-x-4">
              <div className="bg-teal-100 p-3 rounded-full">
                <FiUsers size={24} className="text-teal-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Faculty Assigned</h2>
                <p className="text-3xl font-bold text-teal-600">15</p>
                <p className="text-sm text-gray-500">3 new this week</p>
              </div>
            </div>
            
            <div className="rounded-2xl p-6 bg-white shadow-md hover:shadow-xl transition flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FiBook size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Total Courses</h2>
                <p className="text-3xl font-bold text-blue-600">12</p>
                <p className="text-sm text-gray-500">2 pending approval</p>
              </div>
            </div>
            
            <div className="rounded-2xl p-6 bg-white shadow-md hover:shadow-xl transition flex items-center space-x-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <FiCalendar size={24} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Timetable Status</h2>
                <p className="text-xl font-bold text-indigo-600">In Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="px-6 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold hover:opacity-90 transition shadow-lg flex items-center justify-center gap-3 group">
                <span className="text-2xl group-hover:scale-110 transition">📘</span>
                <span>Assign Faculty</span>
              </button>
              
              <button className="px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold hover:opacity-90 transition shadow-lg flex items-center justify-center gap-3 group">
                <span className="text-2xl group-hover:scale-110 transition">🗂</span>
                <span>View Timetable</span>
              </button>
              
              <button className="px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold hover:opacity-90 transition shadow-lg flex items-center justify-center gap-3 group">
                <span className="text-2xl group-hover:scale-110 transition">➕</span>
                <span>Add Course</span>
              </button>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
              <button className="text-sm text-teal-600 hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-teal-500' : idx === 1 ? 'bg-blue-500' : 'bg-indigo-500'}`}></div>
                  <div className="flex-1">
                    <p className="text-gray-800">{idx === 0 ? 'Dr. Alex Johnson assigned to CS301' : idx === 1 ? 'New course CS405 added' : 'Timetable draft updated'}</p>
                    <p className="text-xs text-gray-500">{idx === 0 ? '2 hours ago' : idx === 1 ? 'Yesterday' : '2 days ago'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
