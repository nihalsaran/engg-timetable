// Constant data
export const timeSlots = [
  '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
  '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
  '16:00 - 17:00', '17:00 - 18:00'
];

export const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const departments = ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering'];
export const semesters = ['Semester 7', 'Semester 6', 'Semester 5'];

// Generate random timetable data
export const generateTimetableData = () => {
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
  weekdays.forEach(day => {
    timetable[day] = {};
    timeSlots.forEach(slot => {
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

// Filter timetable data based on current filters
export const getFilteredTimetable = (timetable, filters) => {
  const { 
    selectedDay, 
    viewType, 
    selectedFaculty, 
    selectedRoom, 
    selectedSemester, 
    searchQuery 
  } = filters;
  
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

// Utility functions
export const printTimetable = () => {
  window.print();
};

export const downloadTimetablePDF = () => {
  alert('PDF download functionality will be implemented here');
  // In a real implementation, use a library like jsPDF to generate the PDF
};

export const navigateWeek = (currentWeek, direction) => {
  // Assume there are 16 weeks in a semester
  const maxWeeks = 16;
  
  if (direction === 'previous' && currentWeek > 1) {
    return currentWeek - 1;
  } else if (direction === 'next' && currentWeek < maxWeeks) {
    return currentWeek + 1;
  }
  
  return currentWeek; // Return unchanged if conditions not met
};

// Get the appropriate toggle state and selections based on view type
export const handleViewToggleLogic = (view, facultyMembers, rooms) => {
  let result = {
    viewType: view,
    selectedFaculty: null,
    selectedRoom: null
  };
  
  if (view === 'faculty') {
    result.selectedFaculty = facultyMembers[0];
  } else if (view === 'room') {
    result.selectedRoom = rooms[0];
  }
  
  return result;
};