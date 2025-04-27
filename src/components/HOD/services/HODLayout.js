import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../Auth/services/Login';

export const useHODLayout = (user, setUser) => {
  const [activeSidebarItem, setActiveSidebarItem] = useState('Dashboard');
  const [semesterDropdownOpen, setSemesterDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState('Semester 7');
  const navigate = useNavigate();
  const location = useLocation();
  
  // List of available semesters
  const availableSemesters = [
    'Semester 7',
    'Semester 6',
    'Semester 5',
    'Semester 4'
  ];
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const closeDropdowns = (e) => {
      if (!e.target.closest('.semester-dropdown')) {
        setSemesterDropdownOpen(false);
      }
      if (!e.target.closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', closeDropdowns);
    return () => document.removeEventListener('mousedown', closeDropdowns);
  }, []);
  
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
  
  // Set active item based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/hod/dashboard')) {
      setActiveSidebarItem('Dashboard');
    } else if (path.includes('/hod/courses')) {
      setActiveSidebarItem('Courses');
    } else if (path.includes('/hod/assign-faculty')) {
      setActiveSidebarItem('Assign-Course');
    } else if (path.includes('/hod/reports')) {
      setActiveSidebarItem('Reports');
    } else if (path.includes('/hod/timetable')) {
      setActiveSidebarItem('Timetable');
    }
  }, [location]);
  
  const sidebarItems = [
    { label: 'Dashboard', icon: 'FiGrid', path: '/hod/dashboard' },
    { label: 'Courses', icon: 'FiBook', path: '/hod/courses' },
    { label: 'Assign-Course', icon: 'FiUsers', path: '/hod/assign-faculty' },
    { label: 'Reports', icon: 'FiFileText', path: '/hod/reports' },
    { label: 'Timetable', icon: 'FiCalendar', path: '/hod/timetable' },
  ];

  const handleNavigation = (path, label) => {
    setActiveSidebarItem(label);
    navigate(path);
  };
  
  const toggleSemesterDropdown = () => {
    setSemesterDropdownOpen(!semesterDropdownOpen);
  };
  
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };
  
  const selectSemester = (semester) => {
    setSelectedSemester(semester);
    setSemesterDropdownOpen(false);
  };

  return {
    activeSidebarItem,
    semesterDropdownOpen,
    profileDropdownOpen,
    selectedSemester,
    availableSemesters,
    sidebarItems,
    handleNavigation,
    handleLogout,
    toggleSemesterDropdown,
    toggleProfileDropdown,
    selectSemester
  };
};