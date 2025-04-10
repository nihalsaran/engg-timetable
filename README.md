# Engineering Timetable Management System

A comprehensive web application for managing university engineering department timetables with role-based access for various stakeholders.

## 🌟 Overview

The Engineering Timetable Management System is a React-based web application designed to streamline the process of creating, managing, and viewing academic timetables for engineering departments. It provides tailored interfaces for different roles including Super Administrators, Heads of Departments (HODs), and Timetable Incharges.

## 👥 User Roles

### 🔹 Super Administrator
- User management across the system
- Department configuration
- Room management
- System-wide settings and semester configuration
- Analytics and reports

### 🔹 Head of Department (HOD)
- Course management for their department
- Faculty assignment to courses
- Faculty workload monitoring
- Timetable viewing and approval

### 🔹 Timetable Incharge
- Timetable building with drag-and-drop interface
- Conflict management and resolution
- Publishing finalized timetables
- Room allocation

## ✨ Key Features

### 📊 Timetable Builder
- Interactive drag-and-drop interface
- Week and day views
- Automatic conflict detection
- Course scheduling with faculty and room assignments
- Undo/redo functionality

### 🚨 Conflict Resolution
- Room conflict detection and resolution
- Faculty time conflict management
- Overlapping courses identification
- Visual indicators for conflicts

### 📋 Course Management
- Add, edit, and remove courses
- Assign faculty members
- Set lecture, tutorial, and practical hours (e.g., 3L+1T+2P format)
- Semester-specific course offerings

### 👀 Timetable Viewer
- Multiple view modes (default, faculty, semester, room)
- Filtering options
- Week navigation
- Print and export functionality
- Detailed tooltips for course information

### 📈 Analytics and Reporting
- Faculty workload analysis
- Room utilization metrics
- Conflict trends and resolution stats
- Department-level reporting

## 🛠️ Technology Stack

- **Frontend:** React 19 with hooks
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4
- **UI Components:** Tremor, HeadlessUI
- **Animations:** Framer Motion
- **Icons:** React Icons, Heroicons
- **Form Handling:** Formik, Yup
- **3D Visuals:** React Three Fiber, Three.js
- **Build Tool:** Vite

## 🚀 Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm 8.x or higher

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/engg-timetable.git
cd engg-timetable
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📱 Access

The application provides the following routes for different user roles:

- `/login` - Authentication page
- `/forgot-password` - Password recovery

### Super Admin
- `/admin-dashboard` - Main dashboard
- `/users` - User management
- `/departments` - Department management
- `/admin-rooms` - Room management
- `/superadmin-reports` - System-wide reports
- `/settings` - System settings

### HOD
- `/hod-dashboard` - HOD main view
- `/courses` - Course management
- `/faculty` - Faculty assignment
- `/hod-reports` - Faculty workload reports
- `/timetable` - Timetable viewer

### Timetable Incharge
- `/tt-dashboard` - Timetable management dashboard
- `/timetable-builder` - Interactive timetable creation
- `/conflicts` - Conflict resolution interface
- `/rooms` - Room management
- `/faculty-view` - Faculty schedule view

## 💻 Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/
│   ├── CampusIllustration.jsx
│   ├── ForgotPassword.jsx
│   ├── Login.jsx
│   ├── HOD/                  # Head of Department components
│   ├── SuperAdmin/           # Super Admin components
│   └── TTIncharge/           # Timetable Incharge components
└── ...
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
