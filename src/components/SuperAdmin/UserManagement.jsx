import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiUser, FiUsers, FiShield } from 'react-icons/fi';

const dummyUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@univ.edu', role: 'HOD', department: 'Computer Science', active: true },
  { id: 2, name: 'Bob Smith', email: 'bob@univ.edu', role: 'TT Incharge', department: 'Electrical Engineering', active: true },
  { id: 3, name: 'Charlie Brown', email: 'charlie@univ.edu', role: 'Faculty', department: 'Mechanical Engineering', active: false },
];

const departments = [
  'Computer Science', 
  'Electrical Engineering', 
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering'
];

export default function UserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    role: 'Faculty',
    department: '',
    active: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const openModal = (user = null) => {
    if (user) {
      setFormData({ 
        name: user.name, 
        email: user.email, 
        password: '',
        role: user.role,
        department: user.department,
        active: user.active
      });
      setEditingId(user.id);
    } else {
      setFormData({ 
        name: '', 
        email: '', 
        password: '',
        role: 'Faculty',
        department: '',
        active: true
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowPassword(false);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saved user:', formData, 'Editing ID:', editingId);
    closeModal();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleDelete = (id) => {
    console.log('Delete user with id:', id);
    // Implement delete logic here
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'HOD': return 'bg-indigo-100 text-indigo-800';
      case 'TT Incharge': return 'bg-purple-100 text-purple-800';
      case 'Faculty': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'HOD': return <FiShield className="mr-1" />;
      case 'TT Incharge': return <FiUsers className="mr-1" />;
      case 'Faculty': return <FiUser className="mr-1" />;
      default: return null;
    }
  };

  // Generate avatar initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Generate background color for avatar based on name
  const getAvatarBg = (name) => {
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

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      {/* User Table */}
      <div className="overflow-x-auto rounded-2xl shadow-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-indigo-100 to-purple-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dummyUsers.map((user, idx) => (
              <tr key={user.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-medium ${getAvatarBg(user.name)}`}>
                      {getInitials(user.name)}
                    </div>
                    <span className="ml-3">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.department}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button 
                    onClick={() => openModal(user)}
                    className="text-indigo-600 hover:text-indigo-900 mx-1"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-900 mx-1"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => openModal()}
        className="fixed bottom-8 right-8 p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:scale-105 transition flex items-center"
      >
        <FiPlus size={24} className="mr-1" />
        <span>Add New User</span>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-11/12 max-w-md animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              {editingId ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="relative">
                <input
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-400 focus:outline-none peer pt-6"
                  placeholder=" "
                />
                <label 
                  htmlFor="name"
                  className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs"
                >
                  Name
                </label>
              </div>

              {/* Email Input */}
              <div className="relative">
                <input
                  name="email"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-400 focus:outline-none peer pt-6"
                  placeholder=" "
                />
                <label 
                  htmlFor="email"
                  className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs"
                >
                  Email
                </label>
              </div>

              {/* Password Input with Toggle */}
              <div className="relative">
                <input
                  name="password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required={!editingId}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-400 focus:outline-none peer pt-6 pr-12"
                  placeholder=" "
                />
                <label 
                  htmlFor="password"
                  className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs"
                >
                  Password {editingId && '(leave blank to keep current)'}
                </label>
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>

              {/* Role Dropdown */}
              <div className="relative">
                <select
                  name="role"
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-400 focus:outline-none appearance-none pt-6"
                >
                  <option value="HOD">HOD</option>
                  <option value="TT Incharge">TT Incharge</option>
                  <option value="Faculty">Faculty</option>
                </select>
                <label 
                  htmlFor="role"
                  className="absolute left-4 top-1 text-xs text-indigo-500"
                >
                  Role
                </label>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  {getRoleIcon(formData.role)}
                </div>
              </div>

              {/* Department Dropdown */}
              <div className="relative">
                <select
                  name="department"
                  id="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-400 focus:outline-none appearance-none pt-6"
                >
                  <option value="" disabled>Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <label 
                  htmlFor="department"
                  className="absolute left-4 top-1 text-xs text-indigo-500"
                >
                  Department
                </label>
              </div>

              {/* Active Status Toggle */}
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-full">
                <span className="text-sm font-medium text-gray-700">User Status</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {formData.active ? 'Active' : 'Inactive'}
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition flex items-center"
                >
                  ❌ Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition flex items-center"
                >
                  💾 Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
