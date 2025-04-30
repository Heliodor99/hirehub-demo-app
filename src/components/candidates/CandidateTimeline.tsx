'use client';

import { Candidate, RecruitmentStage } from '@/types';
import { getStageColor, formatStageName } from '@/utils/recruitment';

interface CandidateTimelineProps {
  candidate: Candidate;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
yes 
export function CandidateTimeline({ candidate }: CandidateTimelineProps) {
  if (!candidate.processStages) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Application Timeline</h2>
      <div className="space-y-6">
        {candidate.processStages.map((stage: {
          stage: RecruitmentStage;
          date: string;
          notes: string;
        }, index: number) => (
          <div key={index} className="flex">
            <div className="flex-shrink-0">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getStageColor(stage.stage)}`}>
                <span className="text-sm font-medium">{index + 1}</span>
              </div>
              {index < (candidate.processStages?.length || 0) - 1 && (
                <div className="h-full w-0.5 bg-gray-200 mx-auto" />
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">{formatStageName(stage.stage)}</h3>
              <p className="text-sm text-gray-500">{formatDate(stage.date)}</p>
              <p className="mt-1 text-sm text-gray-600">{stage.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 