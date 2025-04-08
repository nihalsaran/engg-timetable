import { useState, useEffect, useRef } from 'react';
import DashboardLayout from './DashboardLayout';
import { BarChart, LineChart } from '@tremor/react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';

function PieChartD3({ data, width = 200, height = 200 }) {
  const ref = useRef();

  useEffect(() => {
    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal().range(["#4f46e5", "#9ca3af"]);
    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius - 10);

    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const arcs = svg.selectAll("path")
      .data(pie(data))
      .enter().append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.name))
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    return () => {
      d3.select(ref.current).selectAll("*").remove();
    };
  }, [data, width, height]);

  return <svg ref={ref}></svg>;
}

export default function ReportsDashboard() {
  const [filters, setFilters] = useState({ term: '', year: '', department: '', faculty: '' });
  const [customFields, setCustomFields] = useState([]);

  const utilizationData = [
    { category: 'Rooms', used: 75, free: 25 },
    { category: 'Faculty', used: 80, free: 20 },
    { category: 'Time Slots', used: 65, free: 35 },
  ];

  const conflictData = [
    { type: 'Room Double Booking', count: 5, severity: 'High' },
    { type: 'Faculty Overlap', count: 3, severity: 'Medium' },
    { type: 'Student Clash', count: 2, severity: 'Low' },
  ];

  const workloadData = [
    { name: 'CSE', faculty: 20, hours: 300 },
    { name: 'ECE', faculty: 15, hours: 250 },
    { name: 'MBA', faculty: 10, hours: 180 },
  ];

  const comparativeData = [
    { term: '2024', utilization: 70 },
    { term: '2025', utilization: 75 },
    { term: '2026', utilization: 80 },
  ];

  const efficiencyMetrics = {
    avgUtilization: 75,
    conflicts: 10,
    suggestions: ['Reduce faculty overlaps', 'Optimize room allocation', 'Balance workload'],
  };

  const exportReport = (format) => {
    alert(`Exporting report as ${format}`);
  };

  const scheduleReport = () => {
    alert('Scheduled report generation and email distribution configured.');
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <h1 className="text-3xl font-bold">Reports Dashboard</h1>

        {/* Filters */}
        <section className="flex flex-wrap gap-4">
          <select value={filters.term} onChange={e => setFilters({ ...filters, term: e.target.value })} className="border rounded px-3 py-2">
            <option value="">Select Term</option>
            <option>Spring</option>
            <option>Fall</option>
          </select>
          <select value={filters.year} onChange={e => setFilters({ ...filters, year: e.target.value })} className="border rounded px-3 py-2">
            <option value="">Select Year</option>
            <option>2024</option>
            <option>2025</option>
            <option>2026</option>
          </select>
          <select value={filters.department} onChange={e => setFilters({ ...filters, department: e.target.value })} className="border rounded px-3 py-2">
            <option value="">All Departments</option>
            <option>CSE</option>
            <option>ECE</option>
            <option>MBA</option>
          </select>
          <select value={filters.faculty} onChange={e => setFilters({ ...filters, faculty: e.target.value })} className="border rounded px-3 py-2">
            <option value="">All Faculty</option>
            <option>Dr. Smith</option>
            <option>Prof. Jane</option>
          </select>
        </section>

        {/* Utilization Reports */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Utilization Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {utilizationData.map(item => (
              <div key={item.category} className="p-4 border rounded shadow">
                <h3 className="font-semibold mb-2">{item.category}</h3>
                <PieChartD3
                  data={[
                    { name: 'Used', value: item.used },
                    { name: 'Free', value: item.free },
                  ]}
                  width={200}
                  height={200}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Conflict Analysis */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Conflict Analysis</h2>
          <table className="min-w-full border">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Count</th>
                <th className="p-2 border">Severity</th>
              </tr>
            </thead>
            <tbody>
              {conflictData.map(c => (
                <tr key={c.type}>
                  <td className="p-2 border">{c.type}</td>
                  <td className="p-2 border">{c.count}</td>
                  <td className="p-2 border">{c.severity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Workload Distribution */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Workload Distribution</h2>
          <BarChart
            data={workloadData}
            index="name"
            categories={["faculty", "hours"]}
            colors={["indigo", "emerald"]}
            className="h-64"
          />
        </section>

        {/* Comparative Analysis */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Comparative Analysis</h2>
          <LineChart
            data={comparativeData}
            index="term"
            categories={["utilization"]}
            colors={["blue"]}
            className="h-64"
          />
        </section>

        {/* Custom Report Builder */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Custom Report Builder</h2>
          <div className="flex flex-wrap gap-2">
            {['Room', 'Faculty', 'Time Slot', 'Department', 'Conflict', 'Workload'].map(field => (
              <label key={field} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={customFields.includes(field)}
                  onChange={e => {
                    if(e.target.checked) setCustomFields([...customFields, field]);
                    else setCustomFields(customFields.filter(f => f !== field));
                  }}
                />
                {field}
              </label>
            ))}
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer" onClick={() => alert('Generating custom report...')} aria-label="Generate Custom Report">Generate Custom Report</button>
        </section>

        {/* Scheduling Efficiency & Suggestions */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Scheduling Efficiency</h2>
          <p>Average Utilization: {efficiencyMetrics.avgUtilization}%</p>
          <p>Total Conflicts: {efficiencyMetrics.conflicts}</p>
          <ul className="list-disc ml-6">
            {efficiencyMetrics.suggestions.map((s, idx) => <li key={idx}>{s}</li>)}
          </ul>
        </section>

        {/* Export & Schedule */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Export & Schedule Reports</h2>
          <div className="flex gap-2 flex-wrap">
            {['PDF', 'Excel', 'CSV'].map(fmt => (
              <button key={fmt} onClick={() => exportReport(fmt)} aria-label={`Export report as ${fmt}`} className="px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer">Export as {fmt}</button>
            ))}
          </div>
          <button onClick={scheduleReport} aria-label="Schedule Report Email" className="px-4 py-2 bg-yellow-500 text-white rounded cursor-pointer">Schedule Report Email</button>
        </section>
      </div>
    </DashboardLayout>
  );
}
