import { Job, Candidate, RecruitmentStage } from '@/types';

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp India',
    location: 'Bangalore, Karnataka',
    department: 'Engineering',
    description: 'We are looking for an experienced Frontend Developer to join our team...',
    requirements: [
      '5+ years of experience in frontend development',
      'Strong proficiency in React and TypeScript',
      'Experience with modern frontend build tools',
      'Bachelor\'s degree in Computer Science or related field'
    ],
    responsibilities: [
      'Develop and maintain frontend applications',
      'Collaborate with design and backend teams',
      'Write clean, maintainable code',
      'Participate in code reviews'
    ],
    salary: {
      min: 1800000,
      max: 2800000,
      currency: 'INR'
    },
    postedDate: '2024-03-01',
    status: 'Active',
    hiringManager: 'Rajesh Sharma',
    recruiter: 'Priya Patel',
    pipeline: {
      stages: [
        RecruitmentStage.APPLIED,
        RecruitmentStage.SHORTLISTED,
        RecruitmentStage.INTERVIEWED,
        RecruitmentStage.OFFER_EXTENDED,
        RecruitmentStage.HIRED,
        RecruitmentStage.REJECTED,
        RecruitmentStage.OFFER_REJECTED
      ]
    },
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Redux'],
    benefits: [
      'Health insurance',
      'Provident fund',
      'Flexible work hours',
      'Remote work options'
    ]
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateTech Solutions',
    location: 'Mumbai, Maharashtra',
    department: 'Product',
    description: 'Join our product team to drive innovation and deliver exceptional user experiences...',
    requirements: [
      '3+ years of product management experience',
      'Strong analytical and problem-solving skills',
      'Experience with agile methodologies',
      'Excellent communication skills'
    ],
    responsibilities: [
      'Define product strategy and roadmap',
      'Gather and prioritize product requirements',
      'Work closely with engineering and design teams',
      'Analyze market trends and competition'
    ],
    salary: {
      min: 1600000,
      max: 2500000,
      currency: 'INR'
    },
    postedDate: '2024-03-05',
    status: 'Active',
    hiringManager: 'Vikram Mehta',
    recruiter: 'Anjali Singh',
    pipeline: {
      stages: [
        RecruitmentStage.APPLIED,
        RecruitmentStage.SHORTLISTED,
        RecruitmentStage.INTERVIEWED,
        RecruitmentStage.OFFER_EXTENDED,
        RecruitmentStage.HIRED,
        RecruitmentStage.REJECTED,
        RecruitmentStage.OFFER_REJECTED
      ]
    },
    skills: ['Product Management', 'Agile', 'JIRA', 'User Research', 'Data Analysis'],
    benefits: [
      'Competitive salary',
      'Employee stock option plan',
      'Professional development budget',
      'Wellness program'
    ]
  }
];

export const candidates: Candidate[] = [
  {
    id: '1',
    name: 'Arjun Patel',
    email: 'arjun.patel@gmail.com',
    phone: '+91 9876543210',
    currentTitle: 'Senior Frontend Developer',
    currentCompany: 'TechMinds Solutions',
    location: 'Bangalore, Karnataka',
    experience: 6,
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Redux'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'IIT Bombay',
        year: 2018
      }
    ],
    resume: 'https://arjunpatel.dev/resume',
    source: 'LinkedIn',
    appliedDate: '2024-01-15',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '1',
    notes: 'Strong technical skills and good communication',
    assessment: {
      score: 85,
      feedback: 'Strong React knowledge and system design skills',
      completed: true
    }
  },
  {
    id: '2',
    name: 'Priya Singh',
    email: 'priya.singh@outlook.com',
    phone: '9988776655',
    currentTitle: 'Product Manager',
    currentCompany: 'Flipkart',
    location: 'Bangalore',
    experience: 4,
    skills: ['Product Management', 'Agile', 'User Research', 'Data Analysis'],
    education: [
      {
        degree: 'MBA',
        institution: 'IIM Bangalore',
        year: 2020
      }
    ],
    resume: 'https://priyasingh.me/resume',
    source: 'Company Website',
    appliedDate: '2023-11-22',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '2',
    notes: 'Impressive product portfolio',
    assessment: {
      score: 92,
      feedback: 'Excellent product sense and analytical skills',
      completed: true
    }
  }
];

// Helper function to convert string stages to enum values
export const getStageFromString = (stage: string): RecruitmentStage => {
  switch (stage) {
    case 'Applied':
      return RecruitmentStage.APPLIED;
    case 'Shortlisted':
      return RecruitmentStage.SHORTLISTED;
    case 'Interviewed':
      return RecruitmentStage.INTERVIEWED;
    case 'Rejected':
      return RecruitmentStage.REJECTED;
    case 'Offer Extended':
      return RecruitmentStage.OFFER_EXTENDED;
    case 'Offer Rejected':
      return RecruitmentStage.OFFER_REJECTED;
    case 'Hired':
      return RecruitmentStage.HIRED;
    default:
      return RecruitmentStage.APPLIED;
  }
}; 