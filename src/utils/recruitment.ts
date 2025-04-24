import { RecruitmentStage, Candidate } from '@/types';

// Standard color mapping for recruitment stages
export const getStageColor = (stage: RecruitmentStage): string => {
  const colors: Record<RecruitmentStage, string> = {
    [RecruitmentStage.APPLIED]: 'bg-blue-100 text-blue-800',
    [RecruitmentStage.OUTREACHED]: 'bg-purple-100 text-purple-800',
    [RecruitmentStage.ENGAGED]: 'bg-indigo-100 text-indigo-800',
    [RecruitmentStage.RESUME_SHORTLISTED]: 'bg-green-100 text-green-800',
    [RecruitmentStage.ASSESSMENT_SENT]: 'bg-yellow-100 text-yellow-800',
    [RecruitmentStage.INTERVIEW_SCHEDULED]: 'bg-orange-100 text-orange-800',
    [RecruitmentStage.FEEDBACK_DONE]: 'bg-pink-100 text-pink-800',
    [RecruitmentStage.HIRED]: 'bg-emerald-100 text-emerald-800',
    [RecruitmentStage.REJECTED]: 'bg-red-100 text-red-800',
  };
  return colors[stage] || 'bg-gray-100 text-gray-800';
};

// Standard pipeline stage groups
export const pipelineStageGroups = [
  { 
    id: 'screening', 
    name: 'Screening', 
    color: 'bg-blue-100 text-blue-800', 
    stages: [
      RecruitmentStage.APPLIED,
      RecruitmentStage.OUTREACHED,
      RecruitmentStage.ENGAGED,
      RecruitmentStage.RESUME_SHORTLISTED
    ]
  },
  { 
    id: 'assessment', 
    name: 'Assessment', 
    color: 'bg-yellow-100 text-yellow-800', 
    stages: [RecruitmentStage.ASSESSMENT_SENT] 
  },
  { 
    id: 'interview', 
    name: 'Interview', 
    color: 'bg-purple-100 text-purple-800', 
    stages: [RecruitmentStage.INTERVIEW_SCHEDULED] 
  },
  { 
    id: 'offer', 
    name: 'Offer', 
    color: 'bg-green-100 text-green-800', 
    stages: [RecruitmentStage.FEEDBACK_DONE] 
  },
  { 
    id: 'hired', 
    name: 'Hired', 
    color: 'bg-indigo-100 text-indigo-800', 
    stages: [RecruitmentStage.HIRED] 
  }
];

// Standard function to count candidates by stage
export const countCandidatesByStage = (
  candidates: Candidate[],
  jobId?: string
): Record<RecruitmentStage, number> => {
  return Object.values(RecruitmentStage).reduce((acc, stage) => {
    acc[stage] = candidates.filter(c => 
      c.stage === stage && 
      (!jobId || c.jobId === jobId)
    ).length;
    return acc;
  }, {} as Record<RecruitmentStage, number>);
};

// Get candidates in a specific stage group
export const getCandidatesByStageGroup = (
  candidates: Candidate[],
  groupId: string,
  jobId?: string
): Candidate[] => {
  const group = pipelineStageGroups.find(g => g.id === groupId);
  if (!group) return [];
  
  return candidates.filter(candidate => 
    group.stages.includes(candidate.stage) &&
    (!jobId || candidate.jobId === jobId)
  );
};

// Calculate time-to-hire metrics (in days)
export const calculateTimeToHire = (candidates: Candidate[]): number => {
  const timeToHire = candidates
    .filter(c => c.stage === RecruitmentStage.HIRED && c.appliedDate)
    .map(c => {
      const applicationDate = new Date(c.appliedDate);
      
      // Use lastUpdated if available, otherwise use the current date
      const hireDate = c.lastUpdated 
        ? new Date(c.lastUpdated) 
        : new Date(); // Fallback to today if no lastUpdated date
        
      return Math.ceil((hireDate.getTime() - applicationDate.getTime()) / (1000 * 60 * 60 * 24));
    });
  
  return timeToHire.length > 0 
    ? Math.round(timeToHire.reduce((a, b) => a + b, 0) / timeToHire.length)
    : 0;
};

// Format stage name for display
export const formatStageName = (stage: RecruitmentStage): string => {
  return stage.replace(/_/g, ' ').toLowerCase();
}; 