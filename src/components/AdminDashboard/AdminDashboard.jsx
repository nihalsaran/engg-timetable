import { useState } from 'react';
import { 
  Card, 
  Title, 
  Text, 
  TabList, 
  Tab, 
  TabGroup, 
  TabPanel, 
  TabPanels, 
  Badge,
  Legend,
  BarChart,
} from '@tremor/react';
import {
  UserGroupIcon,
  BuildingLibraryIcon,
  ClockIcon,
  ServerIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from './DashboardLayout';

// Mock data
const metrics = [
  { 
    name: 'Total Departments',
    value: '12',
    change: '+2',
    icon: BuildingLibraryIcon,
    color: 'indigo',
  },
  {
    name: 'Active Users',
    value: '284',
    change: '+12',
    icon: UserGroupIcon,
    color: 'emerald',
  },
  {
    name: 'Recent Timetables',
    value: '47',
    change: '+8',
    icon: ClockIcon,
    color: 'blue',
  },
];

const systemHealth = {
  status: 'Healthy',
  uptime: '99.9%',
  lastBackup: '2 hours ago',
  activeUsers: 42,
  errors: [],
};

const usersByRole = [
  { role: 'Admin', count: 5 },
  { role: 'HOD', count: 12 },
  { role: 'Faculty', count: 180 },
  { role: 'Staff', count: 87 },
];

const recentActivity = [
  {
    id: 1,
    user: 'Dr. Smith',
    action: 'Updated CSE department timetable',
    timestamp: '5 minutes ago',
    type: 'update',
  },
  {
    id: 2,
    user: 'Admin',
    action: 'Added new faculty member',
    timestamp: '1 hour ago',
    type: 'create',
  },
  {
    id: 3,
    user: 'System',
    action: 'Backup completed successfully',
    timestamp: '2 hours ago',
    type: 'system',
  },
];

const MotionCard = motion(Card);

export default function AdminDashboard() {
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric, index) => (
            <MotionCard
              key={metric.name}
              decoration="top"
              decorationColor={metric.color}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="transform transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Text>{metric.name}</Text>
                  <Title className="mt-2">{metric.value}</Title>
                  <Text className="mt-2">
                    <motion.span 
                      className={metric.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.2 + index * 0.1 }}
                    >
                      {metric.change}
                    </motion.span>
                    {' this month'}
                  </Text>
                </div>
                <metric.icon className={`w-12 h-12 text-${metric.color}-500`} />
              </div>
            </MotionCard>
          ))}
        </div>

        {/* System Health and User Distribution */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* System Health */}
          <MotionCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="transform transition-all hover:shadow-lg"
          >
            <Title>System Health</Title>
            <motion.div 
              className="mt-4 space-y-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {Object.entries({
                'Server Status': { icon: ServerIcon, value: systemHealth.status, color: 'emerald' },
                'Uptime': { icon: ShieldCheckIcon, value: systemHealth.uptime, color: 'blue' },
                'Last Backup': { icon: ClockIcon, value: systemHealth.lastBackup, color: 'indigo' }
              }).map(([key, { icon: Icon, value, color }]) => (
                <motion.div
                  key={key}
                  className="flex items-center justify-between"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-5 h-5 text-${color}-500`} />
                    <Text>{key}</Text>
                  </div>
                  {key === 'Server Status' ? (
                    <Badge color={color}>{value}</Badge>
                  ) : (
                    <Text>{value}</Text>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </MotionCard>

          {/* User Distribution */}
          <MotionCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="transform transition-all hover:shadow-lg"
          >
            <Title>Users by Role</Title>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <BarChart
                className="mt-4 h-48"
                data={usersByRole}
                index="role"
                categories={["count"]}
                colors={["indigo"]}
                valueFormatter={(value) => value.toString()}
                yAxisWidth={48}
              />
            </motion.div>
          </MotionCard>
        </div>

        {/* Recent Activity and Announcements */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Activity Feed */}
          <MotionCard 
            className="lg:col-span-2 transform transition-all hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Title>Recent Activity</Title>
            <motion.div 
              className="mt-4 space-y-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {recentActivity.map((activity) => (
                <motion.div
                  key={activity.id}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="flex items-start space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className={`p-2 rounded-full 
                    ${activity.type === 'update' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'create' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-gray-100 text-gray-600'}`}
                  >
                    {activity.type === 'update' ? '↻' : 
                     activity.type === 'create' ? '+' : '⚙'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Text className="font-medium">{activity.user}</Text>
                      <Text className="text-gray-500">{activity.timestamp}</Text>
                    </div>
                    <Text className="mt-1">{activity.action}</Text>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </MotionCard>

          {/* Quick Actions */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="transform transition-all hover:shadow-lg"
          >
            <Title>Quick Actions</Title>
            <motion.div 
              className="mt-4 space-y-2"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="visible"
            >
              {['Create Announcement', 'Add New User', 'Generate Report', 'System Backup'].map((action, index) => (
                <motion.button
                  key={action}
                  onClick={() => action === 'Create Announcement' && setShowAnnouncement(true)}
                  className="w-full p-2 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all hover:shadow-sm"
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {action}
                </motion.button>
              ))}
            </motion.div>
          </MotionCard>
        </div>

        {/* Announcement Modal */}
        <AnimatePresence>
          {showAnnouncement && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAnnouncement(false)}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <MotionCard className="w-full max-w-lg">
                  <div className="flex items-center justify-between mb-4">
                    <Title>Create Announcement</Title>
                    <motion.button 
                      onClick={() => setShowAnnouncement(false)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </motion.button>
                  </div>
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div>
                      <Text>Title</Text>
                      <input
                        type="text"
                        className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Announcement title"
                      />
                    </div>
                    <div>
                      <Text>Message</Text>
                      <textarea
                        className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        rows={4}
                        placeholder="Announcement message"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <motion.button
                        onClick={() => setShowAnnouncement(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button 
                        className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Post Announcement
                      </motion.button>
                    </div>
                  </motion.div>
                </MotionCard>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}