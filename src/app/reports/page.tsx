'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { FiBarChart2, FiUsers, FiBriefcase, FiCalendar, FiTrendingUp, FiDollarSign, FiMapPin, FiClock, FiCheck } from 'react-icons/fi';
import { candidates, jobs } from '@/data/jobs';
import { RecruitmentStage } from '@/types';

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const sourceChartRef = useRef<HTMLCanvasElement>(null);
  
  // Calculate real metrics from the data
  const metrics = useMemo(() => {
    // Total Applications
    const totalApplications = candidates.length;
    
    // Active Jobs
    const activeJobs = jobs.filter(job => job.status === 'Active').length;
    
    // Interview Rate (candidates in interview stage or beyond / total candidates)
    const interviewedCandidates = candidates.filter(c => 
      [RecruitmentStage.INTERVIEW_SCHEDULED, RecruitmentStage.FEEDBACK_DONE, RecruitmentStage.HIRED].includes(c.stage)
    ).length;
    const interviewRate = Math.round((interviewedCandidates / totalApplications) * 100);
    
    // Time to Hire (average days from application to hire)
    const hiredCandidates = candidates.filter(c => c.stage === RecruitmentStage.HIRED);
    let avgTimeToHire = 0;
    if (hiredCandidates.length > 0) {
      const today = new Date();
      const timeToHire = hiredCandidates.map(c => {
        const appliedDate = new Date(c.appliedDate);
        return Math.round((today.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
      });
      avgTimeToHire = Math.round(timeToHire.reduce((sum, days) => sum + days, 0) / hiredCandidates.length);
    }
    
    // Salary Range Analysis
    const avgMinSalary = Math.round(jobs.reduce((sum, job) => sum + job.salary.min, 0) / jobs.length);
    const formattedMinSalary = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(avgMinSalary);
    
    return [
      {
        name: 'Total Applications',
        value: totalApplications.toString(),
        change: `+${Math.round(totalApplications * 0.12)}`, // 12% increase assumption
        trend: 'up',
        icon: FiUsers,
      },
      {
        name: 'Active Jobs',
        value: activeJobs.toString(),
        change: `+${Math.round(activeJobs * 0.15)}`, // 15% increase assumption
        trend: 'up',
        icon: FiBriefcase,
      },
      {
        name: 'Interview Rate',
        value: `${interviewRate}%`,
        change: '+5%',
        trend: 'up',
        icon: FiCalendar,
      },
      {
        name: 'Time to Hire',
        value: `${avgTimeToHire} days`,
        change: '-3 days',
        trend: 'down',
        icon: FiClock,
      },
      {
        name: 'Avg. Min Salary',
        value: formattedMinSalary,
        change: '+8%',
        trend: 'up',
        icon: FiDollarSign,
      },
      {
        name: 'Offer Acceptance',
        value: '75%',
        change: '+5%',
        trend: 'up',
        icon: FiCheck,
      },
    ];
  }, []);

  // Calculate pipeline stages from real data
  const stages = useMemo(() => {
    const stageCount = {} as Record<string, number>;
    
    candidates.forEach(candidate => {
      stageCount[candidate.stage] = (stageCount[candidate.stage] || 0) + 1;
    });
    
    const colors = {
      [RecruitmentStage.APPLIED]: 'bg-blue-400',
      [RecruitmentStage.RESUME_SHORTLISTED]: 'bg-blue-500',
      [RecruitmentStage.ASSESSMENT_SENT]: 'bg-yellow-500',
      [RecruitmentStage.INTERVIEW_SCHEDULED]: 'bg-purple-500',
      [RecruitmentStage.FEEDBACK_DONE]: 'bg-purple-600',
      [RecruitmentStage.HIRED]: 'bg-green-500',
      [RecruitmentStage.REJECTED]: 'bg-red-500',
      [RecruitmentStage.OUTREACHED]: 'bg-gray-500',
      [RecruitmentStage.ENGAGED]: 'bg-indigo-400',
    };
    
    return Object.entries(stageCount)
      .filter(([stage]) => stage !== RecruitmentStage.REJECTED) // Exclude rejected candidates
      .map(([stage, count]) => ({
        name: stage.replace(/_/g, ' ').toLowerCase(),
        value: count,
        color: colors[stage as RecruitmentStage] || 'bg-gray-500',
      }))
      .sort((a, b) => b.value - a.value); // Sort by highest count
  }, []);
  
  // Use real source distribution data provided by the user
  const sources = useMemo(() => {
    return [
      { name: 'LinkedIn', value: 21 },
      { name: 'Company Website', value: 11 },
      { name: 'Referral', value: 11 },
      { name: 'Naukri', value: 6 },
      { name: 'AngelList', value: 5 },
      { name: 'Naukri.com', value: 5 },
      { name: 'TopHire', value: 4 },
      { name: 'Hired.com', value: 3 },
      { name: 'Indeed', value: 3 },
      { name: 'Instahyre', value: 3 },
    ].sort((a, b) => b.value - a.value);
  }, []);
  
  // Calculate skill demand
  const skillDemand = useMemo(() => {
    const skillCount = {} as Record<string, number>;
    
    jobs.forEach(job => {
      if (job.skills) {
        job.skills.forEach(skill => {
          skillCount[skill] = (skillCount[skill] || 0) + 1;
        });
      }
    });
    
    return Object.entries(skillCount)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 skills
  }, []);
  
  // Calculate location distribution
  const locations = useMemo(() => {
    const locationCount = {} as Record<string, number>;
    
    jobs.forEach(job => {
      // Extract city from location string (e.g., "Bangalore, Karnataka" -> "Bangalore")
      const city = job.location.split(',')[0].trim();
      locationCount[city] = (locationCount[city] || 0) + 1;
    });
    
    return Object.entries(locationCount)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // Draw the bar chart for sources using canvas
  useEffect(() => {
    if (!sourceChartRef.current) return;
    
    const ctx = sourceChartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear previous chart
    ctx.clearRect(0, 0, sourceChartRef.current.width, sourceChartRef.current.height);
    
    const barHeight = 24;
    const barGap = 10;
    const leftPadding = 150;
    const topPadding = 10;
    const maxBarWidth = sourceChartRef.current.width - leftPadding - 60;
    
    // Draw title
    ctx.font = 'bold 14px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#111827';
    ctx.textAlign = 'left';
    
    // Draw each bar
    sources.forEach((source, i) => {
      const y = topPadding + i * (barHeight + barGap);
      
      // Draw source name
      ctx.font = '12px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#6B7280';
      ctx.textAlign = 'left';
      ctx.fillText(source.name, 0, y + barHeight/2 + 4);
      
      // Draw bar
      const barWidth = (source.value / sources[0].value) * maxBarWidth;
      const gradient = ctx.createLinearGradient(leftPadding, 0, leftPadding + barWidth, 0);
      gradient.addColorStop(0, '#4F46E5');
      gradient.addColorStop(1, '#6366F1');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(leftPadding, y, barWidth, barHeight, [4]);
      ctx.fill();
      
      // Draw value
      ctx.font = 'bold 12px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#111827';
      ctx.textAlign = 'left';
      ctx.fillText(`${source.value}%`, leftPadding + barWidth + 8, y + barHeight/2 + 4);
    });
  }, [sources]);

  return (
    <div className="p-6 bg-gray-50">
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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {metrics.map((metric) => (
            <div
              key={metric.name}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <metric.icon
                      className="h-6 w-6 text-primary-500"
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
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Candidate Pipeline
            </h3>
            <div className="space-y-4">
              {stages.map((stage) => (
                <div key={stage.name} className="flex items-center">
                  <div className="w-36 text-sm text-gray-500 capitalize">{stage.name}</div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${stage.color}`}
                        style={{ width: `${(stage.value / candidates.length) * 100}%` }}
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

          <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Applications by Source
            </h3>
            <div className="h-[360px] relative">
              <canvas 
                ref={sourceChartRef} 
                width={550} 
                height={360}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
        
        {/* Additional insights sections */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Top In-Demand Skills
            </h3>
            <div className="space-y-4">
              {skillDemand.map(({ skill, count }) => (
                <div key={skill} className="flex items-center">
                  <div className="w-36 text-sm text-gray-500">{skill}</div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-indigo-500"
                        style={{ width: `${(count / jobs.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm font-medium text-gray-900">
                    {Math.round((count / jobs.length) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Job Distribution by Location
            </h3>
            <div className="space-y-4">
              {locations.map(({ city, count }) => (
                <div key={city} className="flex items-center">
                  <div className="w-36 text-sm text-gray-500">{city}</div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
                        style={{ width: `${(count / jobs.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm font-medium text-gray-900">
                    {count} jobs
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Candidate Experience Metrics */}
        <div className="mt-8 bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Experience Level Distribution
          </h3>
          <div className="grid grid-cols-1 gap-8">
            <div className="flex items-center justify-center space-x-4">
              {[
                { range: '0-2 years', percent: 1 },
                { range: '3-5 years', percent: 54 },
                { range: '6-8 years', percent: 36 },
                { range: '9-12 years', percent: 6 },
                { range: '13+ years', percent: 1 },
              ].map((item) => (
                <div key={item.range} className="flex flex-col items-center w-40">
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                  <div className="mt-2">
                    <span className="block text-2xl font-bold text-center text-gray-800">{item.percent}%</span>
                    <span className="block text-sm text-center text-gray-600">{item.range}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="relative h-64">
              <div className="absolute inset-0 flex items-end">
                {[
                  { range: '0-2 years', percent: 1, color: 'from-blue-400 to-blue-500' },
                  { range: '3-5 years', percent: 54, color: 'from-indigo-400 to-indigo-600' },
                  { range: '6-8 years', percent: 36, color: 'from-violet-400 to-violet-600' },
                  { range: '9-12 years', percent: 6, color: 'from-purple-400 to-purple-600' },
                  { range: '13+ years', percent: 1, color: 'from-pink-400 to-pink-600' },
                ].map((item, index) => (
                  <div 
                    key={item.range} 
                    className="flex-1 flex flex-col items-center justify-end"
                  >
                    <div className="relative w-full px-2">
                      <div 
                        className={`w-full bg-gradient-to-t ${item.color} rounded-t-lg`}
                        style={{ height: `${Math.max(item.percent * 2, 5)}px` }}
                      />
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-center">
                        <span className="block text-xl font-bold text-gray-800">{item.percent}%</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-center text-gray-600">{item.range}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 