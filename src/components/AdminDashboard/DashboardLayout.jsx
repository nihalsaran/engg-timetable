import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  BellAlertIcon,
  BuildingOfficeIcon,
  DocumentChartBarIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Department Management', href: '/departments', icon: BuildingOfficeIcon },
  { name: 'User Management', href: '/user-management', icon: UserGroupIcon },
  { name: 'System Configuration', href: '/system-configuration', icon: Cog6ToothIcon },
  { name: 'Reports & Analytics', href: '/reports', icon: DocumentChartBarIcon },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Backdrop for mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-indigo-700 dark:bg-gray-800 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-all duration-300 ease-in-out`}
        initial={false}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-indigo-800 dark:bg-gray-900">
          <span className="text-xl font-semibold text-white">Admin Panel</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200 transition-colors group cursor-pointer"
          >
            <XMarkIcon className="w-6 h-6 group-hover:hidden" />
            <Bars3Icon className="w-6 h-6 hidden group-hover:inline" />
          </button>
        </div>
        
        <nav className="mt-4 space-y-1 px-2">
          {navigation.map((item) => (
            <motion.a
              key={item.name}
              href={item.href}
              className="flex items-center px-4 py-3 text-white hover:bg-indigo-600 dark:hover:bg-gray-700 rounded-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </motion.a>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* Top Navigation */}
        <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-600 dark:text-gray-200 transition-colors group cursor-pointer"
            >
              <Bars3Icon className="w-6 h-6 group-hover:hidden" />
              <XMarkIcon className="w-6 h-6 hidden group-hover:inline" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {darkMode ? 'Dark' : 'Light'}
                </span>
                <Switch
                  checked={darkMode}
                  onChange={setDarkMode}
                  className={`${
                    darkMode ? 'bg-indigo-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span className="sr-only">Toggle dark mode</span>
                  <span
                    className={`${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out`}
                  />
                </Switch>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-500 hover:text-gray-600 dark:text-gray-200 transition-colors"
              >
                <BellAlertIcon className="w-6 h-6" />
              </motion.button>
              
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-700"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User avatar"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}