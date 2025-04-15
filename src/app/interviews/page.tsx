'use client';

import { useState, useMemo } from 'react';
import { FiSearch, FiPlus, FiCalendar, FiClock, FiUser, FiBriefcase, FiMessageSquare, FiStar, FiVideo } from 'react-icons/fi';
import { candidates, jobs } from '@/data/jobs';
import Link from 'next/link';
import { Interview, RecruitmentStage } from '@/types';

type InterviewListItem = {
  id: string;
  candidate: {
    name: string;
    position: string;
  };
  date: string;
  time: string;
  type: 'Technical' | 'Behavioral' | 'HR';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  interviewers: string[];
  gmeetLink: string;
  notes?: {
    transcript: Array<{ timestamp: string; speaker: 'Interviewer' | 'Candidate'; content: string }>;
    aiScore: number;
    humanScore: number;
    feedback: {
      technical: string;
      communication: string;
      problemSolving: string;
      areasForImprovement: string;
    };
  };
};

export default function InterviewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedInterview, setSelectedInterview] = useState<InterviewListItem | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');

  // Get all candidates with interviews
  const interviews = useMemo(() => {
    return candidates
      .filter(candidate => candidate.stage === RecruitmentStage.INTERVIEW_SCHEDULED)
      .map(candidate => ({
        id: candidate.id,
        candidate: {
          name: candidate.name,
          position: candidate.currentTitle,
        },
        date: new Date(candidate.appliedDate).toLocaleDateString(),
        time: '10:00 AM',
        type: 'Technical' as const,
        interviewers: ['John Doe', 'Jane Smith'],
        status: 'Scheduled' as const,
        gmeetLink: 'https://meet.google.com/abc-defg-hij',
        notes: candidate.assessment ? {
          transcript: [],
          aiScore: candidate.assessment.score,
          humanScore: candidate.assessment.score,
          feedback: {
            technical: candidate.assessment.feedback,
            communication: 'Good communication skills',
            problemSolving: 'Strong problem-solving abilities',
            areasForImprovement: 'Could improve on system design'
          }
        } : undefined
      }));
  }, [candidates]);

  const filteredInterviews = useMemo(() => {
    return interviews.filter(interview => {
      const matchesSearch = 
        interview.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interview.candidate.position.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filter === 'all' || interview.status.toLowerCase() === filter.toLowerCase();
      
      return matchesSearch && matchesFilter;
    });
  }, [interviews, searchQuery, filter]);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
            <p className="mt-1 text-sm text-gray-500">
              Schedule and manage candidate interviews
            </p>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setView(view === 'list' ? 'calendar' : 'list')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FiCalendar className="mr-2 h-4 w-4" />
              {view === 'list' ? 'Calendar View' : 'List View'}
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Schedule Interview
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search interviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="all">All Interviews</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {view === 'list' ? (
            <div className="divide-y divide-gray-200">
              {filteredInterviews.map((interview) => (
                <div 
                  key={interview.id} 
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedInterview(interview)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <FiUser className="h-5 w-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">
                            {interview.candidate.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {interview.candidate.position}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiCalendar className="mr-1.5 h-4 w-4" />
                        {interview.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <FiClock className="mr-1.5 h-4 w-4" />
                        {interview.time}
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiBriefcase className="mr-1.5 h-4 w-4" />
                        {interview.type}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {interview.interviewers.join(', ')}
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-6">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        interview.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                        interview.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {interview.status}
                      </span>
                    </div>
                  </div>
                  {interview.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <FiStar className="h-4 w-4 text-yellow-400" />
                          <span className="ml-1 text-sm text-gray-500">
                            AI Score: {interview.notes.aiScore}%
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FiStar className="h-4 w-4 text-blue-400" />
                          <span className="ml-1 text-sm text-gray-500">
                            Human Score: {interview.notes.humanScore}%
                          </span>
                        </div>
                        <a 
                          href={interview.gmeetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                        >
                          <FiVideo className="mr-1.5 h-4 w-4" />
                          Join Meeting
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4">
              {/* Calendar view will be implemented here */}
              <div className="h-[600px] bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Calendar view coming soon</p>
              </div>
            </div>
          )}
        </div>

        {selectedInterview && selectedInterview.notes && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Interview Details
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Transcript</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedInterview.notes.transcript.map((entry) => 
                      `${entry.timestamp} - ${entry.speaker}: ${entry.content}\n`
                    )}
                  </pre>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Feedback</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedInterview.notes.feedback).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="mt-1 text-sm text-gray-700">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 