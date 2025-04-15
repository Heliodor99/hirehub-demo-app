import { FiBarChart2 } from 'react-icons/fi';
import { candidates } from '@/data/jobs';

export default function ApplicationSourceChart() {
  // Get applications from the last 7 days
  const lastWeekApplications = candidates.filter(candidate => {
    const appDate = new Date(candidate.applicationDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - appDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });

  // Count applications by source
  const sourceCounts = lastWeekApplications.reduce((acc, candidate) => {
    acc[candidate.source] = (acc[candidate.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get color for source
  const getSourceColor = (source: string) => {
    switch (source) {
      case 'LinkedIn':
        return 'bg-blue-100 text-blue-800';
      case 'Indeed':
        return 'bg-purple-100 text-purple-800';
      case 'Upwork':
        return 'bg-green-100 text-green-800';
      case 'Naukri':
        return 'bg-yellow-100 text-yellow-800';
      case 'Website':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Application Sources</h2>
          <span className="text-sm text-gray-500">Last 7 days</span>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {Object.entries(sourceCounts).map(([source, count]) => (
            <div key={source} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceColor(source)}`}>
                  {source}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-900">
                  {count}
                </span>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 rounded-full"
                    style={{ width: `${(count / lastWeekApplications.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500">
                  {Math.round((count / lastWeekApplications.length) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 