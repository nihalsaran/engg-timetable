// Import data from TimetableBuilder service
import { facultyData, coursesData, roomsData, timeSlots, weekDays } from './TimetableBuilder';

// Function to calculate weekly hours from string format (e.g., "3L+1T+2P")
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

// Create a timetable grid for a faculty based on their assigned courses
export const createFacultyTimetableGrid = (facultyCourses) => {
  const grid = {};
  
  // Initialize empty grid
  weekDays.forEach(day => {
    grid[day] = {};
    timeSlots.forEach(slot => {
      grid[day][slot] = null;
    });
  });
  
  // Randomly assign courses to time slots for demo purposes
  // In a real app, this would come from the actual timetable data
  facultyCourses.forEach(course => {
    // For demonstration purposes, assign each course to 1-3 random slots
    const slotsToAssign = Math.min(3, Math.floor(Math.random() * 3) + 1);
    let assigned = 0;
    
    while (assigned < slotsToAssign) {
      const randomDay = weekDays[Math.floor(Math.random() * weekDays.length)];
      const randomSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      
      // Only assign if the slot is empty
      if (!grid[randomDay][randomSlot]) {
        // Find a random room for this slot
        const randomRoom = roomsData[Math.floor(Math.random() * roomsData.length)];
        
        grid[randomDay][randomSlot] = {
          ...course,
          room: randomRoom.id
        };
        assigned++;
      }
    }
  });
  
  return grid;
};

// Function to prepare faculty data with courses and time calculations
export const prepareFacultyData = () => {
  return facultyData.map(faculty => {
    // Get courses assigned to this faculty
    const assignedCourses = coursesData.filter(
      course => course.faculty.id === faculty.id
    );
    
    // Calculate weekly teaching hours
    const weeklyHours = assignedCourses.reduce((total, course) => {
      return total + calculateHoursFromString(course.weeklyHours);
    }, 0);
    
    // Create a timetable grid for the faculty
    const timetableGrid = createFacultyTimetableGrid(assignedCourses);
    
    // Calculate load percentage
    const maxHours = 20; // Assuming max hours is 20 per week
    const loadPercentage = Math.min(100, Math.round((weeklyHours / maxHours) * 100));
    
    // Determine status based on load
    let status = 'normal';
    if (loadPercentage > 90) {
      status = 'overloaded';
    } else if (loadPercentage > 75) {
      status = 'nearlyFull';
    }
    
    return {
      ...faculty,
      assignedCourses,
      weeklyHours,
      maxHours,
      loadPercentage,
      status,
      timetableGrid
    };
  });
};

// Get color class for faculty card based on their status
export const getStatusColorClass = (status) => {
  switch(status) {
    case 'overloaded':
      return 'bg-red-100 border-red-300';
    case 'nearlyFull':
      return 'bg-yellow-100 border-yellow-300';
    default:
      return 'bg-green-100 border-green-300';
  }
};

// Export the data so the component can use it directly
export { facultyData, coursesData, roomsData, timeSlots, weekDays };