// filepath: /Users/nihalsarandasduggirala/Downloads/engg-timetable/src/components/HOD/TimetableViewer.jsx
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPrinter, FiDownload, FiSearch, FiFilter, FiCalendar, 
  FiGrid, FiUser, FiHome, FiBookOpen, FiChevronLeft, FiChevronRight,
  FiMaximize2, FiMinimize2, FiInfo
} from 'react-icons/fi';

// Sample data for demonstration
const dummyTimeSlots = [
  '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
  '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
  '16:00 - 17:00', '17:00 - 18:00'
];

const dummyWeekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const dummyDepartments = ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering'];
const dummySemesters = ['Semester 7', 'Semester 6', 'Semester 5'];

// Generate random timetable data
const generateDummyTimetableData = () => {
  const courseColors = [
    'bg-blue-100 text-blue-800 border-blue-300',
    'bg-teal-100 text-teal-800 border-teal-300',
    'bg-purple-100 text-purple-800 border-purple-300',
    'bg-amber-100 text-amber-800 border-amber-300',
    'bg-rose-100 text-rose-800 border-rose-300',
    'bg-green-100 text-green-800 border-green-300',
    'bg-indigo-100 text-indigo-800 border-indigo-300',
  ];

  const courses = [
    { code: 'CS101', name: 'Introduction to Computer Science', faculty: 'Dr. Alex Johnson', room: 'A101', semester: 'Semester 7' },
    { code: 'CS202', name: 'Data Structures and Algorithms', faculty: 'Dr. Sarah Miller', room: 'B201', semester: 'Semester 7' },
    { code: 'CS303', name: 'Database Systems', faculty: 'Prof. Robert Chen', room: 'A105', semester: 'Semester 7' },
    { code: 'CS405', name: 'Artificial Intelligence', faculty: 'Dr. Emily Zhang', room: 'C302', semester: 'Semester 7' },
    { code: 'CS301', name: 'Software Engineering', faculty: 'Prof. David Wilson', room: 'B204', semester: 'Semester 6' },
    { code: 'CS210', name: 'Computer Networks', faculty: 'Dr. Lisa Kumar', room: 'A102', semester: 'Semester 6' },
    { code: 'ME101', name: 'Engineering Mechanics', faculty: 'Dr. John Smith', room: 'D101', semester: 'Semester 7' },
    { code: 'EE201', name: 'Circuit Theory', faculty: 'Prof. Maria Garcia', room: 'E202', semester: 'Semester 6' },
  ];

  // Faculty members
  const facultyMembers = [...new Set(courses.map(course => course.faculty))];
  
  // Rooms
  const rooms = [...new Set(courses.map(course => course.room))];

  const timetable = {};
  dummyWeekdays.forEach(day => {
    timetable[day] = {};
    dummyTimeSlots.forEach(slot => {
      // 70% chance of having a class in this slot
      if (Math.random() < 0.7) {
        const course = courses[Math.floor(Math.random() * courses.length)];
        timetable[day][slot] = {
          ...course,
          colorClass: courseColors[Math.floor(Math.random() * courseColors.length)],
        };
      } else {
        timetable[day][slot] = null; // Empty slot
      }
    });
  });

  return { timetable, courses, facultyMembers, rooms };
};

export default function TimetableViewer() {
  // State variables
  const [viewType, setViewType] = useState('default'); // 'default', 'faculty', 'semester', 'room'
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('Semester 7');
  const [selectedDepartment, setSelectedDepartment] = useState('Computer Science');
  const [selectedDay, setSelectedDay] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(1);
  
  // Generate timetable data
  const { timetable, courses, facultyMembers, rooms } = generateDummyTimetableData();

  // Filter timetable data based on current filters
  const getFilteredTimetable = () => {
    let filteredData = { ...timetable };
    
    // Filter by day if selected
    if (selectedDay) {
      const dayData = { [selectedDay]: timetable[selectedDay] };
      filteredData = dayData;
    }
    
    // Apply further filtering based on view type
    Object.keys(filteredData).forEach(day => {
      Object.keys(filteredData[day]).forEach(slot => {
        const cell = filteredData[day][slot];
        if (!cell) return;
        
        // Filter by faculty in faculty view
        if (viewType === 'faculty' && selectedFaculty && cell.faculty !== selectedFaculty) {
          filteredData[day][slot] = null;
        }
        
        // Filter by room in room view
        else if (viewType === 'room' && selectedRoom && cell.room !== selectedRoom) {
          filteredData[day][slot] = null;
        }
        
        // Filter by semester in semester view
        else if (viewType === 'semester' && selectedSemester && cell.semester !== selectedSemester) {
          filteredData[day][slot] = null;
        }
        
        // Filter by search query if provided
        if (searchQuery && 
            !cell.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !cell.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !cell.faculty.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !cell.room.toLowerCase().includes(searchQuery.toLowerCase())) {
          filteredData[day][slot] = null;
        }
      });
    });
    
    return filteredData;
  };
  
  const filteredTimetable = getFilteredTimetable();
  
  // Handle printing
  const handlePrint = () => {
    window.print();
  };
  
  // Handle PDF download
  const handleDownloadPDF = () => {
    alert('PDF download functionality will be implemented here');
    // In a real implementation, use a library like jsPDF to generate the PDF
  };
  
  // Week navigation
  const handlePreviousWeek = () => {
    if (currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
    }
  };
  
  const handleNextWeek = () => {
    // Assume there are 16 weeks in a semester
    if (currentWeek < 16) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  // Reference for the timetable grid
  const timetableRef = useRef(null);

  // Handlers for view types
  const handleViewToggle = (view) => {
    setViewType(view);
    // Reset selection based on view type
    if (view === 'faculty') {
      setSelectedFaculty(facultyMembers[0]);
      setSelectedRoom(null);
    } else if (view === 'room') {
      setSelectedRoom(rooms[0]);
      setSelectedFaculty(null);
    } else if (view === 'semester') {
      setSelectedFaculty(null);
      setSelectedRoom(null);
    } else {
      setSelectedFaculty(null);
      setSelectedRoom(null);
    }
  };

  return (
    <div className="p-6 relative bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Timetable Viewer</h1>
      
      {/* View Toggles and Filters */}
      <div className="bg-white rounded-2xl p-5 shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* View Toggles */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleViewToggle('default')}
              className={`px-4 py-2 rounded-full border flex items-center gap-2
                        ${viewType === 'default' ? 'bg-teal-500 text-white border-teal-500' : 'border-gray-300 hover:bg-gray-100'}`}
            >
              <FiGrid size={16} />
              <span>Default View</span>
            </button>
            <button
              onClick={() => handleViewToggle('faculty')}
              className={`px-4 py-2 rounded-full border flex items-center gap-2
                        ${viewType === 'faculty' ? 'bg-teal-500 text-white border-teal-500' : 'border-gray-300 hover:bg-gray-100'}`}
            >
              <FiUser size={16} />
              <span>Faculty View</span>
            </button>
            <button
              onClick={() => handleViewToggle('semester')}
              className={`px-4 py-2 rounded-full border flex items-center gap-2
                        ${viewType === 'semester' ? 'bg-teal-500 text-white border-teal-500' : 'border-gray-300 hover:bg-gray-100'}`}
            >
              <FiBookOpen size={16} />
              <span>Semester View</span>
            </button>
            <button
              onClick={() => handleViewToggle('room')}
              className={`px-4 py-2 rounded-full border flex items-center gap-2
                        ${viewType === 'room' ? 'bg-teal-500 text-white border-teal-500' : 'border-gray-300 hover:bg-gray-100'}`}
            >
              <FiHome size={16} />
              <span>Room View</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-auto min-w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by course, faculty, room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full bg-gray-100 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-3">
          {/* Department Filter */}
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full pl-4 pr-8 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {dummyDepartments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full pl-4 pr-8 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {dummySemesters.map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          {/* Day Filter */}
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Day</label>
            <select
              value={selectedDay || ''}
              onChange={(e) => setSelectedDay(e.target.value || null)}
              className="w-full pl-4 pr-8 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All days</option>
              {dummyWeekdays.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          
          {/* Faculty selector (when in faculty view) */}
          {viewType === 'faculty' && (
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Faculty</label>
              <select
                value={selectedFaculty || ''}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full pl-4 pr-8 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {facultyMembers.map((faculty) => (
                  <option key={faculty} value={faculty}>{faculty}</option>
                ))}
              </select>
            </div>
          )}

          {/* Room selector (when in room view) */}
          {viewType === 'room' && (
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Room</label>
              <select
                value={selectedRoom || ''}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full pl-4 pr-8 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {rooms.map((room) => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Week Selection + CTA Buttons */}
      <div className="bg-white p-4 rounded-2xl shadow-md mb-6 flex flex-wrap justify-between items-center gap-4">
        {/* Week Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousWeek}
            className="p-2 rounded-full hover:bg-gray-100 transition-all"
            disabled={currentWeek === 1}
          >
            <FiChevronLeft className={currentWeek === 1 ? "text-gray-300" : "text-gray-600"} />
          </button>
          
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
            <FiCalendar className="text-teal-600 mr-2" />
            <span className="font-medium">Week {currentWeek}</span>
          </div>
          
          <button
            onClick={handleNextWeek}
            className="p-2 rounded-full hover:bg-gray-100 transition-all"
            disabled={currentWeek === 16}
          >
            <FiChevronRight className={currentWeek === 16 ? "text-gray-300" : "text-gray-600"} />
          </button>
          
          {/* Week calendar - mini-calendar dropdown would go here in a real implementation */}
          <div className="relative">
            <button className="ml-2 px-2 py-1 text-sm text-teal-600 hover:underline">
              Jump to week
            </button>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setIsZoomed(!isZoomed)} 
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
          >
            {isZoomed ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
            <span>{isZoomed ? "Zoom Out" : "Zoom In"}</span>
          </button>
          <button 
            onClick={handlePrint} 
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
          >
            <FiPrinter size={16} />
            <span>🖨 Print Timetable</span>
          </button>
          <button 
            onClick={handleDownloadPDF} 
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
          >
            <FiDownload size={16} />
            <span>📥 Download PDF</span>
          </button>
          <button 
            className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition flex items-center gap-2"
          >
            <FiSearch size={16} />
            <span>🔍 Search by Slot</span>
          </button>
        </div>
      </div>
      
      {/* Main Timetable Grid */}
      <div 
        ref={timetableRef}
        className={`bg-white rounded-2xl shadow-md overflow-x-auto print:shadow-none ${isZoomed ? "scale-110 origin-top-left transition-transform" : "scale-100 transition-transform"}`}
      >
        <div className="min-w-[800px] p-4">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="py-4 px-2 border-b border-r border-gray-200 text-left">Time / Day</th>
                {Object.keys(filteredTimetable).map(day => (
                  <th key={day} className="py-4 px-2 border-b border-gray-200 text-center">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dummyTimeSlots.map((slot, slotIndex) => (
                <tr key={slot} className={slotIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="py-3 px-2 border-r border-gray-200 text-sm font-medium text-gray-700 whitespace-nowrap sticky left-0 bg-inherit">
                    {slot}
                  </td>
                  {Object.keys(filteredTimetable).map(day => {
                    const cellData = filteredTimetable[day][slot];
                    return (
                      <td key={`${day}-${slot}`} className="border border-gray-100 p-1">
                        {cellData ? (
                          <motion.div 
                            className={`h-24 p-2 rounded-lg ${cellData.colorClass} border cursor-pointer overflow-hidden relative group transition-all hover:shadow-md`}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="text-sm font-semibold">{cellData.code}</div>
                            <div className="text-xs truncate">{cellData.name}</div>
                            <div className="text-xs mt-1 flex items-center">
                              <FiUser size={10} className="mr-1" />
                              {cellData.faculty}
                            </div>
                            <div className="text-xs flex items-center">
                              <FiHome size={10} className="mr-1" />
                              {cellData.room}
                            </div>
                            
                            {/* Tooltip/pop-up on hover */}
                            <div className="absolute inset-0 bg-white p-3 rounded-lg shadow-xl scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all z-20">
                              <div className="text-sm font-semibold">{cellData.code}</div>
                              <div className="text-xs font-medium mt-1">{cellData.name}</div>
                              <div className="text-xs mt-2 flex items-center">
                                <FiUser size={12} className="mr-1" />
                                Faculty: {cellData.faculty}
                              </div>
                              <div className="text-xs mt-1 flex items-center">
                                <FiHome size={12} className="mr-1" />
                                Room: {cellData.room}
                              </div>
                              <div className="text-xs mt-1 flex items-center">
                                <FiCalendar size={12} className="mr-1" />
                                {cellData.semester}
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="h-24 rounded-lg border border-dashed border-gray-300 bg-gray-50"></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 bg-white p-4 rounded-2xl shadow-md">
        <div className="flex items-center mb-2">
          <FiInfo className="text-teal-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-700">Legend</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {courses.slice(0, 6).map((course, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${['bg-blue-500', 'bg-teal-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500', 'bg-green-500'][idx % 6]}`}></div>
              <span className="text-sm text-gray-700">{course.code} - {course.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Print stylesheet - only applied when printing */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #timetableRef, #timetableRef * {
            visibility: visible;
          }
          #timetableRef {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}