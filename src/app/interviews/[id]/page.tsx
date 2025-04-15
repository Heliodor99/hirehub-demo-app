'use client';

import { useState } from 'react';
import { FiCalendar, FiClock, FiUsers, FiEdit2 } from 'react-icons/fi';
import { interviews } from '@/data/interviews';
import { notFound } from 'next/navigation';

export default function InterviewPage({ params }: { params: { id: string } }) {
  const interview = interviews.find(i => i.id === parseInt(params.id));
  const [humanFeedback, setHumanFeedback] = useState(interview?.humanFeedback);

  if (!interview) {
    notFound();
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Interview Details</h1>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <FiCalendar className="mr-1.5 h-4 w-4" />
              {interview.date}
            </div>
            <div className="flex items-center">
              <FiClock className="mr-1.5 h-4 w-4" />
              {interview.time}
            </div>
            <div className="flex items-center">
              <FiUsers className="mr-1.5 h-4 w-4" />
              {interview.interviewers.join(', ')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transcript */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Interview Transcript</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {interview.transcript.map((entry, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        entry.speaker === 'Interviewer' ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          entry.speaker === 'Interviewer'
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-primary-100 text-primary-900'
                        }`}
                      >
                        <div className="text-xs text-gray-500 mb-1">
                          {entry.timestamp} - {entry.speaker}
                        </div>
                        <p className="text-sm">{entry.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Section */}
          <div className="space-y-6">
            {/* AI Assessment */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">AI Assessment</h2>
              </div>
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className={`text-4xl font-bold ${getScoreColor(interview.aiAssessment.overallScore)}`}>
                    {interview.aiAssessment.overallScore}
                  </div>
                  <div className="text-sm text-gray-500">Overall Score</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {Object.entries(interview.aiAssessment.categoryScores).map(([category, score]) => (
                    <div key={category} className="text-center">
                      <div className={`text-2xl font-semibold ${getScoreColor(score)}`}>
                        {score}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">{category}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Strengths</h3>
                    <ul className="space-y-1">
                      {interview.aiAssessment.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-green-600">✓ {strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Areas for Improvement</h3>
                    <ul className="space-y-1">
                      {interview.aiAssessment.areasForImprovement.map((area, index) => (
                        <li key={index} className="text-sm text-yellow-600">⚠️ {area}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Recommendations</h3>
                    <ul className="space-y-1">
                      {interview.aiAssessment.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-blue-600">→ {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Human Feedback */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Recruiter Feedback</h2>
                <button
                  onClick={() => {
                    // Implement edit functionality
                  }}
                  className="text-primary-600 hover:text-primary-700"
                >
                  <FiEdit2 className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className={`text-4xl font-bold ${getScoreColor(humanFeedback?.score || 0)}`}>
                    {humanFeedback?.score}
                  </div>
                  <div className="text-sm text-gray-500">Human Score</div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={humanFeedback?.notes}
                      onChange={(e) => setHumanFeedback(prev => ({ ...prev!, notes: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Next Steps
                    </label>
                    <textarea
                      value={humanFeedback?.nextSteps}
                      onChange={(e) => setHumanFeedback(prev => ({ ...prev!, nextSteps: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Decision
                    </label>
                    <select
                      value={humanFeedback?.decision}
                      onChange={(e) => setHumanFeedback(prev => ({ ...prev!, decision: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="Hire">Hire</option>
                      <option value="Reject">Reject</option>
                      <option value="Further Evaluation">Further Evaluation</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 