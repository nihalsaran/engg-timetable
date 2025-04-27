// Dummy data for courses
const dummyCourses = [
  { 
    id: 1, 
    code: 'CS101', 
    title: 'Introduction to Computer Science', 
    faculty: { id: 1, name: 'Dr. Alex Johnson', avatar: 'https://via.placeholder.com/36', status: 'available' }, 
    semester: 'Fall 2024', 
    weeklyHours: '3L+1T' 
  },
  { 
    id: 2, 
    code: 'CS202', 
    title: 'Data Structures and Algorithms', 
    faculty: { id: 2, name: 'Dr. Sarah Miller', avatar: 'https://via.placeholder.com/36', status: 'busy' }, 
    semester: 'Spring 2025', 
    weeklyHours: '3L+2P' 
  },
  { 
    id: 3, 
    code: 'CS303', 
    title: 'Database Systems', 
    faculty: { id: 3, name: 'Prof. Robert Chen', avatar: 'https://via.placeholder.com/36', status: 'available' }, 
    semester: 'Fall 2024', 
    weeklyHours: '3L+1T+2P' 
  },
  { 
    id: 4, 
    code: 'CS405', 
    title: 'Artificial Intelligence', 
    faculty: { id: 4, name: 'Dr. Emily Zhang', avatar: 'https://via.placeholder.com/36', status: 'available' }, 
    semester: 'Spring 2025', 
    weeklyHours: '4L+2P' 
  },
  { 
    id: 5, 
    code: 'CS301', 
    title: 'Software Engineering', 
    faculty: { id: 5, name: 'Prof. David Wilson', avatar: 'https://via.placeholder.com/36', status: 'on-leave' }, 
    semester: 'Fall 2024', 
    weeklyHours: '3L+1T' 
  },
  { 
    id: 6, 
    code: 'CS210', 
    title: 'Computer Networks', 
    faculty: null, 
    semester: 'Spring 2025', 
    weeklyHours: '3L+1T+1P' 
  },
];

// Dummy data for faculty
const dummyFaculty = [
  { id: 1, name: 'Dr. Alex Johnson', avatar: 'https://via.placeholder.com/36', status: 'available' },
  { id: 2, name: 'Dr. Sarah Miller', avatar: 'https://via.placeholder.com/36', status: 'busy' },
  { id: 3, name: 'Prof. Robert Chen', avatar: 'https://via.placeholder.com/36', status: 'available' },
  { id: 4, name: 'Dr. Emily Zhang', avatar: 'https://via.placeholder.com/36', status: 'available' },
  { id: 5, name: 'Prof. David Wilson', avatar: 'https://via.placeholder.com/36', status: 'on-leave' },
  { id: 6, name: 'Dr. Lisa Kumar', avatar: 'https://via.placeholder.com/36', status: 'available' },
  { id: 7, name: 'Prof. Michael Brown', avatar: 'https://via.placeholder.com/36', status: 'busy' },
];

// Semester options
const semesterOptions = ['All Semesters', 'Semester 6', 'Semester 7', 'Semester 8'];

/**
 * Get all courses
 * @returns {Array} Array of course objects
 */
export const getCourses = () => {
  return [...dummyCourses];
};

/**
 * Get all faculty members
 * @returns {Array} Array of faculty objects
 */
export const getFaculty = () => {
  return [...dummyFaculty];
};

/**
 * Get semester options
 * @returns {Array} Array of semester options
 */
export const getSemesterOptions = () => {
  return [...semesterOptions];
};

/**
 * Filter courses based on search term, selected semester, and selected faculty
 * @param {Array} courses - Array of course objects
 * @param {string} searchTerm - Search term for filtering
 * @param {string} selectedSemester - Selected semester for filtering
 * @param {Object|null} selectedFaculty - Selected faculty object for filtering
 * @returns {Array} Filtered array of course objects
 */
export const filterCourses = (courses, searchTerm, selectedSemester, selectedFaculty) => {
  let filtered = [...courses];
  
  // Apply semester filter
  if (selectedSemester !== 'All Semesters') {
    filtered = filtered.filter(course => course.semester === selectedSemester);
  }
  
  // Apply faculty filter
  if (selectedFaculty) {
    filtered = filtered.filter(course => 
      course.faculty && course.faculty.id === selectedFaculty.id
    );
  }
  
  // Apply search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(course => 
      course.code.toLowerCase().includes(term) || 
      course.title.toLowerCase().includes(term)
    );
  }
  
  return filtered;
};

/**
 * Format weekly hours based on lecture, tutorial, and practical hours
 * @param {string} lectureHours - Number of lecture hours
 * @param {string} tutorialHours - Number of tutorial hours
 * @param {string} practicalHours - Number of practical hours
 * @returns {string} Formatted weekly hours string
 */
export const formatWeeklyHours = (lectureHours, tutorialHours, practicalHours) => {
  let weeklyHours = '';
  if (lectureHours && parseInt(lectureHours) > 0) weeklyHours += `${lectureHours}L`;
  if (tutorialHours && parseInt(tutorialHours) > 0) weeklyHours += `+${tutorialHours}T`;
  if (practicalHours && parseInt(practicalHours) > 0) weeklyHours += `+${practicalHours}P`;
  
  return weeklyHours;
};

/**
 * Parse weekly hours string into components
 * @param {string} weeklyHours - Weekly hours string (e.g., "3L+1T+2P")
 * @returns {Object} Object containing lecture, tutorial, and practical hours
 */
export const parseWeeklyHours = (weeklyHours) => {
  let lectureHours = '0', tutorialHours = '0', practicalHours = '0';
  
  if (weeklyHours) {
    const matches = weeklyHours.match(/(\d+)L|(\d+)T|(\d+)P/g);
    if (matches) {
      matches.forEach(match => {
        if (match.includes('L')) lectureHours = match.replace('L', '');
        if (match.includes('T')) tutorialHours = match.replace('T', '');
        if (match.includes('P')) practicalHours = match.replace('P', '');
      });
    }
  }
  
  return { lectureHours, tutorialHours, practicalHours };
};

/**
 * Add a new course
 * @param {Array} courses - Array of existing courses
 * @param {Object} formData - Form data for the new course
 * @param {Array} faculty - Array of faculty objects
 * @returns {Array} Updated array of courses with the new course added
 */
export const addCourse = (courses, formData, faculty) => {
  // Get selected faculty object
  const facultyObj = formData.faculty ? 
    faculty.find(f => f.id === parseInt(formData.faculty)) : null;
  
  // Create new course
  const newCourse = {
    id: courses.length + 1, // Simple ID generation
    title: formData.title,
    code: formData.code,
    faculty: facultyObj,
    semester: formData.semester,
    weeklyHours: formData.weeklyHours
  };
  
  return [...courses, newCourse];
};

/**
 * Update an existing course
 * @param {Array} courses - Array of existing courses
 * @param {number} courseId - ID of the course to update
 * @param {Object} formData - Form data with updated course values
 * @param {Array} faculty - Array of faculty objects
 * @returns {Array} Updated array of courses
 */
export const updateCourse = (courses, courseId, formData, faculty) => {
  // Get selected faculty object
  const facultyObj = formData.faculty ? 
    faculty.find(f => f.id === parseInt(formData.faculty)) : null;
  
  // Update the course
  return courses.map(course => 
    course.id === courseId ? 
    {
      ...course,
      title: formData.title,
      code: formData.code,
      faculty: facultyObj,
      semester: formData.semester,
      weeklyHours: formData.weeklyHours
    } : course
  );
};

/**
 * Delete a course
 * @param {Array} courses - Array of existing courses
 * @param {number} courseId - ID of the course to delete
 * @returns {Array} Updated array of courses with the specified course removed
 */
export const deleteCourse = (courses, courseId) => {
  return courses.filter(course => course.id !== courseId);
};

/**
 * Process uploaded course data
 * @param {Array} jsonData - Parsed JSON data from uploaded file
 * @param {Array} currentCourses - Current array of courses
 * @param {Array} faculty - Array of faculty objects
 * @returns {Object} Object containing results and updated courses
 */
export const processUploadedCourses = (jsonData, currentCourses, faculty) => {
  // Validate the JSON structure
  if (!Array.isArray(jsonData)) {
    throw new Error('Invalid JSON format. Expected an array of courses.');
  }
  
  // Process each course in the dataset
  const results = [];
  const newCourses = [...currentCourses];
  
  for (const course of jsonData) {
    // Basic validation
    if (!course.title || !course.code || !course.semester) {
      results.push({
        code: course.code || 'Unknown',
        success: false,
        error: 'Missing required fields (title, code, or semester)'
      });
      continue;
    }
    
    try {
      // Find faculty if specified
      let facultyObj = null;
      if (course.faculty) {
        facultyObj = faculty.find(f => f.id === course.faculty || f.name === course.faculty);
      }
      
      // Create new course object
      const newCourse = {
        id: newCourses.length + 1,
        title: course.title,
        code: course.code,
        semester: course.semester,
        weeklyHours: course.weeklyHours || '3L',
        faculty: facultyObj
      };
      
      newCourses.push(newCourse);
      results.push({
        code: course.code,
        success: true
      });
    } catch (err) {
      results.push({
        code: course.code || 'Unknown',
        success: false,
        error: err.message
      });
    }
  }
  
  return {
    results,
    updatedCourses: newCourses
  };
};

/**
 * Get example course data for download
 * @returns {Array} Example course data
 */
export const getExampleCourseData = () => {
  return [
    {
      "title": "Introduction to Programming",
      "code": "CS100",
      "semester": "Fall 2024",
      "weeklyHours": "3L+1T",
      "faculty": 1
    },
    {
      "title": "Web Development",
      "code": "CS220",
      "semester": "Spring 2025",
      "weeklyHours": "3L+2P",
      "faculty": 3
    },
    {
      "title": "Mobile App Development",
      "code": "CS320",
      "semester": "Fall 2024",
      "weeklyHours": "2L+3P",
      "faculty": null
    }
  ];
};

// Export default as a service object containing all functions
export default {
  getCourses,
  getFaculty,
  getSemesterOptions,
  filterCourses,
  formatWeeklyHours,
  parseWeeklyHours,
  addCourse,
  updateCourse,
  deleteCourse,
  processUploadedCourses,
  getExampleCourseData
};