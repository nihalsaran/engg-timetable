import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { FiMenu, FiBell, FiSearch, FiUser, FiUsers, FiGrid, FiLayers, FiHome, FiFileText, FiSettings, FiBookOpen, FiLogOut, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { logoutUser } from '../Auth/services/Login';
import { AuthContext } from '../../App';

const navItems = [
  { label: 'Dashboard', icon: <FiGrid />, path: '/admin/dashboard' },
  { label: 'Users', icon: <FiUsers />, path: '/admin/users' },
  { label: 'Faculty', icon: <FiBookOpen />, path: '/admin/faculty' },
  { label: 'Departments', icon: <FiLayers />, path: '/admin/departments' },
  { label: 'Rooms', icon: <FiHome />, path: '/admin/rooms' },
  { label: 'Reports', icon: <FiFileText />, path: '/admin/reports' },
  { label: 'Settings', icon: <FiSettings />, path: '/admin/settings' },
];

export default function SuperAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  
  // Set active nav item based on current path
  const [activeNavItem, setActiveNavItem] = useState('Dashboard');
  
  useEffect(() => {
    const path = location.pathname;
    const activeItem = navItems.find(item => path.startsWith(item.path));
    if (activeItem) {
      setActiveNavItem(activeItem.label);
    }
  }, [location.pathname]);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      // Update auth context
      setUser(null);
      // Redirect to login page after successful logout
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // Show error message to user
      alert('Logout failed. Please try again.');
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', closeDropdown);
    return () => document.removeEventListener('mousedown', closeDropdown);
  }, []);

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
            const isActive = activeNavItem === item.label;
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
            <div className="relative profile-dropdown">
              <button 
                className="flex items-center gap-2"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <img src="https://via.placeholder.com/30" alt="avatar" className="rounded-full" />
                <span className="hidden md:block">{user?.name || 'Profile'}</span>
                {profileDropdownOpen ? 
                  <FiChevronUp className="text-gray-500" /> : 
                  <FiChevronDown className="text-gray-500" />
                }
              </button>
              
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                    >
                      <FiLogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
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
