'use client';

import { useState, useMemo } from 'react';
import { FiSearch, FiUser, FiUserPlus, FiX, FiFilter, FiChevronDown, FiChevronRight, FiBarChart2, FiBriefcase, FiMail, FiPhone, FiCalendar, FiClock, FiChevronLeft, FiList } from 'react-icons/fi';
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
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

      // Add interview date if scheduled
      if (candidate.stage === RecruitmentStage.INTERVIEW_SCHEDULED) {
        // For interview scheduled candidates, set interview date 5 days after application
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
            <button
              onClick={() => setView(view === 'list' ? 'calendar' : 'list')}
              className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md ${
                view === 'calendar'
                  ? 'border-primary-600 text-primary-600 bg-white'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              {view === 'list' ? (
                <>
                  <FiCalendar className="mr-2 h-4 w-4" />
                  Calendar View
                </>
              ) : (
                <>
                  <FiList className="mr-2 h-4 w-4" />
                  List View
                </>
              )}
            </button>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
              <FiUserPlus className="h-4 w-4" />
              Add Candidate
            </button>
          </div>
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
        {view === 'list' && (
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
        )}

        {/* Content */}
        {view === 'list' ? (
          // Existing list view code
          <div className="bg-white shadow rounded-lg">
            <div className="divide-y divide-gray-200">
              {filteredCandidates.map((candidate) => {
                const job = jobs.find(j => j.id === candidate.jobId);
                return (
                  <div 
                    key={candidate.id} 
                    className="p-6 hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                            <FiUser className="h-6 w-6 text-primary-600" />
                          </div>
                        </div>
                        <div>
                          <Link
                            href={`/candidates/${candidate.id}`}
                            className="text-lg font-medium text-gray-900 hover:text-primary-600"
                          >
                            {candidate.name}
                          </Link>
                          <div className="mt-1 flex items-center space-x-4">
                            <span className="text-sm text-gray-500">{candidate.currentTitle}</span>
                            <span className="text-sm text-gray-500">{candidate.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                        <div className="flex flex-col items-end">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            getStageColor(candidate.stage)
                          }`}>
                            {formatStageName(candidate.stage)}
                          </span>
                          <span className="mt-1 text-sm text-gray-500">
                            Applied {new Date(candidate.appliedDate).toLocaleDateString()}
                          </span>
                        </div>
                        {candidate.assessment?.score && (
                          <div className="flex items-center space-x-2">
                            <FiBarChart2 className="h-5 w-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {candidate.assessment.score}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <FiBriefcase className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Applied for: <span className="font-medium text-gray-900">{job?.title}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiMail className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-500">{candidate.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiPhone className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-500">{candidate.phone}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredCandidates.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No candidates found matching your criteria.</p>
              </div>
            )}
          </div>
        ) : (
          // Calendar View
          <div className="bg-white shadow rounded-lg">
            {/* Calendar Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setSelectedDate(newDate);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-md"
                >
                  <FiChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setSelectedDate(newDate);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-md"
                >
                  <FiChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Today
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-sm font-medium text-gray-500 text-center">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-[1px] bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
                {(() => {
                  const year = selectedDate.getFullYear();
                  const month = selectedDate.getMonth();
                  const daysInMonth = getDaysInMonth(year, month);
                  const firstDay = getFirstDayOfMonth(year, month);
                  const days = [];

                  // Previous month days
                  const prevMonthDays = getDaysInMonth(year, month - 1);
                  for (let i = 0; i < firstDay; i++) {
                    const day = prevMonthDays - firstDay + i + 1;
                    days.push(
                      <div key={`prev-${i}`} className="min-h-[120px] p-2 bg-gray-50">
                        <span className="text-sm text-gray-400">{day}</span>
                      </div>
                    );
                  }

                  // Current month days
                  for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(year, month, day);
                    const dateStr = formatDate(date);
                    const events = calendarEvents.get(dateStr) || [];
                    const isToday = formatDate(new Date()) === dateStr;

                    days.push(
                      <div 
                        key={`current-${day}`} 
                        className={`min-h-[120px] p-2 bg-white hover:bg-gray-50 transition-colors duration-150 ${
                          isToday ? 'ring-2 ring-primary-500 ring-inset' : ''
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                            isToday 
                              ? 'bg-primary-500 text-white font-semibold' 
                              : 'text-gray-900'
                          }`}>
                            {day}
                          </span>
                          {events.length > 0 && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                              {events.length}
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 max-h-[100px] overflow-y-auto">
                          {events.map((event, idx) => (
                            <Link
                              key={`${event.candidate.id}-${idx}`}
                              href={`/candidates/${event.candidate.id}`}
                              className={`block text-xs p-1.5 rounded-md transition-colors duration-150 ${
                                event.type === 'interview'
                                  ? 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                                  : event.type === 'hired'
                                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                              }`}
                            >
                              <div className="flex items-center gap-1">
                                {event.type === 'interview' && (
                                  <FiClock className="h-3 w-3 flex-shrink-0" />
                                )}
                                <span className="truncate font-medium">
                                  {event.candidate.name}
                                  {event.time && (
                                    <span className="ml-1 text-xs opacity-75 font-normal">
                                      ({event.time})
                                    </span>
                                  )}
                                </span>
                              </div>
                              <div className="text-xs opacity-75 mt-0.5 truncate">
                                {event.type === 'interview' ? 'Interview' :
                                 event.type === 'hired' ? 'Hired' : 'Applied'}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  // Next month days
                  const remainingDays = 42 - days.length;
                  for (let i = 1; i <= remainingDays; i++) {
                    days.push(
                      <div key={`next-${i}`} className="min-h-[120px] p-2 bg-gray-50">
                        <span className="text-sm text-gray-400">{i}</span>
                      </div>
                    );
                  }

                  return days;
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 