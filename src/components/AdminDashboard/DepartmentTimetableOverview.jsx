import { useState } from 'react';
import { CalendarIcon, EyeIcon, EyeSlashIcon, PrinterIcon, ArrowPathIcon, PencilIcon } from '@heroicons/react/24/outline';

const sampleTimetable = [
  { id: 1, day: 'Monday', time: '9:00-10:00', course: 'CSE101', instructor: 'Dr. Smith', room: 'A101', group: 'CSE Sem 2', color: 'bg-indigo-200' },
  { id: 2, day: 'Monday', time: '10:00-11:00', course: 'ECE201', instructor: 'Prof. Jane', room: 'B202', group: 'ECE Sem 4', color: 'bg-green-200' },
  { id: 3, day: 'Tuesday', time: '9:00-10:00', course: 'MBA301', instructor: 'Dr. Lee', room: 'C303', group: 'MBA Sem 1', color: 'bg-yellow-200' },
];

const academicEvents = [
  { date: '2025-04-14', label: 'Holiday: Ambedkar Jayanti' },
  { date: '2025-04-20', label: 'Midterm Exams Start' },
];

export default function DepartmentTimetableOverview() {
  const [viewMode, setViewMode] = useState('Weekly');
  const [filter, setFilter] = useState('');
  const [visibility, setVisibility] = useState('Private');

  return (
    <div className="min-h-screen p-6 space-y-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold">Department Timetable Overview</h1>

      {/* View toggles */}
      <div className="flex flex-wrap gap-4">
        <select value={viewMode} onChange={e => setViewMode(e.target.value)} className="border rounded px-3 py-2">
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Program View</option>
          <option>Semester View</option>
        </select>
        <input placeholder="Filter by faculty, room, course" value={filter} onChange={e => setFilter(e.target.value)} className="border rounded px-3 py-2 flex-1" />
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"><ArrowPathIcon className="w-5 h-5"/>Compare Drafts</button>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"><PrinterIcon className="w-5 h-5"/>Export/Print</button>
        <button onClick={() => setVisibility(visibility === 'Private' ? 'Public' : 'Private')} className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
          {visibility === 'Private' ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
          {visibility}
        </button>
      </div>

      {/* Academic Calendar */}
      <section>
        <h2 className="text-xl font-semibold flex items-center gap-2"><CalendarIcon className="w-5 h-5"/>Academic Events</h2>
        <ul className="list-disc ml-6">
          {academicEvents.map((e, idx) => <li key={idx}>{e.date}: {e.label}</li>)}
        </ul>
      </section>

      {/* Timetable grid */}
      <section className="overflow-x-auto">
        <table className="min-w-full border mt-4">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2 border">Day</th>
              <th className="p-2 border">Time</th>
              <th className="p-2 border">Course</th>
              <th className="p-2 border">Instructor</th>
              <th className="p-2 border">Room</th>
              <th className="p-2 border">Group</th>
              <th className="p-2 border">Notes</th>
            </tr>
          </thead>
          <tbody>
            {sampleTimetable.filter(t => t.course.includes(filter) || t.instructor.includes(filter) || t.room.includes(filter) || t.group.includes(filter)).map(t => (
              <tr key={t.id} className={`${t.color} border`}>
                <td className="p-2 border">{t.day}</td>
                <td className="p-2 border">{t.time}</td>
                <td className="p-2 border font-semibold">{t.course}</td>
                <td className="p-2 border">{t.instructor}</td>
                <td className="p-2 border">{t.room}</td>
                <td className="p-2 border">{t.group}</td>
                <td className="p-2 border">
                  <button className="flex items-center gap-1 px-2 py-1 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600">
                    <PencilIcon className="w-4 h-4"/>Add Note
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
