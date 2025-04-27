import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';
import {
  COLORS,
  semesters,
  departments,
  faculties,
  getInitialChartData,
  sortFacultyWorkload,
  filterChartData,
  exportAsPDF,
  downloadExcel,
  shareReport
} from './services/ReportsAnalytics';

export default function ReportsAnalytics() {
  const [view, setView] = useState('summary');
  const [selectedSemester, setSelectedSemester] = useState(semesters[0]);
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0]);
  const [selectedFaculty, setSelectedFaculty] = useState(faculties[0]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [chartData, setChartData] = useState(getInitialChartData());
  const [chartVisible, setChartVisible] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Simulate chart loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setChartVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Update filters with animation
  useEffect(() => {
    const applyFilters = async () => {
      // Set filtering state to show skeleton loaders
      setIsFiltering(true);
      
      // Small delay for the animation to be noticeable
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Apply actual filters
      const filteredData = filterChartData(
        getInitialChartData(),
        selectedSemester,
        selectedDepartment,
        selectedFaculty
      );
      
      setChartData(filteredData);
      setIsFiltering(false);
    };
    
    applyFilters();
  }, [selectedSemester, selectedDepartment, selectedFaculty]);

  // Handle sorting of faculty workload data
  const handleSort = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    
    const sortedData = sortFacultyWorkload(chartData.facultyWorkload, newOrder);
    
    setChartData(prev => ({
      ...prev,
      facultyWorkload: sortedData
    }));
  };

  // Filter dropdown component with label
  const FilterDropdown = ({ label, options, value, onChange }) => (
    <div className="flex flex-col space-y-1">
      <label className="text-xs text-gray-500">{label}</label>
      <div className="relative inline-block">
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-full px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 min-w-[150px]"
        >
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
  
  // Active filters display component
  const ActiveFilters = () => {
    // Only show if any non-default filter is selected
    const hasActiveFilters = 
      selectedSemester !== semesters[0] || 
      selectedDepartment !== departments[0] || 
      selectedFaculty !== faculties[0];
      
    if (!hasActiveFilters) return null;
    
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="text-xs text-gray-500">Active filters:</span>
        {selectedSemester !== semesters[0] && (
          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
            {selectedSemester}
          </span>
        )}
        {selectedDepartment !== departments[0] && (
          <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
            {selectedDepartment}
          </span>
        )}
        {selectedFaculty !== faculties[0] && (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            {selectedFaculty}
          </span>
        )}
        <button 
          onClick={() => {
            setSelectedSemester(semesters[0]);
            setSelectedDepartment(departments[0]);
            setSelectedFaculty(faculties[0]);
          }}
          className="text-xs text-red-600 hover:text-red-800 underline"
        >
          Clear all
        </button>
      </div>
    );
  };

  // Skeleton loaders for charts
  const BarChartSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-2">
        <div className="flex items-end space-x-2">
          <div className="h-16 w-12 bg-gray-200 rounded"></div>
          <div className="h-24 w-12 bg-gray-200 rounded"></div>
          <div className="h-32 w-12 bg-gray-200 rounded"></div>
          <div className="h-20 w-12 bg-gray-200 rounded"></div>
          <div className="h-28 w-12 bg-gray-200 rounded"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded w-full mt-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
      </div>
    </div>
  );

  const PieChartSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-6 w-36 bg-gray-200 rounded mb-4"></div>
      <div className="flex justify-center items-center">
        <div className="h-40 w-40 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-5 bg-gray-200 rounded w-full mt-6"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mt-2"></div>
    </div>
  );

  const LineChartSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-6 w-64 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-2">
        <div className="relative pt-5">
          <div className="h-[1px] bg-gray-200 absolute left-0 right-0 top-[50%]"></div>
          <div className="h-[1px] bg-gray-200 absolute left-0 right-0 top-[25%]"></div>
          <div className="h-[1px] bg-gray-200 absolute left-0 right-0 top-[75%]"></div>
          <svg viewBox="0 0 400 150" className="w-full h-[200px]">
            <path 
              d="M0,75 Q100,30 200,75 T400,75" 
              fill="none" 
              stroke="#E5E7EB" 
              strokeWidth="4"
            />
            <circle cx="0" cy="75" r="3" fill="#E5E7EB" />
            <circle cx="80" cy="40" r="3" fill="#E5E7EB" />
            <circle cx="200" cy="75" r="3" fill="#E5E7EB" />
            <circle cx="320" cy="110" r="3" fill="#E5E7EB" />
            <circle cx="400" cy="75" r="3" fill="#E5E7EB" />
          </svg>
        </div>
        <div className="h-5 bg-gray-200 rounded w-full mt-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
      </div>
    </div>
  );

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
      
      {/* Filter section */}
      <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
        <h2 className="text-lg font-medium mb-3">Filter Analytics</h2>
        <div className="flex flex-wrap gap-6">
          <FilterDropdown 
            label="Semester" 
            options={semesters} 
            value={selectedSemester} 
            onChange={setSelectedSemester} 
          />
          <FilterDropdown 
            label="Department" 
            options={departments} 
            value={selectedDepartment} 
            onChange={setSelectedDepartment} 
          />
          <FilterDropdown 
            label="Faculty Type" 
            options={faculties} 
            value={selectedFaculty} 
            onChange={setSelectedFaculty} 
          />
        </div>
        <ActiveFilters />
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${!chartVisible ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700`}>
        {/* Faculty Workload Bar Chart */}
        <div className="bg-white rounded-3xl shadow-xl p-6 hover:scale-[1.02] transition">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Faculty Workload by Department</h2>
            <button 
              onClick={handleSort}
              className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 flex items-center gap-1"
            >
              Sort {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
          
          {isFiltering ? (
            <div className="h-[250px] flex items-center justify-center">
              <BarChartSkeleton />
            </div>
          ) : chartData.facultyWorkload.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              No data available for the selected filters
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData.facultyWorkload}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value, name) => [`${value} hours`, 'Workload']}
                />
                <Legend />
                <Bar 
                  dataKey="workload" 
                  name="Hours per Week"
                  radius={[4, 4, 0, 0]} 
                  animationDuration={1500}
                >
                  {chartData.facultyWorkload.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Room Utilization Pie Chart */}
        <div className="bg-white rounded-3xl shadow-xl p-6 hover:scale-[1.02] transition">
          <h2 className="font-semibold mb-4">Room Utilization</h2>
          
          {isFiltering ? (
            <div className="h-[250px] flex items-center justify-center">
              <PieChartSkeleton />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData.roomUtilization}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  animationDuration={1800}
                  animationBegin={300}
                >
                  {chartData.roomUtilization.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value}%`, 'Percentage']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      
      {/* Timetable Conflicts Line Chart */}
      <div className={`bg-white rounded-3xl shadow-xl p-6 hover:scale-[1.02] transition ${!chartVisible ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700 delay-300`}>
        <h2 className="font-semibold mb-4">Timetable Conflicts (Weekly Trend)</h2>
        
        {isFiltering ? (
          <div className="h-[250px] flex items-center justify-center">
            <LineChartSkeleton />
          </div>
        ) : chartData.conflicts.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center text-gray-500">
            No conflict data available for the selected filters
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData.conflicts}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`${value}`, 'Conflicts']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="conflicts" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ r: 6, strokeWidth: 2 }}
                activeDot={{ r: 8 }}
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <button 
          onClick={exportAsPDF}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 transition flex items-center gap-2"
        >
          <span>📥</span> Export as PDF
        </button>
        <button 
          onClick={downloadExcel}
          className="px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-100 transition flex items-center gap-2"
        >
          <span>📄</span> Download Excel
        </button>
        <button 
          onClick={shareReport}
          className="px-6 py-3 rounded-full bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2"
        >
          <span>✈️</span> Share Report
        </button>
      </div>
    </div>
  );
}
