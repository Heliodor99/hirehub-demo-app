import Link from 'next/link';
import { FiBriefcase, FiUsers, FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { jobs, candidates } from '@/data/jobs';

export default function ActiveJobs() {
  // Get active jobs
  const activeJobs = jobs
    .filter(job => job.status === 'Active')
    // Sort by most recent first
    .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
    // Take the first 5
    .slice(0, 5);

  // Calculate applicant counts for each job
  const jobApplicantCounts = activeJobs.map(job => {
    const applicantCount = candidates.filter(c => c.jobId === job.id).length;
    
    // Calculate days since posted
    const postedDate = new Date(job.postedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - postedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate progress percentage (time-based)
    // Assume a job posting is typically active for 30 days
    const progressPercentage = Math.min(Math.round((diffDays / 30) * 100), 100);
    
    return {
      ...job,
      applicantCount,
      daysAgo: diffDays,
      progressPercentage
    };
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Active Jobs</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {jobApplicantCounts.length === 0 ? (
          <div className="px-6 py-4 text-center text-gray-500">
            No active jobs found
          </div>
        ) : (
          jobApplicantCounts.map((job) => (
            <div key={job.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <Link 
                    href={`/jobs/${job.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-primary-600"
                  >
                    {job.title}
                  </Link>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <FiBriefcase className="mr-1.5 h-4 w-4" />
                    {job.department}
                    <span className="mx-2">•</span>
                    <FiMapPin className="mr-1.5 h-4 w-4" />
                    {job.location.split(',')[0]}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center text-sm text-gray-500">
                    <FiUsers className="mr-1.5 h-4 w-4" />
                    <span className="font-medium">{job.applicantCount}</span> applicants
                  </div>
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <FiClock className="mr-1.5 h-3 w-3" />
                    Posted {job.daysAgo} {job.daysAgo === 1 ? 'day' : 'days'} ago
                  </div>
                </div>
              </div>
              
              {/* Progress bar showing job activity */}
              <div className="mt-2">
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${job.progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="px-6 py-4 border-t border-gray-200">
        <Link
          href="/jobs"
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          View all jobs
        </Link>
      </div>
    </div>
  );
} 