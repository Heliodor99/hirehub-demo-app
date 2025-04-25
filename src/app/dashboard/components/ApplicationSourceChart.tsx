import { FiBarChart2, FiPieChart } from 'react-icons/fi';
import { candidates } from '@/data/jobs';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useMemo } from 'react';

interface ApplicationSourceChartProps {
  timeRange?: number; // in days
}

export default function ApplicationSourceChart({ timeRange = 30 }: ApplicationSourceChartProps) {
  // Get applications from the specified time range
  const filteredApplications = useMemo(() => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeRange);
    
    return candidates.filter(candidate => {
      const appDate = new Date(candidate.appliedDate);
      return appDate >= startDate;
    });
  }, [timeRange]);

  // Count applications by source
  const sourceCounts = useMemo(() => {
    return filteredApplications.reduce((acc, candidate) => {
      const source = candidate.source || 'Unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredApplications]);

  // Format data for PieChart
  const chartData = useMemo(() => {
    return Object.entries(sourceCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [sourceCounts]);

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#8dd1e1'];

  // Get color for source in the list
  const getSourceColor = (source: string) => {
    switch (source) {
      case 'LinkedIn':
        return 'bg-blue-100 text-blue-800';
      case 'Indeed':
        return 'bg-purple-100 text-purple-800';
      case 'Upwork':
        return 'bg-green-100 text-green-800';
      case 'Naukri':
        return 'bg-yellow-100 text-yellow-800';
      case 'Website':
        return 'bg-indigo-100 text-indigo-800';
      case 'Referral':
        return 'bg-pink-100 text-pink-800';
      case 'Job Fair':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Application Sources</h2>
          <span className="text-sm text-gray-500">Last {timeRange} days</span>
        </div>
      </div>
      <div className="p-6">
        {filteredApplications.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No application data available for the selected time period
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pie Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Applications']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Breakdown List */}
            <div className="space-y-4">
              {chartData.map(({ name, value }) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceColor(name)}`}>
                      {name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-900">
                      {value}
                    </span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full"
                        style={{ width: `${(value / filteredApplications.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">
                      {Math.round((value / filteredApplications.length) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 