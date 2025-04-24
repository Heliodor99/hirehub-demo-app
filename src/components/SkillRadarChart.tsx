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
    <div className={`w-full ${className} p-4 rounded-xl backdrop-blur-sm bg-white/80 border border-gray-100 shadow-sm`}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, maxValue]} tick={{ fill: '#6b7280', fontSize: 10 }} />
          <Radar
            name="Skills"
            dataKey="value"
            stroke="#2B7BD3"
            fill="#2B7BD3"
            fillOpacity={0.3}
            {...(animated ? { animationBegin: 0, animationDuration: 1500, animationEasing: 'ease-out' } : {})}
          />
          <Radar
            name="Skills"
            dataKey="value"
            stroke="#9B5CFF"
            fill="#9B5CFF"
            fillOpacity={0.0}
            strokeWidth={1}
            {...(animated ? { animationBegin: 0, animationDuration: 1500, animationEasing: 'ease-out' } : {})}
          />
          {showLegend && <Legend />}
          <Tooltip 
            formatter={(value: number) => [`${value}/${maxValue}`, 'Proficiency']}
            labelFormatter={(label: string) => label}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              padding: '8px 12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontSize: '12px'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillRadarChart; 