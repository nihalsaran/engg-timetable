import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSave, 
  FiUpload, 
  FiTrash2, 
  FiFilter, 
  FiChevronDown,
  FiCheck,
  FiX,
  FiAlertTriangle,
  FiCalendar,
  FiGrid,
  FiList,
  FiArrowLeft,
  FiArrowRight,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

// Import services and data
import { 
  coursesData,
  facultyData, 
  roomsData, 
  timeSlots, 
  weekDays,
  initializeEmptyTimetable,
  checkConflicts,
  addCourseToTimetable,
  saveTimetable,
  publishTimetable,
  getCourseColorClass,
  filterCourses
} from './services/TimetableBuilder';

export default function TimetableBuilder() {
  // State for filters
  const [selectedSemester, setSelectedSemester] = useState('Spring 2025');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  
  // State for view mode
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'day'
  const [currentDay, setCurrentDay] = useState('Monday');
  
  // State for the timetable grid
  const [timetableData, setTimetableData] = useState({});
  
  // Selected room
  const [selectedRoom, setSelectedRoom] = useState(roomsData[0]);
  
  // Conflicts
  const [conflicts, setConflicts] = useState([]);
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [draggedCourse, setDraggedCourse] = useState(null);
  
  // History for undo/redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Filter courses based on selected filters
  const filteredCourses = filterCourses(coursesData, { 
    selectedSemester, 
    selectedDepartment, 
    selectedFaculty 
  });

  // Initialize empty timetable data on component mount
  useEffect(() => {
    const initialData = initializeEmptyTimetable();
    setTimetableData(initialData);
    
    // Add to history
    addToHistory(initialData);
  }, []);

  // Function to add current state to history
  const addToHistory = (data) => {
    // Remove any future states if we're not at the end of the history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(data)));
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Handle undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setTimetableData(JSON.parse(JSON.stringify(history[newIndex])));
    }
  };

  // Handle redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setTimetableData(JSON.parse(JSON.stringify(history[newIndex])));
    }
  };

  // Handle drag start
  const handleDragStart = (course) => {
    setIsDragging(true);
    setDraggedCourse(course);
  };

  // Handle drop on a timetable cell
  const handleDrop = (day, slot) => {
    if (draggedCourse) {
      // Check for conflicts
      const newConflicts = checkConflicts(timetableData, day, slot, draggedCourse, selectedRoom);
      setConflicts([...conflicts, ...newConflicts]);
      
      // Add the course to the timetable
      const newTimetable = addCourseToTimetable(timetableData, day, slot, draggedCourse, selectedRoom);
      
      // Update timetable data
      setTimetableData(newTimetable);
      
      // Add to history
      addToHistory(newTimetable);
      
      // Reset dragging state
      setIsDragging(false);
      setDraggedCourse(null);
    }
  };

  // Handle clearing a week
  const handleClearWeek = () => {
    // Create a new empty timetable
    const newTimetable = initializeEmptyTimetable();
    
    setTimetableData(newTimetable);
    setConflicts([]);
    
    // Add to history
    addToHistory(newTimetable);
  };

  // Handle resolving a conflict
  const handleResolveConflict = (conflictIndex) => {
    const newConflicts = [...conflicts];
    newConflicts.splice(conflictIndex, 1);
    setConflicts(newConflicts);
  };

  // Handle save timetable
  const handleSaveTimetable = async () => {
    try {
      const result = await saveTimetable(timetableData);
      alert(result.message);
    } catch (error) {
      alert('Error saving timetable');
    }
  };

  // Handle publish timetable
  const handlePublishTimetable = async () => {
    try {
      const result = await publishTimetable(timetableData, conflicts);
      alert(result.message);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Timetable Builder</h1>
        
        {/* Undo/Redo Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleUndo} 
            disabled={historyIndex <= 0}
            className={`p-2 rounded-lg ${historyIndex <= 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <FiArrowLeft size={20} />
          </button>
          <button 
            onClick={handleRedo} 
            disabled={historyIndex >= history.length - 1}
            className={`p-2 rounded-lg ${historyIndex >= history.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <FiArrowRight size={20} />
          </button>
        </div>
      </div>
      
      {/* Filters Row */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <div className="flex flex-wrap items-center gap-4">
          {/* Semester Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Semester</label>
            <div className="relative">
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="Spring 2025">Spring 2025</option>
                <option value="Fall 2024">Fall 2024</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          {/* Department Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Department</label>
            <div className="relative">
              <select
                value={selectedDepartment || ''}
                onChange={(e) => setSelectedDepartment(e.target.value || null)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          {/* Faculty Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Faculty</label>
            <div className="relative">
              <select
                value={selectedFaculty ? selectedFaculty.id : ''}
                onChange={(e) => {
                  const facultyId = parseInt(e.target.value);
                  setSelectedFaculty(facultyId ? facultyData.find(f => f.id === facultyId) : null);
                }}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="">All Faculty</option>
                {facultyData.map(faculty => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          {/* View Toggle */}
          <div className="ml-auto">
            <label className="block text-xs font-medium text-gray-500 mb-1">View Mode</label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                className={`px-4 py-2 flex items-center gap-2 ${viewMode === 'week' ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setViewMode('week')}
              >
                <FiGrid size={16} />
                <span>Week</span>
              </button>
              <button
                className={`px-4 py-2 flex items-center gap-2 ${viewMode === 'day' ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setViewMode('day')}
              >
                <FiList size={16} />
                <span>Day</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex gap-6">
        {/* Left Panel: Course Blocks */}
        <div className="w-1/8 bg-white rounded-2xl shadow-md p-3 overflow-y-auto max-h-[calc(100vh-250px)]">
          <h2 className="text-md font-semibold text-gray-700 mb-3">Course Blocks</h2>
          <div className="space-y-2">
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                className={`p-2 rounded-lg border ${getCourseColorClass(course)} cursor-grab hover:shadow-md transition`}
                draggable
                onDragStart={() => handleDragStart(course)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-sm">{course.id}</span>
                  <span className="text-xs px-1 py-0.5 rounded-full bg-white/50">
                    {course.duration}h
                  </span>
                </div>
                <h3 className="text-xs mt-0.5 font-medium line-clamp-1">{course.name}</h3>
                <div className="text-xs mt-1 flex justify-between items-center">
                  <span className="truncate text-xs" title={course.faculty.name}>{course.faculty.name}</span>
                  <span className="font-mono text-xs">{course.weeklyHours}</span>
                </div>
              </motion.div>
            ))}
            
            {filteredCourses.length === 0 && (
              <div className="text-center py-6 text-gray-500 text-sm">
                No courses match the current filters
              </div>
            )}
          </div>
        </div>
        
        {/* Center Panel: Timetable Grid */}
        <div className="flex-1 bg-white rounded-2xl shadow-md p-4 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              {viewMode === 'week' ? 'Weekly Schedule' : `${currentDay} Schedule`}
            </h2>
            
            {/* Day selector for day view */}
            {viewMode === 'day' && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const currentIndex = weekDays.indexOf(currentDay);
                    if (currentIndex > 0) {
                      setCurrentDay(weekDays[currentIndex - 1]);
                    }
                  }}
                  disabled={currentDay === weekDays[0]}
                  className={`p-1 rounded-full ${currentDay === weekDays[0] ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiChevronLeft size={20} />
                </button>
                
                <select 
                  value={currentDay}
                  onChange={(e) => setCurrentDay(e.target.value)}
                  className="px-3 py-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  {weekDays.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                
                <button 
                  onClick={() => {
                    const currentIndex = weekDays.indexOf(currentDay);
                    if (currentIndex < weekDays.length - 1) {
                      setCurrentDay(weekDays[currentIndex + 1]);
                    }
                  }}
                  disabled={currentDay === weekDays[weekDays.length - 1]}
                  className={`p-1 rounded-full ${currentDay === weekDays[weekDays.length - 1] ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
          
          <div className="min-w-max">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 border-b border-gray-200 text-left">Time</th>
                  {viewMode === 'week' ? (
                    // Week view shows all days
                    weekDays.map(day => (
                      <th key={day} className="py-3 px-4 border-b border-gray-200 text-center">
                        {day}
                      </th>
                    ))
                  ) : (
                    // Day view shows just the selected day
                    <th className="py-3 px-4 border-b border-gray-200 text-center">
                      {currentDay}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, slotIndex) => (
                  <tr key={slot} className={slotIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="py-2 px-4 border-b border-gray-100 text-sm font-medium text-gray-700">
                      {slot}
                    </td>
                    
                    {viewMode === 'week' ? (
                      // Week view shows all days
                      weekDays.map(day => {
                        const courseInSlot = timetableData[day]?.[slot];
                        const hasConflict = conflicts.some(
                          c => c.day === day && c.slot === slot
                        );
                        
                        return (
                          <td 
                            key={`${day}-${slot}`} 
                            className="py-2 px-1 border-b border-gray-100 text-center relative"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(day, slot)}
                          >
                            {courseInSlot ? (
                              <div 
                                className={`p-2 rounded-lg ${getCourseColorClass(courseInSlot)} border cursor-pointer relative max-w-[120px] mx-auto
                                          ${hasConflict ? 'ring-2 ring-red-500 animate-pulse' : ''}`}
                              >
                                <div className="flex justify-between items-start">
                                  <span className="font-semibold text-xs">{courseInSlot.id}</span>
                                  {hasConflict && (
                                    <FiAlertTriangle className="text-red-500 text-xs" />
                                  )}
                                </div>
                                <h3 className="text-xs mt-0.5 font-medium line-clamp-1">{courseInSlot.name}</h3>
                                <div className="text-xs mt-1">{courseInSlot.room}</div>
                              </div>
                            ) : (
                              <div 
                                className="h-16 w-full max-w-[120px] mx-auto border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center"
                              >
                                {isDragging && (
                                  <div className="text-xs text-gray-400">Drop here</div>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })
                    ) : (
                      // Day view shows just the selected day
                      (() => {
                        const courseInSlot = timetableData[currentDay]?.[slot];
                        const hasConflict = conflicts.some(
                          c => c.day === currentDay && c.slot === slot
                        );
                        
                        return (
                          <td 
                            className="py-2 px-4 border-b border-gray-100 text-center relative"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(currentDay, slot)}
                          >
                            {courseInSlot ? (
                              <div 
                                className={`p-3 rounded-lg ${getCourseColorClass(courseInSlot)} border cursor-pointer relative max-w-[320px] mx-auto
                                          ${hasConflict ? 'ring-2 ring-red-500 animate-pulse' : ''}`}
                              >
                                <div className="flex justify-between items-start">
                                  <span className="font-semibold text-sm">{courseInSlot.id}</span>
                                  {hasConflict && (
                                    <FiAlertTriangle className="text-red-500" />
                                  )}
                                </div>
                                <h3 className="text-sm mt-1 font-medium line-clamp-1">{courseInSlot.name}</h3>
                                <div className="flex justify-between mt-2 text-xs">
                                  <span className="truncate">{courseInSlot.faculty.name}</span>
                                  <span>Room: {courseInSlot.room}</span>
                                </div>
                              </div>
                            ) : (
                              <div 
                                className="h-20 max-w-[320px] mx-auto border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center"
                              >
                                {isDragging && (
                                  <div className="text-sm text-gray-400">Drop here</div>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })()
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Right Panel: Faculty & Room Status */}
        <div className="w-1/7 bg-white rounded-2xl shadow-md p-4 overflow-y-auto max-h-[calc(100vh-250px)]">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Room Selection</h2>
            <div className="relative">
              <select
                value={selectedRoom.id}
                onChange={(e) => {
                  const roomId = e.target.value;
                  setSelectedRoom(roomsData.find(r => r.id === roomId));
                }}
                className="w-full appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                {roomsData.map(room => (
                  <option key={room.id} value={room.id}>{room.id} ({room.type})</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700">{selectedRoom.id} Details</h3>
              <div className="text-sm mt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span>{selectedRoom.capacity} students</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span>{selectedRoom.type}</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs font-medium text-gray-500">Facilities:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedRoom.facilities.map(facility => (
                      <span 
                        key={facility} 
                        className="bg-gray-200 px-2 py-1 rounded-md text-xs text-gray-700"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Conflicts Section */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Conflicts ({conflicts.length})</h2>
            {conflicts.length === 0 ? (
              <div className="p-3 bg-green-50 rounded-lg text-sm text-green-700 flex items-center gap-2">
                <FiCheck className="text-green-500" />
                No conflicts detected
              </div>
            ) : (
              <div className="space-y-2">
                {conflicts.map((conflict, index) => (
                  <div key={index} className="p-3 bg-red-50 rounded-lg shadow-sm">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <FiAlertTriangle className="text-red-500" />
                        <span className="text-sm font-medium text-red-700">
                          {conflict.type === 'room' ? 'Room Conflict' : 'Faculty Conflict'}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleResolveConflict(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiX />
                      </button>
                    </div>
                    <p className="text-xs text-red-600 mt-1">{conflict.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between gap-4">
        <button 
          onClick={handleClearWeek}
          className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition flex items-center gap-2"
        >
          <FiRefreshCw size={18} />
          <span>♻ Clear Week</span>
        </button>
        
        <div className="flex gap-4">
          <button 
            onClick={handleSaveTimetable}
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <FiSave size={18} />
            <span>💾 Save Timetable</span>
          </button>
          
          <button 
            onClick={handlePublishTimetable}
            className={`px-6 py-3 rounded-lg transition flex items-center gap-2 ${
              conflicts.length > 0 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
            disabled={conflicts.length > 0}
          >
            <FiUpload size={18} />
            <span>🚀 Publish</span>
          </button>
        </div>
      </div>
    </div>
  );
}