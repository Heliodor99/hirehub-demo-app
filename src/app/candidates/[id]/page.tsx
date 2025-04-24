'use client';

import { useState } from 'react';
import { FiUser, FiBriefcase, FiMail, FiPhone, FiMapPin, FiCalendar, FiCheckCircle, FiX, FiMessageCircle, FiFileText, FiClock, FiArrowLeft, FiUsers } from 'react-icons/fi';
import { candidates, jobs } from '@/data/jobs';
import Link from 'next/link';
import CandidateCompetencyChart from '@/components/CandidateCompetencyChart';
import { Skill } from '@/types';

export default function CandidateDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('profile');
  
  const candidate = candidates.find(c => c.id === params.id);
  const job = jobs.find(j => j.id === candidate?.jobId);

  if (!candidate || !job) {
    return <div>Candidate not found</div>;
  }

  const aiSummary = {
    pros: [
      'Strong technical background in required skills',
      'Relevant industry experience',
      'Clear communication skills',
      'Leadership experience in similar roles'
    ],
    cons: [
      'May need additional training in specific tools',
      'Location might require relocation',
      'Salary expectations at higher end of range'
    ],
    overallFit: 85
  };

  const communicationLogs = [
    {
      type: 'email',
      date: '2024-03-15',
      subject: 'Initial Contact',
      content: 'Reached out regarding the position...',
      status: 'sent'
    },
    {
      type: 'whatsapp',
      date: '2024-03-16',
      content: 'Confirmed interview availability',
      status: 'received'
    },
    {
      type: 'email',
      date: '2024-03-18',
      subject: 'Interview Confirmation',
      content: 'Sending calendar invite for technical interview...',
      status: 'sent'
    }
  ];

  // Generate mock skill competencies if they don't exist
  const skillCompetencies: Skill[] = candidate.skillCompetencies || (Array.isArray(candidate.skills) && typeof candidate.skills[0] === 'string' 
    ? (candidate.skills as string[]).map(skill => ({
        name: skill,
        proficiency: Math.floor(Math.random() * 5) + 5 // Random score between 5-10
      }))
    : (candidate.skills as Skill[])
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href={`/jobs/${job.id}`}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to {job.title}
          </Link>
        </div>

        {/* Candidate Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <FiUser className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
                  <div className="mt-1 text-sm text-gray-500">
                    {candidate.currentTitle} at {candidate.currentCompany}
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiMail className="mr-1.5 h-4 w-4" />
                      {candidate.email}
                    </div>
                    <div className="flex items-center">
                      <FiPhone className="mr-1.5 h-4 w-4" />
                      {candidate.phone}
                    </div>
                    <div className="flex items-center">
                      <FiMapPin className="mr-1.5 h-4 w-4" />
                      {candidate.location}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {candidate.stage}
                </span>
                <Link
                  href="/candidates/comparison"
                  className="ml-3 inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FiUsers className="mr-2 h-4 w-4" />
                  Compare With Others
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-t border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {['profile', 'resume', 'assessment', 'interviews', 'communication'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Professional Summary</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Experience</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {candidate.experience} years of total experience
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Skills</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {candidate.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Education</h3>
                    <div className="mt-2 space-y-3">
                      {candidate.education.map((edu, index) => (
                        <div key={index}>
                          <div className="text-sm font-medium text-gray-900">
                            {edu.degree}
                          </div>
                          <div className="text-sm text-gray-500">
                            {edu.institution}, {edu.year}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'resume' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Resume</h2>
                  <a
                    href={candidate.resume}
                    className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download PDF
                  </a>
                </div>
                <div className="border rounded-lg p-4">
                  {/* Embed resume viewer here */}
                  <div className="text-center text-gray-500">
                    Resume viewer placeholder
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'assessment' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">AI Assessment Summary</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-green-600">Strengths</h3>
                      <ul className="mt-2 space-y-1">
                        {aiSummary.pros.map((pro, index) => (
                          <li key={index} className="flex items-start">
                            <FiCheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-red-600">Areas for Consideration</h3>
                      <ul className="mt-2 space-y-1">
                        {aiSummary.cons.map((con, index) => (
                          <li key={index} className="flex items-start">
                            <FiX className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Overall Fit Score</h3>
                      <div className="mt-2 flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${aiSummary.overallFit}%` }}
                          />
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-900">
                          {aiSummary.overallFit}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skill Competency Radar Chart */}
                <CandidateCompetencyChart 
                  candidateId={candidate.id}
                  candidateName={candidate.name}
                  skills={skillCompetencies}
                />

                {candidate.assessment && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Technical Assessment</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Score</h3>
                        <div className="mt-2 flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${candidate.assessment.score}%` }}
                            />
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-900">
                            {candidate.assessment.score}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Feedback</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {candidate.assessment.feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'interviews' && candidate.interview && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Interview Details</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{candidate.interview.type} Interview</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {candidate.interview.date} at {candidate.interview.time}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      candidate.interview.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {candidate.interview.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Transcript</h3>
                    <div className="space-y-4">
                      {candidate.interview.transcript.map((entry, index) => (
                        <div key={index} className="flex space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              {entry.speaker === 'Interviewer' ? (
                                <FiUser className="h-4 w-4 text-gray-500" />
                              ) : (
                                <FiUser className="h-4 w-4 text-primary-600" />
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {entry.speaker}
                              <span className="ml-2 text-xs text-gray-500">
                                {entry.timestamp}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              {entry.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {candidate.interview.aiAssessment && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">AI Assessment</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Category Scores</h4>
                          <div className="mt-2 space-y-2">
                            {Object.entries(candidate.interview.aiAssessment.categoryScores).map(([category, score]) => (
                              <div key={category}>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-600">
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                  </span>
                                  <span className="font-medium text-gray-900">{score}%</span>
                                </div>
                                <div className="mt-1 flex-1 bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-primary-600 h-1.5 rounded-full"
                                    style={{ width: `${score}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-xs font-medium text-gray-500">Strengths</h4>
                            <ul className="mt-2 space-y-1">
                              {candidate.interview.aiAssessment.strengths.map((strength, index) => (
                                <li key={index} className="text-sm text-gray-600">
                                  • {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-gray-500">Areas for Improvement</h4>
                            <ul className="mt-2 space-y-1">
                              {candidate.interview.aiAssessment.areasForImprovement.map((area, index) => (
                                <li key={index} className="text-sm text-gray-600">
                                  • {area}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'communication' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Communication History</h2>
                <div className="space-y-4">
                  {communicationLogs.map((log, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          log.type === 'email' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          {log.type === 'email' ? (
                            <FiMail className={`h-4 w-4 ${
                              log.type === 'email' ? 'text-blue-600' : 'text-green-600'
                            }`} />
                          ) : (
                            <FiMessageCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900">
                            {log.type === 'email' && log.subject}
                            {log.type === 'whatsapp' && 'WhatsApp Message'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {log.date}
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {log.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Application Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Application Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Applied Position</h3>
                  <p className="mt-1 text-sm font-medium text-gray-900">{job.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Application Date</h3>
                  <p className="mt-1 text-sm text-gray-900">{candidate.applicationDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Source</h3>
                  <p className="mt-1 text-sm text-gray-900">{candidate.source}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Current Stage</h3>
                  <p className="mt-1">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {candidate.stage}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <FiFileText className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Application Submitted</p>
                    <p className="text-gray-500">{candidate.applicationDate}</p>
                  </div>
                </div>

                {candidate.assessment && (
                  <div className="flex items-center text-sm">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <FiCheckCircle className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">Assessment Completed</p>
                      <p className="text-gray-500">Score: {candidate.assessment.score}%</p>
                    </div>
                  </div>
                )}

                {candidate.interview && (
                  <div className="flex items-center text-sm">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <FiCalendar className="h-4 w-4 text-purple-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{candidate.interview.type} Interview</p>
                      <p className="text-gray-500">
                        {candidate.interview.date} at {candidate.interview.time}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 