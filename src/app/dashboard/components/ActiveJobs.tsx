import Link from 'next/link';
import { FiBriefcase, FiUsers, FiCalendar, FiExternalLink } from 'react-icons/fi';
import { jobs, candidates } from '@/data/jobs';
import { Card, CardHeader, CardBody, CardFooter, Badge } from '@/components/DesignSystem';

export default function ActiveJobs() {
  const activeJobs = jobs.filter(job => job.status === 'Active');

  // Calculate application count for each job
  const getApplicationCount = (jobId: string) => {
    return candidates.filter(candidate => candidate.jobId === jobId).length;
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Active Jobs</h2>
        <Badge variant="primary">{activeJobs.length} Jobs</Badge>
      </CardHeader>
      <CardBody className="p-0">
        <div className="divide-y divide-gray-200/70">
          {activeJobs.map((job) => (
            <div key={job.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <Link 
                    href={`/jobs/${job.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-primary-600 flex items-center"
                  >
                    {job.title}
                    <FiExternalLink className="ml-1.5 h-3.5 w-3.5 text-gray-400" />
                  </Link>
                  <div className="mt-1.5 flex items-center text-sm text-gray-500">
                    <span className="flex items-center">
                      <FiBriefcase className="mr-1.5 h-4 w-4 text-primary-400" />
                      {job.department}
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="flex items-center">
                      <FiUsers className="mr-1.5 h-4 w-4 text-teal-400" />
                      {getApplicationCount(job.id)} applicants
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FiCalendar className="mr-1.5 h-4 w-4 text-purple-400" />
                  Posted {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
      <CardFooter className="flex justify-center">
        <Link
          href="/jobs"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
        >
          View all jobs
          <FiExternalLink className="ml-1.5 h-3.5 w-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
} 