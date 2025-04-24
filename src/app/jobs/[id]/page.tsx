'use client';

import { useState, useEffect } from 'react';
import { FiBriefcase, FiMapPin, FiCalendar, FiUsers, FiChevronDown, FiChevronUp, FiSearch, FiArrowLeft } from 'react-icons/fi';
import { jobs as initialJobs, candidates } from '@/data/jobs';
import { RecruitmentStage, Job } from '@/types';
import { getStageColor, formatStageName, pipelineStageGroups, getCandidatesByStageGroup } from '@/utils/recruitment';
import Link from 'next/link';
import { Card, CardHeader, CardBody, Button, Badge, Input, Avatar, SectionHeading, Divider } from '@/components/DesignSystem';

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [job, setJob] = useState<Job | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load job data including from localStorage
  useEffect(() => {
    // First check if the job is in the initial jobs data
    let foundJob = initialJobs.find(j => j.id === params.id);
    
    // If not found in initial data, check localStorage
    if (!foundJob && typeof window !== 'undefined') {
      const addedJobsJSON = localStorage.getItem('addedJobs');
      if (addedJobsJSON) {
        const addedJobs = JSON.parse(addedJobsJSON);
        foundJob = addedJobs.find((j: Job) => j.id === params.id);
      }
    }
    
    setJob(foundJob);
    setIsLoading(false);
  }, [params.id]);

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

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center justify-center text-gray-500">
              <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full mb-4"></div>
              <h3 className="text-lg font-medium mb-1">Loading job details...</h3>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center justify-center text-gray-500">
              <FiBriefcase className="h-12 w-12 mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-1">Job Not Found</h3>
              <p className="text-sm">The job you're looking for doesn't exist or has been removed.</p>
              <Link href="/jobs">
                <Button variant="primary" className="mt-6">
                  Return to Jobs
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate pipeline stage counts
  const stageCounts = Object.values(RecruitmentStage).reduce((acc, stage) => {
    acc[stage] = jobCandidates.filter(c => c.stage === stage).length;
    return acc;
  }, {} as Record<string, number>);

  const formatStageDisplay = (stage: string) => {
    return stage
      .split('_')
      .map((word: string) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/jobs" className="mr-4 text-gray-600 hover:text-primary-600 transition-colors">
              <FiArrowLeft className="h-6 w-6" />
            </Link>
            <SectionHeading>
              {job.title}
            </SectionHeading>
          </div>
          <Badge variant={job.status === 'Active' ? 'success' : 'warning'}>
            {job.status}
          </Badge>
        </div>

        {/* Job Header */}
        <Card>
          <CardBody className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
                    <FiBriefcase className="h-5 w-5" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  <div className="flex items-center text-gray-600">
                    <FiBriefcase className="mr-2 h-4 w-4 text-primary-500" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-2 h-4 w-4 text-purple-500" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="mr-2 h-4 w-4 text-teal-500" />
                    <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiUsers className="mr-2 h-4 w-4 text-purple-500" />
                    <span>{jobCandidates.length} Candidates</span>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Job Description</h2>
              </CardHeader>
              <CardBody className="p-6">
                <p className="text-gray-700 mb-6">{job.description}</p>
                
                <h3 className="text-md font-semibold text-gray-900 mb-3">Requirements</h3>
                <ul className="list-disc pl-5 mb-6 space-y-1">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="text-gray-700">{req}</li>
                  ))}
                </ul>
                
                <h3 className="text-md font-semibold text-gray-900 mb-3">Responsibilities</h3>
                <ul className="list-disc pl-5 mb-6 space-y-1">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="text-gray-700">{resp}</li>
                  ))}
                </ul>
                
                <Divider />
                
                <div className="pt-4">
                  <h3 className="text-md font-semibold text-gray-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-md font-semibold text-gray-900 mb-3">Benefits</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="text-gray-700">{benefit}</li>
                    ))}
                  </ul>
                </div>
              </CardBody>
            </Card>
          </div>
          
          {/* Right Column - Pipeline */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Recruitment Pipeline</h2>
              </CardHeader>
              <CardBody className="p-0">
                <div className="divide-y divide-gray-200">
                  {[
                    RecruitmentStage.OUTREACHED,
                    RecruitmentStage.APPLIED,
                    RecruitmentStage.SHORTLISTED,
                    RecruitmentStage.INTERVIEWED,
                    RecruitmentStage.OFFER_EXTENDED,
                    RecruitmentStage.HIRED
                  ].map((stage) => (
                    <div 
                      key={stage}
                      className={`flex items-center justify-between p-4 ${selectedStage === stage ? 'bg-primary-50' : ''}`}
                      onClick={() => setSelectedStage(selectedStage === stage ? null : stage)}
                    >
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${getStageColor(stage)}`}></div>
                        <span className="text-gray-900">{formatStageDisplay(stage)}</span>
                      </div>
                      <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {stageCounts[stage] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 