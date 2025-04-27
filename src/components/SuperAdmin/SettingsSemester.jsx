import { useState, useEffect } from 'react';
import { FiCalendar, FiSettings, FiUsers, FiInfo, FiArrowRight, FiCheck, FiClock, FiEdit } from 'react-icons/fi';
import { 
  getAllSemesters, 
  getCurrentSemester, 
  getPastSemesters, 
  getSemesterById,
  createNewSemester,
  cloneSemester,
  getSemesterStatistics
} from './services/SettingsSemester';

export default function SettingsSemester() {
  // UI State
  const [activeTab, setActiveTab] = useState('semester');
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [showNewSemesterModal, setShowNewSemesterModal] = useState(false);
  const [cloneTimetable, setCloneTimetable] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);
  
  // Data State
  const [semesters, setSemesters] = useState([]);
  const [currentSemester, setCurrentSemester] = useState(null);
  const [pastSemesters, setPastSemesters] = useState([]);
  const [semesterStats, setSemesterStats] = useState(null);
  
  // Form state for new semester
  const [newSemester, setNewSemester] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });

  // Load data on component mount
  useEffect(() => {
    setSemesters(getAllSemesters());
    setCurrentSemester(getCurrentSemester());
    setPastSemesters(getPastSemesters());
  }, []);
  
  // Load semester statistics when a semester is selected
  useEffect(() => {
    if (selectedSemester) {
      setSemesterStats(getSemesterStatistics(selectedSemester.id));
    }
  }, [selectedSemester]);

  const handleNewSemesterSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createNewSemester({ ...newSemester, cloneTimetable });
      if (result.success) {
        // In a real app, you'd refresh the semesters list here
        setShowNewSemesterModal(false);
        
        // Reset form
        setNewSemester({
          name: '',
          startDate: '',
          endDate: ''
        });
      }
    } catch (error) {
      console.error('Error creating semester:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSemester({ ...newSemester, [name]: value });
  };

  const handleCloneSemester = async () => {
    try {
      const result = await cloneSemester(cloneTimetable);
      if (result.success) {
        // In a real app, you'd refresh the semesters list here
        setShowCloneModal(false);
      }
    } catch (error) {
      console.error('Error cloning semester:', error);
    }
  };

  const handleSelectSemester = (semester) => {
    setSelectedSemester(semester);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Enhanced Tab Navigation with Icons */}
      <div className="flex gap-4 mb-8 border-b pb-1">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-tl-lg rounded-tr-lg flex items-center gap-2 transition-all ${
            activeTab === 'general' 
              ? 'bg-white text-indigo-600 border-t border-l border-r border-indigo-200 shadow-sm -mb-px' 
              : 'text-gray-500 hover:text-indigo-500'
          }`}
        >
          <FiSettings className="text-lg" />
          <span>General</span>
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 rounded-tl-lg rounded-tr-lg flex items-center gap-2 transition-all ${
            activeTab === 'roles' 
              ? 'bg-white text-indigo-600 border-t border-l border-r border-indigo-200 shadow-sm -mb-px' 
              : 'text-gray-500 hover:text-indigo-500'
          }`}
        >
          <FiUsers className="text-lg" />
          <span>Roles & Permissions</span>
        </button>
        <button
          onClick={() => setActiveTab('semester')}
          className={`px-4 py-2 rounded-tl-lg rounded-tr-lg flex items-center gap-2 transition-all ${
            activeTab === 'semester' 
              ? 'bg-white text-indigo-600 border-t border-l border-r border-indigo-200 shadow-sm -mb-px' 
              : 'text-gray-500 hover:text-indigo-500'
          }`}
        >
          <FiCalendar className="text-lg" />
          <span>Semester Management</span>
        </button>
      </div>

      {activeTab === 'general' && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4">General Settings</h2>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-600">Institute Name</label>
              <input 
                type="text" 
                defaultValue="Engineering College" 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-600">System Email</label>
              <input 
                type="email" 
                defaultValue="admin@engg-college.edu" 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Enable Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4">Roles & Permissions</h2>
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="font-medium">Super Admin</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between py-2">
                  <span>Full System Access</span>
                  <span className="text-green-600 flex items-center gap-1">
                    <FiCheck />
                    Granted
                  </span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="font-medium">HOD</h3>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between py-1">
                  <span>Manage Faculty</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>View Timetable</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Modify Timetable</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="font-medium">TT Incharge</h3>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between py-1">
                  <span>Build Timetable</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'semester' && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Current Semester</h2>
            {currentSemester && (
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                      <h3 className="font-bold text-xl">{currentSemester.name}</h3>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-600 gap-2">
                      <FiClock className="text-gray-400" />
                      <span>
                        {new Date(currentSemester.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                        {new Date(currentSemester.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Active
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-blue-500" 
                      style={{ width: '60%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1 text-gray-500">
                    <span>0%</span>
                    <span>60% Complete</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Semester Timeline</h2>
              <button className="text-xs text-indigo-600 hover:underline">View All</button>
            </div>
            
            <div className="relative border-l-2 border-indigo-300 ml-4">
              {pastSemesters.map((sem) => (
                <div key={sem.id} className="mb-6 ml-4">
                  <div className="absolute -left-3 top-1.5 w-6 h-6 rounded-full border-2 border-indigo-500 bg-white"></div>
                  <div className="p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{sem.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(sem.startDate).toLocaleDateString()} - {new Date(sem.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        sem.status === 'Completed' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sem.status}
                      </span>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button 
                        onClick={() => handleSelectSemester(sem)}
                        className="text-indigo-600 text-sm hover:underline flex items-center gap-1"
                      >
                        View Details
                        <FiArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Semester Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">Clone Timetable with New Semester</span>
                  <div className="relative">
                    <button
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiInfo size={16} />
                    </button>
                    
                    {showTooltip && (
                      <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 w-64 bg-gray-800 text-white text-xs p-2 rounded z-10 shadow-lg">
                        When creating a new semester, clone the timetable structure from the previous semester as a starting point.
                      </div>
                    )}
                  </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={cloneTimetable} 
                    onChange={() => setCloneTimetable(!cloneTimetable)} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <button 
                onClick={() => setShowNewSemesterModal(true)}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition shadow-md hover:shadow-lg hover:shadow-indigo-100 flex items-center gap-2"
              >
                <span className="text-lg">🚀</span>
                <span>Start New Semester</span>
              </button>
              
              <button
                onClick={() => setShowCloneModal(true)}
                className="px-6 py-3 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition flex items-center gap-2"
              >
                <span className="text-lg">♻️</span>
                <span>Clone Last Semester</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Semester Modal */}
      {showNewSemesterModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-11/12 max-w-md animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-6">Start New Semester</h2>
            <form onSubmit={handleNewSemesterSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newSemester.name}
                    onChange={handleChange}
                    placeholder="e.g., Semester 4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={newSemester.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={newSemester.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="flex items-center pt-2">
                  <input
                    id="clone-checkbox"
                    type="checkbox"
                    checked={cloneTimetable}
                    onChange={() => setCloneTimetable(!cloneTimetable)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="clone-checkbox" className="ml-2 block text-sm text-gray-700">
                    Clone timetable structure from previous semester
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowNewSemesterModal(false)}
                  className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transition"
                >
                  Create Semester
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clone Modal */}
      {showCloneModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-11/12 max-w-md animate-fade-in-up">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-4 mx-auto">
              <FiInfo size={28} />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-center">Clone Last Semester</h2>
            <p className="text-gray-600 text-center mb-4">
              Are you sure you want to clone the last semester? This will duplicate all timetable data including courses, faculty assignments, and schedules.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
              <p className="text-amber-800 text-sm">
                <strong>Note:</strong> Existing data for the new semester will be overwritten.
              </p>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowCloneModal(false)}
                className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCloneSemester}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transition"
              >
                Confirm Clone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Semester Detail Modal */}
      {selectedSemester && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-11/12 max-w-lg animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-6 flex items-center justify-between">
              <span>{selectedSemester.name} Details</span>
              <button 
                onClick={() => setSelectedSemester(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </h2>
            
            {semesterStats && (
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium">{selectedSemester.status}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {new Date(selectedSemester.startDate).toLocaleDateString()} - 
                    {new Date(selectedSemester.endDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Total Courses:</span>
                  <span className="font-medium">{semesterStats.totalCourses}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Faculty Assigned:</span>
                  <span className="font-medium">{semesterStats.facultyAssigned}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Rooms Utilized:</span>
                  <span className="font-medium">{semesterStats.roomsUtilized}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Conflicts Resolved:</span>
                  <span className="font-medium">{semesterStats.conflictsResolved}</span>
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setSelectedSemester(null)}
                className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
              >
                Close
              </button>
              <button
                className="px-6 py-2 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition flex items-center gap-1"
              >
                <FiEdit size={16} />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
