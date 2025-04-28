'use client';

import { useState, useMemo } from 'react';
import { FiSearch, FiPlus, FiCalendar, FiClock, FiUser, FiBriefcase, FiMessageSquare, FiStar, FiVideo } from 'react-icons/fi';
import Link from 'next/link';
import { Interview, RecruitmentStage, Candidate } from '@/types';
import { useQuery, gql } from '@apollo/client';

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

const GET_INTERVIEWS = gql`
  query GetInterviews {
    interviews {
      id
      candidate_name
      candidate_position
      date
      time
      type
      status
      interviewers
      location
      interview_assessments {
        overall_score
        category_scores
        strengths
        areas_for_improvement
        recommendations
      }
      interview_human_feedback {
        score
        notes
        next_steps
        decision
      }
      interview_notes {
        transcript
        ai_score
        human_score
        feedback
      }
    }
  }
`;

export default function InterviewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedInterview, setSelectedInterview] = useState<InterviewListItem | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const { data, loading, error } = useQuery(GET_INTERVIEWS);
  const interviewsData = data?.interviews || [];

  const interviews = useMemo(() => {
    return interviewsData.map((interview: any) => {
      // Parse transcript and feedback JSON if needed
      let transcript = [];
      if (interview.interview_notes?.transcript) {
        try {
          transcript = JSON.parse(interview.interview_notes.transcript);
        } catch {
          transcript = [];
        }
      }
      let feedback = {};
      if (interview.interview_notes?.feedback) {
        try {
          feedback = typeof interview.interview_notes.feedback === 'string'
            ? { overall: interview.interview_notes.feedback }
            : interview.interview_notes.feedback;
        } catch {
          feedback = {};
        }
      }
      const assessment = interview.interview_assessments;
      const humanFeedback = interview.interview_human_feedback;
      return {
        id: interview.id,
        candidate: {
          name: interview.candidate_name || '',
          position: interview.candidate_position || '',
        },
        date: interview.date || '',
        time: interview.time || '',
        type: interview.type || 'Technical',
        interviewers: interview.interviewers || [],
        status: interview.status || 'Scheduled',
        gmeetLink: '',
        notes: assessment && humanFeedback && interview.interview_notes ? {
          transcript: transcript || [],
          aiScore: interview.interview_notes.ai_score ?? 0,
          humanScore: interview.interview_notes.human_score ?? 0,
          feedback: feedback || {},
          assessment,
          humanFeedback,
        } : undefined
      };
    });
  }, [interviewsData]);

  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview: InterviewListItem) => {
      const matchesSearch = 
        interview.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interview.candidate.position.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'all' || interview.status.toLowerCase() === filter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [interviews, searchQuery, filter]);

  if (loading) return <div className="p-6">Loading interviews from Hasura...</div>;
  if (error) return <div className="p-6 text-red-600">Error loading interviews: {error.message}</div>;

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
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interview Type
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interviewers
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scores
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInterviews.map((interview: InterviewListItem) => (
                    <tr 
                      key={interview.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedInterview(interview)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <FiUser className="h-4 w-4 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{interview.candidate.name}</div>
                            <div className="text-sm text-gray-500">{interview.candidate.position}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{interview.date}</div>
                        <div className="text-sm text-gray-500">{interview.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{interview.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{interview.interviewers.join(', ')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          interview.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          interview.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {interview.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {interview.status === 'Completed' && interview.notes ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center">
                              <FiStar className="h-4 w-4 text-yellow-400" />
                              <span className="ml-1 text-sm text-gray-500">
                                AI: {interview.notes.aiScore && interview.notes.aiScore > 0 ? `${interview.notes.aiScore}%` : '-'}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <FiStar className="h-4 w-4 text-blue-400" />
                              <span className="ml-1 text-sm text-gray-500">
                                Human: {interview.notes.humanScore && interview.notes.humanScore > 0 ? `${interview.notes.humanScore}%` : '-'}
                              </span>
                            </div>
                            {/* Transcript link if available */}
                            {interview.notes.transcript && interview.notes.transcript.length > 0 && (
                              <a href="#" className="text-xs text-primary-600 underline mt-1">Transcript</a>
                            )}
                          </div>
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href="https://meet.google.com/abc-defg-hij"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-900"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FiVideo className="h-5 w-5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  {selectedInterview.notes.transcript && selectedInterview.notes.transcript.length > 0 ? (
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedInterview.notes.transcript.map((entry) => 
                        `${entry.timestamp} - ${entry.speaker}: ${entry.content}\n`
                      )}
                    </pre>
                  ) : (
                    <span className="text-gray-400">No transcript available.</span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Feedback</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedInterview.notes.feedback && Object.keys(selectedInterview.notes.feedback).length > 0 ? (
                    Object.entries(selectedInterview.notes.feedback).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <p className="mt-1 text-sm text-gray-700">{value}</p>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-400">No feedback available.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 