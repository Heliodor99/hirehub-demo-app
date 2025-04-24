'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiPlus, FiSearch, FiExternalLink, FiBriefcase, FiMapPin, FiClock } from 'react-icons/fi';
import { jobs as initialJobs, candidates } from '@/data/jobs';
import { Card, CardHeader, CardBody, Button, Input, Badge, SectionHeading } from '@/components/DesignSystem';
import { Job } from '@/types';

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const searchParams = useSearchParams();
  const showFrontendJob = searchParams.get('showFrontendJob') === 'true';
  
  // Frontend Developer Job definition
  const frontendDevJob: Job = {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp India',
    location: 'Bangalore, Karnataka',
    department: 'Engineering',
    description: 'We are looking for an experienced Frontend Developer to join our team...',
    requirements: [
      '5+ years of experience in frontend development',
      'Strong proficiency in React and TypeScript',
      'Experience with modern frontend build tools',
      'Bachelor\'s degree in Computer Science or related field'
    ],
    responsibilities: [
      'Develop and maintain frontend applications',
      'Collaborate with design and backend teams',
      'Write clean, maintainable code',
      'Participate in code reviews'
    ],
    salary: {
      min: 1800000,
      max: 2800000,
      currency: 'INR'
    },
    postedDate: '2024-03-01',
    status: 'Active',
    hiringManager: 'Rajesh Sharma',
    recruiter: "Hirehub",
    pipeline: {
      stages: [
        'Outreached',
        'Applied',
        'Shortlisted',
        'Interviewed',
        'Offer Extended',
        'Hired',
        'Rejected',
        'Offer Rejected'
      ]
    },
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Redux'],
    benefits: [
      'Health insurance',
      'Provident fund',
      'Flexible work hours',
      'Remote work options'
    ]
  };

  // Include the frontend job if query parameter is set
  useEffect(() => {
    if (showFrontendJob) {
      // Check if the job already exists by ID to prevent duplicates
      if (!jobs.some(job => job.id === frontendDevJob.id)) {
        setJobs([frontendDevJob, ...initialJobs]);
      }
    } else {
      setJobs(initialJobs);
    }
  }, [showFrontendJob]);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate application count for each job
  const getApplicationCount = (jobId: string) => {
    return candidates.filter(candidate => candidate.jobId === jobId).length;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <SectionHeading
            subheading="Manage and track all your job postings"
          >
            Jobs
          </SectionHeading>

          <Link href="/jobs/new">
            <Button
              variant="primary"
              size="md"
              leftIcon={<FiPlus className="h-4 w-4" />}
              className="shadow-button"
            >
              Post New Job
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              className="pl-10 pr-4 py-2.5 border-0 shadow-sm focus:ring-2"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredJobs.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center justify-center text-gray-500">
                <FiBriefcase className="h-12 w-12 mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-1">No jobs found</h3>
                <p className="text-sm">Try adjusting your search criteria.</p>
              </div>
            </Card>
          ) : (
            filteredJobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden group">
                  <div className="px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary-50 text-primary-600">
                          <FiBriefcase className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {job.title}
                          <FiExternalLink className="inline-block ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <Badge variant={
                          job.status === 'Active' ? 'success' :
                          job.status === 'On Hold' ? 'warning' : 'danger'
                        }>
                          {job.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="p-1 rounded-full bg-teal-50 text-teal-600 mr-2">
                            <FiBriefcase className="h-3.5 w-3.5" />
                          </div>
                          {job.department}
                        </div>
                        <div className="flex items-center">
                          <div className="p-1 rounded-full bg-purple-50 text-purple-600 mr-2">
                            <FiMapPin className="h-3.5 w-3.5" />
                          </div>
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <div className="p-1 rounded-full bg-blue-50 text-blue-600 mr-2">
                            <FiClock className="h-3.5 w-3.5" />
                          </div>
                          {job.type || 'Full-time'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-100 px-3 py-1 rounded-full">
                        <span className="font-semibold text-gray-700">{getApplicationCount(job.id)}</span>
                        <span className="text-sm text-gray-500 ml-1">applicants</span>
                      </div>
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors">
                        <FiExternalLink className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 