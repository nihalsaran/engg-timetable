import { FiGrid, FiBook, FiUsers, FiFileText, FiCalendar } from 'react-icons/fi';

/**
 * Returns the sidebar navigation items for HOD dashboard
 * @returns {Array} Array of sidebar items with label, icon and path
 */
export const getSidebarItems = () => {
  return [
    { label: 'Dashboard', icon: FiGrid, iconSize: 18, path: '/hod-dashboard' },
    { label: 'Courses', icon: FiBook, iconSize: 18, path: '/courses' },
    { label: 'Faculty', icon: FiUsers, iconSize: 18, path: '/faculty' },
    { label: 'Reports', icon: FiFileText, iconSize: 18, path: '/reports' },
    { label: 'Timetable', icon: FiCalendar, iconSize: 18, path: '/timetable' },
  ];
};

/**
 * Returns the metrics data for the dashboard
 * @returns {Object} Object containing faculty, courses and timetable metrics
 */
export const getDashboardMetrics = () => {
  return {
    faculty: {
      total: 15,
      newThisWeek: 3,
    },
    courses: {
      total: 12,
      pendingApproval: 2,
    },
    timetable: {
      status: 'In Progress',
      completionPercentage: 70,
    },
  };
};

/**
 * Returns recent activity data for the dashboard
 * @returns {Array} Array of recent activities with type, description and time
 */
export const getRecentActivities = () => {
  return [
    {
      type: 'faculty',
      description: 'Dr. Alex Johnson assigned to CS301',
      timeAgo: '2 hours ago',
      colorClass: 'bg-teal-500',
    },
    {
      type: 'course',
      description: 'New course CS405 added',
      timeAgo: 'Yesterday',
      colorClass: 'bg-blue-500',
    },
    {
      type: 'timetable',
      description: 'Timetable draft updated',
      timeAgo: '2 days ago',
      colorClass: 'bg-indigo-500',
    },
  ];
};

/**
 * Navigation handler for sidebar items
 * @param {Object} navigate - React Router useNavigate hook
 * @param {string} path - Path to navigate to
 * @param {string} label - Label of the sidebar item
 * @param {Function} setActiveSidebarItem - State setter for active sidebar item
 */
export const handleSidebarNavigation = (navigate, path, label, setActiveSidebarItem) => {
  setActiveSidebarItem(label);
  navigate(path);
};