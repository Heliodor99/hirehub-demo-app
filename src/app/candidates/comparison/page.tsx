'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiUsers, FiRefreshCw, FiBriefcase } from 'react-icons/fi';
import { candidates, jobs } from '@/data/jobs';
import MultiCandidateComparisonChart from '@/components/MultiCandidateComparisonChart';
import { Skill } from '@/types';

export default function CandidateComparisonPage() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [maxCandidates] = useState(10);

  // Get the job and its candidates
  const job = selectedJobId ? jobs.find(j => j.id === selectedJobId) : null;
  const jobCandidates = useMemo(() => {
    if (!selectedJobId) return [];
    
    return candidates
      .filter(c => c.jobId === selectedJobId)
      .slice(0, maxCandidates)
      .map(c => ({
        ...c,
        // Generate mock competencies if not available
        skillCompetencies: c.skillCompetencies || (
          Array.isArray(c.skills) && typeof c.skills[0] === 'string'
            ? (c.skills as string[]).map(skill => ({
                name: skill,
                proficiency: Math.floor(Math.random() * 5) + 5 // Random score between 5-10
              }))
            : (c.skills as Skill[])
        )
      }));
  }, [selectedJobId]);

  // Toggle candidate selection
  const toggleCandidateSelection = (candidateId: string) => {
    if (selectedCandidates.includes(candidateId)) {
      setSelectedCandidates(selectedCandidates.filter(id => id !== candidateId));
    } else {
      if (selectedCandidates.length < 5) { // Limit to 5 candidates for readability
        setSelectedCandidates([...selectedCandidates, candidateId]);
      }
    }
  };

  // Extract all unique skill names from selected candidates
  const skillNames = useMemo(() => {
    const skillSet = new Set<string>();
    jobCandidates
      .filter(c => selectedCandidates.includes(c.id))
      .forEach(candidate => {
        candidate.skillCompetencies.forEach(skill => {
          skillSet.add(skill.name);
        });
      });
    return Array.from(skillSet);
  }, [jobCandidates, selectedCandidates]);

  // Format candidate data for the multi-candidate chart
  const candidatesForChart = useMemo(() => {
    return jobCandidates
      .filter(c => selectedCandidates.includes(c.id))
      .map(c => ({
        candidateId: c.id,
        candidateName: c.name,
        skills: c.skillCompetencies
      }));
  }, [jobCandidates, selectedCandidates]);

  // Reset all selections
  const resetSelections = () => {
    setSelectedCandidates([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href="/candidates"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Candidates
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Candidate Skill Comparison</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Compare skill competencies for candidates applying to the same job
                </p>
              </div>
              {job && (
                <div className="flex space-x-4">
                  <button
                    onClick={resetSelections}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FiRefreshCw className="mr-2 h-4 w-4" />
                    Reset Selection
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {!selectedJobId ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Select a Job</h2>
            <p className="text-sm text-gray-500 mb-6">
              First, choose a job to compare candidates who have applied for the same position.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map(job => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <FiBriefcase className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">{job.title}</h3>
                      <p className="text-xs text-gray-500">{job.company}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {candidates.filter(c => c.jobId === job.id).length} candidates
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Candidates for {job?.title}</h2>
                  <span className="text-sm text-gray-500">
                    {selectedCandidates.length} of {jobCandidates.length} selected
                  </span>
                </div>
                
                <div className="mb-4">
                  <button
                    onClick={() => {
                      setSelectedJobId(null);
                      setSelectedCandidates([]);
                    }}
                    className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center"
                  >
                    <FiArrowLeft className="mr-1 h-3 w-3" />
                    Change job
                  </button>
                </div>
                
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {jobCandidates.map((candidate) => (
                    <div 
                      key={candidate.id}
                      className={`
                        p-3 rounded-md border cursor-pointer transition-colors
                        ${selectedCandidates.includes(candidate.id) 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:bg-gray-50'}
                      `}
                      onClick={() => toggleCandidateSelection(candidate.id)}
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <FiUsers className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                          <div className="text-xs text-gray-500">
                            {candidate.currentTitle} • {candidate.experience} years
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Select up to 5 candidates to compare their skills
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Skill Comparison</h2>
                
                {selectedCandidates.length > 0 ? (
                  <>
                    <div className="text-sm text-gray-500 mb-4">
                      Comparing skill competencies for {selectedCandidates.length} candidate(s)
                    </div>
                    <MultiCandidateComparisonChart 
                      candidates={candidatesForChart}
                      skillNames={skillNames}
                      maxValue={10}
                    />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <FiUsers className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No candidates selected</h3>
                    <p className="text-sm text-gray-500">
                      Select candidates from the list to view their skill comparison
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 