import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { jobs, candidates } from '@/data/jobs';

interface ApplicationsByJobProps {
  timeRange?: number; // in days
}

export default function ApplicationsByJob({ timeRange = 7 }: ApplicationsByJobProps) {
  // Colors for different jobs
  const getJobColor = (jobId: number): string => {
    const colors = [
      '#2563EB', // dark blue
      '#3B82F6', // blue
      '#60A5FA', // light blue
      '#FBBF24'  // yellow
    ];
    return colors[(jobId - 1) % colors.length];
  };

  // Get color class for badge
  const getBadgeColorClass = (jobId: string): string => {
    const id = Number(jobId);
    if (id === 1) return 'bg-blue-800';
    if (id === 2) return 'bg-blue-600';
    if (id === 3) return 'bg-blue-400';
    if (id === 4) return 'bg-yellow-400';
    return 'bg-gray-500';
  };

  // Filter applications in the specified time period
  const recentApplications = useMemo(() => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeRange);
    
    return candidates.filter(candidate => {
      const appDate = new Date(candidate.appliedDate);
      return appDate >= startDate;
    });
  }, [timeRange]);

  // Count applications by job
  const applicationsByJob = useMemo(() => {
    // Group applications by job
    const jobCounts = recentApplications.reduce((acc, candidate) => {
      const jobId = candidate.jobId;
      if (!acc[jobId]) {
        acc[jobId] = 0;
      }
      acc[jobId]++;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array with job details
    return Object.entries(jobCounts)
      .map(([jobId, count]) => {
        const job = jobs.find(j => j.id === jobId);
        return {
          id: jobId,
          name: job?.title || 'Unknown Position',
          value: count,
          color: getJobColor(Number(jobId))
        };
      })
      .sort((a, b) => b.value - a.value); // Sort by count (descending)
  }, [recentApplications]);

  const totalApplications = recentApplications.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-navy-700">New Applications</h2>
        <p className="text-sm text-gray-500">Latest applications received</p>
      </div>
      <div className="p-6">
        {totalApplications === 0 ? (
          <div className="h-80 flex items-center justify-center text-gray-500">
            No applications in the last {timeRange} days
          </div>
        ) : (
          <div className="space-y-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={applicationsByJob}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {applicationsByJob.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} applications`, '']} 
                    labelFormatter={(_, payload) => payload && payload.length > 0 ? payload[0].name : ''}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              {applicationsByJob.map((job) => (
                <div key={job.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${getBadgeColorClass(job.id)} mr-3`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      {job.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-gray-900">
                      {job.value}
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