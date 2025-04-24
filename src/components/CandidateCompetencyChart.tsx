'use client';

import React from 'react';
import SkillRadarChart from './SkillRadarChart';

interface CandidateCompetencyChartProps {
  candidateId: string;
  candidateName: string;
  skills: Array<{ name: string; proficiency: number }>;
  className?: string;
}

const CandidateCompetencyChart: React.FC<CandidateCompetencyChartProps> = ({
  candidateId,
  candidateName,
  skills,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex flex-col space-y-2 mb-4">
        <h3 className="text-lg font-medium text-gray-900">{candidateName} - Skill Competency</h3>
        <p className="text-sm text-gray-500">
          Ratings out of 10 for key competencies
        </p>
      </div>
      
      <SkillRadarChart 
        skills={skills} 
        maxValue={10} 
        size={300}
        animated={true}
      />
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div key={`${candidateId}-${skill.name}`} className="flex justify-between items-center">
            <span className="text-sm text-gray-700">{skill.name}</span>
            <div className="flex items-center">
              <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                <div 
                  className="h-full bg-purple-600 rounded-full" 
                  style={{ width: `${(skill.proficiency / 10) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700">{skill.proficiency}/10</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateCompetencyChart; 