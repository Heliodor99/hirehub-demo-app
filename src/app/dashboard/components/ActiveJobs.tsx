import Link from 'next/link';
import { FiBriefcase, FiUsers, FiCalendar } from 'react-icons/fi';
import { jobs } from '@/data/jobs';

export default function ActiveJobs() {
  const activeJobs = jobs.filter(job => job.status === 'Active');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Active Jobs</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {activeJobs.map((job) => (
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
                  <FiUsers className="mr-1.5 h-4 w-4" />
                  {job.applicationCount} applicants
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FiCalendar className="mr-1.5 h-4 w-4" />
                Posted {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
        ))}
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