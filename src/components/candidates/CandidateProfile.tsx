'use client';

import { FiUser, FiBriefcase, FiMail, FiPhone, FiMapPin, FiCalendar, FiAward, FiLink } from 'react-icons/fi';
import { Candidate, Job } from '@/types';
import { getStageColor, formatStageName } from '@/utils/recruitment';

interface CandidateProfileProps {
  candidate: Candidate;
  job: Job;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatExperience = (experience: Array<{ startDate: string; endDate?: string; current: boolean }>) => {
  if (!Array.isArray(experience) || experience.length === 0) {
    return 0;
  }
    
  const totalYears = experience.reduce((total, exp) => {
    const start = new Date(exp.startDate);
    const end = exp.current ? new Date() : exp.endDate ? new Date(exp.endDate) : new Date();
    const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return total + years;
  }, 0);
  return Math.round(totalYears);
};

export function CandidateProfile({ candidate, job }: CandidateProfileProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-4">
          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
            <FiUser className="h-8 w-8 text-gray-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
            <div className="mt-1 text-sm text-gray-500">
              {candidate.currentTitle} • {formatExperience(candidate.experience)} years experience
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <FiMail className="mr-1.5 h-4 w-4" />
                {candidate.email}
              </div>
              <div className="flex items-center">
                <FiPhone className="mr-1.5 h-4 w-4" />
                {candidate.phone}
              </div>
              <div className="flex items-center">
                <FiMapPin className="mr-1.5 h-4 w-4" />
                {`${candidate.location.city}, ${candidate.location.state}`}
              </div>
            </div>
          </div>
        </div>
        <div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(candidate.stage)}`}>
            {formatStageName(candidate.stage)}
          </span>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Skills</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills?.technical?.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {skill} - {candidate.skills?.levels?.[skill]}
                </span>
              ))}
              {(!candidate.skills?.technical || candidate.skills.technical.length === 0) && (
                <span className="text-sm text-gray-500">No technical skills listed</span>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tools</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills?.tools?.map((tool: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  {tool}
                </span>
              ))}
              {(!candidate.skills?.tools || candidate.skills.tools.length === 0) && (
                <span className="text-sm text-gray-500">No tools listed</span>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Soft Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills?.soft?.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                >
                  {skill}
                </span>
              ))}
              {(!candidate.skills?.soft || candidate.skills.soft.length === 0) && (
                <span className="text-sm text-gray-500">No soft skills listed</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Work Experience */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Work Experience</h2>
        <div className="space-y-6">
          {Array.isArray(candidate.experience) && candidate.experience.length > 0 ? (
            candidate.experience.map((exp: {
              title: string;
              company: string;
              startDate: string;
              endDate?: string;
              current: boolean;
              location: string;
              responsibilities: string[];
              achievements: string[];
              employmentType: string;
            }, index: number) => (
              <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{exp.title}</h3>
                    <p className="text-sm text-gray-500">{exp.company}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-700">Responsibilities:</h4>
                  <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                    {Array.isArray(exp.responsibilities) && exp.responsibilities.map((resp: string, i: number) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-700">Achievements:</h4>
                  <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                    {Array.isArray(exp.achievements) && exp.achievements.map((achievement: string, i: number) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No work experience listed</p>
          )}
        </div>
      </div>

      {/* Education */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Education</h2>
        <div className="space-y-4">
          {candidate.education.map((edu, index) => (
            <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
              <h3 className="font-medium text-gray-900">{edu.degree} in {edu.specialization}</h3>
              <p className="text-sm text-gray-500">{edu.institution}</p>
              <p className="text-sm text-gray-500">{edu.startYear} - {edu.endYear}</p>
              {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      {candidate.certifications && candidate.certifications.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Certifications</h2>
          <div className="space-y-4">
            {candidate.certifications.map((cert, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">{cert.name}</h3>
                  <p className="text-sm text-gray-500">{cert.authority}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(cert.date).toLocaleDateString()}
                  {cert.validUntil && ` - ${new Date(cert.validUntil).toLocaleDateString()}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 