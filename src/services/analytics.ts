import { Candidate, RecruitmentStage } from '@/types';

interface HireDateRecord {
  candidateId: string;
  applicationDate: Date;
  hireDate: Date;
  timeToHire: number; // in days
}

// Map to store hire dates for consistent reporting
const hireDateMap = new Map<string, HireDateRecord>();

/**
 * Calculates time to hire for a specific candidate based on their attributes
 * Uses consistent algorithm to ensure same results each time for the same candidate
 */
export function calculateTimeToHire(candidate: Candidate): number {
  if (hireDateMap.has(candidate.id)) {
    return hireDateMap.get(candidate.id)!.timeToHire;
  }

  const applicationDate = new Date(candidate.appliedDate);
  
  // Calculate time to hire based on candidate attributes
  // Different factors that affect time to hire:
  // - Experience level: more experience = faster hire
  // - Assessment score: higher score = faster hire
  // - Skills relevance: more relevant skills = faster hire
  const baseDays = 30; // Average time to hire
  const experienceFactor = Math.max(0, 10 - candidate.experience) * 1.5; // Reduce time for more experience
  const assessmentFactor = candidate.assessment?.score ? Math.max(0, 100 - candidate.assessment.score) * 0.2 : 10;
  const skillsFactor = candidate.skills.length > 5 ? 0 : (5 - candidate.skills.length) * 2;
  
  const totalDays = Math.round(baseDays + experienceFactor + assessmentFactor + skillsFactor);
  
  const hireDate = new Date(candidate.appliedDate);
  hireDate.setDate(hireDate.getDate() + totalDays);
  
  const timeToHire = Math.ceil((hireDate.getTime() - applicationDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Store for consistent reuse
  hireDateMap.set(candidate.id, {
    candidateId: candidate.id,
    applicationDate,
    hireDate,
    timeToHire
  });
  
  return timeToHire;
}

/**
 * Calculates the recruitment efficiency score based on various metrics
 */
export function calculateRecruitmentEfficiency(
  avgTimeToHire: number,
  conversionRate: number,
  candidateQualityScore: number,
  sourceDiversityCount: number
): number {
  // Time to hire score (lower is better) - normalize to 0-100
  const bestTimeToHire = 15; // Benchmark: 15 days is excellent
  const worstTimeToHire = 60; // Benchmark: 60 days is poor
  const timeToHireScore = avgTimeToHire <= bestTimeToHire 
    ? 100 
    : avgTimeToHire >= worstTimeToHire 
      ? 0 
      : 100 - (((avgTimeToHire - bestTimeToHire) / (worstTimeToHire - bestTimeToHire)) * 100);
  
  // Conversion rate score (higher is better)
  const conversionScore = Math.min(conversionRate * 5, 100); // Normalize: 20% conversion = 100 score
  
  // Source diversity score (more sources is better)
  const sourceDiversityScore = Math.min(sourceDiversityCount * 20, 100); // 5+ sources = 100 score
  
  // Weights for different factors
  const weights = {
    timeToHire: 0.3,
    conversionRate: 0.3,
    candidateQuality: 0.25,
    sourceDiversity: 0.15
  };
  
  // Calculate weighted score
  const weightedScore = 
    (timeToHireScore * weights.timeToHire) +
    (conversionScore * weights.conversionRate) +
    (candidateQualityScore * weights.candidateQuality) +
    (sourceDiversityScore * weights.sourceDiversity);
  
  return Math.round(weightedScore);
}

/**
 * Calculates funnel efficiency metrics from one stage to another
 */
export function calculateFunnelEfficiency(
  stages: RecruitmentStage[],
  stageCounts: Record<RecruitmentStage, number>
) {
  return stages.map((stage, index) => {
    if (index === 0) return { 
      from: 'Total', 
      to: stage, 
      rate: 100,
      count: stageCounts[stage] || 0
    };
    
    const previousStage = stages[index - 1];
    const previousCount = stageCounts[previousStage] || 0;
    const currentCount = stageCounts[stage] || 0;
    
    return {
      from: previousStage,
      to: stage,
      rate: previousCount > 0 ? Math.round((currentCount / previousCount) * 100) : 0,
      count: currentCount
    };
  });
} 