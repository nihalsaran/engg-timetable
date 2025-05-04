import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiDownload, FiFilter, FiMail, FiBarChart2, FiCheckCircle, 
  FiChevronDown, FiChevronUp, FiAlertTriangle, FiX, FiPrinter,
  FiSearch, FiUser, FiClock, FiBook
} from 'react-icons/fi';

// Import service functions and data
import { 
  dummySemesters, 
  dummyCourses,
  dummyFaculty,
  calculateHoursFromString,
  getFacultyWithLoadData,
  getFilteredFacultyData,
  generateReport,
  emailFacultyReport,
  exportReportAs
} from './services/FacultyLoadReports';

// Main component for Faculty Load Reports
export default function FacultyLoadReports() {
  const [faculty, setFaculty] = useState([...dummyFaculty]);
  const [courses, setCourses] = useState([...dummyCourses]);
  const [selectedSemester, setSelectedSemester] = useState('Semester 7');
  const [showOverloadedOnly, setShowOverloadedOnly] = useState(false);
  const [exportFormat, setExportFormat] = useState('PDF');
  const [expandedFaculty, setExpandedFaculty] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [emailingFaculty, setEmailingFaculty] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Handle row expansion
  const toggleExpandRow = (facultyId) => {
    setExpandedFaculty(prev => ({
      ...prev,
      [facultyId]: !prev[facultyId]
    }));
  };

  // Get filtered faculty data from service
  const filteredFacultyData = getFilteredFacultyData(
    faculty, 
    courses, 
    selectedSemester, 
    showOverloadedOnly, 
    searchQuery
  );

  // Handle generating report
  const handleGenerateReport = () => {
    setGeneratingReport(true);
    
    generateReport().then(() => {
      setGeneratingReport(false);
      setReportGenerated(true);
      
      // Hide success message after a delay
      setTimeout(() => {
        setReportGenerated(false);
      }, 3000);
    });
  };

  // Handle faculty email
  const handleEmailFaculty = () => {
    setEmailingFaculty(true);
    
    emailFacultyReport().then(() => {
      setEmailingFaculty(false);
      setEmailSent(true);
      
      // Hide success message after a delay
      setTimeout(() => {
        setEmailSent(false);
      }, 3000);
    });
  };

  // Handle report export
  const handleExport = () => {
    exportReportAs(exportFormat).then((result) => {
      alert(result.message);
    });
  };

  return (
    <div className="p-6 relative bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Faculty Load Reports
      </h1>
      
      {/* Filters and Options */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap justify-between gap-4">
          {/* Left side filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Semester filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                {dummySemesters.map(semester => (
                  <option key={semester} value={semester}>{semester}</option>
                ))}
              </select>
            </div>
            
            {/* Overload filter checkbox */}
            <div className="flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  checked={showOverloadedOnly}
                  onChange={() => setShowOverloadedOnly(!showOverloadedOnly)}
                />
                <span className="ml-2 text-sm text-gray-700">Show Overloaded Only</span>
              </label>
            </div>
          </div>
          
          {/* Right side - Export options */}
          <div className="flex items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
                <option value="CSV">CSV</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="mt-4">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search by faculty name or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Faculty</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Courses Assigned</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Hours</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredFacultyData.map((f) => (
                <React.Fragment key={f.id}>
                  {/* Main faculty row */}
                  <tr 
                    className={`hover:bg-gray-50 transition-colors ${expandedFaculty[f.id] ? 'bg-indigo-50' : ''}`}
                  >
                    {/* Faculty Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                            src={f.avatar}
                            alt={f.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{f.name}</div>
                          <div className="text-sm text-gray-500">{f.department}</div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Courses Assigned */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {f.facultyCourses.length > 0 ? (
                          f.facultyCourses.slice(0, 2).map(course => (
                            <span 
                              key={course.id}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {course.code}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">No courses assigned</span>
                        )}
                        
                        {f.facultyCourses.length > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{f.facultyCourses.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    
                    {/* Total Hours with Bar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="mr-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {f.semesterLoadHours}/{f.maxHours}h
                        </div>
                        <div className="flex-1 h-2.5 bg-gray-200 rounded-full max-w-[150px]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, f.loadPercentage)}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-2.5 rounded-full ${
                              f.loadPercentage > 90 ? 'bg-red-500' : 
                              f.loadPercentage > 70 ? 'bg-yellow-500' : 
                              'bg-green-500'
                            }`}
                          ></motion.div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {f.status === 'overloaded' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-red-800">
                          <FiAlertTriangle className="mr-1" /> Overloaded
                        </span>
                      ) : f.status === 'nearlyFull' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-yellow-100 text-yellow-800">
                          <FiClock className="mr-1" /> Nearly Full
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                          <FiCheckCircle className="mr-1" /> Available
                        </span>
                      )}
                    </td>
                    
                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => toggleExpandRow(f.id)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium flex items-center"
                      >
                        {expandedFaculty[f.id] ? (
                          <>
                            <span>Hide Details</span>
                            <FiChevronUp className="ml-1" />
                          </>
                        ) : (
                          <>
                            <span>View Details</span>
                            <FiChevronDown className="ml-1" />
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded row with course details */}
                  <AnimatePresence>
                    {expandedFaculty[f.id] && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-indigo-50"
                      >
                        <td colSpan={5} className="px-6 py-4">
                          <div className="text-sm text-gray-800 mb-2 font-medium">
                            Course Breakdown for {f.name}
                          </div>
                          {f.facultyCourses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {f.facultyCourses.map(course => (
                                <div key={course.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                                  <div className="font-medium flex items-center">
                                    <FiBook className="text-indigo-500 mr-1" />
                                    {course.code} - {course.title}
                                  </div>
                                  <div className="text-sm text-gray-500 mt-1">
                                    Weekly Hours: {course.weeklyHours} ({calculateHoursFromString(course.weeklyHours)} hours total)
                                  </div>
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {course.tags.map((tag, idx) => (
                                      <span 
                                        key={idx}
                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-500">No courses assigned for the selected semester.</div>
                          )}
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
              
              {filteredFacultyData.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    No faculty members found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-md p-4 flex items-center">
          <div className="bg-blue-100 p-3 rounded-lg mr-4">
            <FiUser size={24} className="text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-blue-600">Total Faculty</div>
            <div className="text-xl font-bold">{filteredFacultyData.length}</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl shadow-md p-4 flex items-center">
          <div className="bg-teal-100 p-3 rounded-lg mr-4">
            <FiBook size={24} className="text-teal-600" />
          </div>
          <div>
            <div className="text-sm text-teal-600">Total Courses</div>
            <div className="text-xl font-bold">
              {filteredFacultyData.reduce((total, f) => total + f.facultyCourses.length, 0)}
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-md p-4 flex items-center">
          <div className="bg-amber-100 p-3 rounded-lg mr-4">
            <FiAlertTriangle size={24} className="text-amber-600" />
          </div>
          <div>
            <div className="text-sm text-amber-600">Overloaded Faculty</div>
            <div className="text-xl font-bold">
              {filteredFacultyData.filter(f => f.status === 'overloaded').length}
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-center flex-wrap gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerateReport}
          disabled={generatingReport}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 
                   text-white font-medium shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-70"
        >
          {generatingReport ? (
            <>
              <FiBarChart2 className="animate-pulse" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <FiBarChart2 />
              <span>📊 Generate Report</span>
            </>
          )}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          className="px-6 py-3 rounded-xl bg-white border border-gray-300
                   text-gray-700 font-medium shadow-sm hover:bg-gray-50 flex items-center gap-2"
        >
          <FiDownload />
          <span>📥 Export {exportFormat}</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEmailFaculty}
          disabled={emailingFaculty}
          className="px-6 py-3 rounded-xl bg-teal-600 
                   text-white font-medium shadow-md hover:bg-teal-700 flex items-center gap-2 disabled:opacity-70"
        >
          {emailingFaculty ? (
            <>
              <FiMail className="animate-pulse" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <FiMail />
              <span>📤 Email to Faculty</span>
            </>
          )}
        </motion.button>
      </div>
      
      {/* Success Messages */}
      <AnimatePresence>
        {reportGenerated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 right-8 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg flex items-center"
          >
            <FiCheckCircle className="mr-2" size={20} />
            <span>Report generated successfully!</span>
            <button
              onClick={() => setReportGenerated(false)}
              className="ml-4 text-green-500 hover:text-green-700"
            >
              <FiX size={20} />
            </button>
          </motion.div>
        )}
        
        {emailSent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 right-8 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow-lg flex items-center"
          >
            <FiCheckCircle className="mr-2" size={20} />
            <span>Report emailed to faculty successfully!</span>
            <button
              onClick={() => setEmailSent(false)}
              className="ml-4 text-blue-500 hover:text-blue-700"
            >
              <FiX size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Print styles - only applied when printing */}
      <style>
        {`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-section, .print-section * {
            visibility: visible;
          }
          .print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none;
          }
        }
        `}
      </style>
    </div>
  );
}