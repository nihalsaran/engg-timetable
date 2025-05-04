// Mock data for courses
export const dummyCourses = [
  { id: 1, code: 'CS101', title: 'Introduction to Computer Science', semester: 'Semester 6', weeklyHours: '3L+1T', faculty: null, tags: ['programming', 'introductory'] },
  { id: 2, code: 'CS202', title: 'Data Structures and Algorithms', semester: 'Semester 7', weeklyHours: '3L+2P', faculty: null, tags: ['algorithms', 'data structures'] },
  { id: 3, code: 'CS303', title: 'Database Systems', semester: 'Semester 6', weeklyHours: '3L+1T+2P', faculty: 7, tags: ['databases', 'SQL'] },
  { id: 4, code: 'CS405', title: 'Artificial Intelligence', semester: 'Semester 7', weeklyHours: '4L+2P', faculty: null, tags: ['AI', 'machine learning'] },
  { id: 5, code: 'CS301', title: 'Software Engineering', semester: 'Semester 6', weeklyHours: '3L+1T', faculty: 3, tags: ['software', 'project management'] },
  { id: 6, code: 'CS210', title: 'Computer Networks', semester: 'Semester 7', weeklyHours: '3L+1T+1P', faculty: 5, tags: ['networking', 'protocols'] },
];

// Mock data for faculty
export const dummyFaculty = [
  { 
    id: 1, 
    name: 'Dr. Alex Johnson', 
    avatar: 'https://i.pravatar.cc/150?img=11', 
    status: 'available', 
    loadHours: 6,
    maxHours: 18,
    expertise: ['programming', 'algorithms', 'theory'],
    preferredCourses: ['CS101', 'CS202']
  },
  { 
    id: 2, 
    name: 'Dr. Sarah Miller', 
    avatar: 'https://i.pravatar.cc/150?img=5', 
    status: 'nearlyFull', 
    loadHours: 14,
    maxHours: 18,
    expertise: ['databases', 'data mining', 'big data'],
    preferredCourses: ['CS303']
  },
  { 
    id: 3, 
    name: 'Prof. Robert Chen', 
    avatar: 'https://i.pravatar.cc/150?img=12', 
    status: 'available', 
    loadHours: 10,
    maxHours: 20,
    expertise: ['software engineering', 'project management'],
    preferredCourses: ['CS301']
  },
  { 
    id: 4, 
    name: 'Dr. Emily Zhang', 
    avatar: 'https://i.pravatar.cc/150?img=9', 
    status: 'available', 
    loadHours: 8,
    maxHours: 18,
    expertise: ['AI', 'machine learning', 'neural networks'],
    preferredCourses: ['CS405']
  },
  { 
    id: 5, 
    name: 'Prof. David Wilson', 
    avatar: 'https://i.pravatar.cc/150?img=15', 
    status: 'overloaded', 
    loadHours: 21,
    maxHours: 20,
    expertise: ['networking', 'security', 'protocols'],
    preferredCourses: ['CS210']
  },
  { 
    id: 6, 
    name: 'Dr. Lisa Kumar', 
    avatar: 'https://i.pravatar.cc/150?img=3', 
    status: 'available', 
    loadHours: 12,
    maxHours: 18,
    expertise: ['theory', 'algorithms', 'computational logic'],
    preferredCourses: ['CS202'] 
  },
  { 
    id: 7, 
    name: 'Prof. Michael Brown', 
    avatar: 'https://i.pravatar.cc/150?img=13', 
    status: 'nearlyFull', 
    loadHours: 15,
    maxHours: 18,
    expertise: ['databases', 'SQL', 'data warehousing'],
    preferredCourses: ['CS303']
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

// Helper to convert course hours to time slots needed
export const getTimeSlots = (weeklyHours) => {
  return calculateHoursFromString(weeklyHours);
};

// Update faculty load based on course assignments
export const updateFacultyLoad = (coursesData, facultyData) => {
  // Reset faculty load to base values first
  const updatedFaculty = [...facultyData].map(f => ({
    ...f,
    loadHours: f.loadHours
  }));
  
  // Add hours from course assignments
  coursesData.forEach(course => {
    if (course.faculty) {
      const facultyIndex = updatedFaculty.findIndex(f => f.id === course.faculty);
      if (facultyIndex !== -1) {
        const courseHours = getTimeSlots(course.weeklyHours);
        updatedFaculty[facultyIndex].loadHours += courseHours;
        
        // Update status based on new load
        const loadPercentage = (updatedFaculty[facultyIndex].loadHours / updatedFaculty[facultyIndex].maxHours) * 100;
        if (loadPercentage > 90) {
          updatedFaculty[facultyIndex].status = 'overloaded';
        } else if (loadPercentage > 70) {
          updatedFaculty[facultyIndex].status = 'nearlyFull';
        } else {
          updatedFaculty[facultyIndex].status = 'available';
        }
      }
    }
  });
  
  return updatedFaculty;
};

// Filter faculty based on search term
export const filterFacultyBySearch = (facultyData, searchTerm) => {
  if (!searchTerm.trim()) {
    return [...facultyData];
  }
  
  const term = searchTerm.toLowerCase();
  return facultyData.filter(f => 
    f.name.toLowerCase().includes(term) || 
    f.expertise.some(e => e.toLowerCase().includes(term))
  );
};

// Assign a faculty to a course
export const assignFacultyToCourse = (courses, selectedCourse, facultyId) => {
  // If the faculty is already assigned to this course, unassign them
  if (selectedCourse.faculty === facultyId) {
    const updatedCourses = courses.map(c => 
      c.id === selectedCourse.id ? { ...c, faculty: null } : c
    );
    const updatedSelectedCourse = { ...selectedCourse, faculty: null };
    return { updatedCourses, updatedSelectedCourse };
  }
  
  // Otherwise, assign the faculty to the course
  const updatedCourses = courses.map(c => 
    c.id === selectedCourse.id ? { ...c, faculty: facultyId } : c
  );
  const updatedSelectedCourse = { ...selectedCourse, faculty: facultyId };
  
  return { updatedCourses, updatedSelectedCourse };
};

// Auto-assign faculty to courses based on expertise and availability
export const autoAssignFaculty = (courses, facultyData) => {
  const newCourses = [...courses];
  
  // Reset all faculty loadHours to their base values
  const tempFaculty = [...facultyData].map(f => ({
    ...f,
    loadHours: f.loadHours,
    status: 'available'
  }));
  
  // Process each course for assignment
  newCourses.forEach((course, index) => {
    // Skip already assigned courses
    if (course.faculty) return;
    
    // Find compatible faculty sorted by preference and availability
    const compatibleFaculty = tempFaculty
      .filter(f => 
        f.expertise.some(exp => course.tags.includes(exp)) ||
        f.preferredCourses.includes(course.code)
      )
      .sort((a, b) => {
        // Sort by preference first
        const aPreferred = a.preferredCourses.includes(course.code);
        const bPreferred = b.preferredCourses.includes(course.code);
        if (aPreferred && !bPreferred) return -1;
        if (!aPreferred && bPreferred) return 1;
        
        // Then sort by load
        return (a.loadHours / a.maxHours) - (b.loadHours / b.maxHours);
      });
    
    // Assign to the first available faculty
    if (compatibleFaculty.length > 0) {
      const assignedFaculty = compatibleFaculty[0];
      newCourses[index].faculty = assignedFaculty.id;
      
      // Update faculty load
      const courseHours = getTimeSlots(course.weeklyHours);
      const facultyIndex = tempFaculty.findIndex(f => f.id === assignedFaculty.id);
      tempFaculty[facultyIndex].loadHours += courseHours;
      
      // Update status
      const loadPercentage = (tempFaculty[facultyIndex].loadHours / tempFaculty[facultyIndex].maxHours) * 100;
      if (loadPercentage > 90) {
        tempFaculty[facultyIndex].status = 'overloaded';
      } else if (loadPercentage > 70) {
        tempFaculty[facultyIndex].status = 'nearlyFull';
      }
    }
  });
  
  return newCourses;
};

// Save assignments to backend (currently just logs to console)
export const saveAssignments = (courses) => {
  console.log('Saving faculty assignments:', courses);
  // This would typically include an API call
  return true;
};