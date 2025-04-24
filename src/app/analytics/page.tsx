'use client';

import { useState, useMemo } from 'react';
import { FiTrendingUp, FiUsers, FiBriefcase, FiClock, FiBarChart2, FiPieChart, FiAward, FiStar, FiActivity, FiTarget } from 'react-icons/fi';
import { candidates, jobs } from '@/data/jobs';
import { RecruitmentStage, Job, Candidate } from '@/types';
import { calculateTimeToHire, calculateRecruitmentEfficiency, calculateFunnelEfficiency } from '@/services/analytics';

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

  // Calculate time-to-hire metrics (in days) using our consistent service
  const timeToHire = candidates
    .filter(c => c.stage === RecruitmentStage.HIRED)
    .map(c => calculateTimeToHire(c));
    
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

  // Calculate assessment scores metrics
  const assessmentMetrics = useMemo(() => {
    // Filter candidates with completed assessments
    const candidatesWithAssessments = candidates.filter(c => c.assessment?.completed);
    
    const averageScore = candidatesWithAssessments.length > 0 
      ? Math.round(candidatesWithAssessments.reduce((sum, c) => sum + (c.assessment?.score || 0), 0) / candidatesWithAssessments.length)
      : 0;
    
    // Score distribution by range
    const scoreRanges = {
      excellent: candidatesWithAssessments.filter(c => (c.assessment?.score || 0) >= 90).length,
      good: candidatesWithAssessments.filter(c => (c.assessment?.score || 0) >= 75 && (c.assessment?.score || 0) < 90).length,
      average: candidatesWithAssessments.filter(c => (c.assessment?.score || 0) >= 60 && (c.assessment?.score || 0) < 75).length,
      belowAverage: candidatesWithAssessments.filter(c => (c.assessment?.score || 0) < 60).length,
    };
    
    // Percentage hired by score range
    const hiredByScore = {
      excellent: calculateHiredPercentByScoreRange(90, 101),
      good: calculateHiredPercentByScoreRange(75, 90),
      average: calculateHiredPercentByScoreRange(60, 75),
      belowAverage: calculateHiredPercentByScoreRange(0, 60),
    };
    
    return { averageScore, scoreRanges, hiredByScore };
  }, []);
  
  // Helper function for hired percentage by score range
  function calculateHiredPercentByScoreRange(min: number, max: number): number {
    const candidatesInRange = candidates.filter(c => 
      c.assessment?.completed && 
      (c.assessment?.score || 0) >= min && 
      (c.assessment?.score || 0) < max
    );
    
    if (candidatesInRange.length === 0) return 0;
    
    const hiredInRange = candidatesInRange.filter(c => c.stage === RecruitmentStage.HIRED).length;
    return Math.round((hiredInRange / candidatesInRange.length) * 100);
  }
  
  // Calculate recruitment efficiency score using our service
  const conversionRate = totalCandidates > 0 
    ? (stageMetrics[RecruitmentStage.HIRED] / totalCandidates) * 100
    : 0;
    
  const recruitmentEfficiency = calculateRecruitmentEfficiency(
    avgTimeToHire,
    conversionRate,
    assessmentMetrics.averageScore,
    Object.keys(sourceMetrics).length
  );
  
  // Calculate funnel efficiency using our service
  const stageOrder = [
    RecruitmentStage.APPLIED,
    RecruitmentStage.RESUME_SHORTLISTED,
    RecruitmentStage.ASSESSMENT_SENT,
    RecruitmentStage.INTERVIEW_SCHEDULED,
    RecruitmentStage.FEEDBACK_DONE,
    RecruitmentStage.HIRED
  ];
  
  const funnelEfficiency = calculateFunnelEfficiency(stageOrder, stageMetrics);
  
  // Calculate skill heat map - for top skills, which ones are in high demand but low supply
  const skillHeatMap = useMemo(() => {
    const skillDemand = {} as Record<string, number>;
    const skillSupply = {} as Record<string, number>;
    
    // Calculate demand from jobs
    jobs.forEach(job => {
      if (job.skills) {
        job.skills.forEach(skill => {
          skillDemand[skill] = (skillDemand[skill] || 0) + 1;
        });
      }
    });
    
    // Calculate supply from candidates
    candidates.forEach(candidate => {
      candidate.skills.forEach(skill => {
        skillSupply[skill] = (skillSupply[skill] || 0) + 1;
      });
    });
    
    // Calculate heat index (demand / supply ratio) - higher means harder to fill
    const heatMap = Object.keys(skillDemand).map(skill => {
      const demand = skillDemand[skill];
      const supply = skillSupply[skill] || 0.5; // Avoid division by zero
      const heatIndex = demand / supply;
      
      return {
        skill,
        demand,
        supply,
        heatIndex: parseFloat(heatIndex.toFixed(2)),
      };
    }).sort((a, b) => b.heatIndex - a.heatIndex).slice(0, 5);
    
    return heatMap;
  }, []);

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

        {/* Recruitment Performance Score */}
        <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recruitment Performance Score</h3>
          </div>
          <div className="px-6 py-5 flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative w-28 h-28">
                {/* Circular progress background */}
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#f3f4f6" 
                    strokeWidth="10" 
                  />
                  
                  {/* Progress circle with gradient */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45"
                    fill="none" 
                    stroke={
                      recruitmentEfficiency >= 75 ? "url(#gradientGreen)" : 
                      recruitmentEfficiency >= 50 ? "url(#gradientYellow)" : 
                      "url(#gradientRed)"
                    }
                    strokeWidth="10" 
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45 * recruitmentEfficiency / 100} ${2 * Math.PI * 45}`}
                    transform="rotate(-90 50 50)"
                  />
                  
                  {/* Gradient definitions */}
                  <defs>
                    <linearGradient id="gradientGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="gradientYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FBBF24" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                    <linearGradient id="gradientRed" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#B91C1C" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Score text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{recruitmentEfficiency}</span>
                </div>
              </div>
              
              <div className="ml-6">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full 
                  ${recruitmentEfficiency >= 80 ? 'bg-green-100 text-green-800' : 
                   recruitmentEfficiency >= 70 ? 'bg-green-50 text-green-700' : 
                   recruitmentEfficiency >= 60 ? 'bg-yellow-100 text-yellow-800' :
                   recruitmentEfficiency >= 50 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-100 text-red-800'}`}>
                  {recruitmentEfficiency >= 80 ? 'Excellent' : 
                   recruitmentEfficiency >= 70 ? 'Very Good' : 
                   recruitmentEfficiency >= 60 ? 'Good' :
                   recruitmentEfficiency >= 50 ? 'Average' : 'Needs Improvement'}
                </span>
                <p className="mt-3 text-sm text-gray-500">Based on time-to-hire, conversion rate, candidate quality, and source diversity</p>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${timeToHire.length > 0 && avgTimeToHire < 25 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="ml-2 text-xs text-gray-500">Time-to-hire</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${totalCandidates > 0 && (stageMetrics[RecruitmentStage.HIRED] / totalCandidates) > 0.1 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="ml-2 text-xs text-gray-500">Conversion rate</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${assessmentMetrics.averageScore > 80 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="ml-2 text-xs text-gray-500">Candidate quality</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${Object.keys(sourceMetrics).length > 3 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="ml-2 text-xs text-gray-500">Source diversity</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <span className="block text-sm font-medium text-gray-500">Time to Hire</span>
                <span className="text-2xl font-semibold text-gray-900">{avgTimeToHire}</span>
                <span className="text-sm text-gray-500 ml-1">days</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <span className="block text-sm font-medium text-gray-500">Conversion Rate</span>
                <span className="text-2xl font-semibold text-gray-900">
                  {totalCandidates > 0 
                    ? Math.round((stageMetrics[RecruitmentStage.HIRED] / totalCandidates) * 100)
                    : 0}
                </span>
                <span className="text-sm text-gray-500 ml-1">%</span>
              </div>
            </div>
          </div>
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
                  <FiAward className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg. Assessment Score</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {assessmentMetrics.averageScore}%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Funnel Efficiency */}
        <div className="mb-8 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recruitment Funnel Efficiency</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center">
              <div className="w-full max-w-4xl">
                {funnelEfficiency.map((stage, i) => (
                  <div key={stage.to} className="mb-4 relative">
                    <div className="flex items-center">
                      {/* Stage count */}
                      <div 
                        className={`px-6 py-3 w-full rounded-md text-center font-medium shadow-sm transition-all duration-300 ${
                          i === funnelEfficiency.length - 1 
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        }`}
                        style={{
                          width: `${Math.max(30, (stage.count / Math.max(...funnelEfficiency.map(s => s.count))) * 100)}%`,
                          height: '60px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <span className="text-lg font-bold">{stage.count}</span>
                        <span className="ml-3 text-sm capitalize">
                          {stage.to.replace(/_/g, ' ').toLowerCase()}
                        </span>
                      </div>
                      
                      {/* Conversion rate */}
                      {i > 0 && (
                        <div className="ml-4 w-20 text-sm font-medium">
                          <div className={`
                            ${stage.rate >= 70 ? 'text-green-600' : 
                              stage.rate >= 50 ? 'text-yellow-600' : 
                              'text-red-600'
                            } flex items-center
                          `}>
                            <span className="text-lg font-bold">{stage.rate}%</span>
                            {stage.rate >= 50 ? (
                              <FiTrendingUp className="ml-1" />
                            ) : (
                              <FiTrendingUp className="ml-1 transform rotate-180" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Connector */}
                    {i < funnelEfficiency.length - 1 && (
                      <div className="w-8 h-8 mx-auto mt-1 mb-1 flex justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 10l5 5 5-5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Pipeline Stage Distribution */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Pipeline Stage Distribution</h3>
            <div className="space-y-5">
              {Object.entries(stageMetrics)
                .sort(([, a], [, b]) => b - a) // Sort by count in descending order
                .map(([stage, count]) => (
                  <div key={stage} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 capitalize w-40">
                        {stage.toLowerCase().replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">{count}</span>
                    </div>
                    <div className="relative">
                      <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-100">
                        <div
                          style={{ width: `${(count / Math.max(...Object.values(stageMetrics))) * 100}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300 ease-in-out hover:bg-blue-600"
                        />
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          {/* Source Distribution */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Candidate Sources</h3>
            <div className="space-y-5 max-h-[600px] overflow-y-auto pr-4">
              {Object.entries(sourceMetrics)
                .sort(([, a], [, b]) => b - a) // Sort by count in descending order
                .map(([source, count]) => (
                  <div key={source} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 w-48 truncate" title={source}>
                        {source}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 ml-2">{count}</span>
                    </div>
                    <div className="relative">
                      <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-100">
                        <div
                          style={{ width: `${(count / Math.max(...Object.values(sourceMetrics))) * 100}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-300 ease-in-out hover:bg-green-600"
                        />
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          {/* Skill Heat Map */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Skills Heat Map (High Demand vs. Low Supply)
            </h3>
            <div className="space-y-6">
              {skillHeatMap.map(({ skill, demand, supply, heatIndex }) => (
                <div key={skill} className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-base font-medium text-gray-900">{skill}</span>
                      <div className="flex items-center mt-1 space-x-4">
                        <span className="text-sm text-blue-600">
                          <span className="font-medium">{demand}</span> jobs
                        </span>
                        <span className="text-sm text-green-600">
                          <span className="font-medium">{supply}</span> candidates
                        </span>
                        <span className="text-sm text-orange-600">
                          <span className="font-medium">{heatIndex.toFixed(2)}</span> D/S ratio
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300 ease-in-out"
                        style={{
                          width: `${Math.min(heatIndex * 20, 100)}%`,
                          background: `linear-gradient(90deg, 
                            ${heatIndex > 2 ? '#ef4444' : '#f87171'} 0%, 
                            ${heatIndex > 1.5 ? '#dc2626' : '#ef4444'} 50%, 
                            ${heatIndex > 1 ? '#b91c1c' : '#dc2626'} 100%)`
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center">
                      <div className="h-4 border-l-2 border-gray-300" style={{ marginLeft: `${(supply / (demand + supply)) * 100}%` }}>
                        <div className="absolute -top-2 -ml-1 text-xs text-gray-500">Supply</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>Low Demand/Supply Ratio</span>
                    <span>High Demand/Supply Ratio</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <span className="font-medium">How to read:</span> Higher D/S ratio indicates skills in high demand but low supply. 
                These are potential areas for recruitment focus.
              </div>
            </div>
          </div>

          {/* Assessment Score Distribution */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Assessment Score Distribution
            </h3>
            
            {/* Score Distribution */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Excellent (90-100)', count: assessmentMetrics.scoreRanges.excellent, color: 'bg-green-500', textColor: 'text-green-700' },
                { label: 'Good (75-89)', count: assessmentMetrics.scoreRanges.good, color: 'bg-blue-500', textColor: 'text-blue-700' },
                { label: 'Average (60-74)', count: assessmentMetrics.scoreRanges.average, color: 'bg-yellow-500', textColor: 'text-yellow-700' },
                { label: 'Below Average (<60)', count: assessmentMetrics.scoreRanges.belowAverage, color: 'bg-red-500', textColor: 'text-red-700' },
              ].map((range) => (
                <div key={range.label} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <div className={`w-12 h-12 ${range.color} rounded-full mb-3 flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">{range.count}</span>
                  </div>
                  <div className={`text-sm font-medium ${range.textColor}`}>{range.label}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.round((range.count / (
                      assessmentMetrics.scoreRanges.excellent +
                      assessmentMetrics.scoreRanges.good +
                      assessmentMetrics.scoreRanges.average +
                      assessmentMetrics.scoreRanges.belowAverage
                    )) * 100)}% of total
                  </div>
                </div>
              ))}
            </div>

            {/* Hiring Rate by Assessment Score */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Hiring Rate by Assessment Score</h4>
              <div className="space-y-4">
                {[
                  { label: 'Excellent (90-100)', rate: assessmentMetrics.hiredByScore.excellent, color: 'bg-green-500' },
                  { label: 'Good (75-89)', rate: assessmentMetrics.hiredByScore.good, color: 'bg-blue-500' },
                  { label: 'Average (60-74)', rate: assessmentMetrics.hiredByScore.average, color: 'bg-yellow-500' },
                  { label: 'Below Average (<60)', rate: assessmentMetrics.hiredByScore.belowAverage, color: 'bg-red-500' },
                ].map((range) => (
                  <div key={range.label} className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{range.label}</span>
                      <span className="text-sm font-bold text-gray-900">{range.rate}%</span>
                    </div>
                    <div className="relative h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full ${range.color} transition-all duration-300 ease-in-out`}
                        style={{ width: `${range.rate}%` }}
                      >
                        {range.rate > 15 && (
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                            {range.rate}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {assessmentMetrics.averageScore}%
                  </div>
                  <div className="text-sm text-gray-600">Average Assessment Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round((assessmentMetrics.scoreRanges.excellent + assessmentMetrics.scoreRanges.good) / 
                      (assessmentMetrics.scoreRanges.excellent + assessmentMetrics.scoreRanges.good + 
                       assessmentMetrics.scoreRanges.average + assessmentMetrics.scoreRanges.belowAverage) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Candidates Scoring Above 75%</div>
                </div>
              </div>
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
                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Efficiency
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(jobMetrics).map(([title, metrics]) => {
                    // Calculate efficiency score for job
                    const efficiency = metrics.total > 0 
                      ? Math.round((metrics.hired / metrics.total) * 100) 
                      : 0;
                    
                    return (
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
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end">
                            <span className={`text-sm font-medium ${
                              efficiency >= 15 ? 'text-green-600' : 
                              efficiency >= 10 ? 'text-yellow-600' : 
                              'text-red-600'
                            }`}>
                              {efficiency}%
                            </span>
                            <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  efficiency >= 15 ? 'bg-green-500' : 
                                  efficiency >= 10 ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(efficiency * 3, 100)}%` }} 
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 