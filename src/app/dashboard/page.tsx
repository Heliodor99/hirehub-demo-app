'use client';

import { useState } from 'react';
import { FiBriefcase, FiUsers, FiCheckCircle, FiAward, FiCalendar, FiClock, FiFilter } from 'react-icons/fi';
import { jobs, candidates } from '@/data/jobs';
import { company } from '@/data/company';
import Link from 'next/link';
import RecentApplications from './components/RecentApplications';
import ActiveJobs from './components/ActiveJobs';
import UpcomingInterviews from './components/UpcomingInterviews';
import TopTalent from './components/TopTalent';
import ApplicationSourceChart from './components/ApplicationSourceChart';

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('7d');

  // Calculate metrics
  const metrics = {
    activeJobs: jobs.filter(job => job.status === 'Active').length,
    newApplications: candidates.filter(c => {
      const appDate = new Date(c.appliedDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - appDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length,
    shortlistedCandidates: candidates.filter(c => c.stage === 'Resume Shortlisted').length,
    topRankingCandidates: candidates.filter(c => c.assessment?.score && c.assessment.score >= 85).length
  };

  const recentApplications = candidates
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 5);

  const upcomingInterviews = candidates
    .filter(c => c.interview && c.interview.status === 'Scheduled')
    .sort((a, b) => {
      if (!a.interview || !b.interview) return 0;
      return new Date(`${a.interview.date} ${a.interview.time}`).getTime() - 
             new Date(`${b.interview.date} ${b.interview.time}`).getTime();
    })
    .slice(0, 3);

  // Calculate metrics
  const activeJobs = jobs.filter(job => job.status === 'Active').length;
  const totalCandidates = candidates.length;
  const interviewsToday = candidates.filter(candidate => 
    candidate.stage === 'Interview Scheduled' && 
    candidate.interview?.date && 
    new Date(candidate.interview.date).toDateString() === new Date().toDateString()
  ).length;
  const hiredThisMonth = candidates.filter(candidate => 
    candidate.stage === 'Hired' && 
    candidate.lastUpdated &&
    new Date(candidate.lastUpdated).getMonth() === new Date().getMonth()
  ).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your recruitment process.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FiFilter className="mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FiClock className="mr-2" />
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FiBriefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Jobs</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.activeJobs}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <FiUsers className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">New Applications</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.newApplications}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <FiCheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Shortlisted</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.shortlistedCandidates}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <FiAward className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Top Ranking</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.topRankingCandidates}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ActiveJobs />
          <ApplicationSourceChart />
        </div>
        <div className="space-y-6">
          <RecentApplications />
          <UpcomingInterviews />
          <TopTalent />
        </div>
      </div>
    </div>
  );
} 