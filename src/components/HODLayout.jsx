// filepath: /Users/nihalsarandasduggirala/Downloads/engg-timetable/src/components/HODLayout.jsx
import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiBook, FiUsers, FiFileText, FiCalendar, FiBell, FiSearch, FiChevronDown } from 'react-icons/fi';

export default function HODLayout() {
  const [activeSidebarItem, setActiveSidebarItem] = useState('Dashboard');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Set active item based on current path
  React.useEffect(() => {
    const path = location.pathname;
    if (path.includes('hod-dashboard')) {
      setActiveSidebarItem('Dashboard');
    } else if (path.includes('courses')) {
      setActiveSidebarItem('Courses');
    } else if (path.includes('faculty')) {
      setActiveSidebarItem('Faculty');
    } else if (path.includes('reports')) {
      setActiveSidebarItem('Reports');
    } else if (path.includes('timetable')) {
      setActiveSidebarItem('Timetable');
    }
  }, [location]);
  
  const sidebarItems = [
    { label: 'Dashboard', icon: <FiGrid size={18} />, path: '/hod-dashboard' },
    { label: 'Courses', icon: <FiBook size={18} />, path: '/courses' },
    { label: 'Faculty', icon: <FiUsers size={18} />, path: '/faculty' },
    { label: 'Reports', icon: <FiFileText size={18} />, path: '/reports' },
    { label: 'Timetable', icon: <FiCalendar size={18} />, path: '/timetable' },
  ];

  const handleNavigation = (path, label) => {
    setActiveSidebarItem(label);
    navigate(path);
  };

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
              onClick={() => handleNavigation(item.path, item.label)}
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

        {/* Main content area */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}