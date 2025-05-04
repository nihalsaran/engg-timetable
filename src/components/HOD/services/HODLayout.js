import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../Auth/services/Login';
import { FiGrid, FiBook, FiUsers, FiFileText, FiCalendar } from 'react-icons/fi';
import { db, collection, query, getDocs, where } from '../../../firebase/config.js';
import { 
  getActiveSemester, 
  getAllSemesters, 
  getDefaultSemesters,
  storeSelectedSemester,
  getSelectedSemesterFromStorage 
} from '../../../services/SemesterService.js';

export const useHODLayout = (user, setUser) => {
  const [activeSidebarItem, setActiveSidebarItem] = useState('Dashboard');
  const [semesterDropdownOpen, setSemesterDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Load semesters from centralized service
  useEffect(() => {
    const loadSemesters = async () => {
      try {
        setLoading(true);
        
        // Check if we have a previously selected semester in localStorage
        const storedSemester = getSelectedSemesterFromStorage();
        
        // Get all semesters from Firebase
        const semestersData = await getAllSemesters();
        
        if (semestersData.length > 0) {
          // Extract semester names from data
          const semesterNames = semestersData.map(sem => sem.name);
          setAvailableSemesters(semesterNames);
          
          // Try to use the stored semester if it exists and is valid
          if (storedSemester && semesterNames.includes(storedSemester)) {
            setSelectedSemester(storedSemester);
          } else {
            // Otherwise use the active semester
            const activeSem = semestersData.find(sem => sem.status === 'active');
            if (activeSem) {
              setSelectedSemester(activeSem.name);
              storeSelectedSemester(activeSem.name);
            } else {
              // Fallback to the first semester in the list
              setSelectedSemester(semesterNames[0]);
              storeSelectedSemester(semesterNames[0]);
            }
          }
        } else {
          // Fallback to default semesters if none found in database
          const defaultSemesters = getDefaultSemesters();
          setAvailableSemesters(defaultSemesters);
          setSelectedSemester(defaultSemesters[0]);
          storeSelectedSemester(defaultSemesters[0]);
        }
      } catch (error) {
        console.error('Error loading semesters:', error);
        // Fallback to defaults on error
        const defaultSemesters = getDefaultSemesters();
        setAvailableSemesters(defaultSemesters);
        setSelectedSemester(defaultSemesters[0]);
        storeSelectedSemester(defaultSemesters[0]);
      } finally {
        setLoading(false);
      }
    };
    
    loadSemesters();
  }, []);
  
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
    { label: 'Dashboard', icon: FiGrid, iconSize: 18, path: '/hod/dashboard' },
    { label: 'Courses', icon: FiBook, iconSize: 18, path: '/hod/courses' },
    { label: 'Assign-Course', icon: FiUsers, iconSize: 18, path: '/hod/assign-faculty' },
    { label: 'Reports', icon: FiFileText, iconSize: 18, path: '/hod/reports' },
    { label: 'Timetable', icon: FiCalendar, iconSize: 18, path: '/hod/timetable' },
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
    
    // Store selected semester in local storage to persist across page refreshes
    storeSelectedSemester(semester);
  };

  return {
    activeSidebarItem,
    semesterDropdownOpen,
    profileDropdownOpen,
    selectedSemester,
    availableSemesters,
    sidebarItems,
    loading,
    handleNavigation,
    handleLogout,
    toggleSemesterDropdown,
    toggleProfileDropdown,
    selectSemester
  };
};