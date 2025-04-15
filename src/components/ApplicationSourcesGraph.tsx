'use client';

import React from 'react';
import { Job, Candidate } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ApplicationSourcesGraphProps {
  job: Job;
  candidates: Candidate[];
}

const COLORS = ['#2563eb', '#16a34a', '#ca8a04', '#9333ea', '#dc2626', '#0891b2'];

const ApplicationSourcesGraph: React.FC<ApplicationSourcesGraphProps> = ({ job, candidates }) => {
  // Filter candidates for this job
  const jobCandidates = candidates.filter(c => c.jobId === job.id);

  // Count candidates by source
  const sourceData = jobCandidates.reduce((acc, candidate) => {
    const source = candidate.source;
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array format for chart
  const data = Object.entries(sourceData).map(([name, value]) => ({
    name,
    value
  }));

  // Calculate percentages for the legend
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const getPercentage = (value: number) => ((value / total) * 100).toFixed(1);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Application Sources</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value} (${getPercentage(value)}%)`,
                name
              ]}
            />
            <Legend 
              formatter={(value: string, entry: any) => (
                <span className="text-sm">
                  {value} ({getPercentage(entry.payload.value)}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <div className="text-sm text-gray-600">Top Source</div>
          <div className="text-xl font-semibold text-blue-600">
            {data.length > 0 ? data.reduce((max, item) => 
              item.value > max.value ? item : max
            ).name : 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Total Sources</div>
          <div className="text-xl font-semibold text-green-600">{data.length}</div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSourcesGraph; 