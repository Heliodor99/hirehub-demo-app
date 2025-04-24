'use client';

import { useState } from 'react';
import { FiBriefcase, FiUsers, FiCheckCircle, FiAward, FiCalendar, FiClock, FiFilter } from 'react-icons/fi';
import { jobs, candidates } from '@/data/jobs';
import { interviews } from '@/data/interviews';
import { company } from '@/data/company';
import Link from 'next/link';
import { Button, Card, CardHeader, CardBody, SectionHeading } from '@/components/DesignSystem';
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

  // Calculate metrics
  const activeJobs = jobs.filter(job => job.status === 'Active').length;
  const totalCandidates = candidates.length;
  const interviewsToday = interviews.filter(interview => 
    interview.status === 'Scheduled' && 
    new Date(interview.date).toDateString() === new Date().toDateString()
  ).length;
  const hiredThisMonth = candidates.filter(candidate => 
    candidate.stage === 'Hired'
  ).length;

  return (
    <div className="p-6 space-y-8 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <SectionHeading
          subheading="Welcome back! Here's what's happening with your recruitment process."
        >
          Dashboard
        </SectionHeading>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FiFilter className="h-4 w-4" />}
          >
            Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FiClock className="h-4 w-4" />}
          >
            Last 30 Days
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="transition-all duration-200 hover:shadow-lg">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100">
                <FiBriefcase className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                <p className="text-2xl font-semibold text-gray-900">{metrics.activeJobs}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-teal-100">
                <FiUsers className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">New Applications</p>
                <p className="text-2xl font-semibold text-gray-900">{metrics.newApplications}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FiCheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Shortlisted</p>
                <p className="text-2xl font-semibold text-gray-900">{metrics.shortlistedCandidates}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-lg">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <FiAward className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Top Ranking</p>
                <p className="text-2xl font-semibold text-gray-900">{metrics.topRankingCandidates}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <ActiveJobs />
          <ApplicationSourceChart />
        </div>
        <div className="space-y-8">
          <RecentApplications />
          <UpcomingInterviews />
          <TopTalent />
        </div>
      </div>
    </div>
  );
} 