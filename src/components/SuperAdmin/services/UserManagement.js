// User Management Service

// Mock data for users - would be replaced with actual API calls in production
const dummyUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@univ.edu', role: 'HOD', department: 'Computer Science', active: true },
  { id: 2, name: 'Bob Smith', email: 'bob@univ.edu', role: 'TT Incharge', department: 'Electrical Engineering', active: true },
  { id: 3, name: 'Charlie Brown', email: 'charlie@univ.edu', role: 'Faculty', department: 'Mechanical Engineering', active: false },
];

// Department data - would come from API in production
const departments = [
  'Computer Science', 
  'Electrical Engineering', 
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering'
];

// User roles
const roles = ['HOD', 'TT Incharge', 'Faculty'];

// CRUD Operations
export const getUsers = () => {
  return dummyUsers;
};

export const getDepartments = () => {
  return departments;
};

export const getRoles = () => {
  return roles;
};

export const createUser = (userData) => {
  // In a real app, this would make an API call
  console.log('Creating user:', userData);
  // For demo, just return a fake success with assigned ID
  return {
    ...userData,
    id: Math.floor(Math.random() * 1000) + 10 // Generate random ID
  };
};

export const updateUser = (id, userData) => {
  // In a real app, this would make an API call
  console.log('Updating user:', id, userData);
  // For demo, just return the updated data
  return {
    ...userData,
    id
  };
};

export const deleteUser = (id) => {
  // In a real app, this would make an API call
  console.log('Deleting user with id:', id);
  return { success: true, id };
};

// Utility functions
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const getAvatarBg = (name) => {
  const colors = [
    'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 
    'bg-red-500', 'bg-orange-500', 'bg-amber-500',
    'bg-yellow-500', 'bg-lime-500', 'bg-green-500',
    'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500',
    'bg-sky-500', 'bg-blue-500', 'bg-violet-500'
  ];
  
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export const getRoleBadgeColor = (role) => {
  switch (role) {
    case 'HOD': return 'bg-indigo-100 text-indigo-800';
    case 'TT Incharge': return 'bg-purple-100 text-purple-800';
    case 'Faculty': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getRoleIcon = (role) => {
  // Note: This function returns a reference to the icon component type,
  // The actual icons need to be imported in the component file
  return role;
};