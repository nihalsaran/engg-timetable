import React from 'react';

export default function SuperAdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center justify-center">
        <h2 className="text-lg font-semibold mb-2">Total Users</h2>
        <p className="text-3xl font-bold">120</p>
      </div>
      <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center justify-center">
        <h2 className="text-lg font-semibold mb-2">Total Departments</h2>
        <p className="text-3xl font-bold">8</p>
      </div>
      <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center justify-center">
        <h2 className="text-lg font-semibold mb-2">Conflicts Detected Today</h2>
        <p className="text-3xl font-bold">3</p>
      </div>
      <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center justify-center">
        <h2 className="text-lg font-semibold mb-2">Active Semesters</h2>
        <p className="text-3xl font-bold">2</p>
      </div>

      <div className="md:col-span-4 flex flex-wrap gap-4 justify-center mt-4">
        <button className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:opacity-90 transition">
          ➕ Add New User
        </button>
        <button className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
          📊 Generate Report
        </button>
        <button className="px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">
          ⚙️ Manage Semester
        </button>
      </div>
    </div>
  );
}
