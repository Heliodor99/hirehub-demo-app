import { RecruitmentStage, Candidate } from '@/types';

// Standard color mapping for recruitment stages
export const getStageColor = (stage: RecruitmentStage): string => {
  const colors: Record<RecruitmentStage, string> = {
    [RecruitmentStage.APPLIED]: 'bg-blue-100 text-blue-800',
    [RecruitmentStage.SHORTLISTED]: 'bg-green-100 text-green-800',
    [RecruitmentStage.INTERVIEWED]: 'bg-purple-100 text-purple-800',
    [RecruitmentStage.REJECTED]: 'bg-red-100 text-red-800',
    [RecruitmentStage.OFFER_EXTENDED]: 'bg-yellow-100 text-yellow-800',
    [RecruitmentStage.OFFER_REJECTED]: 'bg-orange-100 text-orange-800',
    [RecruitmentStage.HIRED]: 'bg-emerald-100 text-emerald-800'
  };
  return colors[stage] || 'bg-gray-100 text-gray-800';
};

// Pipeline stages matching recruitment stages exactly
export const pipelineStageGroups = [
  { 
    id: 'applied', 
    name: 'Applied', 
    color: 'bg-blue-100 text-blue-800', 
    stages: [RecruitmentStage.APPLIED]
  },
  { 
    id: 'shortlisted', 
    name: 'Shortlisted', 
    color: 'bg-green-100 text-green-800', 
    stages: [RecruitmentStage.SHORTLISTED]
  },
  { 
    id: 'interviewed', 
    name: 'Interviewed', 
    color: 'bg-purple-100 text-purple-800', 
    stages: [RecruitmentStage.INTERVIEWED]
  },
  { 
    id: 'rejected', 
    name: 'Rejected', 
    color: 'bg-red-100 text-red-800', 
    stages: [RecruitmentStage.REJECTED]
  },
  { 
    id: 'offer_extended', 
    name: 'Offer Extended', 
    color: 'bg-yellow-100 text-yellow-800', 
    stages: [RecruitmentStage.OFFER_EXTENDED]
  },
  { 
    id: 'offer_rejected', 
    name: 'Offer Rejected', 
    color: 'bg-orange-100 text-orange-800', 
    stages: [RecruitmentStage.OFFER_REJECTED]
  },
  { 
    id: 'hired', 
    name: 'Hired', 
    color: 'bg-emerald-100 text-emerald-800', 
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
export const formatStageName = (stage: RecruitmentStage | undefined): string => {
  if (!stage) return '';
  return stage; // The enum values are already in the desired format ('Applied', 'Shortlisted', etc.)
}; 