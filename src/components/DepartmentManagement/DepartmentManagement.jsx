import { useState } from 'react';
import DashboardLayout from '../AdminDashboard/DashboardLayout';

const mockDepartments = [
  { id: 1, code: 'CSE', name: 'Computer Science', college: 'Engineering', status: 'Active', size: 40 },
  { id: 2, code: 'ECE', name: 'Electronics', college: 'Engineering', status: 'Inactive', size: 35 },
  { id: 3, code: 'MBA', name: 'Business Admin', college: 'Management', status: 'Active', size: 25 },
];

export default function DepartmentManagement() {
  const [filters, setFilters] = useState({ college: '', status: '', size: '' });

  const filteredDepartments = mockDepartments.filter(dep =>
    (filters.college ? dep.college === filters.college : true) &&
    (filters.status ? dep.status === filters.status : true) &&
    (filters.size ? dep.size >= parseInt(filters.size) : true)
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Department Management</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.college}
            onChange={e => setFilters({ ...filters, college: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="">All Colleges</option>
            <option value="Engineering">Engineering</option>
            <option value="Management">Management</option>
          </select>
          <select
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={filters.size}
            onChange={e => setFilters({ ...filters, size: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="">All Sizes</option>
            <option value="20">20+</option>
            <option value="30">30+</option>
            <option value="40">40+</option>
          </select>
          <button className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">+ Add Department</button>
        </div>

        {/* Department Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border mt-4">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-2 border">Code</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">College</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Size</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map(dep => (
                <tr key={dep.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-2 border">{dep.code}</td>
                  <td className="p-2 border">{dep.name}</td>
                  <td className="p-2 border">{dep.college}</td>
                  <td className="p-2 border">{dep.status}</td>
                  <td className="p-2 border">{dep.size}</td>
                  <td className="p-2 border space-x-2">
                    <button className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">Edit</button>
                    <button className="px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">Toggle</button>
                    <button className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Placeholder panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="border rounded-lg p-4">Department Hierarchy Visualization (Coming Soon)</div>
          <div className="border rounded-lg p-4">Faculty Assignment & Workload (Coming Soon)</div>
          <div className="border rounded-lg p-4">Timetable Settings (Coming Soon)</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
