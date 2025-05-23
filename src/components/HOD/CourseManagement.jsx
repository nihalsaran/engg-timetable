import React, { useState, useEffect, useRef } from 'react';
import { FiEdit, FiTrash2, FiSearch, FiFilter, FiX, FiBook, FiUser, FiClock, FiCalendar, FiHash, FiUpload, FiInfo, FiDownload } from 'react-icons/fi';

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

export default function CourseManagement() {
  // State variables
  const [courses, setCourses] = useState(dummyCourses);
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    faculty: '',
    semester: 'Fall 2024',
    weeklyHours: '',
    lectureHours: '3',
    tutorialHours: '1',
    practicalHours: '0'
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const fileInputRef = useRef(null);
  const tooltipRef = useRef(null);

  // Handle click outside for tooltip
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowInfoTooltip(false);
      }
    };

    // Add event listener only when tooltip is shown
    if (showInfoTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInfoTooltip]);

  // Filter courses whenever filter parameters change
  useEffect(() => {
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
    
    setFilteredCourses(filtered);
  }, [courses, selectedSemester, selectedFaculty, searchTerm]);

  // Handle input changes in form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Format weekly hours when lecture, tutorial, or practical hours change
  useEffect(() => {
    const { lectureHours, tutorialHours, practicalHours } = formData;
    
    let weeklyHours = '';
    if (lectureHours && parseInt(lectureHours) > 0) weeklyHours += `${lectureHours}L`;
    if (tutorialHours && parseInt(tutorialHours) > 0) weeklyHours += `+${tutorialHours}T`;
    if (practicalHours && parseInt(practicalHours) > 0) weeklyHours += `+${practicalHours}P`;
    
    setFormData(prev => ({ ...prev, weeklyHours }));
  }, [formData.lectureHours, formData.tutorialHours, formData.practicalHours]);

  // Open modal for new course
  const openNewCourseModal = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      code: '',
      faculty: '',
      semester: 'Semester 6',
      weeklyHours: '',
      lectureHours: '3',
      tutorialHours: '1',
      practicalHours: '0'
    });
    setShowModal(true);
  };

  // Open modal for editing an existing course
  const openEditCourseModal = (course) => {
    setEditingCourse(course);
    
    // Parse weekly hours into components (3L+1T+2P)
    let lectureHours = '0', tutorialHours = '0', practicalHours = '0';
    
    if (course.weeklyHours) {
      const matches = course.weeklyHours.match(/(\d+)L|(\d+)T|(\d+)P/g);
      if (matches) {
        matches.forEach(match => {
          if (match.includes('L')) lectureHours = match.replace('L', '');
          if (match.includes('T')) tutorialHours = match.replace('T', '');
          if (match.includes('P')) practicalHours = match.replace('P', '');
        });
      }
    }
    
    setFormData({
      title: course.title,
      code: course.code,
      faculty: course.faculty ? course.faculty.id : '',
      semester: course.semester,
      weeklyHours: course.weeklyHours,
      lectureHours,
      tutorialHours,
      practicalHours
    });
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get selected faculty object
    const facultyObj = formData.faculty ? 
      dummyFaculty.find(f => f.id === parseInt(formData.faculty)) : null;
    
    if (editingCourse) {
      // Update existing course
      const updatedCourses = courses.map(course => 
        course.id === editingCourse.id ? 
        {
          ...course,
          title: formData.title,
          code: formData.code,
          faculty: facultyObj,
          semester: formData.semester,
          weeklyHours: formData.weeklyHours
        } : course
      );
      setCourses(updatedCourses);
    } else {
      // Add new course
      const newCourse = {
        id: courses.length + 1,
        title: formData.title,
        code: formData.code,
        faculty: facultyObj,
        semester: formData.semester,
        weeklyHours: formData.weeklyHours
      };
      setCourses([...courses, newCourse]);
    }
    
    setShowModal(false);
  };

  // Delete a course
  const handleDeleteCourse = (id) => {
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedSemester('All Semesters');
    setSelectedFaculty(null);
    setSearchTerm('');
  };
  
  // Trigger the hidden file input
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file upload and JSON parsing
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          
          // Validate the JSON structure
          if (!Array.isArray(jsonData)) {
            throw new Error('Invalid JSON format. Expected an array of courses.');
          }
          
          // Process each course in the dataset
          const results = [];
          const newCourses = [...courses];
          
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
                facultyObj = dummyFaculty.find(f => f.id === course.faculty || f.name === course.faculty);
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
          
          // Update courses state
          setCourses(newCourses);
          
          // Show results summary
          const successful = results.filter(r => r.success).length;
          if (successful === results.length) {
            alert(`Successfully imported ${successful} courses.`);
          } else {
            alert(`Imported ${successful} out of ${results.length} courses. Check console for details.`);
            console.table(results);
          }
          
        } catch (err) {
          setError(`Error parsing JSON: ${err.message}`);
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      
      reader.onerror = () => {
        setError('Error reading the file');
        setIsLoading(false);
      };
      
      reader.readAsText(file);
      
    } catch (err) {
      setError(err.message || 'An error occurred during file upload');
      setIsLoading(false);
    }
    
    // Reset the file input
    e.target.value = '';
  };

  // Download example JSON dataset
  const downloadExampleJSON = () => {
    const exampleData = [
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
    
    const blob = new Blob([JSON.stringify(exampleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'courses_dataset_example.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 relative bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Course Management</h1>
      
      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-md mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="flex flex-1 flex-col md:flex-row gap-4 w-full lg:w-auto">
            {/* Semester Filter */}
            <div className="relative flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {semesterOptions.map((semester) => (
                  <option key={semester} value={semester}>{semester}</option>
                ))}
              </select>
            </div>
            
            {/* Faculty Filter */}
            <div className="relative flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">Faculty</label>
              <select
                value={selectedFaculty ? selectedFaculty.id : ''}
                onChange={(e) => {
                  const facultyId = e.target.value;
                  setSelectedFaculty(facultyId ? dummyFaculty.find(f => f.id === parseInt(facultyId)) : null);
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">All Faculty</option>
                {dummyFaculty.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                ))}
              </select>
            </div>
            
            {/* Search Bar */}
            <div className="relative flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">Search</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by course code or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 w-full lg:w-auto justify-end">
            {/* Reset Filters Button */}
            {(selectedSemester !== 'All Semesters' || selectedFaculty || searchTerm) && (
              <button
                onClick={resetFilters}
                className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
              >
                <FiX size={16} />
                <span>Clear Filters</span>
              </button>
            )}
            
            {/* Add New Course Button */}
            <button
              onClick={openNewCourseModal}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold hover:shadow-lg transition duration-300 flex items-center gap-2"
            >
              <span className="text-lg">➕</span>
              <span>Add New Course</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Buttons Group */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4">
        {/* Upload Course Dataset Button with Info Icon */}
        <div className="flex items-center relative group">
          <button
            onClick={handleUploadClick}
            className="p-4 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg hover:scale-105 transition flex items-center"
          >
            <FiUpload size={20} className="mr-2" />
            <span>Upload Course Dataset</span>
          </button>
          
          {/* Info Icon with Tooltip */}
          <div 
            className="relative ml-2"
            ref={tooltipRef}
            onClick={() => setShowInfoTooltip(!showInfoTooltip)}
          >
            <button
              className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100"
            >
              <FiInfo size={16} className="text-teal-600" />
            </button>
            
            {/* Tooltip */}
            {showInfoTooltip && (
              <div className="absolute bottom-full right-0 mb-2 w-72 bg-white rounded-lg shadow-xl p-4 text-sm border border-gray-200 z-50">
                <p className="font-medium mb-2 text-gray-700">JSON Dataset Format</p>
                <p className="text-gray-600 mb-3">Upload a JSON file containing an array of courses with their details.</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadExampleJSON();
                  }}
                  className="flex items-center text-teal-600 hover:text-teal-800 font-medium"
                >
                  <FiDownload size={14} className="mr-1" />
                  Download Example Format
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {/* Display error message if any */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span>{error}</span>
        </div>
      )}
      
      {/* Courses Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Course Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Course Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Faculty</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Semester</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Weekly Hours</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => (
                  <tr key={course.id} className={`hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-700">{course.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{course.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.faculty ? (
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <img src={course.faculty.avatar} alt={course.faculty.name} className="w-8 h-8 rounded-full" />
                            <span 
                              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                course.faculty.status === 'available' ? 'bg-green-500' : 
                                course.faculty.status === 'busy' ? 'bg-yellow-500' : 
                                'bg-red-500'
                              }`}
                            ></span>
                          </div>
                          <span className="text-sm text-gray-700">{course.faculty.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Not Assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{course.semester}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {course.weeklyHours}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => openEditCourseModal(course)}
                          className="text-indigo-600 hover:text-indigo-900 transition"
                          aria-label="Edit course"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-red-500 hover:text-red-700 transition"
                          aria-label="Delete course"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    No courses found with the current filters. Try adjusting your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add/Edit Course Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-end bg-black bg-opacity-40 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-white shadow-xl rounded-l-3xl h-full animate-slide-left">
            {/* Close button */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <FiX size={24} />
            </button>
            
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Course Title */}
                <div className="relative">
                  <div className="flex items-center mb-1">
                    <FiBook size={16} className="text-teal-600 mr-2" />
                    <label className="block text-sm font-medium text-gray-600">Course Title</label>
                  </div>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Introduction to Computer Science"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                
                {/* Course Code */}
                <div className="relative">
                  <div className="flex items-center mb-1">
                    <FiHash size={16} className="text-teal-600 mr-2" />
                    <label className="block text-sm font-medium text-gray-600">Course Code</label>
                  </div>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    placeholder="CS101"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                
                {/* Weekly Hours */}
                <div>
                  <div className="flex items-center mb-1">
                    <FiClock size={16} className="text-teal-600 mr-2" />
                    <label className="block text-sm font-medium text-gray-600">Weekly Hours</label>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500">Lectures</label>
                      <div className="flex">
                        <input
                          type="number"
                          name="lectureHours"
                          value={formData.lectureHours}
                          onChange={handleChange}
                          min="0"
                          max="10"
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <span className="bg-gray-100 px-2 py-2 border border-l-0 border-gray-300 rounded-r-lg text-gray-500">L</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500">Tutorials</label>
                      <div className="flex">
                        <input
                          type="number"
                          name="tutorialHours"
                          value={formData.tutorialHours}
                          onChange={handleChange}
                          min="0"
                          max="10"
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <span className="bg-gray-100 px-2 py-2 border border-l-0 border-gray-300 rounded-r-lg text-gray-500">T</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500">Practicals</label>
                      <div className="flex">
                        <input
                          type="number"
                          name="practicalHours"
                          value={formData.practicalHours}
                          onChange={handleChange}
                          min="0"
                          max="10"
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <span className="bg-gray-100 px-2 py-2 border border-l-0 border-gray-300 rounded-r-lg text-gray-500">P</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Format: {formData.weeklyHours}</p>
                </div>
                
                {/* Semester */}
                <div className="relative">
                  <div className="flex items-center mb-1">
                    <FiCalendar size={16} className="text-teal-600 mr-2" />
                    <label className="block text-sm font-medium text-gray-600">Semester</label>
                  </div>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="Semester 6">Semester 6</option>
                    <option value="Semester 7">Semester 7</option>
                    <option value="Semester 8">Semester 8</option>
                  </select>
                </div>
                
                {/* Faculty Assignment */}
                <div className="relative">
                  <div className="flex items-center mb-1">
                    <FiUser size={16} className="text-teal-600 mr-2" />
                    <label className="block text-sm font-medium text-gray-600">Assigned Faculty</label>
                  </div>
                  <select
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">-- Not Assigned --</option>
                    {dummyFaculty.map((faculty) => (
                      <option key={faculty.id} value={faculty.id}>
                        {faculty.name} ({faculty.status === 'available' ? '🟢' : faculty.status === 'busy' ? '🟡' : '🔴'})
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Faculty Avatars Quick Selection */}
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Quick Select:</label>
                  <div className="flex flex-wrap gap-2">
                    {dummyFaculty.map((faculty) => (
                      <button
                        type="button"
                        key={faculty.id}
                        onClick={() => setFormData(prev => ({ ...prev, faculty: faculty.id.toString() }))}
                        className={`relative p-1 border-2 rounded-full transition ${
                          parseInt(formData.faculty) === faculty.id 
                          ? 'border-teal-500 shadow-md' 
                          : 'border-transparent hover:border-gray-300'
                        }`}
                        title={faculty.name}
                      >
                        <img src={faculty.avatar} alt={faculty.name} className="w-10 h-10 rounded-full" />
                        <span 
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            faculty.status === 'available' ? 'bg-green-500' : 
                            faculty.status === 'busy' ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                        ></span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition flex items-center gap-2"
                  >
                    💾 Save Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}