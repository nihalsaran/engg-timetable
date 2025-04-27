// Mock data for faculty and courses
export const dummySemesters = ['Semester 7', 'Semester 6', 'Semester 5', 'Semester 4'];

export const dummyCourses = [
  { id: 1, code: 'CS101', title: 'Introduction to Computer Science', semester: 'Semester 6', weeklyHours: '3L+1T', faculty: 1, tags: ['programming', 'introductory'] },
  { id: 2, code: 'CS202', title: 'Data Structures and Algorithms', semester: 'Semester 7', weeklyHours: '3L+2P', faculty: 1, tags: ['algorithms', 'data structures'] },
  { id: 3, code: 'CS303', title: 'Database Systems', semester: 'Semester 6', weeklyHours: '3L+1T+2P', faculty: 7, tags: ['databases', 'SQL'] },
  { id: 4, code: 'CS405', title: 'Artificial Intelligence', semester: 'Semester 7', weeklyHours: '4L+2P', faculty: 4, tags: ['AI', 'machine learning'] },
  { id: 5, code: 'CS301', title: 'Software Engineering', semester: 'Semester 6', weeklyHours: '3L+1T', faculty: 3, tags: ['software', 'project management'] },
  { id: 6, code: 'CS210', title: 'Computer Networks', semester: 'Semester 7', weeklyHours: '3L+1T+1P', faculty: 5, tags: ['networking', 'protocols'] },
  { id: 7, code: 'CS450', title: 'Cloud Computing', semester: 'Semester 7', weeklyHours: '3L+2P', faculty: 7, tags: ['cloud', 'distributed systems'] },
  { id: 8, code: 'CS320', title: 'Web Development', semester: 'Semester 6', weeklyHours: '2L+3P', faculty: 6, tags: ['web', 'javascript', 'html'] },
  { id: 9, code: 'CS410', title: 'Machine Learning', semester: 'Semester 7', weeklyHours: '3L+2P', faculty: 4, tags: ['ML', 'statistics'] },
  { id: 10, code: 'CS250', title: 'Computer Architecture', semester: 'Semester 6', weeklyHours: '4L+1T', faculty: 2, tags: ['hardware', 'systems'] },
  { id: 11, code: 'CS350', title: 'Operating Systems', semester: 'Semester 7', weeklyHours: '3L+2P', faculty: 2, tags: ['OS', 'systems'] },
  { id: 12, code: 'CS430', title: 'Cybersecurity', semester: 'Semester 6', weeklyHours: '3L+1T+1P', faculty: 5, tags: ['security', 'cryptography'] },
  { id: 13, code: 'CS222', title: 'Advanced Programming', semester: 'Semester 7', weeklyHours: '2L+3P', faculty: 6, tags: ['programming', 'advanced'] },
  { id: 14, code: 'CS401', title: 'Project Management', semester: 'Semester 6', weeklyHours: '2L+2T', faculty: 3, tags: ['project management', 'software'] },
];

export const dummyFaculty = [
  { 
    id: 1, 
    name: 'Dr. Alex Johnson', 
    avatar: 'https://i.pravatar.cc/150?img=11', 
    department: 'Computer Science',
    status: 'available', 
    loadHours: 9,
    maxHours: 18,
    expertise: ['programming', 'algorithms', 'theory'],
    assignedCourses: [1, 2]
  },
  { 
    id: 2, 
    name: 'Dr. Sarah Miller', 
    avatar: 'https://i.pravatar.cc/150?img=5', 
    department: 'Computer Science',
    status: 'nearlyFull', 
    loadHours: 15,
    maxHours: 18,
    expertise: ['databases', 'data mining', 'systems'],
    assignedCourses: [10, 11]
  },
  { 
    id: 3, 
    name: 'Prof. Robert Chen', 
    avatar: 'https://i.pravatar.cc/150?img=12', 
    department: 'Computer Science',
    status: 'available', 
    loadHours: 10,
    maxHours: 20,
    expertise: ['software engineering', 'project management'],
    assignedCourses: [5, 14]
  },
  { 
    id: 4, 
    name: 'Dr. Emily Zhang', 
    avatar: 'https://i.pravatar.cc/150?img=9', 
    department: 'Computer Science',
    status: 'nearlyFull', 
    loadHours: 15,
    maxHours: 18,
    expertise: ['AI', 'machine learning', 'neural networks'],
    assignedCourses: [4, 9]
  },
  { 
    id: 5, 
    name: 'Prof. David Wilson', 
    avatar: 'https://i.pravatar.cc/150?img=15',
    department: 'Computer Science', 
    status: 'overloaded', 
    loadHours: 21,
    maxHours: 20,
    expertise: ['networking', 'security', 'protocols'],
    assignedCourses: [6, 12]
  },
  { 
    id: 6, 
    name: 'Dr. Lisa Kumar', 
    avatar: 'https://i.pravatar.cc/150?img=3',
    department: 'Computer Science', 
    status: 'available', 
    loadHours: 12,
    maxHours: 18,
    expertise: ['theory', 'algorithms', 'computational logic'],
    assignedCourses: [8, 13]
  },
  { 
    id: 7, 
    name: 'Prof. Michael Brown', 
    avatar: 'https://i.pravatar.cc/150?img=13',
    department: 'Computer Science', 
    status: 'nearlyFull', 
    loadHours: 15,
    maxHours: 18,
    expertise: ['databases', 'cloud', 'data warehousing'],
    assignedCourses: [3, 7]
  },
];

// Helper function to calculate weekly hours as a number
export const calculateHoursFromString = (hoursString) => {
  // Extract numbers from strings like "3L+1T+2P"
  const lectureMatch = hoursString.match(/(\d+)L/);
  const tutorialMatch = hoursString.match(/(\d+)T/);
  const practicalMatch = hoursString.match(/(\d+)P/);
  
  const lectureHours = lectureMatch ? parseInt(lectureMatch[1]) : 0;
  const tutorialHours = tutorialMatch ? parseInt(tutorialMatch[1]) : 0;
  const practicalHours = practicalMatch ? parseInt(practicalMatch[1]) : 0;
  
  return lectureHours + tutorialHours + practicalHours;
};

// Calculate the faculty load data with course information
export const getFacultyWithLoadData = (faculty, courses, selectedSemester) => {
  // Filter courses based on selected semester
  const semesterCourses = courses.filter(course => course.semester === selectedSemester);
  
  // Enhance faculty data with detailed course information
  const enhancedFacultyData = faculty.map(f => {
    // Get courses assigned to this faculty member for the selected semester
    const facultyCourses = semesterCourses.filter(course => f.assignedCourses.includes(course.id));
    
    // Calculate total load hours for this semester
    const semesterLoadHours = facultyCourses.reduce((total, course) => 
      total + calculateHoursFromString(course.weeklyHours), 0);
    
    // Determine faculty status based on load
    const loadPercentage = (semesterLoadHours / f.maxHours) * 100;
    let status = 'available';
    if (loadPercentage > 90) {
      status = 'overloaded';
    } else if (loadPercentage > 70) {
      status = 'nearlyFull';
    }
    
    return {
      ...f,
      semesterLoadHours,
      loadPercentage,
      status,
      facultyCourses
    };
  });
  
  return enhancedFacultyData;
};

// Get filtered faculty data
export const getFilteredFacultyData = (faculty, courses, selectedSemester, showOverloadedOnly, searchQuery) => {
  const enhancedData = getFacultyWithLoadData(faculty, courses, selectedSemester);
  
  let filtered = enhancedData;
  
  // Apply overloaded filter if selected
  if (showOverloadedOnly) {
    filtered = filtered.filter(f => f.status === 'overloaded');
  }
  
  // Apply search filter if any
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(f => 
      f.name.toLowerCase().includes(query) || 
      f.facultyCourses.some(c => 
        c.code.toLowerCase().includes(query) || 
        c.title.toLowerCase().includes(query)
      )
    );
  }
  
  return filtered;
};

// Mock service functions for UI actions
export const generateReport = () => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      resolve({ success: true, message: 'Report generated successfully' });
    }, 1500);
  });
};

export const emailFacultyReport = () => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      resolve({ success: true, message: 'Report emailed to faculty successfully' });
    }, 1500);
  });
};

export const exportReportAs = (format) => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      resolve({ success: true, message: `Report exported in ${format} format` });
    }, 800);
  });
};