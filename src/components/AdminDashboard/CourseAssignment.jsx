import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

// Sample data
const initialCourses = [
  { id: 'CSE101', name: 'Intro to CS', prerequisites: [], qualification: 'CS', section: 'A' },
  { id: 'CSE201', name: 'Data Structures', prerequisites: ['CSE101'], qualification: 'CS', section: 'A' },
  { id: 'ECE101', name: 'Circuits', prerequisites: [], qualification: 'ECE', section: 'B' },
];

const facultyList = [
  { id: 'f1', name: 'Dr. Smith', qualifications: ['CS'], preferences: { 'CSE101': 5, 'CSE201': 4 }, maxLoad: 3, assigned: [], history: ['CSE101', 'CSE201'] },
  { id: 'f2', name: 'Prof. Jane', qualifications: ['ECE'], preferences: { 'ECE101': 5 }, maxLoad: 4, assigned: [], history: ['ECE101'] },
];

export default function CourseAssignment() {
  const [courses, setCourses] = useState(initialCourses);
  const [faculty, setFaculty] = useState(facultyList);
  const [assignments, setAssignments] = useState({});
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [status, setStatus] = useState({});
  const [showComm, setShowComm] = useState(false);
  const [commFaculty, setCommFaculty] = useState(null);
  const [draggedCourse, setDraggedCourse] = useState(null);
  const [dragFeedback, setDragFeedback] = useState('');

  // Function to handle drag start
  const handleDragStart = (e, course) => {
    e.dataTransfer.setData('courseId', course.id);
    setDraggedCourse(course);
    
    // Create a custom drag image for better visual feedback
    const ghostElement = document.createElement('div');
    ghostElement.className = 'bg-indigo-500 text-white p-2 rounded shadow-lg opacity-80';
    ghostElement.textContent = course.name;
    document.body.appendChild(ghostElement);
    e.dataTransfer.setDragImage(ghostElement, 10, 10);
    
    // setTimeout to remove the element after drag starts
    setTimeout(() => {
      ghostElement.remove();
    }, 0);
  };
  
  // Handle drag over a faculty drop zone
  const handleDragOver = (e, faculty) => {
    e.preventDefault();
    if (!draggedCourse) return;

    // Check prerequisites
    const prereqMet = draggedCourse.prerequisites.every(pr => faculty.history.includes(pr));
    // Check qualifications
    const qualified = faculty.qualifications.includes(draggedCourse.qualification);
    // Check teaching load
    const conflict = faculty.assigned.length >= faculty.maxLoad;

    if (!prereqMet) {
      setDragFeedback('Prerequisites not met');
      e.dataTransfer.dropEffect = 'none';
    } else if (!qualified) {
      setDragFeedback('Not qualified for this course');
      e.dataTransfer.dropEffect = 'none';
    } else if (conflict) {
      setDragFeedback('Teaching load exceeded');
      e.dataTransfer.dropEffect = 'none';
    } else {
      setDragFeedback('');
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  // Handle drop of a course on a faculty
  const handleDrop = (e, faculty) => {
    e.preventDefault();
    const courseId = e.dataTransfer.getData('courseId');
    const course = courses.find(c => c.id === courseId);
    
    if (!course) return;

    // Check prerequisites and qualifications again (for safety)
    const prereqMet = course.prerequisites.every(pr => faculty.history.includes(pr));
    const qualified = faculty.qualifications.includes(course.qualification);
    const conflict = faculty.assigned.length >= faculty.maxLoad;

    if (!prereqMet || !qualified || conflict) {
      return;
    }

    // Assign the course
    setFaculty(prev => prev.map(f => 
      f.id === faculty.id ? { ...f, assigned: [...f.assigned, courseId] } : f
    ));
    setAssignments(prev => ({ ...prev, [courseId]: faculty.id }));
    setStatus(prev => ({ ...prev, [courseId]: 'Pending Confirmation' }));
    setDraggedCourse(null);
    setDragFeedback('');
  };

  // Function to handle drag end (cleanup)
  const handleDragEnd = () => {
    setDraggedCourse(null);
    setDragFeedback('');
  };

  // Batch assignment function
  const batchAssign = (courseIds, facultyId) => {
    const fac = faculty.find(f => f.id === facultyId);
    if (!fac) return;
    
    let assignedCount = fac.assigned.length;
    const newAssignments = [];
    
    for (const cid of courseIds) {
      const course = courses.find(c => c.id === cid);
      const prereqMet = course.prerequisites.every(pr => fac.history.includes(pr));
      const qualified = fac.qualifications.includes(course.qualification);
      
      if (!prereqMet || !qualified || assignedCount >= fac.maxLoad) continue;
      assignedCount++;
      newAssignments.push(cid);
      setAssignments(prev => ({ ...prev, [cid]: facultyId }));
      setStatus(prev => ({ ...prev, [cid]: 'Pending Confirmation' }));
    }
    
    setFaculty(prev => prev.map(f => 
      f.id === facultyId ? { ...f, assigned: [...f.assigned, ...newAssignments] } : f
    ));
  };

  // Function to suggest best faculty for a course
  const suggestFaculty = (course) => {
    return faculty
      .filter(f => f.qualifications.includes(course.qualification))
      .sort((a, b) => (b.preferences[course.id] || 0) - (a.preferences[course.id] || 0));
  };

  return (
      <div className="p-6 space-y-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <h1 className="text-3xl font-bold">Course Assignment</h1>
        
        {/* Feedback for drag operations */}
        {dragFeedback && (
          <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-3 mb-4">
            {dragFeedback}
          </div>
        )}

        {/* Batch Assignment */}
        <div className="flex gap-2">
          <button 
            onClick={() => {
              const facId = prompt('Assign selected courses to faculty ID:');
              if (facId) batchAssign(selectedCourses, facId);
            }} 
            disabled={selectedCourses.length === 0}
            className={`px-4 py-2 rounded ${selectedCourses.length > 0 ? 'bg-green-600 text-white' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            Batch Assign ({selectedCourses.length} selected)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Courses List */}
          <div className="border rounded p-4 space-y-2 bg-white shadow">
            <h2 className="font-semibold mb-2">Courses</h2>
            {courses.map(course => (
              <div 
                key={course.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, course)}
                onDragEnd={handleDragEnd}
                onClick={() => setSelectedCourses(prev => 
                  prev.includes(course.id) 
                    ? prev.filter(id => id !== course.id) 
                    : [...prev, course.id]
                )}
                className={`p-3 mb-2 border rounded cursor-move hover:shadow-md transition-all duration-200 ${
                  selectedCourses.includes(course.id) ? 'bg-indigo-100 border-indigo-300' : 'bg-white'
                }`}
              >
                <div className="font-semibold">{course.name}</div>
                <div className="text-sm">ID: {course.id}</div>
                <div className="text-sm">Prerequisites: {course.prerequisites.join(', ') || 'None'}</div>
                <div className="text-sm">Qualification: {course.qualification}</div>
                <div className="text-sm">Section: {course.section}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {assignments[course.id] 
                    ? `Assigned to: ${faculty.find(f => f.id === assignments[course.id])?.name}` 
                    : 'Drag to assign'}
                </div>
              </div>
            ))}
          </div>

          {/* Faculty List with preferences and suggestions */}
          <div className="border rounded p-4 space-y-4 col-span-2 bg-white shadow">
            <h2 className="font-semibold mb-2">Faculty</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faculty.map(fac => (
                <div 
                  key={fac.id} 
                  onDragOver={(e) => handleDragOver(e, fac)} 
                  onDrop={(e) => handleDrop(e, fac)}
                  className={`p-4 border-2 rounded space-y-2 ${
                    draggedCourse && fac.qualifications.includes(draggedCourse.qualification) && fac.assigned.length < fac.maxLoad
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{fac.name}</div>
                      <div className="text-sm">Qualifications: {fac.qualifications.join(', ')}</div>
                      <div className="text-sm">
                        Teaching Load: {fac.assigned.length}/{fac.maxLoad}
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${(fac.assigned.length / fac.maxLoad) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setCommFaculty(fac); setShowComm(true); }} 
                      className="px-2 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
                    >
                      Notify
                    </button>
                  </div>
                  
                  {/* Preferences Visualization */}
                  <div className="mt-3">
                    <h4 className="font-semibold text-sm">Course Preferences</h4>
                    <div className="space-y-1 mt-1">
                      {Object.entries(fac.preferences).map(([cid, strength]) => (
                        <div key={cid} className="flex justify-between items-center text-sm">
                          <span>{cid}</span>
                          <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < strength ? "text-yellow-500" : "text-gray-300"}>★</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Teaching History */}
                  <div>
                    <h4 className="font-semibold text-sm">Teaching History</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {fac.history.map((courseId, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-gray-100 rounded">
                          {courseId}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Course Assignments with Status */}
                  <div>
                    <h4 className="font-semibold text-sm">Assigned Courses</h4>
                    <div className="space-y-1 mt-1">
                      {fac.assigned.map(courseId => {
                        const course = courses.find(c => c.id === courseId);
                        return (
                          <div key={courseId} className="flex justify-between items-center text-sm">
                            <span>{course?.name || courseId}</span>
                            <span className={`px-2 py-0.5 text-xs rounded ${
                              status[courseId] === 'Confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {status[courseId] || 'Pending'}
                            </span>
                          </div>
                        );
                      })}
                      {fac.assigned.length === 0 && (
                        <div className="text-sm text-gray-500 italic">No courses assigned</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Recommended Courses */}
                  <div>
                    <h4 className="font-semibold text-sm">Suggested Courses</h4>
                    <div className="mt-1">
                      {courses
                        .filter(c => !assignments[c.id] && fac.qualifications.includes(c.qualification))
                        .slice(0, 3)
                        .map(c => (
                          <div key={c.id} className="text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            {c.name} 
                            {fac.preferences[c.id] && (
                              <span className="text-yellow-500 text-xs">
                                {[...Array(fac.preferences[c.id])].map((_, i) => '★').join('')}
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Communication Modal */}
        {showComm && commFaculty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md space-y-4 shadow-xl">
              <h2 className="text-xl font-semibold">Notify {commFaculty.name}</h2>
              <textarea 
                placeholder="Message" 
                className="w-full border rounded px-3 py-2 h-32" 
                defaultValue={`You have been assigned courses: ${commFaculty.assigned.join(', ')}. Please confirm.`} 
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setShowComm(false)} 
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => { 
                    // Update status for all assignments of this faculty to "Pending Confirmation"
                    const updatedStatus = { ...status };
                    commFaculty.assigned.forEach(courseId => {
                      updatedStatus[courseId] = 'Pending Confirmation';
                    });
                    setStatus(updatedStatus);
                    setShowComm(false);
                    alert('Notification sent');
                  }} 
                  className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  Send Notification
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

  );
}
