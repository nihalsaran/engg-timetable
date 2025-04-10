import { useState } from 'react';
import { FiBookOpen, FiUser, FiSearch, FiEdit, FiTrash2, FiBook } from 'react-icons/fi';

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

const hodOptions = [
  { name: 'Alice Johnson', avatar: 'https://via.placeholder.com/30' },
  { name: 'Bob Smith', avatar: 'https://via.placeholder.com/30' },
  { name: 'Charlie Brown', avatar: 'https://via.placeholder.com/30' },
];

export default function DepartmentManagement() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: '', hod: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Created department:', formData);
    closeModal();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDepartments = dummyDepartments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (dept) => {
    console.log('Edit department:', dept);
    // Implementation for editing would go here
  };

  const handleDelete = (id) => {
    console.log('Delete department with id:', id);
    // Implementation for deleting would go here
  };

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-6">Departments</h1>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent backdrop-blur-sm bg-white/30"
          />
        </div>

        <button
          onClick={openModal}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:scale-105 transition duration-300 flex items-center gap-2"
        >
          🏫 Add Department
        </button>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((dept) => (
          <div key={dept.id} className="rounded-xl backdrop-blur-lg bg-white/30 border border-white/20 shadow-lg p-6 transition-all hover:shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg">{dept.name}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${dept.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {dept.status}
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Type</span>
                <div className="mt-1">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-600">
                    {dept.type}
                  </span>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">HOD</span>
                <div className="flex items-center gap-2 mt-1">
                  <img src={dept.hodAvatar} alt={dept.hod} className="w-8 h-8 rounded-full" />
                  <span>{dept.hod}</span>
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-500">Total Courses</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 p-2 bg-blue-50 rounded-lg">
                    <FiBook className="text-blue-500" />
                    <span className="font-semibold">{dept.totalCourses}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button 
                onClick={() => handleEdit(dept)}
                className="p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
              >
                <FiEdit size={18} />
              </button>
              <button 
                onClick={() => handleDelete(dept.id)}
                className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty state when no departments match search */}
      {filteredDepartments.length === 0 && (
        <div className="text-center py-12 backdrop-blur-lg bg-white/20 rounded-xl">
          <p className="text-gray-500">No departments found matching your search.</p>
        </div>
      )}

      {/* Add Department Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-11/12 max-w-md animate-fade-in-up border border-white/50">
            <h2 className="text-xl font-semibold mb-6">Add Department</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative flex items-center">
                <FiBookOpen className="absolute left-4 text-gray-400" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Department Name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 shadow-sm"
                />
              </div>
              <div className="relative flex items-center">
                <FiBookOpen className="absolute left-4 text-gray-400" />
                <input
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  placeholder="Department Type"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 shadow-sm"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Assign HOD</label>
                <select
                  name="hod"
                  value={formData.hod}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 shadow-sm"
                >
                  <option value="">Select HOD</option>
                  {hodOptions.map((hod) => (
                    <option key={hod.name} value={hod.name}>
                      {hod.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {hodOptions.map((hod) => (
                    <div 
                      key={hod.name} 
                      onClick={() => setFormData({...formData, hod: hod.name})}
                      className={`flex items-center gap-1 px-3 py-2 rounded-full border cursor-pointer transition-all
                      ${formData.hod === hod.name 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <img src={hod.avatar} alt={hod.name} className="w-6 h-6 rounded-full" />
                      <span className="text-sm">{hod.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Description (Optional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Department description..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 shadow-sm min-h-[100px]"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transition"
                >
                  ✅ Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
