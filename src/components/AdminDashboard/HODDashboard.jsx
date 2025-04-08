import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ExclamationTriangleIcon, UserIcon, ClipboardDocumentCheckIcon, ChartBarIcon, BellIcon } from '@heroicons/react/24/outline';

const facultyList = [
  { name: 'Dr. Smith', available: true, onCampus: true },
  { name: 'Prof. Jane', available: false, onCampus: false },
  { name: 'Dr. Lee', available: true, onCampus: false },
];

const deadlines = [
  { title: 'Submit Timetable Draft', date: '2025-04-15' },
  { title: 'Finalize Faculty Assignments', date: '2025-04-20' },
];

const recentChanges = [
  'Prof. Jane requested schedule change',
  'Dr. Smith updated course assignments',
  'ECE timetable conflict resolved',
];

const announcements = [
  'Department meeting on April 12th',
  'Submit leave requests by April 10th',
];

const conflicts = [
  { message: 'Room clash for CSE101', severity: 'High' },
  { message: 'Faculty overlap: Dr. Lee', severity: 'Medium' },
];

const requests = [
  { id: 1, faculty: 'Prof. Jane', request: 'Swap slot with Dr. Lee', status: 'Pending' },
  { id: 2, faculty: 'Dr. Smith', request: 'Reduce workload on Friday', status: 'Approved' },
];

const metrics = [
  { label: 'Courses Offered', current: 12, previous: 10 },
  { label: 'Faculty Load (hrs)', current: 180, previous: 170 },
  { label: 'Conflicts', current: 3, previous: 5 },
];

const academicDates = [
  { date: '2025-04-10', label: 'Leave Deadline' },
  { date: '2025-04-15', label: 'Draft Submission' },
  { date: '2025-04-20', label: 'Finalization' },
];

export default function HODDashboard() {
  const [filter, setFilter] = useState('All');

  return (
    <div className="min-h-screen p-6 space-y-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold">HOD Dashboard</h1>

      {/* Announcements */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold flex items-center gap-2"><BellIcon className="w-5 h-5"/>Announcements</h2>
        <ul className="list-disc ml-6">
          {announcements.map((a, idx) => <li key={idx}>{a}</li>)}
        </ul>
      </section>

      {/* Deadlines */}
      <section>
        <h2 className="text-xl font-semibold flex items-center gap-2"><CalendarIcon className="w-5 h-5"/>Upcoming Deadlines</h2>
        <ul className="list-disc ml-6">
          {deadlines.map((d, idx) => <li key={idx}>{d.title} - {d.date}</li>)}
        </ul>
      </section>

      {/* Conflict Alerts */}
      <section>
        <h2 className="text-xl font-semibold flex items-center gap-2"><ExclamationTriangleIcon className="w-5 h-5"/>Conflict Alerts</h2>
        <ul className="ml-6">
          {conflicts.map((c, idx) => (
            <li key={idx} className={`mb-1 p-2 rounded ${c.severity==='High' ? 'bg-red-100 text-red-700' : c.severity==='Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
              {c.message} ({c.severity})
            </li>
          ))}
        </ul>
      </section>

      {/* Faculty Availability & Presence */}
      <section>
        <h2 className="text-xl font-semibold flex items-center gap-2"><UserIcon className="w-5 h-5"/>Faculty Availability</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {facultyList.map((f, idx) => (
            <div key={idx} className="border rounded p-3 flex flex-col gap-2">
              <span className="font-semibold">{f.name}</span>
              <span className={`text-sm ${f.available ? 'text-green-600' : 'text-red-600'}`}>{f.available ? 'Available' : 'Unavailable'}</span>
              <span className={`text-sm ${f.onCampus ? 'text-green-600' : 'text-gray-500'}`}>{f.onCampus ? 'On Campus' : 'Off Campus'}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Changes */}
      <section>
        <h2 className="text-xl font-semibold flex items-center gap-2"><ClipboardDocumentCheckIcon className="w-5 h-5"/>Recent Changes</h2>
        <ul className="list-disc ml-6">
          {recentChanges.map((c, idx) => <li key={idx}>{c}</li>)}
        </ul>
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="text-xl font-semibold flex items-center gap-2"><ChartBarIcon className="w-5 h-5"/>Quick Links</h2>
        <div className="flex flex-wrap gap-4">
          <a href="/user-management" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Manage Faculty</a>
          <a href="/departments" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Assign Courses</a>
          <a href="/reports" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">View Reports</a>
        </div>
      </section>

      {/* Mini Calendar */}
      <section>
        <h2 className="text-xl font-semibold flex items-center gap-2"><CalendarIcon className="w-5 h-5"/>Key Academic Dates</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {academicDates.map((d, idx) => (
            <div key={idx} className="border rounded p-2 text-center">
              <div className="font-semibold">{d.date}</div>
              <div className="text-sm">{d.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Department Metrics */}
      <section>
        <h2 className="text-xl font-semibold">Department Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((m, idx) => (
            <div key={idx} className="border rounded p-3">
              <div className="font-semibold">{m.label}</div>
              <div>Current: {m.current}</div>
              <div>Previous: {m.previous}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Request Management */}
      <section>
        <h2 className="text-xl font-semibold">Schedule Change Requests</h2>
        <table className="min-w-full border">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2 border">Faculty</th>
              <th className="p-2 border">Request</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id}>
                <td className="p-2 border">{r.faculty}</td>
                <td className="p-2 border">{r.request}</td>
                <td className="p-2 border">{r.status}</td>
                <td className="p-2 border space-x-2">
                  <button className="px-2 py-1 bg-green-500 text-white rounded">Approve</button>
                  <button className="px-2 py-1 bg-red-500 text-white rounded">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
