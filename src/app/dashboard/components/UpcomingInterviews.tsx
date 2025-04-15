import Link from 'next/link';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { candidates, jobs } from '@/data/jobs';

export default function UpcomingInterviews() {
  // Get upcoming interviews
  const upcomingInterviews = candidates
    .filter(candidate => 
      candidate.stage === 'Interview Scheduled' && 
      candidate.interview &&
      new Date(candidate.interview.date) >= new Date()
    )
    .sort((a, b) => new Date(a.interview!.date).getTime() - new Date(b.interview!.date).getTime())
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

  // Format time
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {upcomingInterviews.map((candidate) => (
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
                <div className="flex items-center text-sm text-gray-900">
                  <FiCalendar className="mr-1 h-4 w-4" />
                  {formatDate(candidate.interview!.date)}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <FiClock className="mr-1 h-4 w-4" />
                  {formatTime(candidate.interview!.time)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 border-t border-gray-200">
        <Link
          href="/interviews"
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          View all interviews
        </Link>
      </div>
    </div>
  );
} 