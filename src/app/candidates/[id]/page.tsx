'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { FiUser, FiBriefcase, FiMail, FiPhone, FiMapPin, FiCalendar, FiCheckCircle, FiX, FiMessageCircle, FiFileText, FiClock, FiArrowLeft, FiUsers, FiVideo, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { candidates, jobs } from '@/data/jobs';
import Link from 'next/link';
import CandidateCompetencyChart from '@/components/CandidateCompetencyChart';
import { Skill, RecruitmentStage, Candidate, Job } from '@/types';
import { CommunicationTimeline } from '@/components/CommunicationTimeline';

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
  const job = jobs.find(j => j.id === candidate?.jobId);

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
  if (!candidate.communicationTimeline) {
    candidate.communicationTimeline = [
      {
        id: '1',
        type: 'system',
        date: formatDate(candidate.appliedDate),
        time: '09:00 AM',
        channel: 'Application Portal',
        subject: 'Application Submitted',
        content: `Applied for ${job.title} position`,
        direction: 'system',
        status: 'completed'
      },
      {
        id: '2',
        type: 'email',
        date: formatDate(new Date(new Date(candidate.appliedDate).getTime() + 24 * 60 * 60 * 1000).toISOString()),
        time: '10:00 AM',
        channel: 'Email',
        subject: 'Application Received',
        content: 'Thank you for your application. Our team will review it and get back to you soon.',
        direction: 'outbound',
        status: 'sent'
      }
    ];

    // Add assessment event if it exists
    if (candidate.assessment) {
      candidate.communicationTimeline.push({
        id: '3',
        type: 'assessment',
        date: formatDate(new Date(new Date(candidate.appliedDate).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()),
        time: '02:00 PM',
        channel: 'Assessment Platform',
        subject: 'Technical Assessment Completed',
        content: `Completed technical assessment with a score of ${candidate.assessment.score}%`,
        direction: 'system',
        status: 'completed',
        metadata: {
          score: candidate.assessment.score
        }
      });
    }

    // Add interview event if it exists
    if (candidate.interview) {
      candidate.communicationTimeline.push({
        id: '4',
        type: 'interview',
        date: formatDate(candidate.interview.date),
        time: candidate.interview.time,
        channel: 'Video Call',
        subject: `${candidate.interview.type} Interview`,
        content: 'Interview conducted with the hiring team.',
        direction: 'system',
        status: 'completed',
        metadata: {
          duration: '45 minutes',
          meetLink: 'https://meet.google.com/abc-defg-hij'
        }
      });
    }
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
              <nav className="flex space-x-2 px-4 overflow-x-auto border-b border-gray-200 bg-white" aria-label="Sections">
                {[
                  { id: 'profile', label: 'Profile', ref: profileRef, icon: <FiUser className="mr-1.5 h-4 w-4" /> },
                  { id: 'assessment', label: 'Assessment', ref: assessmentRef, icon: <FiCheckCircle className="mr-1.5 h-4 w-4" /> },
                  { id: 'resume', label: 'Resume', ref: resumeRef, icon: <FiFileText className="mr-1.5 h-4 w-4" /> },
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
            <div ref={profileRef} id="profile" className="section-container bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Professional Summary</h2>
              
              {/* HirehubAI Summary Card */}
              <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900 flex items-center">
                    <FiCheckCircle className="mr-2 h-5 w-5 text-primary-600" />
                    HirehubAI Summary
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    aiSummary.overallFit >= 80 ? 'bg-green-100 text-green-800' :
                    aiSummary.overallFit >= 70 ? 'bg-blue-100 text-blue-800' :
                    aiSummary.overallFit >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {aiSummary.recommendation}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Fit Scores */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Overall Fit</span>
                        <span className="text-sm font-medium text-gray-900">{aiSummary.overallFit}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${aiSummary.overallFit}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Skill Match</span>
                        <span className="text-sm font-medium text-gray-900">{Math.round(aiSummary.skillMatch)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${aiSummary.skillMatch}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Experience</span>
                        <span className="text-sm font-medium text-gray-900">{Math.round(aiSummary.experienceMatch)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${aiSummary.experienceMatch}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Key Strengths */}
                  {aiSummary.keyStrengths.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Key Strengths</h4>
                      <ul className="space-y-1">
                        {aiSummary.keyStrengths.map((strength: string, index: number) => (
                          <li key={index} className="flex items-center gap-2 text-green-700">
                            <FiCheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Areas of Concern */}
                  {aiSummary.areasOfConcern.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Areas of Consideration</h4>
                      <ul className="space-y-1">
                        {aiSummary.areasOfConcern.map((concern: string, index: number) => (
                          <li key={index} className="flex items-center gap-2 text-amber-700">
                            <FiX className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            {concern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendation */}
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="font-medium text-gray-900">Recommendation:</p>
                    <p className="mt-1">{aiSummary.reasonForRecommendation}</p>
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
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">AI Assessment Summary</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-green-600">Strengths</h3>
                    <ul className="mt-2 space-y-1">
                      {aiSummary.pros.map((pro: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-green-700">
                          <FiCheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-red-600">Areas for Consideration</h3>
                    <ul className="mt-2 space-y-1">
                      {aiSummary.cons.map((con: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-amber-700">
                          <FiX className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                          {con}
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
                <h2 className="text-lg font-medium text-gray-900">Communication History</h2>
              </div>
              <div className="p-6">
                <div className="flow-root">
                  <ul role="list" className="-mb-8">
                    {candidate.communicationTimeline?.map((event, eventIdx) => (
                      <li key={event.id}>
                        <div className="relative pb-8">
                          {eventIdx !== (candidate.communicationTimeline?.length ?? 0) - 1 ? (
                            <span
                              className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex items-start space-x-3">
                            <div className="relative">
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                event.direction === 'inbound' 
                                  ? 'bg-blue-100' 
                                  : event.direction === 'outbound'
                                  ? 'bg-green-100'
                                  : 'bg-gray-100'
                              }`}>
                                {event.type === 'email' && <FiMail className="h-5 w-5 text-gray-600" />}
                                {event.type === 'phone' && <FiPhone className="h-5 w-5 text-gray-600" />}
                                {event.type === 'calendar' && <FiCalendar className="h-5 w-5 text-gray-600" />}
                                {event.type === 'assessment' && <FiCheckCircle className="h-5 w-5 text-gray-600" />}
                                {event.type === 'interview' && <FiUsers className="h-5 w-5 text-gray-600" />}
                                {event.type === 'system' && <FiClock className="h-5 w-5 text-gray-600" />}
                      </div>
                    </div>
                            <div className="min-w-0 flex-1">
                              <div>
                                <div className="text-sm">
                                  <span className="font-medium text-gray-900">
                                    {event.subject}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">
                                  {event.date} at {event.time} via {event.channel}
                                </p>
                              </div>
                              <div className="mt-2 text-sm text-gray-700">
                                <p className="whitespace-pre-line">{event.content}</p>
                        </div>
                              {event.attachments && event.attachments.length > 0 && (
                                <div className="mt-2">
                                  <div className="flex space-x-2">
                                    {event.attachments.map((attachment, index) => (
                                      <span
                                        key={index}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                      >
                                        <FiFileText className="mr-1 h-4 w-4" />
                                        {attachment.name} ({attachment.size})
                                      </span>
                                    ))}
                        </div>
                      </div>
                              )}
                              {event.metadata && (
                                <div className="mt-2 text-sm">
                                  {event.metadata.duration && (
                                    <span className="inline-flex items-center mr-3 text-gray-500">
                                      <FiClock className="mr-1 h-4 w-4" />
                                      Duration: {event.metadata.duration}
                                    </span>
                                  )}
                                  {event.metadata.score && (
                                    <span className="inline-flex items-center mr-3 text-gray-500">
                                      <FiCheckCircle className="mr-1 h-4 w-4" />
                                      Score: {event.metadata.score}%
                                    </span>
                                  )}
                                  {event.metadata.meetLink && (
                                    <a
                                      href={event.metadata.meetLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-primary-600 hover:text-primary-700"
                                    >
                                      <FiVideo className="mr-1 h-4 w-4" />
                                      Join Meeting
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex-shrink-0 self-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                event.direction === 'inbound' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : event.direction === 'outbound'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {event.direction === 'inbound' ? 'Received' : event.direction === 'outbound' ? 'Sent' : 'System'}
                              </span>
                            </div>
                    </div>
                  </div>
                      </li>
                ))}
                  </ul>
                </div>
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