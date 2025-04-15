'use client';

import { useState, useMemo } from 'react';
import { FiSearch, FiUser, FiUserPlus, FiX, FiFilter, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { candidates, jobs } from '@/data/jobs';
import Link from 'next/link';
import { RecruitmentStage, Candidate } from '@/types';
import { 
  getStageColor, 
  formatStageName,
  pipelineStageGroups,
  getCandidatesByStageGroup
} from '@/utils/recruitment';

type FilterField = {
  field: string;
  operator: 'contains' | 'equals' | 'greater' | 'less' | 'between';
  value: string;
};

export default function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterField[]>([]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const matchesSearch = 
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.currentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesJob = !selectedJob || candidate.jobId === selectedJob;
      const matchesStage = !selectedStage || 
        pipelineStageGroups.find(group => group.id === selectedStage)?.stages.includes(candidate.stage);

      return matchesSearch && matchesJob && matchesStage;
    });
  }, [searchQuery, selectedJob, selectedStage]);

  // Calculate pipeline stages from the jobs data
  const pipelineStages = useMemo(() => {
    return [
      { 
        id: 'screening', 
        name: 'Screening', 
        color: 'bg-blue-100 text-blue-800', 
        stages: [
          RecruitmentStage.APPLIED,
          RecruitmentStage.OUTREACHED,
          RecruitmentStage.ENGAGED,
          RecruitmentStage.RESUME_SHORTLISTED
        ]
      },
      { 
        id: 'assessment', 
        name: 'Assessment', 
        color: 'bg-yellow-100 text-yellow-800', 
        stages: [RecruitmentStage.ASSESSMENT_SENT] 
      },
      { 
        id: 'interview', 
        name: 'Interview', 
        color: 'bg-purple-100 text-purple-800', 
        stages: [RecruitmentStage.INTERVIEW_SCHEDULED] 
      },
      { 
        id: 'offer', 
        name: 'Offer', 
        color: 'bg-green-100 text-green-800', 
        stages: [RecruitmentStage.FEEDBACK_DONE] 
      },
      { 
        id: 'hired', 
        name: 'Hired', 
        color: 'bg-indigo-100 text-indigo-800', 
        stages: [RecruitmentStage.HIRED] 
      }
    ];
  }, []);

  // Get match percentage from assessment
  const getMatchPercentage = (candidate: Candidate) => {
    return candidate.assessment?.score || null;
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedJob(null);
    setSelectedStage(null);
    setAdvancedFilters([]);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage candidates in your hiring pipeline
            </p>
          </div>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FiUserPlus className="h-5 w-5" />
            Add Candidate
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              value={selectedJob || ''}
              onChange={(e) => setSelectedJob(e.target.value || null)}
              className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg"
            >
              <option value="">All Jobs</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
            {(searchQuery || selectedJob !== null || selectedStage !== null) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <FiX className="h-4 w-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Pipeline Stages */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {pipelineStages.map(stage => {
            const candidatesInStage = getCandidatesByStageGroup(candidates, stage.id);
            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}
                className={`p-4 rounded-lg shadow-sm border ${
                  selectedStage === stage.id 
                    ? 'ring-2 ring-primary-500 border-primary-500' 
                    : 'border-gray-200'
                } ${stage.color} hover:shadow-md transition-shadow`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{stage.name}</h3>
                  <span className="text-sm font-semibold">{candidatesInStage.length}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCandidates.map(candidate => (
            <div
              key={candidate.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <Link
                      href={`/candidates/${candidate.id}`}
                      className="font-medium text-gray-900 hover:text-primary-600"
                    >
                      {candidate.name}
                    </Link>
                    <p className="text-sm text-gray-500">{candidate.currentTitle}</p>
                  </div>
                </div>
                {candidate.assessment?.score && (
                  <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    {candidate.assessment.score}%
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Applied for:</span>
                  <span className="text-gray-900">
                    {jobs.find(job => job.id === candidate.jobId)?.title}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Stage:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    getStageColor(candidate.stage)
                  }`}>
                    {formatStageName(candidate.stage)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Applied:</span>
                  <span className="text-gray-900">
                    {new Date(candidate.appliedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No candidates found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
} 