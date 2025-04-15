import { Candidate } from '@/types';
import { 
  pipelineStageGroups, 
  getCandidatesByStageGroup, 
  countCandidatesByStage 
} from '@/utils/recruitment';

interface PipelineOverviewProps {
  candidates: Candidate[];
  jobId?: string;
}

export default function PipelineOverview({ candidates, jobId }: PipelineOverviewProps) {
  const stageCounts = countCandidatesByStage(candidates, jobId);
  const totalCandidates = Object.values(stageCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Pipeline Overview</h2>
      <div className="space-y-4">
        {pipelineStageGroups.map((group) => {
          const groupCandidates = getCandidatesByStageGroup(candidates, group.id, jobId);
          const percentage = totalCandidates > 0 
            ? Math.round((groupCandidates.length / totalCandidates) * 100) 
            : 0;

          return (
            <div key={group.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{group.name}</span>
                <span className={`px-2 py-1 rounded-full text-sm ${group.color}`}>
                  {groupCandidates.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${group.color.replace('text-', 'bg-')}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Candidates</span>
          <span className="text-lg font-semibold">{totalCandidates}</span>
        </div>
      </div>
    </div>
  );
} 