// Department data (temporary mock data)
const dummyDepartments = [
  { 
    id: 1, 
    name: 'Computer Science', 
    type: 'Engineering', 
    status: 'Active', 
    hod: 'Alice Johnson', 
    hodAvatar: 'https://via.placeholder.com/30',
    totalCourses: 12
  },
  { 
    id: 2, 
    name: 'Mechanical', 
    type: 'Engineering', 
    status: 'Inactive', 
    hod: 'Bob Smith', 
    hodAvatar: 'https://via.placeholder.com/30',
    totalCourses: 8
  },
  { 
    id: 3, 
    name: 'Mathematics', 
    type: 'Science', 
    status: 'Active', 
    hod: 'Charlie Brown', 
    hodAvatar: 'https://via.placeholder.com/30',
    totalCourses: 6
  },
];

// HOD options for department assignment
const hodOptions = [
  { name: 'Alice Johnson', avatar: 'https://via.placeholder.com/30' },
  { name: 'Bob Smith', avatar: 'https://via.placeholder.com/30' },
  { name: 'Charlie Brown', avatar: 'https://via.placeholder.com/30' },
];

// Get all departments
export const getAllDepartments = () => {
  return dummyDepartments;
};

// Get HOD options
export const getHODOptions = () => {
  return hodOptions;
};

// Filter departments by search term
export const searchDepartments = (searchTerm) => {
  if (!searchTerm) return dummyDepartments;
  
  return dummyDepartments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Create new department
export const createDepartment = (departmentData) => {
  // In a real app, this would make an API call
  console.log('Creating department:', departmentData);
  
  // For demo purposes, add the new department to our dummy data
  const newDepartment = {
    id: dummyDepartments.length + 1,
    ...departmentData,
    status: 'Active',
    totalCourses: 0
  };
  
  // Note: This is just for demo and won't persist after page refresh
  dummyDepartments.push(newDepartment);
  
  return newDepartment;
};

// Edit department
export const updateDepartment = (departmentData) => {
  // In a real app, this would make an API call
  console.log('Updating department:', departmentData);
  
  const index = dummyDepartments.findIndex(d => d.id === departmentData.id);
  if (index !== -1) {
    dummyDepartments[index] = { ...dummyDepartments[index], ...departmentData };
    return dummyDepartments[index];
  }
  
  return null;
};

// Delete department
export const deleteDepartment = (id) => {
  // In a real app, this would make an API call
  console.log('Deleting department with id:', id);
  
  const index = dummyDepartments.findIndex(d => d.id === id);
  if (index !== -1) {
    const deleted = dummyDepartments.splice(index, 1);
    return deleted[0];
  }
  
  return null;
};