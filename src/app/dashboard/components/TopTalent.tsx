import Link from 'next/link';
import { FiUser, FiAward, FiBriefcase, FiMapPin, FiStar } from 'react-icons/fi';
import { candidates, jobs } from '@/data/jobs';
import { Skill } from '@/types';

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

  // Get top skill for a candidate
  const getTopSkills = (skills: Skill[] | string[]): string[] => {
    if (skills.length === 0) return [];
    
    if (typeof skills[0] === 'string') {
      return (skills as string[]).slice(0, 3);
    }
    
    return (skills as Skill[])
      .sort((a, b) => b.proficiency - a.proficiency)
      .slice(0, 3)
      .map(skill => skill.name);
  };

  // Format assessment score
  const formatScore = (score: number | undefined): string => {
    if (!score) return 'N/A';
    return `${score}%`;
  };

  // Get score color class
  const getScoreColorClass = (score: number | undefined): string => {
    if (!score) return 'text-gray-400';
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-emerald-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-orange-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Top Talent</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {topTalent.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No high-scoring candidates found
          </div>
        ) : (
          topTalent.map((candidate) => (
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
                      <span className="mx-2">•</span>
                      <FiMapPin className="h-3 w-3 mr-1" />
                      {candidate.location.split(',')[0]}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {getTopSkills(candidate.skills).map(skill => (
                        <span key={skill} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className={`flex items-center font-semibold ${getScoreColorClass(candidate.assessment?.score)}`}>
                    <FiAward className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {formatScore(candidate.assessment?.score)}
                    </span>
                  </div>
                  <div className="mt-2 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar 
                        key={star} 
                        className={`h-3 w-3 ${
                          (candidate.assessment?.score || 0) / 20 >= star 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
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