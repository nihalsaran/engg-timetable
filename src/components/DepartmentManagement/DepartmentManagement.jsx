import { useState } from 'react';
import DashboardLayout from '../AdminDashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';

const initialDepartments = [
  { id: 1, code: 'CSE', name: 'Computer Science', description: 'CS Dept', college: 'Engineering', contact: 'cs@univ.edu', status: 'Active', size: 40, history: [] },
  { id: 2, code: 'ECE', name: 'Electronics', description: 'ECE Dept', college: 'Engineering', contact: 'ece@univ.edu', status: 'Inactive', size: 35, history: [] },
  { id: 3, code: 'MBA', name: 'Business Admin', description: 'MBA Dept', college: 'Management', contact: 'mba@univ.edu', status: 'Active', size: 25, history: [] },
];

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [filters, setFilters] = useState({ college: '', status: '', size: '' });
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const filteredDepartments = departments.filter(dep =>
    (filters.college ? dep.college === filters.college : true) &&
    (filters.status ? dep.status === filters.status : true) &&
    (filters.size ? dep.size >= parseInt(filters.size) : true)
  );

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const openAddModal = () => {
    setEditDept(null);
    setShowModal(true);
  };

  const openEditModal = (dept) => {
    setEditDept(dept);
    setShowModal(true);
  };

  const saveDepartment = (dept) => {
    if (dept.id) {
      setDepartments(prev => prev.map(d => {
        if (d.id === dept.id) {
          return { ...dept, history: [...d.history, { ...d }] };
        }
        return d;
      }));
    } else {
      dept.id = Date.now();
      dept.history = [];
      setDepartments(prev => [...prev, dept]);
    }
    setShowModal(false);
  };

  const batchUpdateStatus = (status) => {
    setDepartments(prev => prev.map(d => selectedIds.includes(d.id) ? { ...d, status } : d));
    setSelectedIds([]);
  };

  const deleteDepartments = () => {
    setDepartments(prev => prev.filter(d => !selectedIds.includes(d.id)));
    setSelectedIds([]);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <h1 className="text-3xl font-bold">Department Management</h1>

        {/* Filters and Actions */}
        <div className="flex flex-wrap gap-4 items-center">
          <select value={filters.college} onChange={e => setFilters({ ...filters, college: e.target.value })} className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-3 py-2">
            <option value="">All Colleges</option>
            <option value="Engineering">Engineering</option>
            <option value="Management">Management</option>
          </select>
          <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-3 py-2">
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select value={filters.size} onChange={e => setFilters({ ...filters, size: e.target.value })} className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-3 py-2">
            <option value="">All Sizes</option>
            <option value="20">20+</option>
            <option value="30">30+</option>
            <option value="40">40+</option>
          </select>
          <button onClick={openAddModal} aria-label="Add Department" className="ml-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition cursor-pointer">+ Add Department</button>
          {selectedIds.length > 0 && (
            <div className="flex gap-2">
              <button onClick={() => setConfirmAction({ type: 'activate' })} aria-label="Activate Selected Departments" className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded cursor-pointer">Activate</button>
              <button onClick={() => setConfirmAction({ type: 'deactivate' })} aria-label="Deactivate Selected Departments" className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded cursor-pointer">Deactivate</button>
              <button onClick={() => setConfirmAction({ type: 'delete' })} aria-label="Delete Selected Departments" className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded cursor-pointer">Delete</button>
            </div>
          )}
        </div>

        {/* Department Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border mt-4">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr className="text-gray-900 dark:text-gray-100">
                <th className="p-2 border"><input type="checkbox" onChange={e => setSelectedIds(e.target.checked ? filteredDepartments.map(d => d.id) : [])} checked={selectedIds.length === filteredDepartments.length && filteredDepartments.length > 0} /></th>
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
                <tr key={dep.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="p-2 border"><input type="checkbox" checked={selectedIds.includes(dep.id)} onChange={() => toggleSelect(dep.id)} /></td>
                  <td className="p-2 border">{dep.code}</td>
                  <td className="p-2 border">{dep.name}</td>
                  <td className="p-2 border">{dep.college}</td>
                  <td className="p-2 border">{dep.status}</td>
                  <td className="p-2 border">{dep.size}</td>
                  <td className="p-2 border space-x-2">
                    <button onClick={() => openEditModal(dep)} aria-label={`Edit Department ${dep.name}`} className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer">Edit</button>
                    <button onClick={() => setConfirmAction({ type: dep.status === 'Active' ? 'deactivateOne' : 'activateOne', id: dep.id })} aria-label={`${dep.status === 'Active' ? 'Deactivate' : 'Activate'} Department ${dep.name}`} className="px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer">{dep.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                    <button onClick={() => setConfirmAction({ type: 'deleteOne', id: dep.id })} aria-label={`Delete Department ${dep.name}`} className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Department Hierarchy Visualization */}
        <div className="border rounded-lg p-4 mt-6 bg-gray-50 dark:bg-gray-800 transition-colors">
          <h2 className="font-semibold mb-2">Department Hierarchy</h2>
          <ul className="ml-4 list-disc">
            <li>Engineering
              <ul className="ml-4 list-disc">
                {departments.filter(d => d.college === 'Engineering').map(d => <li key={d.id}>{d.name}</li>)}
              </ul>
            </li>
            <li>Management
              <ul className="ml-4 list-disc">
                {departments.filter(d => d.college === 'Management').map(d => <li key={d.id}>{d.name}</li>)}
              </ul>
            </li>
          </ul>
        </div>

        {/* Faculty Assignment & Workload */}
        <div className="border rounded-lg p-4 mt-6 bg-gray-50 dark:bg-gray-800 transition-colors">
          <h2 className="font-semibold mb-2">Faculty Assignment & Workload</h2>
          <table className="min-w-full border">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-2 border">Faculty Name</th>
                <th className="p-2 border">Department</th>
                <th className="p-2 border">Workload (hrs/week)</th>
                <th className="p-2 border">HOD</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Example static data, replace with dynamic later */}
              <tr>
                <td className="p-2 border">Dr. Smith</td>
                <td className="p-2 border">Computer Science</td>
                <td className="p-2 border">12</td>
                <td className="p-2 border">Yes</td>
                <td className="p-2 border space-x-2">
                  <button className="px-2 py-1 text-sm bg-green-500 text-white rounded cursor-pointer">Edit</button>
                  <button className="px-2 py-1 text-sm bg-red-500 text-white rounded cursor-pointer">Remove</button>
                </td>
              </tr>
              <tr>
                <td className="p-2 border">Prof. Jane</td>
                <td className="p-2 border">Electronics</td>
                <td className="p-2 border">10</td>
                <td className="p-2 border">No</td>
                <td className="p-2 border space-x-2">
                  <button className="px-2 py-1 text-sm bg-green-500 text-white rounded cursor-pointer">Edit</button>
                  <button className="px-2 py-1 text-sm bg-red-500 text-white rounded cursor-pointer">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
          <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer" aria-label="Assign Faculty">+ Assign Faculty</button>
        </div>

        {/* Timetable Settings */}
        <div className="border rounded-lg p-4 mt-6 bg-gray-50 dark:bg-gray-800 transition-colors">
          <h2 className="font-semibold mb-2">Timetable Settings</h2>
          <form className="space-y-4">
            <div>
              <label className="block mb-1">Max Hours per Day</label>
              <input type="number" placeholder="e.g., 6" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block mb-1">Max Hours per Week</label>
              <input type="number" placeholder="e.g., 30" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block mb-1">Break Duration (minutes)</label>
              <input type="number" placeholder="e.g., 15" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block mb-1">Allowed Days</label>
              <select multiple className="w-full border rounded px-3 py-2">
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
              </select>
            </div>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer">Save Settings</button>
          </form>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg space-y-4">
              <h2 className="text-xl font-semibold mb-2">{editDept ? 'Edit Department' : 'Add Department'}</h2>
              <form onSubmit={e => { e.preventDefault();
                const formData = new FormData(e.target);
                const dept = Object.fromEntries(formData.entries());
                dept.id = editDept?.id;
                dept.size = parseInt(dept.size);
                saveDepartment(dept);
              }} className="space-y-4">
                <input name="code" defaultValue={editDept?.code || ''} placeholder="Code" required className="w-full border rounded px-3 py-2" />
                <input name="name" defaultValue={editDept?.name || ''} placeholder="Name" required className="w-full border rounded px-3 py-2" />
                <textarea name="description" defaultValue={editDept?.description || ''} placeholder="Description" className="w-full border rounded px-3 py-2" />
                <input name="college" defaultValue={editDept?.college || ''} placeholder="College" required className="w-full border rounded px-3 py-2" />
                <input name="contact" defaultValue={editDept?.contact || ''} placeholder="Contact Email" className="w-full border rounded px-3 py-2" />
                <input name="size" type="number" defaultValue={editDept?.size || ''} placeholder="Size" className="w-full border rounded px-3 py-2" />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowModal(false)} aria-label="Cancel" className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 cursor-pointer">Cancel</button>
                  <button type="submit" aria-label="Save Department" className="px-4 py-2 rounded bg-indigo-600 text-white cursor-pointer">Save</button>
                </div>
              </form>
              {editDept && editDept.history?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Edit History</h3>
                  <ul className="max-h-32 overflow-y-auto space-y-1 text-sm">
                    {editDept.history.map((h, idx) => (
                      <li key={idx} className="border p-2 rounded">{JSON.stringify(h)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md space-y-4">
              <h2 className="text-lg font-semibold">Confirm Action</h2>
              <p>Are you sure you want to {confirmAction.type.includes('activate') ? 'activate' : confirmAction.type.includes('deactivate') ? 'deactivate' : 'delete'} {confirmAction.id ? 'this department' : 'selected departments'}?</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setConfirmAction(null)} aria-label="Cancel Action" className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 cursor-pointer">Cancel</button>
                <button onClick={() => {
                  if (confirmAction.type === 'activate') batchUpdateStatus('Active');
                  else if (confirmAction.type === 'deactivate') batchUpdateStatus('Inactive');
                  else if (confirmAction.type === 'delete') deleteDepartments();
                  else if (confirmAction.type === 'activateOne') setDepartments(prev => prev.map(d => d.id === confirmAction.id ? { ...d, status: 'Active' } : d));
                  else if (confirmAction.type === 'deactivateOne') setDepartments(prev => prev.map(d => d.id === confirmAction.id ? { ...d, status: 'Inactive' } : d));
                  else if (confirmAction.type === 'deleteOne') setDepartments(prev => prev.filter(d => d.id !== confirmAction.id));
                  setConfirmAction(null);
                }} aria-label="Confirm Action" className="px-4 py-2 rounded bg-red-600 text-white cursor-pointer">Confirm</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
