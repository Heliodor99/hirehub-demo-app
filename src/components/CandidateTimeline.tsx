'use client';

import { FiFileText, FiMessageCircle, FiCheckCircle, FiCalendar, FiBriefcase } from 'react-icons/fi';
import { Candidate, RecruitmentStage } from '@/types';

interface CandidateTimelineProps {
  candidate: Candidate;
}

export default function CandidateTimeline({ candidate }: CandidateTimelineProps) {
  // Format a date safely
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      // Use a more stable date format that will be consistent between server and client
      return date.toISOString().split('T')[0];
    } catch (e) {
      return 'N/A';
    }
  };

  return (
    <div className="relative pl-3 border-l border-gray-200">
      {/* Outreach Stage - Always show for candidates who were recruited */}
      {candidate.source === 'Recruiter' && (
        <div className="mb-4 relative">
          <div className="absolute -left-2.5 mt-1">
            <div className="h-5 w-5 rounded-full bg-blue-50 flex items-center justify-center">
              <FiMessageCircle className="h-3 w-3 text-blue-500" />
            </div>
          </div>
          <div className="ml-5">
            <h3 className="text-sm font-medium text-gray-900">Outreached</h3>
            <p className="text-xs text-gray-500">
              {formatDate(candidate.appliedDate ? new Date(new Date(candidate.appliedDate).setDate(new Date(candidate.appliedDate).getDate() - 5)).toISOString() : undefined)}
            </p>
          </div>
        </div>
      )}
      
      {/* Application Stage - Show for all candidates except those who are only outreached */}
      {candidate.stage !== RecruitmentStage.OUTREACHED && (
        <div className="mb-4 relative">
          <div className="absolute -left-2.5 mt-1">
            <div className="h-5 w-5 rounded-full bg-green-50 flex items-center justify-center">
              <FiFileText className="h-3 w-3 text-green-500" />
            </div>
          </div>
          <div className="ml-5">
            <h3 className="text-sm font-medium text-gray-900">Application Submitted</h3>
            <p className="text-xs text-gray-500">{formatDate(candidate.appliedDate)}</p>
          </div>
        </div>
      )}

      {/* Shortlisted Stage */}
      {[RecruitmentStage.SHORTLISTED, RecruitmentStage.INTERVIEWED, RecruitmentStage.REJECTED, 
         RecruitmentStage.OFFER_EXTENDED, RecruitmentStage.OFFER_REJECTED, RecruitmentStage.HIRED].includes(candidate.stage) && (
        <div className="mb-4 relative">
          <div className="absolute -left-2.5 mt-1">
            <div className="h-5 w-5 rounded-full bg-indigo-50 flex items-center justify-center">
              <FiCheckCircle className="h-3 w-3 text-indigo-500" />
            </div>
          </div>
          <div className="ml-5">
            <h3 className="text-sm font-medium text-gray-900">Shortlisted</h3>
            <p className="text-xs text-gray-500">
              {formatDate(candidate.appliedDate ? new Date(new Date(candidate.appliedDate).setDate(new Date(candidate.appliedDate).getDate() + 2)).toISOString() : undefined)}
            </p>
          </div>
        </div>
      )}

      {/* Interview Stage - Only show for candidates who've been interviewed or further */}
      {[RecruitmentStage.INTERVIEWED, RecruitmentStage.REJECTED, 
         RecruitmentStage.OFFER_EXTENDED, RecruitmentStage.OFFER_REJECTED, 
         RecruitmentStage.HIRED].includes(candidate.stage) && (
        <div className="mb-4 relative">
          <div className="absolute -left-2.5 mt-1">
            <div className="h-5 w-5 rounded-full bg-purple-50 flex items-center justify-center">
              <FiCalendar className="h-3 w-3 text-purple-500" />
            </div>
          </div>
          <div className="ml-5">
            <h3 className="text-sm font-medium text-gray-900">Interviewed</h3>
            <p className="text-xs text-gray-500">
              {candidate.interview?.date || formatDate(candidate.appliedDate ? new Date(new Date(candidate.appliedDate).setDate(new Date(candidate.appliedDate).getDate() + 7)).toISOString() : undefined)}
            </p>
          </div>
        </div>
      )}

      {/* Offer Stage */}
      {[RecruitmentStage.OFFER_EXTENDED, RecruitmentStage.OFFER_REJECTED, 
        RecruitmentStage.HIRED].includes(candidate.stage) && (
        <div className="mb-4 relative">
          <div className="absolute -left-2.5 mt-1">
            <div className="h-5 w-5 rounded-full bg-yellow-50 flex items-center justify-center">
              <FiBriefcase className="h-3 w-3 text-yellow-500" />
            </div>
          </div>
          <div className="ml-5">
            <h3 className="text-sm font-medium text-gray-900">Offer Extended</h3>
            <p className="text-xs text-gray-500">
              {formatDate(candidate.interview?.date ? new Date(new Date(candidate.interview.date).setDate(new Date(candidate.interview.date).getDate() + 4)).toISOString() : undefined)}
            </p>
          </div>
        </div>
      )}

      {/* Hired Stage */}
      {candidate.stage === RecruitmentStage.HIRED && (
        <div className="mb-4 relative">
          <div className="absolute -left-2.5 mt-1">
            <div className="h-5 w-5 rounded-full bg-green-50 flex items-center justify-center">
              <FiCheckCircle className="h-3 w-3 text-green-500" />
            </div>
          </div>
          <div className="ml-5">
            <h3 className="text-sm font-medium text-gray-900">Hired</h3>
            <p className="text-xs text-gray-500">
              {formatDate(candidate.interview?.date ? new Date(new Date(candidate.interview.date).setDate(new Date(candidate.interview.date).getDate() + 7)).toISOString() : undefined)}
            </p>
          </div>
        </div>
      )}

      {/* Current Stage Indicator - Always shown */}
      <div className="relative">
        <div className="absolute -left-2.5 mt-1">
          <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-white"></div>
          </div>
        </div>
        <div className="ml-5">
          <h3 className="text-sm font-medium text-blue-600">Current Stage: {candidate.stage}</h3>
          <p className="text-xs text-gray-500">Updated today</p>
        </div>
      </div>
    </div>
  );
} 