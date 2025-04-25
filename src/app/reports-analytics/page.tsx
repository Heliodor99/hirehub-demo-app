'use client';

import { useState, useMemo } from 'react';
import { FiBarChart2, FiUsers, FiBriefcase, FiCalendar, FiTrendingUp, FiDollarSign, FiMapPin, FiClock, FiCheck, FiInfo, FiFilter, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { candidates, jobs } from '@/data/jobs';
import { RecruitmentStage, Candidate } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area } from 'recharts';

export default function ReportsAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState('all');
  
  // Function to refresh data
  const refreshData = () => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Weekly application data by day for each job
  const weeklyApplicationData = useMemo(() => {
    // Generate sample data for weekly applications by day
    const jobIds = selectedJob === 'all' ? 
      jobs.filter(job => job.status === 'Active').slice(0, 4).map(job => job.id) : 
      [selectedJob];
    
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return weekdays.map(day => {
      const data = { name: day };
      
      jobIds.forEach(jobId => {
        const job = jobs.find(j => j.id === jobId);
        if (job) {
          // Generate random but consistent values for each job and day
          // Use job.id as seed for pseudo-randomness
          const seed = parseInt(jobId) * weekdays.indexOf(day);
          const baseValue = (seed % 200) + 100;
          data[job.title] = baseValue + Math.floor(Math.random() * 300);
        }
      });
      
      return data;
    });
  }, [selectedJob]);

  // Time saved calculation
  const timeSavingMetrics = useMemo(() => {
    // Estimate time saved based on automation
    const totalCandidates = candidates.length;
    
    // Manual outreach time (minutes per candidate)
    const manualOutreachTimePerCandidate = 15;
    
    // Manual screening time (minutes per candidate)
    const manualScreeningTimePerCandidate = 20;
    
    // Manual interview scheduling time (minutes per candidate)
    const manualInterviewSchedulingPerCandidate = 10;
    
    // Total time saved in minutes
    const outreachTimeSaved = totalCandidates * manualOutreachTimePerCandidate;
    const screeningTimeSaved = totalCandidates * manualScreeningTimePerCandidate;
    const schedulingTimeSaved = candidates.filter(c => c.stage === RecruitmentStage.INTERVIEWED).length * manualInterviewSchedulingPerCandidate;
    
    const totalTimeSavedMinutes = outreachTimeSaved + screeningTimeSaved + schedulingTimeSaved;
    const totalTimeSavedHours = Math.round(totalTimeSavedMinutes / 60);
    const totalTimeSavedDays = Math.round(totalTimeSavedHours / 8); // Assuming 8-hour workdays
    
    return {
      totalTimeSavedMinutes,
      totalTimeSavedHours,
      totalTimeSavedDays,
      outreachTimeSaved,
      screeningTimeSaved,
      schedulingTimeSaved,
    };
  }, []);

  // Hiring process comparison
  const hiringProcessComparison = useMemo(() => {
    return [
      {
        stage: 'Candidate Sourcing',
        traditional: '2-3 weeks',
        hireHub: '3-5 days',
        timeSaved: '~75%'
      },
      {
        stage: 'Initial Screening',
        traditional: '1-2 weeks',
        hireHub: '1-2 days',
        timeSaved: '~85%'
      },
      {
        stage: 'Interview Scheduling',
        traditional: '3-5 days',
        hireHub: 'Same day',
        timeSaved: '~90%'
      },
      {
        stage: 'Resume Evaluation',
        traditional: '1-2 days per batch',
        hireHub: 'Minutes',
        timeSaved: '~95%'
      },
      {
        stage: 'Candidate Matching',
        traditional: '1 week',
        hireHub: 'Instant',
        timeSaved: '~99%'
      },
      {
        stage: 'Overall Time to Hire',
        traditional: '45-60 days',
        hireHub: '14-21 days',
        timeSaved: '~65%'
      }
    ];
  }, []);

  // Colors for charts
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#6366F1'];

  // Calculate metrics from the data for the key metrics section
  const metrics = useMemo(() => {
    // Total Applications
    const totalApplications = candidates.length;
    
    // Calculate HireHub sourced candidates
    const hireHubCandidates = candidates.filter(c => c.source === 'HireHub').length;
    const hireHubPercentage = Math.round((hireHubCandidates / totalApplications) * 100);
    
    // Interview Rate (candidates in interview stage or beyond / total candidates)
    const interviewedCandidates = candidates.filter(c => 
      [RecruitmentStage.INTERVIEWED, RecruitmentStage.OFFER_EXTENDED, RecruitmentStage.HIRED].includes(c.stage)
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
    
    // Offer Acceptance Rate
    const offersExtended = candidates.filter(c => 
      [RecruitmentStage.OFFER_EXTENDED, RecruitmentStage.OFFER_REJECTED, RecruitmentStage.HIRED].includes(c.stage)
    ).length;
    
    const offersAccepted = candidates.filter(c => c.stage === RecruitmentStage.HIRED).length;
    const acceptanceRate = offersExtended > 0 ? Math.round((offersAccepted / offersExtended) * 100) : 0;
    
    return [
      {
        name: 'Total Candidates',
        value: totalApplications.toString(),
        change: `+${Math.round(totalApplications * 0.12)}`,
        trend: 'up',
        icon: FiUsers,
        description: 'Total number of candidates in the system'
      },
      {
        name: 'HireHub Sourced',
        value: `${hireHubPercentage}%`,
        change: `+${hireHubCandidates}`,
        trend: 'up',
        icon: FiTrendingUp,
        description: 'Percentage of candidates sourced via HireHub'
      },
      {
        name: 'Time to Hire',
        value: `${avgTimeToHire} days`,
        change: '-3 days',
        trend: 'down',
        icon: FiClock,
        description: 'Average days from application to hire'
      },
    ];
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="mt-1 text-sm text-gray-500">
              Comprehensive overview of your recruitment metrics and performance
            </p>
          </div>
          <div className="flex space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="block pl-3 pr-10 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md shadow-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button 
              onClick={refreshData}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isLoading ? (
                <FiRefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FiRefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <FiDownload className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    {metric.name}
                    <FiInfo className="ml-1 text-gray-400 hover:text-gray-500 cursor-pointer" title={metric.description} />
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-full ${
                  metric.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <metric.icon className={`h-6 w-6 ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
              <div className="mt-4">
                <p className={`text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change} {timeRange}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Application Tracker */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Weekly Application Tracker</h2>
            <div className="flex space-x-3">
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="block pl-3 pr-10 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md shadow-sm"
              >
                <option value="all">All Active Jobs</option>
                {jobs.filter(job => job.status === 'Active').map((job) => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={weeklyApplicationData}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {jobs
                  .filter(job => job.status === 'Active')
                  .filter(job => selectedJob === 'all' || job.id === selectedJob)
                  .slice(0, 4) // Limit to 4 jobs for better visualization
                  .map((job, index) => (
                    <Line
                      key={job.id}
                      type="monotone"
                      dataKey={job.title}
                      stroke={COLORS[index % COLORS.length]}
                      activeDot={{ r: 8 }}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Saved Metrics */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Time Saved with HireHub</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Total Time Saved</h3>
                <FiClock className="h-5 w-5 text-blue-500" />
              </div>
              <p className="mt-2 text-3xl font-bold text-blue-600">{timeSavingMetrics.totalTimeSavedHours} hours</p>
              <p className="text-sm text-gray-600">({timeSavingMetrics.totalTimeSavedDays} working days)</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Manual Outreach Avoided</h3>
                <FiUsers className="h-5 w-5 text-green-500" />
              </div>
              <p className="mt-2 text-3xl font-bold text-green-600">{Math.round(timeSavingMetrics.outreachTimeSaved / 60)} hours</p>
              <p className="text-sm text-gray-600">({candidates.length} candidates)</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Screening Time Saved</h3>
                <FiCheck className="h-5 w-5 text-purple-500" />
              </div>
              <p className="mt-2 text-3xl font-bold text-purple-600">{Math.round(timeSavingMetrics.screeningTimeSaved / 60)} hours</p>
              <p className="text-sm text-gray-600">(Manual screening avoided)</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-md font-medium text-gray-800 mb-4">Traditional Hiring vs. HireHub AI</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hiring Stage</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Traditional Process</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">With HireHub AI</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Saved</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hiringProcessComparison.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.stage}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.traditional}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.hireHub}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{row.timeSaved}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Key Insights Call-out */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md p-6 mb-8 text-white">
          <h2 className="text-xl font-bold mb-4">Key Insights</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 mr-2">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p>HireHub has saved recruiters <span className="font-bold underline">{timeSavingMetrics.totalTimeSavedDays} days</span> of manual work in the current hiring cycle</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 mr-2">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p>Hiring process is <span className="font-bold underline">65% faster</span> compared to traditional methods</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 mr-2">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p>Automated outreach has contacted <span className="font-bold underline">{candidates.length} candidates</span> without manual intervention</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 