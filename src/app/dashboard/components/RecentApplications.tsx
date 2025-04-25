import Link from 'next/link';
import { FiUser, FiBriefcase, FiClock, FiMail, FiPhone } from 'react-icons/fi';
import { candidates, jobs } from '@/data/jobs';
import { RecruitmentStage } from '@/types';
import { getStageColor } from '@/utils/recruitment';
import { formatDistance } from 'date-fns';

export default function RecentApplications() {
  // Get recent applications sorted by date
  const recentApplications = candidates
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 5);

  // Get job title for a candidate
  const getJobTitle = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.title || 'Unknown Position';
  };

  // Format date as "time ago"
  const formatDateAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistance(date, new Date(), { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  // Format date consistently for tooltip
  const formatFullDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {recentApplications.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No recent applications found
          </div>
        ) : (
          recentApplications.map((candidate) => (
            <div key={candidate.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <FiUser className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <Link 
                      href={`/candidates/${candidate.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-primary-600"
                    >
                      {candidate.name}
                    </Link>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <FiBriefcase className="h-3 w-3 mr-1" />
                      {getJobTitle(candidate.jobId)}
                    </div>
                    <div className="flex items-center space-x-3 mt-2">
                      <a 
                        href={`mailto:${candidate.email}`} 
                        className="text-xs flex items-center text-gray-500 hover:text-gray-700"
                      >
                        <FiMail className="h-3 w-3 mr-1" />
                        Email
                      </a>
                      <a 
                        href={`tel:${candidate.phone}`} 
                        className="text-xs flex items-center text-gray-500 hover:text-gray-700"
                      >
                        <FiPhone className="h-3 w-3 mr-1" />
                        Call
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-xs text-gray-500 flex items-center" title={formatFullDate(candidate.appliedDate)}>
                    <FiClock className="h-3 w-3 mr-1" />
                    {formatDateAgo(candidate.appliedDate)}
                  </div>
                  <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(candidate.stage)}`}>
                    {candidate.stage}
                  </span>
                  {candidate.assessment?.score && (
                    <div className="mt-1 text-xs font-medium text-gray-700">
                      Score: {candidate.assessment.score}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="px-6 py-4 border-t border-gray-200">
        <Link
          href="/candidates"
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          View all applications
        </Link>
      </div>
    </div>
  );
} 