import { useState } from 'react';
import { ChartBarIcon, ArrowDownTrayIcon, ExclamationTriangleIcon, UserIcon, PencilIcon } from '@heroicons/react/24/outline';

const facultyData = [
  { id: 1, name: 'Dr. Smith', teaching: 12, research: 8, admin: 4, expertise: 'AI, ML', preferences: 'Morning', leave: 'None', contractLimit: 25, feedback: '' },
  { id: 2, name: 'Prof. Jane', teaching: 15, research: 5, admin: 3, expertise: 'VLSI', preferences: 'Afternoon', leave: 'April 15-20', contractLimit: 24, feedback: '' },
  { id: 3, name: 'Dr. Lee', teaching: 10, research: 10, admin: 2, expertise: 'Finance', preferences: 'No Fridays', leave: 'None', contractLimit: 22, feedback: '' },
];

export default function FacultyWorkloadManagement() {
  const [feedbacks, setFeedbacks] = useState({});

  return (
    <div className="min-h-screen p-6 space-y-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold">Faculty Workload Management</h1>

      {/* Export button */}
      <div className="flex gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"><ArrowDownTrayIcon className="w-5 h-5"/>Export Reports</button>
      </div>

      {/* Workload Table */}
      <section className="overflow-x-auto">
        <table className="min-w-full border mt-4">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2 border">Faculty</th>
              <th className="p-2 border">Teaching Hours</th>
              <th className="p-2 border">Research Hours</th>
              <th className="p-2 border">Admin Duties</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Expertise</th>
              <th className="p-2 border">Preferences</th>
              <th className="p-2 border">Leave</th>
              <th className="p-2 border">Contract Limit</th>
              <th className="p-2 border">Warnings</th>
              <th className="p-2 border">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {facultyData.map(f => {
              const total = f.teaching + f.research + f.admin;
              const warning = total > f.contractLimit;
              return (
                <tr key={f.id} className="border">
                  <td className="p-2 border">{f.name}</td>
                  <td className="p-2 border">{f.teaching}</td>
                  <td className="p-2 border">{f.research}</td>
                  <td className="p-2 border">{f.admin}</td>
                  <td className="p-2 border font-semibold">{total}</td>
                  <td className="p-2 border">{f.expertise}</td>
                  <td className="p-2 border">{f.preferences}</td>
                  <td className="p-2 border">{f.leave}</td>
                  <td className="p-2 border">{f.contractLimit}</td>
                  <td className="p-2 border">{warning && <span className="flex items-center gap-1 text-red-600"><ExclamationTriangleIcon className="w-4 h-4"/>Over Limit</span>}</td>
                  <td className="p-2 border">
                    <textarea
                      placeholder="Feedback"
                      value={feedbacks[f.id] || ''}
                      onChange={e => setFeedbacks({ ...feedbacks, [f.id]: e.target.value })}
                      className="w-32 border rounded px-2 py-1"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Comparison & Equity */}
      <section>
        <h2 className="text-xl font-semibold flex items-center gap-2"><ChartBarIcon className="w-5 h-5"/>Workload Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {facultyData.map(f => {
            const total = f.teaching + f.research + f.admin;
            return (
              <div key={f.id} className="border rounded p-3">
                <div className="font-semibold">{f.name}</div>
                <div>Teaching: {f.teaching} hrs</div>
                <div>Research: {f.research} hrs</div>
                <div>Admin: {f.admin} hrs</div>
                <div className="font-bold">Total: {total} hrs</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Historical Trends */}
      <section>
        <h2 className="text-xl font-semibold">Historical Workload Trends</h2>
        <div className="mt-4">(Trend visualization placeholder)</div>
      </section>

      {/* Automated Suggestions */}
      <section>
        <h2 className="text-xl font-semibold">Balancing Suggestions</h2>
        <ul className="list-disc ml-6 mt-2">
          <li>Reduce Dr. Smith's teaching hours by 2 hrs</li>
          <li>Increase Prof. Jane's research allocation by 1 hr</li>
          <li>Reassign admin duties from Dr. Lee to Prof. Jane</li>
        </ul>
        <div className="mt-2 text-sm text-gray-500">(Impact analysis placeholder)</div>
      </section>
    </div>
  );
}
