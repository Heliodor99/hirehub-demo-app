'use client';

import { useState } from 'react';
import { FiBriefcase, FiMapPin, FiCalendar, FiUsers, FiDollarSign, FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';
import { jobs, candidates } from '@/data/jobs';
import { RecruitmentStage } from '@/types';
import { getStageColor, formatStageName, pipelineStageGroups, getCandidatesByStageGroup } from '@/utils/recruitment';

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  
  const job = jobs.find(j => j.id === params.id);
  const jobCandidates = candidates.filter(c => c.jobId === params.id);

  // Filter candidates based on search query and selected stage
  const filteredCandidates = jobCandidates.filter(candidate => {
    const matchesSearch = searchQuery === '' || 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.currentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStage = !selectedStage || candidate.stage === selectedStage;
    
    return matchesSearch && matchesStage;
  });

  if (!job) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900">Job Not Found</h1>
            <p className="mt-2 text-gray-600">The job you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate pipeline stage counts
  const stageCounts = Object.values(RecruitmentStage).reduce((acc, stage) => {
    acc[stage] = jobCandidates.filter(c => c.stage === stage).length;
    return acc;
  }, {} as Record<RecruitmentStage, number>);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Job Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <FiBriefcase className="mr-1.5 h-4 w-4" />
                  {job.company}
                </div>
                <div className="flex items-center">
                  <FiMapPin className="mr-1.5 h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <FiCalendar className="mr-1.5 h-4 w-4" />
                  Posted {new Date(job.postedDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <FiUsers className="mr-1.5 h-4 w-4" />
                  {jobCandidates.length} Candidates
                </div>
                <div className="flex items-center">
                  <FiDollarSign className="mr-1.5 h-4 w-4" />
                  ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {job.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Job Details</h2>
              
              {/* Mandatory Fields */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Experience Required</h3>
                  <p className="text-gray-700">{job.requirements.find(r => r.includes('years')) || 'Not specified'}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Salary Range</h3>
                  <p className="text-gray-700">
                    {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Key Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {job.responsibilities.map((responsibility, index) => (
                      <li key={index}>{responsibility}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {job.requirements.map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-8">
                <button
                  onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                  className="flex items-center text-primary-600 hover:text-primary-700"
                >
                  {showAdditionalInfo ? (
                    <FiChevronUp className="mr-1 h-5 w-5" />
                  ) : (
                    <FiChevronDown className="mr-1 h-5 w-5" />
                  )}
                  {showAdditionalInfo ? 'Hide Additional Information' : 'Show Additional Information'}
                </button>

                {showAdditionalInfo && (
                  <div className="mt-4 space-y-6">
                    {job.skills && job.skills.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {job.benefits && job.benefits.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                          {job.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Hiring Team</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Hiring Manager</p>
                          <p className="font-medium">{job.hiringManager}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Recruiter</p>
                          <p className="font-medium">{job.recruiter}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pipeline Overview */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Pipeline Overview</h2>
              <div className="space-y-4">
                {job.pipeline.stages.map((stage, index) => (
                  <div key={stage} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        {formatStageName(stage)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {stageCounts[stage]} candidates
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getStageColor(stage)}`}
                        style={{
                          width: `${(stageCounts[stage] / jobCandidates.length) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Candidates Section */}
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Candidates</h2>
              
              {/* Search and Filters */}
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Search candidates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Stage Filters */}
                <div className="flex flex-wrap gap-2">
                  {pipelineStageGroups.map((group) => {
                    const candidatesInGroup = getCandidatesByStageGroup(jobCandidates, group.id);
                    return (
                      <button
                        key={group.id}
                        onClick={() => setSelectedStage(selectedStage === group.id ? null : group.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedStage === group.id
                            ? 'ring-2 ring-primary-500'
                            : 'hover:shadow-md'
                        } ${group.color}`}
                      >
                        {group.name} ({candidatesInGroup.length})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Candidates List */}
              <div className="space-y-4">
                {filteredCandidates.map(candidate => (
                  <div key={candidate.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{candidate.name}</h3>
                        <p className="text-sm text-gray-500">{candidate.currentTitle}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        getStageColor(candidate.stage)
                      }`}>
                        {formatStageName(candidate.stage)}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Source: {candidate.source}</p>
                      <p>Applied: {new Date(candidate.appliedDate).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button className="text-sm text-primary-600 hover:text-primary-700">
                        View Profile
                      </button>
                      <button className="text-sm text-primary-600 hover:text-primary-700">
                        View Resume
                      </button>
                      <button className="text-sm text-primary-600 hover:text-primary-700">
                        Communication Log
                      </button>
                    </div>
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