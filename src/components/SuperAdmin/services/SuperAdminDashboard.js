// Dashboard data service for Super Admin
export const getDashboardMetrics = () => {
  // In a real application, this would fetch data from an API
  return {
    totalUsers: 120,
    totalDepartments: 8,
    activeSemesters: 2,
    conflictsToday: 3
  };
};

export const getRecentActivity = () => {
  // In a real application, this would fetch data from an API
  return [
    { id: 1, user: "Dr. Smith", action: "Modified CS101 Schedule", time: "10 mins ago" },
    { id: 2, user: "Prof. Johnson", action: "Requested room change", time: "1 hour ago" },
    { id: 3, user: "Admin Lee", action: "Added new faculty", time: "3 hours ago" },
    { id: 4, user: "Dr. Patel", action: "Updated office hours", time: "5 hours ago" }
  ];
};

export const getSemesterProgress = () => {
  // In a real application, this would fetch data from an API
  return [
    { id: 1, name: "Spring 2025", progress: 65, startDate: "Jan 15", endDate: "May 30" },
    { id: 2, name: "Summer 2025", progress: 10, startDate: "Jun 15", endDate: "Aug 30" }
  ];
};

export const addNewUser = () => {
  // Implementation for adding a new user
  console.log("Adding new user");
  // API call would go here
};

export const generateReport = () => {
  // Implementation for generating reports
  console.log("Generating report");
  // API call would go here
};

export const manageSemester = () => {
  // Implementation for managing semester
  console.log("Managing semester");
  // API call would go here
};