import { useState } from 'react';
import DashboardLayout from './DashboardLayout';

export default function SystemConfiguration() {
  const [term, setTerm] = useState({ start: '', end: '', holidays: '', workingDays: [] });
  const [timeSlots, setTimeSlots] = useState([{ start: '', end: '', duration: 60 }]);
  const [notifications, setNotifications] = useState({});
  const [integrations, setIntegrations] = useState({ lms: '', email: '', auth: '' });
  const [backup, setBackup] = useState({ schedule: '', retention: '' });
  const [constraints, setConstraints] = useState({ maxConsecutive: 4, preferredGap: 15 });
  const [appearance, setAppearance] = useState({ logo: '', theme: 'light', colors: {} });
  const [audit, setAudit] = useState({ enabled: true, retention: '90' });

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <h1 className="text-3xl font-bold">System Configuration</h1>

        {/* Academic Term */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Academic Term</h2>
          <div className="flex gap-4">
            <div>
              <label>Semester Start</label>
              <input type="date" value={term.start} onChange={e => setTerm({ ...term, start: e.target.value })} className="border rounded px-3 py-2" />
            </div>
            <div>
              <label>Semester End</label>
              <input type="date" value={term.end} onChange={e => setTerm({ ...term, end: e.target.value })} className="border rounded px-3 py-2" />
            </div>
          </div>
          <div>
            <label>Holidays (comma separated dates)</label>
            <textarea value={term.holidays} onChange={e => setTerm({ ...term, holidays: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label>Working Days</label>
            <select multiple value={term.workingDays} onChange={e => setTerm({ ...term, workingDays: Array.from(e.target.selectedOptions, o => o.value) })} className="w-full border rounded px-3 py-2">
              {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(day => <option key={day}>{day}</option>)}
            </select>
          </div>
        </section>

        {/* Time Slots */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Time Slot Definitions</h2>
          {timeSlots.map((slot, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input type="time" value={slot.start} onChange={e => {
                const updated = [...timeSlots]; updated[idx].start = e.target.value; setTimeSlots(updated);
              }} className="border rounded px-3 py-2" />
              <input type="time" value={slot.end} onChange={e => {
                const updated = [...timeSlots]; updated[idx].end = e.target.value; setTimeSlots(updated);
              }} className="border rounded px-3 py-2" />
              <input type="number" value={slot.duration} onChange={e => {
                const updated = [...timeSlots]; updated[idx].duration = e.target.value; setTimeSlots(updated);
              }} className="border rounded px-3 py-2 w-24" placeholder="Duration (min)" />
              <button onClick={() => setTimeSlots(timeSlots.filter((_, i) => i !== idx))} className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer">Remove</button>
            </div>
          ))}
          <button onClick={() => setTimeSlots([...timeSlots, { start: '', end: '', duration: 60 }])} className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer">+ Add Slot</button>
        </section>

        {/* Notification Templates */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Notification Templates</h2>
          {['UserCreated','PasswordReset','SchedulePublished'].map(type => (
            <div key={type}>
              <label>{type} Template (use {'{{name}}'}, {'{{date}}'}, etc.)</label>
              <textarea value={notifications[type] || ''} onChange={e => setNotifications({ ...notifications, [type]: e.target.value })} className="w-full border rounded px-3 py-2" />
            </div>
          ))}
        </section>

        {/* Integrations */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Integrations</h2>
          <input placeholder="LMS API URL" value={integrations.lms} onChange={e => setIntegrations({ ...integrations, lms: e.target.value })} className="w-full border rounded px-3 py-2" />
          <input placeholder="Email Server" value={integrations.email} onChange={e => setIntegrations({ ...integrations, email: e.target.value })} className="w-full border rounded px-3 py-2" />
          <input placeholder="Authentication Provider" value={integrations.auth} onChange={e => setIntegrations({ ...integrations, auth: e.target.value })} className="w-full border rounded px-3 py-2" />
        </section>

        {/* Backup Settings */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Backup & Retention</h2>
          <input placeholder="Backup Schedule (e.g., daily at 2am)" value={backup.schedule} onChange={e => setBackup({ ...backup, schedule: e.target.value })} className="w-full border rounded px-3 py-2" />
          <input placeholder="Retention Period (days)" value={backup.retention} onChange={e => setBackup({ ...backup, retention: e.target.value })} className="w-full border rounded px-3 py-2" />
        </section>

        {/* Scheduling Constraints */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Scheduling Constraints</h2>
          <input type="number" placeholder="Max Consecutive Classes" value={constraints.maxConsecutive} onChange={e => setConstraints({ ...constraints, maxConsecutive: e.target.value })} className="w-full border rounded px-3 py-2" />
          <input type="number" placeholder="Preferred Time Gap (minutes)" value={constraints.preferredGap} onChange={e => setConstraints({ ...constraints, preferredGap: e.target.value })} className="w-full border rounded px-3 py-2" />
        </section>

        {/* Appearance */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Appearance & Branding</h2>
          <input placeholder="University Logo URL" value={appearance.logo} onChange={e => setAppearance({ ...appearance, logo: e.target.value })} className="w-full border rounded px-3 py-2" />
          <select value={appearance.theme} onChange={e => setAppearance({ ...appearance, theme: e.target.value })} className="w-full border rounded px-3 py-2">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
          <textarea placeholder="Custom CSS Variables or Theme JSON" value={JSON.stringify(appearance.colors)} onChange={e => {
            try { setAppearance({ ...appearance, colors: JSON.parse(e.target.value) }); } catch {}
          }} className="w-full border rounded px-3 py-2" />
        </section>

        {/* Audit Logging */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Audit Logging & Data Retention</h2>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={audit.enabled} onChange={e => setAudit({ ...audit, enabled: e.target.checked })} /> Enable Audit Logging
          </label>
          <input placeholder="Retention Period (days)" value={audit.retention} onChange={e => setAudit({ ...audit, retention: e.target.value })} className="w-full border rounded px-3 py-2" />
        </section>

        <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded cursor-pointer">Save Configuration</button>
      </div>
    </DashboardLayout>
  );
}
