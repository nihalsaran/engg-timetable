import { useState } from 'react';
import { FiPlus, FiBookOpen, FiUser } from 'react-icons/fi';

const dummyDepartments = [
  { id: 1, name: 'Computer Science', type: 'Engineering', status: 'Active', hod: 'Alice Johnson' },
  { id: 2, name: 'Mechanical', type: 'Engineering', status: 'Inactive', hod: 'Bob Smith' },
  { id: 3, name: 'Mathematics', type: 'Science', status: 'Active', hod: 'Charlie Brown' },
];

const hodOptions = [
  { name: 'Alice Johnson', avatar: 'https://via.placeholder.com/30' },
  { name: 'Bob Smith', avatar: 'https://via.placeholder.com/30' },
  { name: 'Charlie Brown', avatar: 'https://via.placeholder.com/30' },
];

export default function DepartmentManagement() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: '', hod: '' });

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

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-6">Departments</h1>

      <div className="overflow-x-auto rounded-2xl backdrop-blur-lg bg-white/30 border border-white/20 shadow-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white/20">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">HOD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dummyDepartments.map((dept, idx) => (
              <tr key={dept.id} className={idx % 2 === 0 ? 'bg-white/10' : 'bg-white/5'}>
                <td className="px-6 py-4 whitespace-nowrap">{dept.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-600">
                    {dept.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${dept.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {dept.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{dept.hod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={openModal}
        className="fixed bottom-8 right-8 px-6 py-3 rounded-full backdrop-blur-lg bg-white/30 border border-white/30 shadow-lg hover:scale-105 transition"
      >
        🏫 Add Department
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-11/12 max-w-md animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-6">Add / Edit Department</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative flex items-center">
                <FiBookOpen className="absolute left-4 text-gray-400" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Department Name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Assign HOD</label>
                <select
                  name="hod"
                  value={formData.hod}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">Select HOD</option>
                  {hodOptions.map((hod) => (
                    <option key={hod.name} value={hod.name}>
                      {hod.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2 mt-2">
                  {hodOptions.map((hod) => (
                    <div key={hod.name} className={`flex items-center gap-1 px-2 py-1 rounded-full border ${formData.hod === hod.name ? 'border-indigo-500' : 'border-gray-300'}`}>
                      <img src={hod.avatar} alt={hod.name} className="w-6 h-6 rounded-full" />
                      <span className="text-xs">{hod.name}</span>
                    </div>
                  ))}
                </div>
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
                  className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
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
