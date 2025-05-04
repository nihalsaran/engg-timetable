// Firebase implementation for faculty load reports
import { 
  db, 
  collection, 
  doc,
  getDoc, 
  getDocs, 
  addDoc,
  updateDoc,
  query,
  where, 
  orderBy, 
  limit,
  serverTimestamp
} from '../../../firebase/config.js';
import { logActivity } from './HODDashboard';

// Collection references
const FACULTY_COLLECTION = 'faculty';
const COURSES_COLLECTION = 'courses';
const SEMESTERS_COLLECTION = 'semesters';
const REPORTS_COLLECTION = 'reports';

// Fallback dummy data (will be used if Firebase data fetch fails)
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

/**
 * Fetch available semesters from Firebase
 * @param {string} departmentId - Department ID
 * @returns {Promise<Array>} - Array of semester names
 */
export const fetchSemesters = async (departmentId) => {
  try {
    const semesterRef = collection(db, SEMESTERS_COLLECTION);
    const semesterQuery = departmentId ? 
      query(semesterRef, where('department', '==', departmentId)) : 
      query(semesterRef);
      
    const snapshot = await getDocs(semesterQuery);
    
    if (snapshot.empty) {
      console.log('No semesters found, using dummy data');
      return dummySemesters;
    }
    
    return snapshot.docs.map(doc => doc.data().name);
  } catch (error) {
    console.error('Error fetching semesters:', error);
    return dummySemesters;
  }
};

/**
 * Fetch faculty data from Firebase
 * @param {string} departmentId - Department ID
 * @returns {Promise<Array>} - Array of faculty data
 */
export const fetchFaculty = async (departmentId) => {
  try {
    const facultyRef = collection(db, FACULTY_COLLECTION);
    const facultyQuery = departmentId ? 
      query(facultyRef, where('department', '==', departmentId)) : 
      query(facultyRef);
      
    const snapshot = await getDocs(facultyQuery);
    
    if (snapshot.empty) {
      console.log('No faculty found, using dummy data');
      return dummyFaculty;
    }
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        avatar: data.avatar || 'https://i.pravatar.cc/150?img=11',
        department: data.department,
        status: data.status || 'available',
        loadHours: data.loadHours || 0,
        maxHours: data.maxHours || 18,
        expertise: data.expertise || [],
        assignedCourses: data.assignedCourses || []
      };
    });
  } catch (error) {
    console.error('Error fetching faculty:', error);
    return dummyFaculty;
  }
};

/**
 * Fetch course data from Firebase
 * @param {string} departmentId - Department ID
 * @param {string} semester - Optional semester filter
 * @returns {Promise<Array>} - Array of course data
 */
export const fetchCourses = async (departmentId, semester = null) => {
  try {
    const coursesRef = collection(db, COURSES_COLLECTION);
    let coursesQuery;
    
    if (semester) {
      coursesQuery = query(
        coursesRef, 
        where('department', '==', departmentId),
        where('semester', '==', semester)
      );
    } else {
      coursesQuery = query(coursesRef, where('department', '==', departmentId));
    }
    
    const snapshot = await getDocs(coursesQuery);
    
    if (snapshot.empty) {
      console.log('No courses found, using dummy data');
      return dummyCourses;
    }
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        code: data.code,
        title: data.title,
        semester: data.semester,
        weeklyHours: data.weeklyHours,
        faculty: data.faculty,
        tags: data.tags || []
      };
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return dummyCourses;
  }
};

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
    const facultyCourses = semesterCourses.filter(course => 
      Array.isArray(f.assignedCourses) && f.assignedCourses.includes(course.id)
    );
    
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

/**
 * Generate a faculty load report and save it to Firebase
 * @param {string} departmentId - Department ID
 * @param {string} selectedSemester - Selected semester for the report
 * @param {Array} filteredFacultyData - Faculty data with load information
 * @returns {Promise<Object>} - Result of report generation
 */
export const generateReport = async (departmentId, selectedSemester, filteredFacultyData) => {
  try {
    // Prepare report data
    const reportData = {
      departmentId: departmentId,
      semester: selectedSemester,
      generatedAt: serverTimestamp(),
      facultyCount: filteredFacultyData.length,
      overloadedCount: filteredFacultyData.filter(f => f.status === 'overloaded').length,
      nearlyFullCount: filteredFacultyData.filter(f => f.status === 'nearlyFull').length,
      availableCount: filteredFacultyData.filter(f => f.status === 'available').length,
      facultyData: filteredFacultyData.map(f => ({
        id: f.id,
        name: f.name,
        loadPercentage: f.loadPercentage,
        status: f.status,
        semesterLoadHours: f.semesterLoadHours,
        maxHours: f.maxHours
      }))
    };
    
    // Save report to Firebase
    const reportsRef = collection(db, REPORTS_COLLECTION);
    const reportDocRef = await addDoc(reportsRef, reportData);
    
    // Log activity
    await logActivity(departmentId, 'report', `Faculty load report generated for ${selectedSemester}`);
    
    return { 
      success: true, 
      message: 'Report generated successfully',
      reportId: reportDocRef.id
    };
  } catch (error) {
    console.error('Error generating report:', error);
    return { 
      success: false, 
      message: 'Error generating report: ' + error.message
    };
  }
};

/**
 * Email faculty load report to department faculty
 * @param {string} departmentId - Department ID
 * @param {string} selectedSemester - Selected semester
 * @returns {Promise<Object>} - Result of email operation
 */
export const emailFacultyReport = async (departmentId, selectedSemester) => {
  try {
    // In a real implementation, this would connect to a Cloud Function
    // that sends emails. For now, we'll just log an activity.
    
    // Log activity
    await logActivity(departmentId, 'report', `Faculty load report for ${selectedSemester} emailed to faculty`);
    
    // In production, you'd call a Firebase Cloud Function here
    // await callCloudFunction('sendFacultyLoadReportEmails', { 
    //   departmentId, 
    //   semester: selectedSemester 
    // });
    
    // Simulate delay for demo purposes
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return { success: true, message: 'Report emailed to faculty successfully' };
  } catch (error) {
    console.error('Error emailing report:', error);
    return { 
      success: false, 
      message: 'Error emailing report: ' + error.message
    };
  }
};

/**
 * Export report in specified format
 * @param {string} format - Export format (PDF, Excel, CSV)
 * @param {string} reportId - ID of the report to export
 * @returns {Promise<Object>} - Result of export operation
 */
export const exportReportAs = async (format, reportId) => {
  try {
    // In a real implementation, this would generate a file in the specified format
    // For now we'll just log the action
    
    // Get report data if reportId is provided
    let reportData = null;
    if (reportId) {
      const reportRef = doc(db, REPORTS_COLLECTION, reportId);
      const reportSnapshot = await getDoc(reportRef);
      
      if (reportSnapshot.exists()) {
        reportData = reportSnapshot.data();
      }
    }
    
    // In production, you'd call a Firebase Cloud Function here
    // const downloadUrl = await callCloudFunction('generateReportFile', { 
    //   format, 
    //   reportId,
    //   reportData
    // });
    
    // Simulate delay for demo purposes
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return { 
      success: true, 
      message: `Report exported in ${format} format`,
      // downloadUrl: downloadUrl // In a real implementation
    };
  } catch (error) {
    console.error(`Error exporting report as ${format}:`, error);
    return { 
      success: false, 
      message: `Error exporting report as ${format}: ` + error.message
    };
  }
};