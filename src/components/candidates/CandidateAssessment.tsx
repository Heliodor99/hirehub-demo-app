'use client';

import { FiAward, FiCheckCircle, FiX } from 'react-icons/fi';
import { Candidate } from '@/types';

interface CandidateAssessmentProps {
  candidate: Candidate;
}

export function CandidateAssessment({ candidate }: CandidateAssessmentProps) {
  if (!candidate.assessment) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Assessment Results</h2>
        <div className="flex items-center">
          <FiAward className="h-5 w-5 text-yellow-500 mr-2" />
          <span className="text-lg font-medium text-gray-900">{candidate.assessment.score}% Match</span>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Feedback</h3>
          <p className="text-gray-700">{candidate.assessment.feedback}</p>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          {candidate.assessment.completed ? (
            <>
              <FiCheckCircle className="mr-1.5 h-4 w-4 text-green-500" />
              <span>Assessment completed</span>
            </>
          ) : (
            <>
              <FiX className="mr-1.5 h-4 w-4 text-gray-400" />
              <span>Assessment pending</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 