// Faculty Assignment service using Firebase
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
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from '../../../firebase/config.js';
import { logActivity } from './HODDashboard';

// Collection references
const FACULTY_COLLECTION = 'faculty';
const COURSES_COLLECTION = 'courses';

// Keeping dummy data for fallback
export const dummyCourses = [
  { id: 1, code: 'CS101', title: 'Introduction to Computer Science', semester: 'Semester 6', weeklyHours: '3L+1T', faculty: null, tags: ['programming', 'introductory'] },
  { id: 2, code: 'CS202', title: 'Data Structures and Algorithms', semester: 'Semester 7', weeklyHours: '3L+2P', faculty: null, tags: ['algorithms', 'data structures'] },
  { id: 3, code: 'CS303', title: 'Database Systems', semester: 'Semester 6', weeklyHours: '3L+1T+2P', faculty: 7, tags: ['databases', 'SQL'] },
  { id: 4, code: 'CS405', title: 'Artificial Intelligence', semester: 'Semester 7', weeklyHours: '4L+2P', faculty: null, tags: ['AI', 'machine learning'] },
  { id: 5, code: 'CS301', title: 'Software Engineering', semester: 'Semester 6', weeklyHours: '3L+1T', faculty: 3, tags: ['software', 'project management'] },
  { id: 6, code: 'CS210', title: 'Computer Networks', semester: 'Semester 7', weeklyHours: '3L+1T+1P', faculty: 5, tags: ['networking', 'protocols'] },
];

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

/**
 * Fetch courses from Firebase with optional semester filter
 * @param {string} departmentId - Department ID
 * @param {string} semester - Optional semester filter
 * @returns {Promise<Array>} - Array of courses
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
        code: data.code || '',
        title: data.title || '',
        semester: data.semester || '',
        weeklyHours: data.weeklyHours || '',
        faculty: data.faculty || null,
        tags: data.tags || []
      };
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return dummyCourses;
  }
};

/**
 * Fetch faculty from Firebase
 * @param {string} departmentId - Department ID
 * @returns {Promise<Array>} - Array of faculty members
 */
export const fetchFaculty = async (departmentId) => {
  try {
    const facultyRef = collection(db, FACULTY_COLLECTION);
    const facultyQuery = query(facultyRef, where('department', '==', departmentId));
    
    const snapshot = await getDocs(facultyQuery);
    
    if (snapshot.empty) {
      console.log('No faculty found, using dummy data');
      return dummyFaculty;
    }
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        avatar: data.avatar || 'https://i.pravatar.cc/150?img=11',
        status: data.status || 'available',
        loadHours: data.loadHours || 0,
        maxHours: data.maxHours || 18,
        expertise: data.expertise || [],
        preferredCourses: data.preferredCourses || []
      };
    });
  } catch (error) {
    console.error('Error fetching faculty:', error);
    return dummyFaculty;
  }
};

/**
 * Calculate time slots from weekly hours string
 * @param {string} weeklyHours - String representing weekly hours (e.g., "3L+1T+2P")
 * @returns {number} - Total hours
 */
export const getTimeSlots = (weeklyHours) => {
  const lectureMatch = weeklyHours.match(/(\d+)L/);
  const tutorialMatch = weeklyHours.match(/(\d+)T/);
  const practicalMatch = weeklyHours.match(/(\d+)P/);
  
  const lectureHours = lectureMatch ? parseInt(lectureMatch[1]) : 0;
  const tutorialHours = tutorialMatch ? parseInt(tutorialMatch[1]) : 0;
  const practicalHours = practicalMatch ? parseInt(practicalMatch[1]) : 0;
  
  return lectureHours + tutorialHours + practicalHours;
};

/**
 * Update faculty load hours in Firebase
 * @param {string} facultyId - Faculty ID to update
 * @param {number} hoursChange - Change in load hours (positive or negative)
 * @returns {Promise<Object>} - Updated faculty data
 */
export const updateFacultyLoad = async (facultyId, hoursChange) => {
  try {
    // Get current faculty data
    const facultyRef = doc(db, FACULTY_COLLECTION, facultyId);
    const facultySnapshot = await getDoc(facultyRef);
    
    if (!facultySnapshot.exists()) {
      throw new Error(`Faculty with ID ${facultyId} not found`);
    }
    
    const facultyData = facultySnapshot.data();
    const currentLoadHours = facultyData.loadHours || 0;
    const maxHours = facultyData.maxHours || 18;
    
    // Calculate new load hours
    const newLoadHours = Math.max(0, currentLoadHours + hoursChange);
    
    // Determine new status based on load percentage
    const loadPercentage = (newLoadHours / maxHours) * 100;
    let newStatus = 'available';
    
    if (loadPercentage > 90) {
      newStatus = 'overloaded';
    } else if (loadPercentage > 70) {
      newStatus = 'nearlyFull';
    }
    
    // Update faculty document
    await updateDoc(facultyRef, {
      loadHours: newLoadHours,
      status: newStatus,
      updatedAt: serverTimestamp()
    });
    
    return {
      id: facultyId,
      loadHours: newLoadHours,
      status: newStatus,
      loadPercentage
    };
  } catch (error) {
    console.error('Error updating faculty load:', error);
    throw error;
  }
};

/**
 * Filter faculty members by search query
 * @param {Array} faculty - Array of faculty members
 * @param {string} searchQuery - Search query
 * @returns {Array} - Filtered faculty members
 */
export const filterFacultyBySearch = (faculty, searchQuery) => {
  if (!searchQuery || searchQuery.trim() === '') {
    return faculty;
  }
  
  const query = searchQuery.toLowerCase();
  return faculty.filter(f => 
    f.name.toLowerCase().includes(query) || 
    f.expertise.some(e => e.toLowerCase().includes(query))
  );
};

/**
 * Assign a faculty member to a course in Firebase
 * @param {string} departmentId - Department ID
 * @param {string} courseId - Course ID
 * @param {string} facultyId - Faculty ID
 * @returns {Promise<Object>} - Result of the assignment
 */
export const assignFacultyToCourse = async (departmentId, courseId, facultyId) => {
  try {
    // Get course data
    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    const courseSnapshot = await getDoc(courseRef);
    
    if (!courseSnapshot.exists()) {
      throw new Error(`Course with ID ${courseId} not found`);
    }
    
    const courseData = courseSnapshot.data();
    const previousFacultyId = courseData.faculty;
    
    // If the course already has the same faculty assigned, do nothing
    if (previousFacultyId === facultyId) {
      return { success: true, course: { id: courseId, ...courseData } };
    }
    
    // If another faculty was previously assigned, update their load
    if (previousFacultyId) {
      // Remove course from previous faculty's assigned courses
      const prevFacultyRef = doc(db, FACULTY_COLLECTION, previousFacultyId);
      await updateDoc(prevFacultyRef, {
        assignedCourses: arrayRemove(courseId)
      });
      
      // Update previous faculty's load hours
      const hoursChange = -getTimeSlots(courseData.weeklyHours);
      await updateFacultyLoad(previousFacultyId, hoursChange);
    }
    
    // Update course with new faculty
    await updateDoc(courseRef, {
      faculty: facultyId,
      updatedAt: serverTimestamp()
    });
    
    // Add course to faculty's assigned courses
    const facultyRef = doc(db, FACULTY_COLLECTION, facultyId);
    await updateDoc(facultyRef, {
      assignedCourses: arrayUnion(courseId)
    });
    
    // Update new faculty's load hours
    const hoursChange = getTimeSlots(courseData.weeklyHours);
    await updateFacultyLoad(facultyId, hoursChange);
    
    // Log the activity
    await logActivity(
      departmentId, 
      'faculty', 
      `Faculty ${facultyId} assigned to course ${courseData.code}`
    );
    
    return { 
      success: true, 
      message: 'Faculty assigned successfully',
      courseId,
      facultyId
    };
  } catch (error) {
    console.error('Error assigning faculty to course:', error);
    return {
      success: false,
      message: 'Error assigning faculty: ' + error.message
    };
  }
};

/**
 * Automatically assign faculty to courses based on expertise match
 * @param {string} departmentId - Department ID 
 * @param {Array} courses - Array of courses
 * @param {Array} faculty - Array of faculty members
 * @returns {Promise<Object>} - Result of auto-assignment
 */
export const autoAssignFaculty = async (departmentId, courses, faculty) => {
  try {
    // Filter out courses that are already assigned
    const unassignedCourses = courses.filter(course => !course.faculty);
    
    // Skip if there are no unassigned courses
    if (unassignedCourses.length === 0) {
      return {
        success: true,
        message: 'All courses are already assigned',
        assignedCount: 0
      };
    }
    
    // Filter out overloaded faculty
    const availableFaculty = faculty.filter(f => f.status !== 'overloaded');
    
    // Skip if there are no available faculty
    if (availableFaculty.length === 0) {
      return {
        success: false,
        message: 'No available faculty for assignment',
        assignedCount: 0
      };
    }
    
    let assignedCount = 0;
    
    // Process each unassigned course
    for (const course of unassignedCourses) {
      // Find faculty with expertise in the course's tags
      const matchingFaculty = availableFaculty.filter(f => 
        f.expertise.some(exp => course.tags.includes(exp)) ||
        f.preferredCourses.includes(course.code)
      );
      
      if (matchingFaculty.length === 0) {
        continue; // Skip if no matching faculty
      }
      
      // Sort matching faculty by current load (ascending)
      matchingFaculty.sort((a, b) => a.loadHours - b.loadHours);
      
      // Assign the course to the faculty with the lowest load
      const selectedFaculty = matchingFaculty[0];
      
      // Make the assignment
      const result = await assignFacultyToCourse(
        departmentId,
        course.id, 
        selectedFaculty.id
      );
      
      if (result.success) {
        assignedCount++;
        
        // Update the faculty's load for subsequent assignments
        const foundFaculty = availableFaculty.find(f => f.id === selectedFaculty.id);
        if (foundFaculty) {
          const courseHours = getTimeSlots(course.weeklyHours);
          foundFaculty.loadHours += courseHours;
          
          // Update faculty status if needed
          const loadPercentage = (foundFaculty.loadHours / foundFaculty.maxHours) * 100;
          if (loadPercentage > 90) {
            foundFaculty.status = 'overloaded';
          } else if (loadPercentage > 70) {
            foundFaculty.status = 'nearlyFull';
          }
        }
      }
    }
    
    // Log the activity
    await logActivity(
      departmentId, 
      'faculty', 
      `Auto-assigned ${assignedCount} courses to faculty`
    );
    
    return {
      success: true,
      message: `Successfully assigned ${assignedCount} out of ${unassignedCourses.length} courses`,
      assignedCount
    };
  } catch (error) {
    console.error('Error auto-assigning faculty:', error);
    return {
      success: false,
      message: 'Error during auto-assignment: ' + error.message,
      assignedCount: 0
    };
  }
};

/**
 * Save faculty assignments to Firebase
 * @param {string} departmentId - Department ID
 * @returns {Promise<Object>} - Result of the save operation
 */
export const saveAssignments = async (departmentId) => {
  try {
    // Create a snapshot record of current assignments
    const assignmentHistoryRef = collection(db, 'assignmentHistory');
    
    // Get current assignments
    const coursesRef = collection(db, COURSES_COLLECTION);
    const coursesQuery = query(coursesRef, where('department', '==', departmentId));
    const coursesSnapshot = await getDocs(coursesQuery);
    
    const assignments = [];
    coursesSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.faculty) {
        assignments.push({
          courseId: doc.id,
          courseCode: data.code,
          facultyId: data.faculty
        });
      }
    });
    
    // Save the assignment record
    await addDoc(assignmentHistoryRef, {
      departmentId,
      timestamp: serverTimestamp(),
      assignments,
      totalAssigned: assignments.length
    });
    
    // Log the activity
    await logActivity(
      departmentId, 
      'faculty', 
      `Faculty assignments saved`
    );
    
    return {
      success: true,
      message: `Successfully saved ${assignments.length} faculty assignments`,
      assignmentCount: assignments.length
    };
  } catch (error) {
    console.error('Error saving assignments:', error);
    return {
      success: false,
      message: 'Error saving assignments: ' + error.message
    };
  }
};