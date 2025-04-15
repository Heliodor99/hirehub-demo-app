import Link from 'next/link';
import { FiUser } from 'react-icons/fi';
import { candidates, jobs } from '@/data/jobs';

export default function RecentApplications() {
  // Get recent applications sorted by date
  const recentApplications = candidates
    .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())
    .slice(0, 5);

  // Get job title for a candidate
  const getJobTitle = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.title || 'Unknown Position';
  };

  // Format date consistently
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {recentApplications.map((candidate) => (
          <div key={candidate.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <FiUser className="h-5 w-5 text-gray-500" />
                </div>
                <div className="ml-4">
                  <Link 
                    href={`/candidates/${candidate.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-primary-600"
                  >
                    {candidate.name}
                  </Link>
                  <div className="text-sm text-gray-500">
                    {getJobTitle(candidate.jobId)}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-sm text-gray-900">
                  {formatDate(candidate.applicationDate)}
                </div>
                <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  candidate.stage === 'Applied' ? 'bg-blue-100 text-blue-800' :
                  candidate.stage === 'Resume Shortlisted' ? 'bg-green-100 text-green-800' :
                  candidate.stage === 'Interview Scheduled' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {candidate.stage}
                </span>
              </div>
            </div>
          </div>
        ))}
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