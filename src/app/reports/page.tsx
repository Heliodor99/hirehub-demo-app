'use client';

import { useState } from 'react';
import { FiBarChart2, FiUsers, FiBriefcase, FiCalendar } from 'react-icons/fi';

const metrics = [
  {
    name: 'Total Applications',
    value: '286',
    change: '+12%',
    trend: 'up',
    icon: FiUsers,
  },
  {
    name: 'Active Jobs',
    value: '6',
    change: '+2',
    trend: 'up',
    icon: FiBriefcase,
  },
  {
    name: 'Interview Rate',
    value: '45%',
    change: '+5%',
    trend: 'up',
    icon: FiCalendar,
  },
  {
    name: 'Time to Hire',
    value: '32 days',
    change: '-3 days',
    trend: 'down',
    icon: FiBarChart2,
  },
];

const stages = [
  { name: 'Screening', value: 120, color: 'bg-blue-500' },
  { name: 'Assessment', value: 80, color: 'bg-yellow-500' },
  { name: 'Interview', value: 60, color: 'bg-purple-500' },
  { name: 'Offer', value: 20, color: 'bg-green-500' },
  { name: 'Hired', value: 6, color: 'bg-indigo-500' },
];

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="mt-1 text-sm text-gray-500">
              Overview of your recruitment metrics and performance
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.name}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <metric.icon
                      className="h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {metric.name}
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {metric.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span
                    className={`font-medium ${
                      metric.trend === 'up'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {metric.change}
                  </span>{' '}
                  <span className="text-gray-500">vs last period</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Candidate Pipeline
            </h3>
            <div className="space-y-4">
              {stages.map((stage) => (
                <div key={stage.name} className="flex items-center">
                  <div className="w-24 text-sm text-gray-500">{stage.name}</div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${stage.color}`}
                        style={{ width: `${(stage.value / 286) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm font-medium text-gray-900">
                    {stage.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Applications by Source
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-24 text-sm text-gray-500">LinkedIn</div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500"
                      style={{ width: '45%' }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right text-sm font-medium text-gray-900">
                  45%
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-24 text-sm text-gray-500">Indeed</div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500"
                      style={{ width: '30%' }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right text-sm font-medium text-gray-900">
                  30%
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-24 text-sm text-gray-500">Company Website</div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500"
                      style={{ width: '15%' }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right text-sm font-medium text-gray-900">
                  15%
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-24 text-sm text-gray-500">Referrals</div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500"
                      style={{ width: '10%' }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right text-sm font-medium text-gray-900">
                  10%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 