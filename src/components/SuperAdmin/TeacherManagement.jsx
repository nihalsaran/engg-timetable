import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiUser, FiBookOpen, FiAward, FiLayers } from 'react-icons/fi';
import authService from '../../appwrite/auth';
import facultyService from '../../appwrite/database/facultyService';

// Subject areas that teachers can specialize in
const subjectAreas = [
  'Algorithms & Data Structures',
  'Artificial Intelligence',
  'Computer Networks',
  'Database Systems',
  'Operating Systems',
  'Software Engineering',
  'Web Development',
  'Machine Learning',
  'Embedded Systems',
  'Cybersecurity',
  'Cloud Computing',
  'Mobile Development',
  'Computer Architecture',
  'Theoretical Computer Science',
  'Graphics & Visualization'
];

const departments = [
  'Computer Science', 
  'Electrical Engineering', 
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering'
];

// Sample teachers data - will be replaced with actual data from the database
const dummyTeachers = [
  { id: 1, name: 'Dr. Jane Smith', email: 'jane@univ.edu', department: 'Computer Science', expertise: ['Algorithms & Data Structures', 'Artificial Intelligence'], qualification: 'Ph.D Computer Science', experience: 8, active: true },
  { id: 2, name: 'Prof. Michael Johnson', email: 'michael@univ.edu', department: 'Electrical Engineering', expertise: ['Computer Networks', 'Embedded Systems'], qualification: 'Ph.D Electrical Engineering', experience: 12, active: true },
  { id: 3, name: 'Dr. Sarah Williams', email: 'sarah@univ.edu', department: 'Computer Science', expertise: ['Database Systems', 'Web Development'], qualification: 'Ph.D Information Systems', experience: 6, active: false },
];

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState(dummyTeachers);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    expertise: [],
    qualification: '',
    experience: 0,
    active: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch all teachers on component mount
  useEffect(() => {
    // Uncomment when ready to integrate with backend
    // fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      const response = await facultyService.getAllFaculty();
      if (response.success) {
        setTeachers(response.faculty);
      }
    } catch (error) {
      setError('Failed to load teachers');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Open modal for creating or editing a teacher
  const openModal = (teacher = null) => {
    if (teacher) {
      setFormData({
        name: teacher.name,
        email: teacher.email,
        password: '',
        department: teacher.department,
        expertise: teacher.expertise || [],
        qualification: teacher.qualification || '',
        experience: teacher.experience || 0,
        active: teacher.active
      });
      setEditingId(teacher.id);
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        department: '',
        expertise: [],
        qualification: '',
        experience: 0,
        active: true
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowPassword(false);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleExpertiseChange = (subject) => {
    // Toggle expertise selection
    if (formData.expertise.includes(subject)) {
      setFormData({
        ...formData,
        expertise: formData.expertise.filter(item => item !== subject)
      });
    } else {
      setFormData({
        ...formData,
        expertise: [...formData.expertise, subject]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Create user account first if this is a new teacher
      if (!editingId) {
        const { name, email, password } = formData;
        const userResult = await authService.createAccount(email, password, name);
        
        if (!userResult.success) {
          throw new Error('Failed to create user account');
        }
        
        // Now create the teacher profile in the faculty collection
        const teacherData = {
          userId: userResult.user.$id, // Link to the auth user
          name: formData.name,
          email: formData.email,
          department: formData.department,
          expertise: formData.expertise,
          qualification: formData.qualification,
          experience: parseInt(formData.experience),
          active: formData.active,
          role: 'Faculty',
          maxHours: 40, // Default max teaching hours per week
          status: 'available'
        };
        
        const facultyResult = await facultyService.createFaculty(teacherData);
        
        if (facultyResult.success) {
          // Refresh the teachers list
          fetchTeachers();
          closeModal();
        }
      } else {
        // Update existing teacher
        const teacherData = {
          name: formData.name,
          department: formData.department,
          expertise: formData.expertise,
          qualification: formData.qualification,
          experience: parseInt(formData.experience),
          active: formData.active
        };
        
        const result = await facultyService.updateFaculty(editingId, teacherData);
        
        if (result.success) {
          // Update password if provided
          if (formData.password) {
            // Note: Password update would typically require a different approach
            // This is a placeholder for where you might handle password changes
            console.log("Password would be updated here");
          }
          
          // Refresh the teachers list
          fetchTeachers();
          closeModal();
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to save teacher information');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        setIsLoading(true);
        const result = await facultyService.deleteFaculty(id);
        
        if (result.success) {
          // Refresh the teachers list
          setTeachers(teachers.filter(teacher => teacher.id !== id));
        }
      } catch (error) {
        setError('Failed to delete teacher');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
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
      <h1 className="text-2xl font-bold mb-6">Teacher Management</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span>{error}</span>
        </div>
      )}
      
      {/* Teachers Table */}
      <div className="overflow-x-auto rounded-2xl shadow-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-indigo-100 to-purple-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Expertise</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Qualification</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Experience (Years)</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {teachers.map((teacher, idx) => (
              <tr key={teacher.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-medium ${getAvatarBg(teacher.name)}`}>
                      {getInitials(teacher.name)}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                      <div className="text-sm text-gray-500">{teacher.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FiLayers className="text-gray-500 mr-2" />
                    <span>{teacher.department}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {teacher.expertise && teacher.expertise.map((item) => (
                      <span 
                        key={item}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FiAward className="text-amber-500 mr-2" />
                    <span>{teacher.qualification}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {teacher.experience} years
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${teacher.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {teacher.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button 
                    onClick={() => openModal(teacher)}
                    className="text-indigo-600 hover:text-indigo-900 mx-1"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(teacher.id)}
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
        <span>Add New Teacher</span>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-11/12 max-w-3xl animate-fade-in-up overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <FiBookOpen className="mr-2 text-indigo-600" />
              {editingId ? 'Edit Teacher' : 'Add New Teacher'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Information Section */}
              <div className="bg-indigo-50 p-4 rounded-xl mb-4">
                <h3 className="text-lg font-medium text-indigo-800 mb-3">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      Full Name
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
                      Email Address
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
                </div>
              </div>

              {/* Professional Details Section */}
              <div className="bg-purple-50 p-4 rounded-xl mb-4">
                <h3 className="text-lg font-medium text-purple-800 mb-3">Professional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Qualification Input */}
                  <div className="relative">
                    <input
                      name="qualification"
                      id="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-400 focus:outline-none peer pt-6"
                      placeholder=" "
                    />
                    <label 
                      htmlFor="qualification"
                      className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs"
                    >
                      Highest Qualification
                    </label>
                  </div>

                  {/* Experience Input */}
                  <div className="relative">
                    <input
                      name="experience"
                      id="experience"
                      type="number"
                      min="0"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-400 focus:outline-none peer pt-6"
                      placeholder=" "
                    />
                    <label 
                      htmlFor="experience"
                      className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs"
                    >
                      Years of Experience
                    </label>
                  </div>
                </div>
              
                {/* Areas of Expertise */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Areas of Expertise (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {subjectAreas.map((subject) => (
                      <button
                        key={subject}
                        type="button"
                        onClick={() => handleExpertiseChange(subject)}
                        className={`text-sm px-3 py-1 rounded-full border ${
                          formData.expertise.includes(subject)
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Status Toggle */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-full">
                <span className="text-sm font-medium text-gray-700">Teacher Status</span>
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

              {/* Form Actions */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition flex items-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition flex items-center"
                >
                  {isLoading ? 'Saving...' : editingId ? 'Update Teacher' : 'Create Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}