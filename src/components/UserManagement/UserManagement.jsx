import { useState } from 'react';
import DashboardLayout from '../AdminDashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';

const initialUsers = [
  { id: 1, name: 'Alice', email: 'alice@univ.edu', role: 'Admin', departments: ['CSE'], status: 'Active', lastLogin: '2025-04-08 10:00', permissions: ['manage_users'], audit: [] },
  { id: 2, name: 'Bob', email: 'bob@univ.edu', role: 'Faculty', departments: ['ECE', 'CSE'], status: 'Inactive', lastLogin: '2025-04-07 09:30', permissions: ['view_timetable'], audit: [] },
];

const defaultRoles = ['Admin', 'Faculty', 'HOD'];

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [filters, setFilters] = useState({ role: '', department: '', status: '' });
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [customRoles, setCustomRoles] = useState([]);
  const [showImport, setShowImport] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const filteredUsers = users.filter(u =>
    (filters.role ? u.role === filters.role : true) &&
    (filters.department ? u.departments.includes(filters.department) : true) &&
    (filters.status ? u.status === filters.status : true)
  );

  const saveUser = (user) => {
    if (user.id) {
      setUsers(prev => prev.map(u => {
        if (u.id === user.id) {
          return { ...user, audit: [...u.audit, { action: 'Edited', date: new Date().toISOString() }] };
        }
        return u;
      }));
    } else {
      user.id = Date.now();
      user.audit = [{ action: 'Created', date: new Date().toISOString() }];
      user.lastLogin = '';
      setUsers(prev => [...prev, user]);
    }
    setShowModal(false);
  };

  const toggleStatus = (id, status) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status, audit: [...u.audit, { action: `Status changed to ${status}`, date: new Date().toISOString() }] } : u));
  };

  const resetPassword = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, audit: [...u.audit, { action: 'Password Reset', date: new Date().toISOString() }] } : u));
    alert('Password reset link sent to user email.');
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let pwd = '';
    for (let i = 0; i < 12; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    return pwd;
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <h1 className="text-3xl font-bold">User Management</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <select value={filters.role} onChange={e => setFilters({ ...filters, role: e.target.value })} className="border rounded px-3 py-2">
            <option value="">All Roles</option>
            {[...defaultRoles, ...customRoles].map(r => <option key={r}>{r}</option>)}
          </select>
          <select value={filters.department} onChange={e => setFilters({ ...filters, department: e.target.value })} className="border rounded px-3 py-2">
            <option value="">All Departments</option>
            <option>CSE</option>
            <option>ECE</option>
            <option>MBA</option>
          </select>
          <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} className="border rounded px-3 py-2">
            <option value="">All Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Locked</option>
          </select>
          <button onClick={() => setShowModal(true)} aria-label="Add User" className="ml-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded cursor-pointer">+ Add User</button>
          <button onClick={() => setShowImport(true)} aria-label="Import Users" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded cursor-pointer">Import Users</button>
          <button onClick={() => setShowRoleModal(true)} aria-label="Manage Roles" className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded cursor-pointer">Manage Roles</button>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border mt-4">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Departments</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Last Login</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-2 border">{u.name}</td>
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border">{u.role}</td>
                  <td className="p-2 border">{u.departments.join(', ')}</td>
                  <td className="p-2 border">{u.status}</td>
                  <td className="p-2 border">{u.lastLogin}</td>
                  <td className="p-2 border space-x-2">
                    <button onClick={() => { setEditUser(u); setShowModal(true); }} aria-label={`Edit user ${u.name}`} className="px-2 py-1 text-sm bg-green-500 text-white rounded cursor-pointer">Edit</button>
                    <button onClick={() => toggleStatus(u.id, u.status === 'Active' ? 'Inactive' : 'Active')} aria-label={`${u.status === 'Active' ? 'Deactivate' : 'Activate'} user ${u.name}`} className="px-2 py-1 text-sm bg-yellow-500 text-white rounded cursor-pointer">{u.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                    <button onClick={() => toggleStatus(u.id, 'Locked')} aria-label={`Lock user ${u.name}`} className="px-2 py-1 text-sm bg-red-500 text-white rounded cursor-pointer">Lock</button>
                    <button onClick={() => resetPassword(u.id)} aria-label={`Reset password for ${u.name}`} className="px-2 py-1 text-sm bg-indigo-500 text-white rounded cursor-pointer">Reset Password</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User Activity Tracking */}
        <div className="mt-6">
          <h2 className="font-semibold mb-2">User Activity Logs</h2>
          <ul className="max-h-48 overflow-y-auto border rounded p-2 space-y-1 text-sm">
            {users.flatMap(u => u.audit.map((a, idx) => (
              <li key={`${u.id}-${idx}`}>{u.name}: {a.action} at {a.date}</li>
            )))}
          </ul>
        </div>

        {/* User Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg space-y-4">
                <h2 className="text-xl font-semibold mb-2">{editUser ? 'Edit User' : 'Add User'}</h2>
                <form onSubmit={e => { e.preventDefault();
                  const formData = new FormData(e.target);
                  const user = Object.fromEntries(formData.entries());
                  user.id = editUser?.id;
                  user.departments = formData.getAll('departments');
                  user.permissions = user.permissions ? user.permissions.split(',').map(p => p.trim()) : [];
                  saveUser(user);
                }} className="space-y-4">
                  <input name="name" defaultValue={editUser?.name || ''} placeholder="Name" required className="w-full border rounded px-3 py-2" />
                  <input name="email" defaultValue={editUser?.email || ''} placeholder="Email" required className="w-full border rounded px-3 py-2" />
                  <select name="role" defaultValue={editUser?.role || ''} required className="w-full border rounded px-3 py-2">
                    <option value="">Select Role</option>
                    {[...defaultRoles, ...customRoles].map(r => <option key={r}>{r}</option>)}
                  </select>
                  <label>Departments (Ctrl/Cmd+Click to select multiple)</label>
                  <select name="departments" multiple defaultValue={editUser?.departments || []} className="w-full border rounded px-3 py-2">
                    <option>CSE</option>
                    <option>ECE</option>
                    <option>MBA</option>
                  </select>
                  <textarea name="permissions" defaultValue={editUser?.permissions?.join(', ') || ''} placeholder="Permissions (comma separated)" className="w-full border rounded px-3 py-2" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => alert('Generated Password: ' + generatePassword())} aria-label="Generate Password" className="px-4 py-2 rounded bg-green-600 text-white cursor-pointer">Generate Password</button>
                    <button type="button" onClick={() => alert('Email notification sent!')} aria-label="Send Email Notification" className="px-4 py-2 rounded bg-indigo-600 text-white cursor-pointer">Send Email</button>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowModal(false)} aria-label="Cancel" className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 cursor-pointer">Cancel</button>
                    <button type="submit" aria-label="Save User" className="px-4 py-2 rounded bg-indigo-600 text-white cursor-pointer">Save</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Import Modal */}
        <AnimatePresence>
          {showImport && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg space-y-4">
                <h2 className="text-xl font-semibold mb-2">Import Users</h2>
                <p>Upload CSV or Excel file. Map fields accordingly.</p>
                <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" className="w-full" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowImport(false)} aria-label="Cancel Import" className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 cursor-pointer">Cancel</button>
                  <button onClick={() => { alert('Import simulated'); setShowImport(false); }} aria-label="Confirm Import" className="px-4 py-2 rounded bg-green-600 text-white cursor-pointer">Import</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Role Management Modal */}
        <AnimatePresence>
          {showRoleModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md space-y-4">
                <h2 className="text-xl font-semibold mb-2">Manage Roles</h2>
                <ul className="space-y-2">
                  {[...defaultRoles, ...customRoles].map(r => <li key={r} className="border rounded p-2">{r}</li>)}
                </ul>
                <form onSubmit={e => { e.preventDefault();
                  const role = e.target.role.value.trim();
                  if(role && !customRoles.includes(role) && !defaultRoles.includes(role)) {
                    setCustomRoles(prev => [...prev, role]);
                  }
                  e.target.reset();
                }} className="flex gap-2 mt-4">
                  <input name="role" placeholder="New Role" className="flex-1 border rounded px-3 py-2" />
                  <button type="submit" aria-label="Add Role" className="px-4 py-2 rounded bg-indigo-600 text-white cursor-pointer">Add</button>
                </form>
                <div className="flex justify-end">
                  <button onClick={() => setShowRoleModal(false)} aria-label="Close Role Management" className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 cursor-pointer">Close</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

