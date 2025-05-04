import { useState, useEffect } from 'react';
import { FiAlertCircle, FiCheck, FiRefreshCw, FiStar, FiUsers } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { 
  dummyCourses, 
  dummyFaculty, 
  getTimeSlots, 
  updateFacultyLoad, 
  filterFacultyBySearch, 
  assignFacultyToCourse, 
  autoAssignFaculty, 
  saveAssignments 
} from './services/FacultyAssignment';

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
    const updatedFaculty = updateFacultyLoad(courses, dummyFaculty);
    setFaculty(updatedFaculty);
  }, [courses]);

  // Filter faculty based on search term
  useEffect(() => {
    const filtered = filterFacultyBySearch(faculty, searchTerm);
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
    const { updatedCourses, updatedSelectedCourse } = assignFacultyToCourse(courses, selectedCourse, facultyId);
    setCourses(updatedCourses);
    setSelectedCourse(updatedSelectedCourse);
  };

  // Auto-assign faculty to courses based on expertise and availability
  const handleAutoAssign = () => {
    const newCourses = autoAssignFaculty(courses, dummyFaculty);
    setCourses(newCourses);
    
    // If there was a selected course, update its selection too
    if (selectedCourse) {
      const updated = newCourses.find(c => c.id === selectedCourse.id);
      setSelectedCourse(updated);
    }
  };

  // Save assignments
  const handleSaveAssignments = () => {
    const success = saveAssignments(courses);
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