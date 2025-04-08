import { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const barData = [
  { name: 'CSE', classes: 40 },
  { name: 'ECE', classes: 30 },
  { name: 'MECH', classes: 20 },
  { name: 'CIVIL', classes: 15 },
];

const pieData = [
  { name: 'Free Slots', value: 60 },
  { name: 'Occupied', value: 40 },
];

const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'];

export default function ReportsAnalytics() {
  const [view, setView] = useState('summary');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setView('summary')}
            className={`px-4 py-2 rounded-full border ${view === 'summary' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100'}`}
          >
            Summary
          </button>
          <button
            onClick={() => setView('detailed')}
            className={`px-4 py-2 rounded-full border ${view === 'detailed' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100'}`}
          >
            Detailed View
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-xl p-6 hover:scale-[1.02] transition">
          <h2 className="font-semibold mb-4">Classes per Department</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <Tooltip />
              <Legend />
              <Bar dataKey="classes" fill="#6366F1" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 hover:scale-[1.02] transition">
          <h2 className="font-semibold mb-4">Slot Utilization</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mt-6">
        <button className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 transition">
          📥 Export PDF
        </button>
        <button className="px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-100 transition">
          📊 View Department Stats
        </button>
        <button className="px-6 py-3 rounded-full bg-green-600 text-white hover:bg-green-700 transition">
          📤 Share Report
        </button>
      </div>
    </div>
  );
}
