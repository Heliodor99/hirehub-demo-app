'use client';

import { useState, useRef, useEffect } from 'react';
import { FiUser, FiBriefcase, FiMail, FiPhone, FiMapPin, FiCalendar, FiCheckCircle, FiX, FiMessageCircle, FiFileText, FiClock, FiArrowLeft, FiUsers } from 'react-icons/fi';
import { candidates, jobs } from '@/data/jobs';
import Link from 'next/link';
import CandidateCompetencyChart from '@/components/CandidateCompetencyChart';
import { Skill, RecruitmentStage } from '@/types';

export default function CandidateDetailsPage({ params }: { params: { id: string } }) {
  const [activeSection, setActiveSection] = useState('profile');
  
  // Refs for each section
  const profileRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const assessmentRef = useRef<HTMLDivElement>(null);
  const interviewsRef = useRef<HTMLDivElement>(null);
  const communicationRef = useRef<HTMLDivElement>(null);

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

  // Function to scroll to a section when the navigation link is clicked
  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>, section: string) => {
    if (sectionRef.current) {
      // Account for sticky header height
      const headerHeight = 170; // Reduced to account for removed progress bar
      const yOffset = -headerHeight;
      const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(section);
    }
  };

  // Check which section is currently visible as the user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Adjusted offset for smaller sticky header

      // Check which section is in view
      const sections = [
        { ref: profileRef, id: 'profile' },
        { ref: resumeRef, id: 'resume' },
        { ref: assessmentRef, id: 'assessment' },
        { ref: interviewsRef, id: 'interviews' },
        { ref: communicationRef, id: 'communication' }
      ];

      for (const section of sections) {
        if (section.ref.current && 
            scrollPosition >= section.ref.current.offsetTop && 
            scrollPosition < section.ref.current.offsetTop + section.ref.current.offsetHeight) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Format a date safely
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString; // Return the original string if it can't be parsed
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation - Will be moved into the sticky container */}
        <div className="mb-6 hidden lg:block">
          {/* This is just a spacer for layout, the actual back link will be inside the sticky container */}
        </div>

        {/* Sticky container for header and navigation */}
        <div className="sticky top-0 z-20 bg-gray-50 pb-2">
          {/* Back Navigation - Now inside the sticky container */}
          <div className="bg-gray-50 py-2 px-1 mb-2">
            <Link
              href={`/jobs/${job.id}`}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back to {job.title}
            </Link>
          </div>
          
          {/* Candidate Header */}
          <div className="bg-white rounded-lg shadow-md">
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

            {/* Navigation Links */}
            <div className="border-t border-gray-200 bg-white z-10 shadow-sm">
              <nav className="flex space-x-2 px-4 overflow-x-auto" aria-label="Sections">
                {[
                  { id: 'profile', label: 'Profile', ref: profileRef, icon: <FiUser className="mr-1.5 h-4 w-4" /> },
                  { id: 'resume', label: 'Resume', ref: resumeRef, icon: <FiFileText className="mr-1.5 h-4 w-4" /> },
                  { id: 'assessment', label: 'Assessment', ref: assessmentRef, icon: <FiCheckCircle className="mr-1.5 h-4 w-4" /> },
                  { id: 'interviews', label: 'Interviews', ref: interviewsRef, icon: <FiCalendar className="mr-1.5 h-4 w-4" /> },
                  { id: 'communication', label: 'Communication', ref: communicationRef, icon: <FiMessageCircle className="mr-1.5 h-4 w-4" /> }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.ref, section.id)}
                    className={`
                      py-4 px-4 border-b-2 font-medium text-sm flex items-center whitespace-nowrap
                      ${activeSection === section.id
                        ? 'border-primary-600 text-primary-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    {section.icon}
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main content sections */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Section */}
            <div ref={profileRef} id="profile" className="bg-white rounded-lg shadow-sm p-6">
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
                    {Array.isArray(candidate.skills) && candidate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                      >
                        {typeof skill === 'string' ? skill : skill.name}
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

            {/* Resume Section */}
            <div ref={resumeRef} id="resume" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Resume</h2>
              </div>
              <div className="border rounded-lg p-4">
                {/* Embed resume viewer here */}
                <div className="text-center text-gray-500">
                  Resume viewer placeholder
                </div>
              </div>
            </div>

            {/* Assessment Section */}
            <div ref={assessmentRef} id="assessment" className="space-y-6">
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

            {/* Interviews Section */}
            <div ref={interviewsRef} id="interviews" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Interview Details</h2>
              {candidate.interview ? (
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
                      {candidate.interview?.transcript?.map((entry, index: number) => (
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

                  {candidate.interview?.aiAssessment && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">AI Assessment</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Category Scores</h4>
                          <div className="mt-2 space-y-2">
                            {candidate.interview?.aiAssessment?.categoryScores && 
                              Object.entries(candidate.interview.aiAssessment.categoryScores).map(([category, score]) => (
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
                                    style={{ width: `${Number(score)}%` }}
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
                              {candidate.interview.aiAssessment.strengths?.map((strength: string, index: number) => (
                                <li key={index} className="text-sm text-gray-600">
                                  • {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-gray-500">Areas for Improvement</h4>
                            <ul className="mt-2 space-y-1">
                              {candidate.interview.aiAssessment.areasForImprovement?.map((area: string, index: number) => (
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
              ) : (
                <p className="text-sm text-gray-500">No interview data available yet.</p>
              )}
            </div>

            {/* Communication Section */}
            <div ref={communicationRef} id="communication" className="bg-white rounded-lg shadow-sm p-6">
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
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 lg:sticky self-start" style={{ top: 'calc(170px + 1.5rem)' }}>
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
                  <p className="mt-1 text-sm text-gray-900">{formatDate(candidate.appliedDate)}</p>
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
                    <p className="text-gray-500">{formatDate(candidate.appliedDate)}</p>
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