// filepath: /Users/nihalsarandasduggirala/Downloads/engg-timetable/src/components/FacultyAssignment.jsx
import { useState, useEffect } from 'react';
import { FiAlertCircle, FiCheck, FiRefreshCw, FiStar, FiUsers } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Mock data for courses
const dummyCourses = [
  { id: 1, code: 'CS101', title: 'Introduction to Computer Science', semester: 'Semester 6', weeklyHours: '3L+1T', faculty: null, tags: ['programming', 'introductory'] },
  { id: 2, code: 'CS202', title: 'Data Structures and Algorithms', semester: 'Semester 7', weeklyHours: '3L+2P', faculty: null, tags: ['algorithms', 'data structures'] },
  { id: 3, code: 'CS303', title: 'Database Systems', semester: 'Semester 6', weeklyHours: '3L+1T+2P', faculty: 7, tags: ['databases', 'SQL'] },
  { id: 4, code: 'CS405', title: 'Artificial Intelligence', semester: 'Semester 7', weeklyHours: '4L+2P', faculty: null, tags: ['AI', 'machine learning'] },
  { id: 5, code: 'CS301', title: 'Software Engineering', semester: 'Semester 6', weeklyHours: '3L+1T', faculty: 3, tags: ['software', 'project management'] },
  { id: 6, code: 'CS210', title: 'Computer Networks', semester: 'Semester 7', weeklyHours: '3L+1T+1P', faculty: 5, tags: ['networking', 'protocols'] },
];

// Mock data for faculty
const dummyFaculty = [
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
const calculateHoursFromString = (hoursString) => {
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
const getTimeSlots = (weeklyHours) => {
  return calculateHoursFromString(weeklyHours);
};

// Component for displaying a faculty card
const FacultyCard = ({ faculty, selectedCourse, onAssign, assignedCourses }) => {
  // Calculate load percentage
  const loadPercentage = Math.min(100, Math.round((faculty.loadHours / faculty.maxHours) * 100));
  
  // Count how many hours this faculty is assigned in current selection
  const currentAssignedHours = assignedCourses
    .filter(course => course.faculty === faculty.id)
    .reduce((total, course) => total + getTimeSlots(course.weeklyHours), 0);
  
  // Determine if faculty is compatible with selected course
  const isCompatible = selectedCourse && (
    faculty.expertise.some(exp => selectedCourse.tags.includes(exp)) ||
    faculty.preferredCourses.includes(selectedCourse.code)
  );
  
  const statusColors = {
    available: 'bg-green-500',
    nearlyFull: 'bg-yellow-500',
    overloaded: 'bg-red-500'
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`p-4 border rounded-xl transition-all duration-200 shadow-sm
                 ${selectedCourse && isCompatible ? 'ring-2 ring-teal-400 bg-teal-50' : 'bg-white'}
                 ${selectedCourse && !isCompatible ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <img 
            src={faculty.avatar} 
            alt={faculty.name} 
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-100" 
          />
          <span 
            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${statusColors[faculty.status]}`}
          ></span>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{faculty.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="bg-gray-100 rounded-full h-1.5 flex-1">
              <div 
                className={`h-1.5 rounded-full ${
                  loadPercentage > 90 ? 'bg-red-500' : 
                  loadPercentage > 70 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`} 
                style={{ width: `${loadPercentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {faculty.loadHours}/{faculty.maxHours}h
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-1.5">
        {faculty.expertise.map((exp, index) => (
          <span 
            key={index} 
            className={`text-xs px-2 py-0.5 rounded-full 
                      ${selectedCourse && selectedCourse.tags.includes(exp) 
                        ? 'bg-teal-100 text-teal-700' 
                        : 'bg-gray-100 text-gray-600'}`}
          >
            {exp}
          </span>
        ))}
      </div>
      
      {selectedCourse && (
        <div className="mt-3">
          <button
            onClick={() => onAssign(faculty.id)}
            disabled={faculty.status === 'overloaded' && selectedCourse.faculty !== faculty.id}
            className={`w-full py-1.5 px-3 rounded-lg text-sm text-center transition
                      ${selectedCourse.faculty === faculty.id 
                        ? 'bg-teal-100 text-teal-700 border border-teal-200' 
                        : faculty.status === 'overloaded'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-200 hover:bg-teal-50 text-gray-700'}`}
          >
            {selectedCourse.faculty === faculty.id ? 'Assigned' : 'Assign'}
          </button>
        </div>
      )}
    </motion.div>
  );
};

// Component for displaying a course card
const CourseCard = ({ course, isSelected, onClick, faculty }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-4 border rounded-xl cursor-pointer transition-all duration-200
                 ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white hover:shadow-md'}`}
    >
      <h3 className="text-blue-700 font-medium">{course.code}</h3>
      <h4 className="font-medium text-gray-800 mt-1">{course.title}</h4>
      <p className="text-sm text-gray-500 mt-1">
        {course.semester} • {course.weeklyHours}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {course.tags.map((tag, index) => (
          <span 
            key={index} 
            className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700"
          >
            {tag}
          </span>
        ))}
      </div>
      
      {course.faculty && (
        <div className="mt-3 flex items-center gap-2 border-t pt-2">
          <img 
            src={faculty?.avatar || 'https://via.placeholder.com/32'} 
            alt={faculty?.name || 'Faculty'} 
            className="w-6 h-6 rounded-full object-cover" 
          />
          <span className="text-sm text-gray-600 truncate">
            {faculty?.name || 'Loading...'}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default function FacultyAssignment() {
  const [courses, setCourses] = useState([...dummyCourses]);
  const [faculty, setFaculty] = useState([...dummyFaculty]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filteredFaculty, setFilteredFaculty] = useState([...dummyFaculty]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  
  // Update faculty load data whenever course assignments change
  useEffect(() => {
    // Reset faculty load to base values first
    const updatedFaculty = [...dummyFaculty].map(f => ({
      ...f,
      loadHours: f.loadHours
    }));
    
    // Add hours from course assignments
    courses.forEach(course => {
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
    
    setFaculty(updatedFaculty);
  }, [courses]);

  // Filter faculty based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFaculty([...faculty]);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = faculty.filter(f => 
      f.name.toLowerCase().includes(term) || 
      f.expertise.some(e => e.toLowerCase().includes(term))
    );
    
    setFilteredFaculty(filtered);
  }, [searchTerm, faculty]);

  const handleSelectCourse = (course) => {
    // If the course is already selected, deselect it by setting selectedCourse to null
    if (selectedCourse && selectedCourse.id === course.id) {
      setSelectedCourse(null);
    } else {
      setSelectedCourse(course);
    }
  };

  const handleAssignFaculty = (facultyId) => {
    // If the faculty is already assigned to this course, unassign them
    if (selectedCourse.faculty === facultyId) {
      setCourses(courses.map(c => 
        c.id === selectedCourse.id ? { ...c, faculty: null } : c
      ));
      setSelectedCourse({ ...selectedCourse, faculty: null });
      return;
    }
    
    // Otherwise, assign the faculty to the course
    setCourses(courses.map(c => 
      c.id === selectedCourse.id ? { ...c, faculty: facultyId } : c
    ));
    setSelectedCourse({ ...selectedCourse, faculty: facultyId });
  };

  // Auto-assign faculty to courses based on expertise and availability
  const handleAutoAssign = () => {
    const newCourses = [...courses];
    
    // Reset all faculty loadHours to their base values
    const tempFaculty = [...dummyFaculty].map(f => ({
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
    
    // Update courses with new assignments
    setCourses(newCourses);
    
    // If there was a selected course, update its selection too
    if (selectedCourse) {
      const updated = newCourses.find(c => c.id === selectedCourse.id);
      setSelectedCourse(updated);
    }
  };

  // Save assignments
  const handleSaveAssignments = () => {
    console.log('Saving faculty assignments:', courses);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  return (
    <div className="p-6 relative bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Faculty Assignment
      </h1>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search faculty by name or expertise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      {/* Auto-assign button */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={handleAutoAssign}
          className="px-6 py-2 rounded-lg border border-teal-500 text-teal-600 hover:bg-teal-50 
                   transition flex items-center gap-2 group"
        >
          <FiRefreshCw className="group-hover:rotate-180 transition-transform duration-500" />
          <span>🔄 Auto Assign</span>
        </button>
        
        <div className="flex items-center text-sm text-gray-500">
          <FiAlertCircle className="inline-block mr-1" />
          <span>Auto-assign will match faculty to compatible courses based on expertise and workload</span>
        </div>
      </div>
      
      {/* Main content: 2-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Courses */}
        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Courses 
            {selectedCourse && (
              <button
                onClick={() => setSelectedCourse(null)}
                className="ml-3 text-sm text-blue-600 hover:text-blue-800 font-normal"
              >
                (Clear selection)
              </button>
            )}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {courses.map(course => {
              const assignedFaculty = faculty.find(f => f.id === course.faculty);
              return (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  isSelected={selectedCourse?.id === course.id}
                  onClick={() => handleSelectCourse(course)}
                  faculty={assignedFaculty}
                />
              );
            })}
          </div>
        </div>
        
        {/* Right Column: Faculty */}
        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Faculty
            {selectedCourse && (
              <span className="ml-3 text-sm text-gray-500 font-normal">
                Assigning for: {selectedCourse.code}
              </span>
            )}
          </h2>
          
          <div className="flex items-center mb-3 gap-6">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-xs text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="text-xs text-gray-600">Nearly Full</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-xs text-gray-600">Overloaded</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredFaculty.map(f => (
              <FacultyCard 
                key={f.id} 
                faculty={f} 
                selectedCourse={selectedCourse}
                onAssign={handleAssignFaculty}
                assignedCourses={courses}
              />
            ))}
            
            {filteredFaculty.length === 0 && (
              <div className="bg-white p-6 rounded-lg text-center text-gray-500">
                No faculty found matching your search criteria
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Floating Save Button */}
      <div className="fixed bottom-8 right-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveAssignments}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 
                   text-white font-semibold hover:shadow-lg transition flex items-center gap-2"
        >
          <FiCheck />
          <span>✅ Save Assignments</span>
        </motion.button>
        
        {showSavedMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 right-0 transform -translate-y-full mb-2 px-4 py-2 
                     bg-green-100 text-green-700 rounded-lg text-sm"
          >
            Assignments saved successfully!
          </motion.div>
        )}
      </div>
    </div>
  );
}