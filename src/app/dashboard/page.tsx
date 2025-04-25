'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  FiBriefcase, 
  FiUsers, 
  FiCheckCircle, 
  FiAward, 
  FiCalendar, 
  FiClock, 
  FiFilter
} from 'react-icons/fi';
import { jobs, candidates } from '@/data/jobs';
import { RecruitmentStage } from '@/types';
import Link from 'next/link';
import ActiveJobs from './components/ActiveJobs';
import UpcomingInterviews from './components/UpcomingInterviews';
import ApplicationsByJob from './components/ApplicationsByJob';

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [timeRangeLabel, setTimeRangeLabel] = useState('Last 7 Days');

  // Calculate time range in days
  const timeRangeDays = useMemo(() => {
    const ranges = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '180d': 180,
      '365d': 365
    };
    return ranges[timeRange as keyof typeof ranges] || 7;
  }, [timeRange]);

  // Get date for calculating metrics based on time range
  const getStartDate = useMemo(() => {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - timeRangeDays);
    return startDate;
  }, [timeRangeDays]);

  // Filter candidates by date range
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const appDate = new Date(c.appliedDate);
      return appDate >= getStartDate;
    });
  }, [getStartDate]);

  // Calculate metrics based on real data
  const metrics = useMemo(() => {
    // Active jobs
    const activeJobs = jobs.filter(job => job.status === 'Active').length;
    
    // New applications in time period
    const newApplications = filteredCandidates.length;
    
    // Shortlisted candidates in time period
    const shortlistedCandidates = filteredCandidates.filter(c => 
      c.stage === RecruitmentStage.SHORTLISTED
    ).length;
    
    // Top talent (candidates with assessment score >= 85)
    const topTalent = filteredCandidates.filter(c => 
      c.assessment?.score && c.assessment.score >= 85
    ).length;

    return {
      activeJobs,
      newApplications,
      shortlistedCandidates,
      topTalent
    };
  }, [filteredCandidates]);

  // Get upcoming interviews
  const upcomingInterviews = useMemo(() => {
    return candidates
      .filter(c => c.interview && c.interview.status === 'Scheduled')
      .sort((a, b) => {
        if (!a.interview || !b.interview) return 0;
        return new Date(`${a.interview.date} ${a.interview.time}`).getTime() - 
              new Date(`${b.interview.date} ${b.interview.time}`).getTime();
      })
      .slice(0, 3);
  }, []);

  // Function to update time range
  const updateTimeRange = (range: string, label: string) => {
    setTimeRange(range);
    setTimeRangeLabel(label);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruitment Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your recruitment pipeline and hiring metrics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FiClock className="mr-2" />
              {timeRangeLabel}
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10 hidden">
              <div className="py-1">
                <button 
                  onClick={() => updateTimeRange('7d', 'Last 7 Days')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Last 7 Days
                </button>
                <button 
                  onClick={() => updateTimeRange('30d', 'Last 30 Days')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Last 30 Days
                </button>
                <button 
                  onClick={() => updateTimeRange('90d', 'Last 90 Days')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Last 90 Days
                </button>
                <button 
                  onClick={() => updateTimeRange('180d', 'Last 6 Months')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Last 6 Months
                </button>
                <button 
                  onClick={() => updateTimeRange('365d', 'Last Year')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Last Year
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-5xl font-bold text-gray-900">{metrics.activeJobs}</p>
              <p className="mt-1 text-sm font-medium text-gray-500">Active Job Post</p>
            </div>
            <div className="p-4 rounded-full bg-green-50">
              <FiBriefcase className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-5xl font-bold text-gray-900">{metrics.newApplications}</p>
              <p className="mt-1 text-sm font-medium text-gray-500">New Applications</p>
            </div>
            <div className="p-4 rounded-full bg-yellow-50">
              <FiUsers className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-5xl font-bold text-gray-900">{metrics.shortlistedCandidates}</p>
              <p className="mt-1 text-sm font-medium text-gray-500">Shortlisted Candidates</p>
            </div>
            <div className="p-4 rounded-full bg-blue-50">
              <FiCheckCircle className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-5xl font-bold text-gray-900">{metrics.topTalent}</p>
              <p className="mt-1 text-sm font-medium text-gray-500">Top Ranking Candidates</p>
            </div>
            <div className="p-4 rounded-full bg-pink-50">
              <FiAward className="h-6 w-6 text-pink-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveJobs />
        <ApplicationsByJob timeRange={timeRangeDays} />
        <div className="lg:col-span-2">
          <UpcomingInterviews />
        </div>
      </div>
    </div>
  );
} 