'use client';

import { useState } from 'react';
import { FiBriefcase, FiMapPin, FiCalendar, FiUsers, FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';
import { jobs, candidates } from '@/data/jobs';
import { RecruitmentStage } from '@/types';
import { getStageColor, formatStageName, pipelineStageGroups, getCandidatesByStageGroup } from '@/utils/recruitment';
import Link from 'next/link';

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

  const formatStageDisplay = (stage: RecruitmentStage) => {
    return stage
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

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
                  ₹{job.salary.min.toLocaleString()} - ₹{job.salary.max.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-3">
                <Link
                  href="/candidates/comparison"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FiUsers className="mr-2 h-4 w-4" />
                  Compare Skills
                </Link>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {job.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Job Description */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg p-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-600">{job.description}</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                    className="mt-6 flex items-center text-primary-600 hover:text-primary-700"
                  >
                    {showAdditionalInfo ? (
                      <>
                        <FiChevronUp className="mr-2 h-4 w-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <FiChevronDown className="mr-2 h-4 w-4" />
                        Show More
                      </>
                    )}
                  </button>

                  {showAdditionalInfo && (
                    <div className="mt-6 space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                          {job.benefits?.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </div>

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
            </div>

            {/* Right Column - Pipeline Overview */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg p-6 sticky" style={{ top: '170px' }}>
                <h2 className="text-xl font-semibold mb-4">Pipeline Overview</h2>
                <div className="space-y-4">
                  {[
                    RecruitmentStage.APPLIED,
                    RecruitmentStage.SHORTLISTED,
                    RecruitmentStage.INTERVIEWED,
                    RecruitmentStage.OFFER_EXTENDED,
                    RecruitmentStage.HIRED,
                    RecruitmentStage.REJECTED,
                    RecruitmentStage.OFFER_REJECTED
                  ].map((stage) => (
                    <div key={stage} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          {formatStageDisplay(stage)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {stageCounts[stage]} candidates
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getStageColor(stage)}`}
                          style={{
                            width: `${(stageCounts[stage] / (jobCandidates.length || 1)) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Candidates Section */}
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
                    <div className="group relative">
                      <div className="flex items-center space-x-1 cursor-pointer">
                        <Link href={`/candidates/${candidate.id}`} className="font-medium text-gray-900 hover:text-primary-600">
                          {candidate.name}
                        </Link>
                        <FiChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10">
                        <div className="py-1">
                          <Link
                            href={`/candidates/${candidate.id}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            View Profile
                          </Link>
                          <a
                            href={candidate.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            View Resume
                          </a>
                        </div>
                      </div>
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 