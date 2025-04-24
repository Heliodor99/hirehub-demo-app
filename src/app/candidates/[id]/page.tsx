'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { FiUser, FiBriefcase, FiMail, FiPhone, FiMapPin, FiCalendar, FiCheckCircle, FiX, FiMessageSquare, FiFileText, FiClock, FiArrowLeft, FiUsers, FiVideo, FiChevronUp, FiChevronDown, FiLinkedin } from 'react-icons/fi';
import { candidates, jobs } from '@/data/jobs';
import Link from 'next/link';
import CandidateCompetencyChart from '@/components/CandidateCompetencyChart';
import { Skill, RecruitmentStage, Candidate, Job } from '@/types';
import { CommunicationTimeline } from '@/components/CommunicationTimeline';
import { generateCommunicationTimeline } from '@/utils/communication';

interface AISummary {
  overallFit: number;
  skillMatch: number;
  experienceMatch: number;
  culturalFit: number;
  recommendation: string;
  keyStrengths: string[];
  areasOfConcern: string[];
  reasonForRecommendation: string;
  pros: string[];
  cons: string[];
}

export default function CandidateDetailsPage({ params }: { params: { id: string } }) {
  const [activeSection, setActiveSection] = useState('profile');
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [fromPage, setFromPage] = useState<'list' | 'job' | null>(null);
  
  // Refs for each section
  const profileRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const assessmentRef = useRef<HTMLDivElement>(null);
  const interviewsRef = useRef<HTMLDivElement>(null);
  const communicationRef = useRef<HTMLDivElement>(null);

  // Ref for the sticky header to get its actual height
  const headerRef = useRef<HTMLDivElement>(null);

  const candidate = candidates.find(c => c.id === params.id);
  const job = jobs.find(j => j.id === candidate?.jobId) || jobs[0];

  if (!candidate || !job) {
    return <div>Candidate not found</div>;
  }

  // Format a date safely
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      // Use a more stable date format that will be consistent between server and client
      return date.toISOString().split('T')[0];
    } catch (e) {
      return 'N/A';
    }
  };

  // Generate communication timeline if it doesn't exist
  if (!candidate.communicationTimeline || candidate.communicationTimeline.length === 0) {
    candidate.communicationTimeline = generateCommunicationTimeline(candidate, job);
  }

  // Generate AI summary based on all available candidate data
  const generateAISummary = () => {
    const summary = {
      overallFit: 0,
      skillMatch: 0,
      experienceMatch: 0,
      culturalFit: 0,
      recommendation: '',
      keyStrengths: [] as string[],
      areasOfConcern: [] as string[],
      reasonForRecommendation: '',
      pros: [] as string[],
      cons: [] as string[],
    };

    // Calculate skill match
    const requiredSkills = new Set<string>((job.skills || []).map(s => 
      typeof s === 'string' ? s : (s as Skill).name
    ));
    const candidateSkills = new Set<string>(
      (candidate.skills || []).map(s => 
        typeof s === 'string' ? s : (s as Skill).name
      )
    );
    const matchingSkills = Array.from(requiredSkills).filter(skill => candidateSkills.has(skill));
    summary.skillMatch = (matchingSkills.length / (requiredSkills.size || 1)) * 100;

    // Calculate experience match
    const requiredYears = parseInt(job.requirements.find(r => r.includes('year'))?.match(/\d+/)?.[0] || '1', 10);
    const experienceWeight = candidate.experience >= requiredYears
      ? 100 
      : (candidate.experience / requiredYears) * 100;
    summary.experienceMatch = experienceWeight;

    // Calculate cultural fit based on assessment and interview if available
    if (candidate.interview?.aiAssessment?.categoryScores?.culturalFit) {
      summary.culturalFit = candidate.interview.aiAssessment.categoryScores.culturalFit;
    } else {
      summary.culturalFit = 70; // Default baseline
    }

    // Calculate overall fit
    summary.overallFit = Math.round(
      (summary.skillMatch * 0.4) + 
      (summary.experienceMatch * 0.3) + 
      (summary.culturalFit * 0.3)
    );

    // Determine key strengths
    if (summary.skillMatch > 80) {
      summary.keyStrengths.push('Strong technical skill match with requirements');
    }
    if (summary.experienceMatch > 80) {
      summary.keyStrengths.push('Experience level aligns well with position');
    }
    if (candidate.assessment?.score && candidate.assessment.score > 80) {
      summary.keyStrengths.push('Excellent performance in technical assessment');
    }
    if (summary.culturalFit > 80) {
      summary.keyStrengths.push('High potential for cultural fit');
    }

    // Determine areas of concern
    if (summary.skillMatch < 60) {
      summary.areasOfConcern.push('Missing some key required skills');
    }
    if (summary.experienceMatch < 60) {
      summary.areasOfConcern.push('May need additional experience');
    }
    if (candidate.assessment?.score && candidate.assessment.score < 60) {
      summary.areasOfConcern.push('Below expected performance in technical assessment');
    }
    if (summary.culturalFit < 60) {
      summary.areasOfConcern.push('Potential cultural fit concerns');
    }

    // Generate recommendation
    if (summary.overallFit >= 80) {
      summary.recommendation = 'Strong Hire';
      summary.reasonForRecommendation = 'Candidate demonstrates excellent alignment with job requirements and company culture.';
    } else if (summary.overallFit >= 70) {
      summary.recommendation = 'Hire';
      summary.reasonForRecommendation = 'Candidate meets most key requirements with some areas for development.';
    } else if (summary.overallFit >= 60) {
      summary.recommendation = 'Consider with Reservations';
      summary.reasonForRecommendation = 'Candidate shows potential but has notable gaps that should be addressed.';
    } else {
      summary.recommendation = 'Do Not Hire';
      summary.reasonForRecommendation = 'Significant gaps in multiple key areas suggest this is not the right fit.';
    }

    return summary;
  };

  const aiSummary = generateAISummary();

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

  // Function to get the actual header height
  const getHeaderHeight = (): number => {
    if (headerRef.current) {
      return headerRef.current.getBoundingClientRect().height;
    }
    return 200; // fallback height
  };

  // Function to scroll to a section when the navigation link is clicked
  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>, section: string) => {
    if (!sectionRef.current) return;
    
    sectionRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
      setActiveSection(section);
  };

  // Update active section based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -50% 0px',
        threshold: 0
      }
    );

    const sections = [
      profileRef.current,
      resumeRef.current,
      assessmentRef.current,
      interviewsRef.current,
      communicationRef.current
    ].filter(Boolean);

    sections.forEach((section) => section && observer.observe(section));

    return () => {
      sections.forEach((section) => section && observer.unobserve(section));
    };
  }, []);

  useEffect(() => {
    // Get the 'from' parameter from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const from = searchParams.get('from');
    setFromPage(from === 'list' ? 'list' : 'job');
  }, []);

  // Ensure consistent data format for interview time
  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return 'N/A';
    return timeString; // Return the time string as is since it's already formatted
  };

  // Add null checks for interview data
  const interviewData = candidate.interview || null;
  const interviewTranscript = interviewData?.transcript || [];
  const aiAssessment = interviewData?.aiAssessment || null;

  // Update skill type in the skills chart with proper type checking and use skillCompetencies
  const skillsChartData = useMemo(() => {
    // If skillCompetencies is available, use it
    if (candidate.skillCompetencies) {
      return candidate.skillCompetencies;
    }

    // Otherwise, map from skills array
    if (!candidate.skills) return [];

    return candidate.skills.map((skill: string | Skill): Skill => {
      if (typeof skill === 'string') {
        return {
          name: skill,
          proficiency: Math.floor(Math.random() * 5) + 5 // Random score between 5-10 for consistency
        };
      }
      return skill;
    });
  }, [candidate.skills, candidate.skillCompetencies]);

  // Add useState for communication regeneration
  const [isRegeneratingComm, setIsRegeneratingComm] = useState(false);

  // Add a function to handle regeneration
  const handleRegenerateTimeline = () => {
    setIsRegeneratingComm(true);
    // Regenerate communication timeline
    candidate.communicationTimeline = generateCommunicationTimeline(candidate, job);
    setIsRegeneratingComm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <style jsx global>{`
        :root {
          --header-height: 180px;
        }
        .section-container {
          scroll-margin-top: var(--header-height);
          scroll-snap-margin-top: var(--header-height); /* For Safari */
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-6 hidden lg:block">
          {/* This is just a spacer for layout */}
        </div>

        {/* Sticky container for header and navigation */}
        <div ref={headerRef} className="sticky top-0 z-20 bg-gray-50 pb-2">
          {/* Back Navigation - Now inside the sticky container */}
          <div className="bg-gray-50 py-2 px-1 mb-2">
            <Link
              href={fromPage === 'list' ? '/candidates' : `/jobs/${job.id}`}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back to {fromPage === 'list' ? 'Candidates' : job.title}
            </Link>
          </div>
          
          {/* Candidate Header */}
          <div className="bg-white backdrop-blur-sm bg-white/90 rounded-xl shadow-lg border border-gray-100">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shadow-sm">
                    <span className="text-xl font-bold text-primary-600">{candidate.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
                    <div className="mt-1 text-sm text-gray-500">
                      {candidate.currentTitle} at {candidate.currentCompany}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiMail className="mr-1.5 h-4 w-4 text-primary-500" />
                        {candidate.email}
                      </div>
                      <div className="flex items-center">
                        <FiPhone className="mr-1.5 h-4 w-4 text-secondary-500" />
                        {candidate.phone}
                      </div>
                      <div className="flex items-center">
                        <FiMapPin className="mr-1.5 h-4 w-4 text-accent-500" />
                        {candidate.location}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-primary-50 text-primary-600 border border-primary-100">
                    {candidate.stage}
                  </span>
                  <Link
                    href="/candidates/comparison"
                    className="inline-flex items-center justify-center px-4 py-1.5 border border-gray-200 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <FiUsers className="mr-2 h-4 w-4 text-primary-500" />
                    Compare With Others
                  </Link>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="border-t border-gray-100 bg-white z-10">
              <nav className="flex space-x-2 px-4 overflow-x-auto" aria-label="Sections">
                {[
                  { id: 'profile', label: 'Profile', ref: profileRef, icon: <FiUser className="mr-1.5 h-4 w-4" /> },
                  { id: 'assessment', label: 'Assessment', ref: assessmentRef, icon: <FiCheckCircle className="mr-1.5 h-4 w-4" /> },
                  { id: 'resume', label: 'Resume', ref: resumeRef, icon: <FiFileText className="mr-1.5 h-4 w-4" /> },
                  { id: 'interviews', label: 'Interviews', ref: interviewsRef, icon: <FiCalendar className="mr-1.5 h-4 w-4" /> },
                  { id: 'communication', label: 'Communication', ref: communicationRef, icon: <FiMessageSquare className="mr-1.5 h-4 w-4" /> }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.ref, section.id)}
                    className={`
                      py-4 px-4 border-b-2 font-medium text-sm flex items-center whitespace-nowrap transition-all
                      ${activeSection === section.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    {section.icon}
                    {section.label}
                    {section.id === 'communication' && candidate.communicationTimeline && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                        {candidate.communicationTimeline.length}
                      </span>
                    )}
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
            <div ref={profileRef} id="profile" className="section-container bg-white rounded-xl shadow-sm p-6 border border-gray-100 backdrop-blur-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Professional Summary</h2>
              
              {/* HirehubAI Summary Card */}
              <div className="mb-6 bg-gradient-to-br from-white to-primary-50 rounded-xl p-6 border border-primary-100 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-semibold text-gray-900 flex items-center">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 mr-3">
                      <FiCheckCircle className="h-4 w-4 text-primary-600" />
                    </div>
                    HirehubAI Summary
                  </h3>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium border shadow-sm ${
                    aiSummary.overallFit >= 80 ? 'bg-green-50 text-green-700 border-green-200' :
                    aiSummary.overallFit >= 70 ? 'bg-primary-50 text-primary-700 border-primary-200' :
                    aiSummary.overallFit >= 60 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {aiSummary.recommendation}
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Fit Scores */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-xl bg-white/80 border border-gray-200 shadow-sm">
                      <div className="flex flex-col items-center">
                        <div className="relative w-20 h-20 mb-3">
                          <svg className="w-20 h-20" viewBox="0 0 100 100">
                            <circle 
                              cx="50" cy="50" r="45" 
                              fill="none" 
                              stroke="#E0EFFF" 
                              strokeWidth="8"
                            />
                            <circle 
                              cx="50" cy="50" r="45" 
                              fill="none" 
                              stroke="#2B7BD3" 
                              strokeWidth="8"
                              strokeDasharray={`${aiSummary.overallFit * 2.83} 283`}
                              strokeLinecap="round"
                              transform="rotate(-90 50 50)"
                            />
                            <text 
                              x="50" y="50" 
                              dominantBaseline="middle" 
                              textAnchor="middle" 
                              fontSize="16" 
                              fontWeight="bold"
                              fill="#2B7BD3"
                            >
                              {Math.round(aiSummary.overallFit)}%
                            </text>
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Overall Fit</span>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-white/80 border border-gray-200 shadow-sm">
                      <div className="flex flex-col items-center">
                        <div className="relative w-20 h-20 mb-3">
                          <svg className="w-20 h-20" viewBox="0 0 100 100">
                            <circle 
                              cx="50" cy="50" r="45" 
                              fill="none" 
                              stroke="#E6FDFB" 
                              strokeWidth="8"
                            />
                            <circle 
                              cx="50" cy="50" r="45" 
                              fill="none" 
                              stroke="#2ECDC3" 
                              strokeWidth="8"
                              strokeDasharray={`${aiSummary.skillMatch * 2.83} 283`}
                              strokeLinecap="round"
                              transform="rotate(-90 50 50)"
                            />
                            <text 
                              x="50" y="50" 
                              dominantBaseline="middle" 
                              textAnchor="middle" 
                              fontSize="16" 
                              fontWeight="bold"
                              fill="#2ECDC3"
                            >
                              {Math.round(aiSummary.skillMatch)}%
                            </text>
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Skill Match</span>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-white/80 border border-gray-200 shadow-sm">
                      <div className="flex flex-col items-center">
                        <div className="relative w-20 h-20 mb-3">
                          <svg className="w-20 h-20" viewBox="0 0 100 100">
                            <circle 
                              cx="50" cy="50" r="45" 
                              fill="none" 
                              stroke="#F5F0FF" 
                              strokeWidth="8"
                            />
                            <circle 
                              cx="50" cy="50" r="45" 
                              fill="none" 
                              stroke="#9B5CFF" 
                              strokeWidth="8"
                              strokeDasharray={`${aiSummary.experienceMatch * 2.83} 283`}
                              strokeLinecap="round"
                              transform="rotate(-90 50 50)"
                            />
                            <text 
                              x="50" y="50" 
                              dominantBaseline="middle" 
                              textAnchor="middle" 
                              fontSize="16" 
                              fontWeight="bold"
                              fill="#9B5CFF"
                            >
                              {Math.round(aiSummary.experienceMatch)}%
                            </text>
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Experience</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Strengths and Areas of Concern */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-xl bg-white/80 border border-gray-200 shadow-sm p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                          <FiCheckCircle className="h-3 w-3 text-primary-600" />
                        </div>
                        Key Strengths
                      </h4>
                      <ul className="space-y-2">
                        {aiSummary.keyStrengths.map((strength, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="inline-block w-4 h-4 mt-0.5 mr-2 rounded-full bg-green-100 flex-shrink-0"></span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="rounded-xl bg-white/80 border border-gray-200 shadow-sm p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                          <FiX className="h-3 w-3 text-yellow-600" />
                        </div>
                        Areas of Concern
                      </h4>
                      <ul className="space-y-2">
                        {aiSummary.areasOfConcern.map((concern, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="inline-block w-4 h-4 mt-0.5 mr-2 rounded-full bg-yellow-100 flex-shrink-0"></span>
                            {concern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Recommendation Reason */}
                  <div className="bg-white/80 rounded-xl border border-gray-200 shadow-sm p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendation Reasoning</h4>
                    <p className="text-sm text-gray-600">{aiSummary.reasonForRecommendation}</p>
                  </div>
                </div>
              </div>

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

            {/* Assessment Section */}
            <div ref={assessmentRef} id="assessment" className="section-container space-y-6">
              {/* Skill Competency Radar Chart */}
              <CandidateCompetencyChart 
                candidateId={candidate.id}
                candidateName={candidate.name}
                skills={skillCompetencies}
              />
            </div>

            {/* Resume Section */}
            <div ref={resumeRef} id="resume" className="section-container bg-white rounded-lg shadow-sm p-6">
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

            {/* Interviews Section */}
            <div ref={interviewsRef} id="interviews" className="section-container bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Interview Details</h2>
              {interviewData ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{interviewData.type} Interview</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatDate(interviewData.date)} at {formatTime(interviewData.time)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      interviewData.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {interviewData.status}
                    </span>
                  </div>

                  {interviewTranscript.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Transcript</h3>
                    <div className="space-y-4">
                        {/* Show first 4 entries by default */}
                        {interviewTranscript.slice(0, showFullTranscript ? undefined : 4).map((entry, index) => (
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
                                  {entry.timestamp || 'N/A'}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              {entry.content}
                            </p>
                          </div>
                        </div>
                      ))}
                        
                        {/* Show/Hide button if there are more than 4 entries */}
                        {interviewTranscript.length > 4 && (
                          <button
                            onClick={() => setShowFullTranscript(!showFullTranscript)}
                            className="mt-4 text-sm text-primary-600 hover:text-primary-700 flex items-center"
                          >
                            {showFullTranscript ? (
                              <>
                                <FiChevronUp className="mr-1.5 h-4 w-4" />
                                Show Less
                              </>
                            ) : (
                              <>
                                <FiChevronDown className="mr-1.5 h-4 w-4" />
                                Show More
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {aiAssessment && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">AI Assessment</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Category Scores</h4>
                          <div className="mt-2 space-y-2">
                            {Object.entries(aiAssessment.categoryScores || {}).map(([category, score]) => (
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
                          {aiAssessment.strengths && aiAssessment.strengths.length > 0 && (
                          <div>
                            <h4 className="text-xs font-medium text-gray-500">Strengths</h4>
                            <ul className="mt-2 space-y-1">
                                {aiAssessment.strengths.map((strength, index) => (
                                <li key={index} className="text-sm text-gray-600">
                                  • {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          )}
                          {aiAssessment.areasForImprovement && aiAssessment.areasForImprovement.length > 0 && (
                          <div>
                            <h4 className="text-xs font-medium text-gray-500">Areas for Improvement</h4>
                            <ul className="mt-2 space-y-1">
                                {aiAssessment.areasForImprovement.map((area, index) => (
                                <li key={index} className="text-sm text-gray-600">
                                  • {area}
                                </li>
                              ))}
                            </ul>
                          </div>
                          )}
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
            <div ref={communicationRef} id="communication" className="section-container bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Communication History</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {candidate.communicationTimeline?.length || 0} total messages across the recruitment process
                  </p>
                </div>
              </div>
              
              <div className="p-6">
                <CommunicationTimeline events={candidate.communicationTimeline || []} />
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 lg:sticky self-start" style={{ top: 'var(--header-height)' }}>
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
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 backdrop-blur-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-5">
                <div className="flex items-center text-sm">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <FiFileText className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">Applied</p>
                    <p className="text-sm text-gray-500">{formatDate(candidate.appliedDate)}</p>
                  </div>
                </div>

                {candidate.stage === 'Shortlisted' || 
                 candidate.stage === 'Interviewed' || 
                 candidate.stage === 'Offer Extended' || 
                 candidate.stage === 'Hired' ? (
                  <div className="flex items-center text-sm">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-secondary-100 flex items-center justify-center">
                        <FiCheckCircle className="h-5 w-5 text-secondary-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Shortlisted</p>
                      <p className="text-sm text-gray-500">{formatDate(candidate.lastUpdated || candidate.appliedDate)}</p>
                    </div>
                  </div>
                ) : null}

                {candidate.interview && (candidate.stage === 'Interviewed' || 
                                         candidate.stage === 'Offer Extended' || 
                                         candidate.stage === 'Hired') ? (
                  <div className="flex items-center text-sm">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center">
                        <FiCalendar className="h-5 w-5 text-accent-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Interview{candidate.interview.status === 'Completed' ? 'ed' : ''}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(candidate.interview.date)} {candidate.interview.time ? `at ${candidate.interview.time}` : ''}
                      </p>
                    </div>
                  </div>
                ) : null}

                {candidate.stage === 'Offer Extended' || candidate.stage === 'Hired' ? (
                  <div className="flex items-center text-sm">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <FiFileText className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Offer Extended</p>
                      <p className="text-sm text-gray-500">{formatDate(candidate.lastUpdated || candidate.appliedDate)}</p>
                    </div>
                  </div>
                ) : null}

                {candidate.stage === 'Hired' ? (
                  <div className="flex items-center text-sm">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FiBriefcase className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Hired</p>
                      <p className="text-sm text-gray-500">{formatDate(candidate.lastUpdated || candidate.appliedDate)}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 