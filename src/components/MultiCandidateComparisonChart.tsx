'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface CandidateSkill {
  candidateId: string;
  candidateName: string;
  skills: Array<{ name: string; proficiency: number }>;
}

interface MultiCandidateComparisonChartProps {
  candidates: CandidateSkill[];
  skillNames: string[]; // List of skill names to compare
  maxValue?: number;
  className?: string;
}

const MultiCandidateComparisonChart: React.FC<MultiCandidateComparisonChartProps> = ({
  candidates,
  skillNames,
  maxValue = 10,
  className = ''
}) => {
  // Set of colors for different candidates
  const colors = [
    { stroke: '#8884d8', fill: '#8884d8' },
    { stroke: '#82ca9d', fill: '#82ca9d' },
    { stroke: '#ffc658', fill: '#ffc658' },
    { stroke: '#ff7300', fill: '#ff7300' },
    { stroke: '#0088fe', fill: '#0088fe' },
    { stroke: '#00c49f', fill: '#00c49f' },
    { stroke: '#ffbb28', fill: '#ffbb28' },
    { stroke: '#ff8042', fill: '#ff8042' },
    { stroke: '#a4de6c', fill: '#a4de6c' },
    { stroke: '#d0ed57', fill: '#d0ed57' }
  ];

  // Format data for the radar chart with multiple candidate series
  const formatData = () => {
    return skillNames.map(skillName => {
      const data: any = { subject: skillName };
      
      candidates.forEach(candidate => {
        const skill = candidate.skills.find(s => s.name === skillName);
        data[candidate.candidateName] = skill ? skill.proficiency : 0;
      });
      
      return data;
    });
  };

  const data = formatData();

  return (
    <div className={`${className}`} style={{ height: 500 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, maxValue]} />
          
          {candidates.map((candidate, index) => (
            <Radar
              key={candidate.candidateId}
              name={candidate.candidateName}
              dataKey={candidate.candidateName}
              stroke={colors[index % colors.length].stroke}
              fill={colors[index % colors.length].fill}
              fillOpacity={0.6}
              animationBegin={index * 300} 
              animationDuration={1500}
              animationEasing="ease-out"
            />
          ))}
          
          <Legend />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MultiCandidateComparisonChart; 