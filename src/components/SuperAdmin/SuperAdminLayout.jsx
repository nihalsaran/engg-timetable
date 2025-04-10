import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiMenu, FiBell, FiSearch, FiUser, FiUsers, FiGrid, FiLayers, FiHome, FiFileText, FiSettings } from 'react-icons/fi';

const navItems = [
  { label: 'Dashboard', icon: <FiGrid />, path: '/admin-dashboard' },
  { label: 'Users', icon: <FiUsers />, path: '/users' },
  { label: 'Departments', icon: <FiLayers />, path: '/departments' },
  { label: 'Rooms', icon: <FiHome />, path: '/rooms' },
  { label: 'Reports', icon: <FiFileText />, path: '/superadmin-reports' },
  { label: 'Settings', icon: <FiSettings />, path: '/settings' },
];

export default function SuperAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <aside className={`transition-all duration-300 ${sidebarOpen ? 'w-56' : 'w-20'} bg-white shadow-xl flex flex-col rounded-tr-3xl rounded-br-3xl`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className={`font-bold text-lg transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Admin</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FiMenu size={20} />
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition ${isActive ? 'bg-indigo-100 text-indigo-600 font-semibold' : 'hover:bg-indigo-50 text-gray-700'}`}
              >
                {item.icon}
                <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between bg-white shadow p-4 rounded-bl-3xl">
          <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full">
            <FiSearch />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none w-32 md:w-64"
            />
          </div>
          <div className="flex items-center gap-4">
            <FiBell size={20} className="cursor-pointer" />
            <div className="relative">
              <button className="flex items-center gap-2">
                <img src="https://via.placeholder.com/30" alt="avatar" className="rounded-full" />
                <span className="hidden md:block">Profile</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
