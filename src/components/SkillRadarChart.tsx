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

interface Skill {
  name: string;
  proficiency: number;
}

interface SkillRadarChartProps {
  skills: Skill[];
  maxValue?: number; // Default is 10
  size?: number;
  showLegend?: boolean;
  className?: string;
  animated?: boolean;
}

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({
  skills,
  maxValue = 10,
  size = 400,
  showLegend = false,
  className = '',
  animated = true
}) => {
  // Prepare the data for the radar chart
  const data = skills.map(skill => ({
    subject: skill.name,
    value: skill.proficiency,
    fullMark: maxValue
  }));

  return (
    <div className={`w-full ${className}`} style={{ height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, maxValue]} />
          <Radar
            name="Skills"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
            {...(animated ? { animationBegin: 0, animationDuration: 1500, animationEasing: 'ease-out' } : {})}
          />
          {showLegend && <Legend />}
          <Tooltip 
            formatter={(value: number) => [`${value}/${maxValue}`, 'Proficiency']}
            labelFormatter={(label: string) => label}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillRadarChart; 