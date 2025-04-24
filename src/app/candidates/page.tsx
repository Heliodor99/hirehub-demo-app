'use client';

import { useState, useMemo } from 'react';
import { FiSearch, FiUser, FiUserPlus, FiX, FiFilter, FiChevronDown, FiChevronRight, FiBarChart2, FiBriefcase, FiMail, FiPhone, FiCalendar, FiClock, FiChevronLeft, FiList, FiUsers } from 'react-icons/fi';
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
  const [advancedFilters, setAdvancedFilters] = useState({
    experience: { min: '', max: '' },
    location: '',
    skills: [] as string[],
    education: {
      degree: '',
      institution: ''
    },
    appliedDate: { start: '', end: '' }
  });

  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      // Basic search
      const matchesSearch = 
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.currentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Job filter
      const matchesJob = !selectedJob || candidate.jobId === selectedJob;
      
      // Stage filter
      const matchesStage = !selectedStage || 
        pipelineStageGroups.find(group => group.id === selectedStage)?.stages.includes(candidate.stage);

      // Advanced filters
      const matchesExperience = (!advancedFilters.experience.min || candidate.experience >= Number(advancedFilters.experience.min)) &&
        (!advancedFilters.experience.max || candidate.experience <= Number(advancedFilters.experience.max));

      const matchesLocation = !advancedFilters.location || 
        candidate.location.toLowerCase().includes(advancedFilters.location.toLowerCase());

      const matchesSkills = advancedFilters.skills.length === 0 || 
        advancedFilters.skills.every(skill => 
          candidate.skills.some(s => 
            (typeof s === 'string' ? s : s.name).toLowerCase() === skill.toLowerCase()
          )
        );

      const matchesEducation = (
        !advancedFilters.education.degree || 
        candidate.education.some(edu => 
          edu.degree.toLowerCase().includes(advancedFilters.education.degree.toLowerCase())
        )
      ) && (
        !advancedFilters.education.institution ||
        candidate.education.some(edu => 
          edu.institution.toLowerCase().includes(advancedFilters.education.institution.toLowerCase())
        )
      );

      const matchesAppliedDate = (
        !advancedFilters.appliedDate.start || 
        new Date(candidate.appliedDate) >= new Date(advancedFilters.appliedDate.start)
      ) && (
        !advancedFilters.appliedDate.end ||
        new Date(candidate.appliedDate) <= new Date(advancedFilters.appliedDate.end)
      );

      return matchesSearch && matchesJob && matchesStage && 
        matchesExperience && matchesLocation && matchesSkills && 
        matchesEducation && matchesAppliedDate;
    });
  }, [searchQuery, selectedJob, selectedStage, advancedFilters]);

  // Calculate pipeline stages from the jobs data
  const pipelineStages = useMemo(() => {
    return [
      { 
        id: 'outreached', 
        name: 'Outreached', 
        color: 'bg-gray-100 text-gray-800', 
        stages: [RecruitmentStage.OUTREACHED]
      },
      { 
        id: 'applied', 
        name: 'Applied', 
        color: 'bg-blue-100 text-blue-800', 
        stages: [RecruitmentStage.APPLIED]
      },
      { 
        id: 'shortlisted', 
        name: 'Shortlisted', 
        color: 'bg-green-100 text-green-800', 
        stages: [RecruitmentStage.SHORTLISTED]
      },
      { 
        id: 'interviewed', 
        name: 'Interviewed', 
        color: 'bg-purple-100 text-purple-800', 
        stages: [RecruitmentStage.INTERVIEWED]
      },
      { 
        id: 'rejected', 
        name: 'Rejected', 
        color: 'bg-red-100 text-red-800', 
        stages: [RecruitmentStage.REJECTED]
      },
      { 
        id: 'offer_extended', 
        name: 'Offer Extended', 
        color: 'bg-yellow-100 text-yellow-800', 
        stages: [RecruitmentStage.OFFER_EXTENDED]
      },
      { 
        id: 'offer_rejected', 
        name: 'Offer Rejected', 
        color: 'bg-orange-100 text-orange-800', 
        stages: [RecruitmentStage.OFFER_REJECTED]
      },
      { 
        id: 'hired', 
        name: 'Hired', 
        color: 'bg-emerald-100 text-emerald-800', 
        stages: [RecruitmentStage.HIRED]
      }
    ];
  }, []);

  // Get candidates for each pipeline stage (without applying stage filter)
  const getCandidatesInStage = (stageGroup: typeof pipelineStages[0]) => {
    // Use candidates directly without the stage filter
    return candidates.filter(candidate => 
      stageGroup.stages.includes(candidate.stage) &&
      // Apply every filter except the stage filter
      (candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       candidate.currentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
       candidate.location.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!selectedJob || candidate.jobId === selectedJob) &&
      (!advancedFilters.experience.min || candidate.experience >= Number(advancedFilters.experience.min)) &&
      (!advancedFilters.experience.max || candidate.experience <= Number(advancedFilters.experience.max)) &&
      (!advancedFilters.location || 
        candidate.location.toLowerCase().includes(advancedFilters.location.toLowerCase())) &&
      (advancedFilters.skills.length === 0 || 
        advancedFilters.skills.every(skill => 
          candidate.skills.some(s => 
            (typeof s === 'string' ? s : s.name).toLowerCase() === skill.toLowerCase()
          )
        )) &&
      (!advancedFilters.education.degree || 
        candidate.education.some(edu => 
          edu.degree.toLowerCase().includes(advancedFilters.education.degree.toLowerCase())
        )) &&
      (!advancedFilters.education.institution ||
        candidate.education.some(edu => 
          edu.institution.toLowerCase().includes(advancedFilters.education.institution.toLowerCase())
        )) &&
      (!advancedFilters.appliedDate.start || 
        new Date(candidate.appliedDate) >= new Date(advancedFilters.appliedDate.start)) &&
      (!advancedFilters.appliedDate.end ||
        new Date(candidate.appliedDate) <= new Date(advancedFilters.appliedDate.end))
    ).length;
  };

  // Get match percentage from assessment
  const getMatchPercentage = (candidate: Candidate) => {
    return candidate.assessment?.score || null;
  };

  // Get AI verdict for a candidate from their interview data
  const getAIVerdict = (candidate: Candidate) => {
    // Use existing interview data if available
    if (candidate.interview?.humanFeedback?.decision) {
      const decision = candidate.interview.humanFeedback.decision;
      
      if (decision === 'Hire') {
        return { verdict: 'Hire', class: 'bg-green-100 text-green-800' };
      } else if (decision === 'Further Evaluation') {
        return { verdict: 'Consider', class: 'bg-yellow-100 text-yellow-800' };
      } else if (decision === 'Reject') {
        return { verdict: 'Pass', class: 'bg-red-100 text-red-800' };
      }
    }
    
    // Fallback to recommendations if decision not available
    if (candidate.interview?.aiAssessment?.recommendations?.length) {
      const rec = candidate.interview.aiAssessment.recommendations[0].toLowerCase();
      if (rec.includes('hire') || rec.includes('proceed with offer')) {
        return { verdict: 'Hire', class: 'bg-green-100 text-green-800' };
      } else if (rec.includes('consider') || rec.includes('potential')) {
        return { verdict: 'Consider', class: 'bg-yellow-100 text-yellow-800' };
      }
    }
    
    // Fallback to assessment score if neither decision nor recommendations are available
    if (candidate.assessment?.score) {
      const score = candidate.assessment.score;
      if (score >= 85) return { verdict: 'Hire', class: 'bg-green-100 text-green-800' };
      if (score >= 70) return { verdict: 'Consider', class: 'bg-yellow-100 text-yellow-800' };
      return { verdict: 'Pass', class: 'bg-red-100 text-red-800' };
    }
    
    return null;
  };

  // Get AI recommendations for a candidate
  const getAIRecommendation = (candidate: Candidate) => {
    if (candidate.interview?.aiAssessment?.recommendations?.length) {
      return candidate.interview.aiAssessment.recommendations[0];
    }
    return null;
  };

  // Sort candidates by AI verdict (hire first) and then by score
  const sortedCandidates = useMemo(() => {
    return [...filteredCandidates].sort((a, b) => {
      const aVerdict = getAIVerdict(a);
      const bVerdict = getAIVerdict(b);
      
      // If both have verdicts, sort by verdict first
      if (aVerdict && bVerdict) {
        if (aVerdict.verdict === 'Hire' && bVerdict.verdict !== 'Hire') return -1;
        if (aVerdict.verdict !== 'Hire' && bVerdict.verdict === 'Hire') return 1;
        if (aVerdict.verdict === 'Consider' && bVerdict.verdict === 'Pass') return -1;
        if (aVerdict.verdict === 'Pass' && bVerdict.verdict === 'Consider') return 1;
      }
      
      // If only one has a verdict
      if (aVerdict && !bVerdict) return -1;
      if (!aVerdict && bVerdict) return 1;
      
      // If same verdict or no verdict, sort by score
      const aScore = a.assessment?.score || 0;
      const bScore = b.assessment?.score || 0;
      return bScore - aScore;
    });
  }, [filteredCandidates]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedJob(null);
    setSelectedStage(null);
    setAdvancedFilters({
      experience: { min: '', max: '' },
      location: '',
      skills: [],
      education: {
        degree: '',
        institution: ''
      },
      appliedDate: { start: '', end: '' }
    });
  };

  // Calendar helper functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Get candidates with events for the selected month
  const calendarEvents = useMemo(() => {
    const events = new Map<string, Array<{ candidate: Candidate; type: string; time?: string }>>();
    
    filteredCandidates.forEach(candidate => {
      // Add application date
      const applicationDate = new Date(candidate.appliedDate);
      const applicationDateStr = formatDate(applicationDate);
      
      if (!events.has(applicationDateStr)) {
        events.set(applicationDateStr, []);
      }
      events.get(applicationDateStr)?.push({ 
        candidate,
        type: 'application'
      });

      // Add interview date if interviewed
      if (candidate.stage === RecruitmentStage.INTERVIEWED) {
        // For interviewed candidates, set interview date 5 days after application
        const interviewDate = new Date(applicationDate);
        interviewDate.setDate(interviewDate.getDate() + 5);
        const interviewDateStr = formatDate(interviewDate);
        
        if (!events.has(interviewDateStr)) {
          events.set(interviewDateStr, []);
        }
        events.get(interviewDateStr)?.push({ 
          candidate,
          type: 'interview',
          time: '10:00 AM' // You would get this from actual data in a real app
        });
      }

      // Add hire date for hired candidates
      if (candidate.stage === RecruitmentStage.HIRED) {
        // For hired candidates, set hire date 14 days after application
        const hireDate = new Date(applicationDate);
        hireDate.setDate(hireDate.getDate() + 14);
        const hireDateStr = formatDate(hireDate);
        
        if (!events.has(hireDateStr)) {
          events.set(hireDateStr, []);
        }
        events.get(hireDateStr)?.push({ 
          candidate,
          type: 'hired',
          time: 'Hired'
        });
      }
    });

    return events;
  }, [filteredCandidates]);

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
          <div className="flex gap-4">
            <Link
              href="/candidates/comparison"
              className="inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiUsers className="mr-2 h-4 w-4" />
              Compare Skills
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4 items-start">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              value={selectedJob || ''}
              onChange={(e) => setSelectedJob(e.target.value || null)}
              className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">All Jobs</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
            >
              <FiFilter className="h-4 w-4" />
              {showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            {(searchQuery || selectedJob || selectedStage || Object.values(advancedFilters).some(v => v !== '')) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <FiX className="h-4 w-4" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                    value={advancedFilters.experience.min}
                    onChange={(e) => setAdvancedFilters({
                      ...advancedFilters,
                      experience: { ...advancedFilters.experience, min: e.target.value }
                    })}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                    value={advancedFilters.experience.max}
                    onChange={(e) => setAdvancedFilters({
                      ...advancedFilters,
                      experience: { ...advancedFilters.experience, max: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Filter by location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                  value={advancedFilters.location}
                  onChange={(e) => setAdvancedFilters({
                    ...advancedFilters,
                    location: e.target.value
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <select
                  multiple
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                  value={advancedFilters.skills}
                  onChange={(e) => setAdvancedFilters({
                    ...advancedFilters,
                    skills: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                >
                  {Array.from(new Set(candidates.flatMap(c => 
                    c.skills.map(s => typeof s === 'string' ? s : s.name)
                  ))).map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Degree"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                    value={advancedFilters.education.degree}
                    onChange={(e) => setAdvancedFilters({
                      ...advancedFilters,
                      education: { ...advancedFilters.education, degree: e.target.value }
                    })}
                  />
                  <input
                    type="text"
                    placeholder="Institution"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                    value={advancedFilters.education.institution}
                    onChange={(e) => setAdvancedFilters({
                      ...advancedFilters,
                      education: { ...advancedFilters.education, institution: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Applied Date</label>
                <div className="space-y-2">
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                    value={advancedFilters.appliedDate.start}
                    onChange={(e) => setAdvancedFilters({
                      ...advancedFilters,
                      appliedDate: { ...advancedFilters.appliedDate, start: e.target.value }
                    })}
                  />
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                    value={advancedFilters.appliedDate.end}
                    onChange={(e) => setAdvancedFilters({
                      ...advancedFilters,
                      appliedDate: { ...advancedFilters.appliedDate, end: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pipeline Stages */}
        <div className="mb-6 flex flex-wrap">
          {pipelineStages.map(stage => {
            const candidatesInStage = getCandidatesInStage(stage);
            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}
                className={`py-5 px-3 m-1 rounded-lg shadow-sm border ${
                  selectedStage === stage.id 
                    ? 'ring-2 ring-primary-500 border-primary-500' 
                    : 'border-gray-200'
                } ${stage.color} hover:shadow-md transition-shadow flex-1 min-w-[110px] ${
                  selectedStage === stage.id ? 'outline outline-2 outline-offset-2 outline-blue-500' : ''
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <h3 className="font-medium text-sm mb-2">{stage.name}</h3>
                  <span className="text-xl font-bold">{candidatesInStage}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Candidates List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI Verdict
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCandidates.map((candidate) => {
                  const job = jobs.find(j => j.id === candidate.jobId);
                  const aiVerdict = getAIVerdict(candidate);
                  return (
                    <tr 
                      key={candidate.id}
                      className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <FiUser className="h-5 w-5 text-primary-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <Link
                              href={`/candidates/${candidate.id}?from=list`}
                              className="text-sm font-medium text-gray-900 hover:text-primary-600"
                            >
                              {candidate.name}
                            </Link>
                            <div className="text-sm text-gray-500">{candidate.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{job?.title}</div>
                        <div className="text-sm text-gray-500">{candidate.currentTitle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{candidate.email}</div>
                        <div className="text-sm text-gray-500">{candidate.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          getStageColor(candidate.stage)
                        }`}>
                          {formatStageName(candidate.stage)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(candidate.appliedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {aiVerdict ? (
                          <div>
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${aiVerdict.class}`}>
                              {aiVerdict.verdict}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Not assessed</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {candidate.assessment?.score ? (
                          <div className="flex items-center justify-center">
                            <div className={`w-12 h-12 flex items-center justify-center rounded-full border-2 font-medium text-sm ${
                              candidate.assessment.score >= 85 
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : candidate.assessment.score >= 70
                                  ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                                  : 'border-red-500 bg-red-50 text-red-700'
                            }`}>
                              {candidate.assessment.score}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCandidates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No candidates found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 