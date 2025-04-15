import { useState } from 'react';
import { candidates } from '@/data/candidates';
import { jobs } from '@/data/jobs';

interface AICandidateMatchingProps {
  jobId: string;
  onSelectCandidate: (candidateId: string) => void;
}

export default function AICandidateMatching({ jobId, onSelectCandidate }: AICandidateMatchingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'match' | 'experience' | 'skills'>('match');

  const job = jobs.find(j => j.id === jobId);
  if (!job) return null;

  // Filter and sort candidates based on search query and sort criteria
  const filteredCandidates = candidates
    .filter(candidate => {
      const fullName = `${candidate.name.first} ${candidate.name.last}`.toLowerCase();
      const query = searchQuery.toLowerCase();
      return fullName.includes(query) || candidate.contact.email.toLowerCase().includes(query);
    })
    .map(candidate => {
      // Calculate match score based on various factors
      const application = candidate.applications.find(app => app.jobId === jobId);
      const matchScore = application?.aiAssessment.matchPercentage || 0;

      // Calculate experience match
      const experienceMatch = candidate.experience.some(exp => 
        exp.title.toLowerCase().includes(job.title.toLowerCase().split(' ')[0])
      ) ? 20 : 0;

      // Calculate skills match
      const requiredSkills = job.description.requirements
        .map(req => req.toLowerCase())
        .filter(req => req.includes('experience') || req.includes('knowledge'));
      
      const skillsMatch = candidate.skills.reduce((score, skill) => {
        if (requiredSkills.some(req => req.includes(skill.name.toLowerCase()))) {
          return score + (skill.proficiency / 5) * 10;
        }
        return score;
      }, 0);

      return {
        ...candidate,
        matchScore,
        experienceMatch,
        skillsMatch,
        totalScore: matchScore + experienceMatch + skillsMatch
      };
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return b.totalScore - a.totalScore;
        case 'experience':
          return b.experienceMatch - a.experienceMatch;
        case 'skills':
          return b.skillsMatch - a.skillsMatch;
        default:
          return 0;
      }
    });

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">AI-Powered Candidate Matching</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'match' | 'experience' | 'skills')}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="match">Sort by Match</option>
              <option value="experience">Sort by Experience</option>
              <option value="skills">Sort by Skills</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Candidate
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Match Score
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Experience Match
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Skills Match
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Score
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {candidate.name.first[0]}{candidate.name.last[0]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {candidate.name.first} {candidate.name.last}
                      </div>
                      <div className="text-sm text-gray-500">{candidate.contact.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{candidate.matchScore}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${candidate.matchScore}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{candidate.experienceMatch}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${candidate.experienceMatch}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{candidate.skillsMatch}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: `${candidate.skillsMatch}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{candidate.totalScore}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${candidate.totalScore}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onSelectCandidate(candidate.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 