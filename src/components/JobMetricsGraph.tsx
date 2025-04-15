'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Job, Candidate, RecruitmentStage } from '@/types';

interface JobMetricsGraphProps {
  job: Job;
  candidates: Candidate[];
}

const JobMetricsGraph: React.FC<JobMetricsGraphProps> = ({ job, candidates }) => {
  // Filter candidates for this job
  const jobCandidates = candidates.filter(candidate => candidate.jobId === job.id);

  // Count candidates in each stage
  const stageData = Object.values(RecruitmentStage).map(stage => {
    const count = jobCandidates.filter(candidate => candidate.stage === stage).length;
    return {
      stage: stage.replace(/_/g, ' '),
      candidates: count,
    };
  });

  // Calculate conversion rates between stages
  const conversionData = stageData.map((data, index) => {
    if (index === 0) {
      return {
        ...data,
        conversionRate: 100
      };
    }
    const previousCount = stageData[index - 1].candidates;
    const currentCount = data.candidates;
    const conversionRate = previousCount === 0 ? 0 : (currentCount / previousCount) * 100;
    return {
      ...data,
      conversionRate: Math.round(conversionRate)
    };
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Recruitment Pipeline Metrics</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={conversionData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="stage"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={80}
            />
            <YAxis yAxisId="left" label={{ value: 'Number of Candidates', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Conversion Rate (%)', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="candidates"
              fill="#4F46E5"
              name="Candidates"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="conversionRate"
              fill="#10B981"
              name="Conversion Rate %"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Total Applications</h4>
          <p className="text-2xl font-semibold text-gray-900">{jobCandidates.length}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Current Stage</h4>
          <p className="text-2xl font-semibold text-gray-900">{job.pipeline.currentStage.replace(/_/g, ' ')}</p>
        </div>
      </div>
    </div>
  );
};

export default JobMetricsGraph; 