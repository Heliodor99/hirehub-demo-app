'use client';

import { useState } from 'react';
import { FiTrendingUp, FiUsers, FiBriefcase, FiClock, FiBarChart2, FiPieChart } from 'react-icons/fi';
import { candidates, jobs } from '@/data/jobs';
import { RecruitmentStage, Job, Candidate } from '@/types';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30');  // days

  // Calculate metrics
  const totalCandidates = candidates.length;
  const activeCandidates = candidates.filter(c => 
    c.stage !== RecruitmentStage.REJECTED && c.stage !== RecruitmentStage.HIRED
  ).length;
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'Active').length;

  // Calculate stage metrics
  const stageMetrics = (Object.keys(RecruitmentStage) as Array<keyof typeof RecruitmentStage>).reduce((acc, stage) => {
    acc[RecruitmentStage[stage]] = candidates.filter(c => c.stage === RecruitmentStage[stage]).length;
    return acc;
  }, {} as Record<RecruitmentStage, number>);

  // Calculate time-to-hire metrics (in days)
  const timeToHire = candidates
    .filter(c => c.stage === RecruitmentStage.HIRED)
    .map(c => {
      const applicationDate = new Date(c.appliedDate);
      const hireDate = new Date(c.appliedDate); // Using appliedDate as a placeholder since we don't have hireDate
      return Math.ceil((hireDate.getTime() - applicationDate.getTime()) / (1000 * 60 * 60 * 24));
    });
  const avgTimeToHire = timeToHire.length > 0 
    ? Math.round(timeToHire.reduce((a, b) => a + b, 0) / timeToHire.length)
    : 0;

  // Calculate source metrics
  const sourceMetrics = candidates.reduce((acc, c) => {
    acc[c.source] = (acc[c.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate job metrics
  const jobMetrics = jobs.reduce((acc, job) => {
    const jobCandidates = candidates.filter(c => c.jobId === job.id);
    acc[job.title] = {
      total: jobCandidates.length,
      inProgress: jobCandidates.filter(c => 
        c.stage !== RecruitmentStage.REJECTED && c.stage !== RecruitmentStage.HIRED
      ).length,
      hired: jobCandidates.filter(c => c.stage === RecruitmentStage.HIRED).length
    };
    return acc;
  }, {} as Record<string, { total: number; inProgress: number; hired: number; }>);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recruitment Analytics</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track and analyze your recruitment pipeline metrics
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiUsers className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Candidates</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{totalCandidates}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <FiTrendingUp className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                        <span className="ml-1">{activeCandidates} active</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiBriefcase className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Jobs</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{activeJobs}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-blue-600">
                        <span>of {totalJobs} total</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiClock className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg. Time to Hire</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{avgTimeToHire}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-gray-600">
                        <span>days</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiBarChart2 className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {totalCandidates > 0 
                          ? Math.round((stageMetrics[RecruitmentStage.HIRED] / totalCandidates) * 100)
                          : 0}%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Pipeline Stage Distribution */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pipeline Stage Distribution</h3>
            <div className="space-y-4">
              {Object.entries(stageMetrics).map(([stage, count]) => (
                <div key={stage}>
                  <div className="flex items-center justify-between text-sm font-medium text-gray-900">
                    <span className="capitalize">{stage.replace(/_/g, ' ').toLowerCase()}</span>
                    <span>{count}</span>
                  </div>
                  <div className="mt-1 relative">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                      <div
                        style={{ width: `${(count / totalCandidates) * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Source Distribution */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Candidate Sources</h3>
            <div className="space-y-4">
              {Object.entries(sourceMetrics).map(([source, count]) => (
                <div key={source}>
                  <div className="flex items-center justify-between text-sm font-medium text-gray-900">
                    <span className="capitalize">{source}</span>
                    <span>{count}</span>
                  </div>
                  <div className="mt-1 relative">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                      <div
                        style={{ width: `${(count / totalCandidates) * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-secondary-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Job Performance */}
          <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Job Performance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Candidates
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      In Progress
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hired
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(jobMetrics).map(([title, metrics]) => (
                    <tr key={title}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {metrics.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {metrics.inProgress}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {metrics.hired}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 