import { useState } from 'react';
import { FiPlus, FiUser, FiUsers } from 'react-icons/fi';

const dummyUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@univ.edu', role: 'HOD' },
  { id: 2, name: 'Bob Smith', email: 'bob@univ.edu', role: 'TT Incharge' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@univ.edu', role: 'Faculty' },
];

export default function UserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Faculty' });

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saved user:', formData);
    closeModal();
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dummyUsers.map((user, idx) => (
              <tr key={user.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={openModal}
        className="fixed bottom-8 right-8 p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:scale-105 transition"
      >
        <FiPlus size={24} />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-11/12 max-w-md animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-6">Add / Edit User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 peer"
                />
                <label className="absolute left-4 top-3 text-gray-500 transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-indigo-500 bg-white px-1">
                  Name
                </label>
              </div>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 peer"
                />
                <label className="absolute left-4 top-3 text-gray-500 transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-indigo-500 bg-white px-1">
                  Email
                </label>
              </div>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="HOD">HOD</option>
                  <option value="TT Incharge">TT Incharge</option>
                  <option value="Faculty">Faculty</option>
                </select>
                <label className="absolute left-4 -top-3 text-xs text-indigo-500 bg-white px-1">
                  Role
                </label>
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
                  className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  💾 Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
