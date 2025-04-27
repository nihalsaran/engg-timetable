// Sample data for faculty workload
export const facultyWorkloadData = [
  { name: 'CSE', workload: 25, semester: 'Semester 7', faculty: 'Senior Professors' },
  { name: 'ECE', workload: 20, semester: 'Semester 6', faculty: 'Associate Professors' },
  { name: 'MECH', workload: 18, semester: 'Semester 5', faculty: 'Assistant Professors' },
  { name: 'CIVIL', workload: 15, semester: 'Semester 7', faculty: 'Visiting Faculty' },
  { name: 'IT', workload: 22, semester: 'Semester 6', faculty: 'Senior Professors' },
];

// Sample data for room utilization
export const roomUtilizationData = [
  { name: 'Occupied', value: 65, department: 'CSE', semester: 'Semester 7' },
  { name: 'Available', value: 35, department: 'All Departments', semester: 'All Semesters' },
];

// Sample data for timetable conflicts (weekly trend)
export const conflictsData = [
  { day: 'Mon', conflicts: 4, department: 'CSE', semester: 'Semester 7', faculty: 'Senior Professors' },
  { day: 'Tue', conflicts: 7, department: 'ECE', semester: 'Semester 6', faculty: 'Associate Professors' },
  { day: 'Wed', conflicts: 2, department: 'MECH', semester: 'Semester 5', faculty: 'Assistant Professors' },
  { day: 'Thu', conflicts: 5, department: 'CIVIL', semester: 'Semester 7', faculty: 'Visiting Faculty' },
  { day: 'Fri', conflicts: 3, department: 'IT', semester: 'Semester 6', faculty: 'Senior Professors' },
  { day: 'Sat', conflicts: 1, department: 'CSE', semester: 'Semester 5', faculty: 'Assistant Professors' },
];

// Colors for charts
export const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'];

// Filter options
export const semesters = ['All Semesters', 'Semester 7', 'Semester 6', 'Semester 5'];
export const departments = ['All Departments', 'CSE', 'ECE', 'MECH', 'CIVIL', 'IT'];
export const faculties = ['All Faculty', 'Senior Professors', 'Associate Professors', 'Assistant Professors', 'Visiting Faculty'];

/**
 * Get initial chart data
 * @returns {Object} Initial chart data for all charts
 */
export const getInitialChartData = () => {
  return {
    facultyWorkload: [...facultyWorkloadData],
    roomUtilization: [...roomUtilizationData],
    conflicts: [...conflictsData]
  };
};

/**
 * Sort faculty workload data based on order
 * @param {Array} data - Faculty workload data to sort
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted faculty workload data
 */
export const sortFacultyWorkload = (data, order) => {
  return [...data].sort((a, b) => {
    return order === 'asc' 
      ? a.workload - b.workload 
      : b.workload - a.workload;
  });
};

/**
 * Filter chart data based on selected filters
 * @param {Object} currentData - Current chart data
 * @param {string} semester - Selected semester
 * @param {string} department - Selected department
 * @param {string} facultyType - Selected faculty type
 * @returns {Object} Filtered chart data
 */
export const filterChartData = (currentData, semester, department, facultyType) => {
  // Helper function to filter array based on criteria
  const filterArray = (array, criteriaFn) => {
    return array.filter(criteriaFn);
  };

  // Filter faculty workload data
  const filteredFacultyWorkload = filterArray(facultyWorkloadData, item => {
    const semesterMatch = semester === 'All Semesters' || item.semester === semester;
    const departmentMatch = department === 'All Departments' || item.name === department;
    const facultyMatch = facultyType === 'All Faculty' || item.faculty === facultyType;
    return semesterMatch && departmentMatch && facultyMatch;
  });

  // If no data matches the filter, return the original data with reduced values
  const processedFacultyWorkload = filteredFacultyWorkload.length > 0 
    ? filteredFacultyWorkload 
    : facultyWorkloadData.map(item => ({...item, workload: Math.floor(item.workload / 2)}));

  // Filter room utilization data
  // For room utilization, we'll adjust the values based on filters
  let occupiedPercentage = 65; // Default
  let availablePercentage = 35; // Default
  
  // Adjust based on department
  if (department !== 'All Departments') {
    // Different departments have different utilization rates
    const rates = {
      'CSE': [75, 25],
      'ECE': [60, 40],
      'MECH': [50, 50],
      'CIVIL': [40, 60],
      'IT': [70, 30]
    };
    [occupiedPercentage, availablePercentage] = rates[department] || [65, 35];
  }
  
  // Adjust based on semester
  if (semester !== 'All Semesters') {
    // Different semesters have different adjustments
    const adjustments = {
      'Semester 7': 5,
      'Semester 6': -5,
      'Semester 5': 0
    };
    
    const adjustment = adjustments[semester] || 0;
    occupiedPercentage = Math.min(95, Math.max(5, occupiedPercentage + adjustment));
    availablePercentage = 100 - occupiedPercentage;
  }
  
  const filteredRoomUtilization = [
    { name: 'Occupied', value: occupiedPercentage, department, semester },
    { name: 'Available', value: availablePercentage, department, semester }
  ];
  
  // Filter conflicts data
  const filteredConflicts = filterArray(conflictsData, item => {
    const semesterMatch = semester === 'All Semesters' || item.semester === semester;
    const departmentMatch = department === 'All Departments' || item.department === department;
    const facultyMatch = facultyType === 'All Faculty' || item.faculty === facultyType;
    return semesterMatch && departmentMatch && facultyMatch;
  });
  
  // If no conflicts match the filter, generate some sample data based on the filter
  const processedConflicts = filteredConflicts.length > 0 
    ? filteredConflicts 
    : [
        { day: 'Mon', conflicts: Math.floor(Math.random() * 5) },
        { day: 'Tue', conflicts: Math.floor(Math.random() * 5) },
        { day: 'Wed', conflicts: Math.floor(Math.random() * 5) },
        { day: 'Thu', conflicts: Math.floor(Math.random() * 5) },
        { day: 'Fri', conflicts: Math.floor(Math.random() * 5) },
        { day: 'Sat', conflicts: Math.floor(Math.random() * 3) }
      ];
  
  return {
    facultyWorkload: processedFacultyWorkload,
    roomUtilization: filteredRoomUtilization,
    conflicts: processedConflicts
  };
};

/**
 * Export report as PDF
 */
export const exportAsPDF = () => {
  console.log('Exporting report as PDF...');
  // Implementation would go here
};

/**
 * Download report as Excel
 */
export const downloadExcel = () => {
  console.log('Downloading report as Excel...');
  // Implementation would go here
};

/**
 * Share report with others
 */
export const shareReport = () => {
  console.log('Sharing report...');
  // Implementation would go here
};

// Export all functions as a service object
const ReportsAnalyticsService = {
  getInitialChartData,
  sortFacultyWorkload,
  filterChartData,
  exportAsPDF,
  downloadExcel,
  shareReport
};

export default ReportsAnalyticsService;