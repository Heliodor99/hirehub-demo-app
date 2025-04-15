import Link from 'next/link';
import { FiUser, FiAward } from 'react-icons/fi';
import { candidates, jobs } from '@/data/jobs';

export default function TopTalent() {
  // Get top talent (candidates with high assessment scores)
  const topTalent = candidates
    .filter(candidate => candidate.assessment?.score && candidate.assessment.score >= 85)
    .sort((a, b) => (b.assessment?.score || 0) - (a.assessment?.score || 0))
    .slice(0, 5);

  // Get job title for a candidate
  const getJobTitle = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.title || 'Unknown Position';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Top Talent</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {topTalent.map((candidate) => (
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
              <div className="flex items-center">
                <FiAward className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  {candidate.assessment?.score}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 border-t border-gray-200">
        <Link
          href="/candidates?filter=top"
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          View all top talent
        </Link>
      </div>
    </div>
  );
} 