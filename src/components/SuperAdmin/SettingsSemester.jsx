import { useState } from 'react';

const dummySemesters = [
  { id: 1, name: 'Spring 2024', status: 'Completed' },
  { id: 2, name: 'Fall 2024', status: 'Ongoing' },
];

export default function SettingsSemester() {
  const [activeTab, setActiveTab] = useState('semester');
  const [showCloneModal, setShowCloneModal] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('semester')}
          className={`px-4 py-2 rounded-full border ${activeTab === 'semester' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100'}`}
        >
          Semester Management
        </button>
        <button
          onClick={() => setActiveTab('other')}
          className={`px-4 py-2 rounded-full border ${activeTab === 'other' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100'}`}
        >
          Other Settings
        </button>
      </div>

      {activeTab === 'semester' && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Semesters Timeline</h2>
          <div className="relative border-l-2 border-indigo-300 ml-4">
            {dummySemesters.map((sem) => (
              <div key={sem.id} className="mb-6 ml-4">
                <div className="absolute -left-3 top-1.5 w-6 h-6 rounded-full border-2 border-indigo-500 bg-white"></div>
                <div className="p-4 bg-white rounded-xl shadow hover:scale-[1.02] transition">
                  <h3 className="font-semibold">{sem.name}</h3>
                  <p className="text-sm text-gray-500">Status: {sem.status}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            <button className="px-6 py-3 rounded-full bg-green-600 text-white hover:bg-green-700 transition">
              🚀 Start New Semester
            </button>
            <button
              onClick={() => setShowCloneModal(true)}
              className="px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              ♻️ Clone Last Semester
            </button>
          </div>
        </div>
      )}

      {activeTab === 'other' && (
        <div>
          <p className="text-gray-500">Other settings content here...</p>
        </div>
      )}

      {showCloneModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-11/12 max-w-md animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-6">Clone Last Semester</h2>
            <p>Are you sure you want to clone the last semester? This will duplicate all timetable data.</p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowCloneModal(false)}
                className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCloneModal(false)}
                className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Confirm Clone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
