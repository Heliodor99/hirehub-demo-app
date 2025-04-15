import { Job, Candidate, RecruitmentStage } from '@/types';

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
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
      min: 120000,
      max: 160000,
      currency: 'USD'
    },
    postedDate: '2024-03-01',
    status: 'Active',
    hiringManager: 'John Smith',
    recruiter: 'Sarah Johnson',
    pipeline: {
      stages: [
        RecruitmentStage.APPLIED,
        RecruitmentStage.RESUME_SHORTLISTED,
        RecruitmentStage.ASSESSMENT_SENT,
        RecruitmentStage.INTERVIEW_SCHEDULED,
        RecruitmentStage.FEEDBACK_DONE,
        RecruitmentStage.HIRED,
        RecruitmentStage.REJECTED
      ]
    },
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Redux'],
    benefits: [
      'Health insurance',
      '401(k) matching',
      'Flexible work hours',
      'Remote work options'
    ]
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateTech',
    location: 'New York, NY',
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
      min: 100000,
      max: 140000,
      currency: 'USD'
    },
    postedDate: '2024-03-05',
    status: 'Active',
    hiringManager: 'Emily Chen',
    recruiter: 'Michael Brown',
    pipeline: {
      stages: [
        RecruitmentStage.APPLIED,
        RecruitmentStage.RESUME_SHORTLISTED,
        RecruitmentStage.INTERVIEW_SCHEDULED,
        RecruitmentStage.FEEDBACK_DONE,
        RecruitmentStage.HIRED,
        RecruitmentStage.REJECTED
      ]
    },
    skills: ['Product Management', 'Agile', 'JIRA', 'User Research', 'Data Analysis'],
    benefits: [
      'Competitive salary',
      'Stock options',
      'Professional development budget',
      'Wellness program'
    ]
  },
  {
    id: '3',
    title: 'Data Scientist',
    company: 'DataInsights',
    location: 'Boston, MA',
    department: 'Data Science',
    description: 'Looking for a Data Scientist to help us extract insights from complex datasets...',
    requirements: [
      '4+ years of experience in data science',
      'Strong programming skills in Python',
      'Experience with machine learning frameworks',
      'Master\'s degree in Data Science or related field'
    ],
    responsibilities: [
      'Develop and implement machine learning models',
      'Analyze large datasets',
      'Create data visualizations',
      'Collaborate with cross-functional teams'
    ],
    salary: {
      min: 110000,
      max: 150000,
      currency: 'USD'
    },
    postedDate: '2024-03-10',
    status: 'Active',
    hiringManager: 'David Wilson',
    recruiter: 'Lisa Anderson',
    pipeline: {
      stages: [
        RecruitmentStage.APPLIED,
        RecruitmentStage.RESUME_SHORTLISTED,
        RecruitmentStage.ASSESSMENT_SENT,
        RecruitmentStage.INTERVIEW_SCHEDULED,
        RecruitmentStage.FEEDBACK_DONE,
        RecruitmentStage.HIRED,
        RecruitmentStage.REJECTED
      ]
    },
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'TensorFlow'],
    benefits: [
      'Health and dental insurance',
      'Flexible work arrangements',
      'Conference attendance',
      'Research budget'
    ]
  }
];

export const candidates: Candidate[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1-555-123-4567',
    currentTitle: 'Senior Frontend Developer',
    currentCompany: 'TechStart',
    location: 'San Francisco, CA',
    experience: 6,
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Redux'],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Stanford University',
        year: 2018
      }
    ],
    resume: 'https://example.com/resumes/alex-johnson.pdf',
    source: 'LinkedIn',
    appliedDate: '2024-03-02',
    stage: RecruitmentStage.RESUME_SHORTLISTED,
    jobId: '1',
    notes: 'Strong technical skills and good communication',
    assessment: {
      score: 85,
      feedback: 'Excellent technical assessment results',
      completed: true
    }
  },
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    phone: '+1-555-234-5678',
    currentTitle: 'Product Manager',
    currentCompany: 'ProductLabs',
    location: 'New York, NY',
    experience: 4,
    skills: ['Product Management', 'Agile', 'JIRA', 'User Research'],
    education: [
      {
        degree: 'MBA',
        institution: 'Harvard Business School',
        year: 2020
      }
    ],
    resume: 'https://example.com/resumes/sarah-williams.pdf',
    source: 'Company Website',
    appliedDate: '2024-03-06',
    stage: RecruitmentStage.INTERVIEW_SCHEDULED,
    jobId: '2',
    notes: 'Impressive product portfolio',
    assessment: {
      score: 90,
      feedback: 'Strong product sense and analytical skills',
      completed: true
    }
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+1-555-345-6789',
    currentTitle: 'Data Scientist',
    currentCompany: 'DataWorks',
    location: 'Boston, MA',
    experience: 5,
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL'],
    education: [
      {
        degree: 'Master of Science in Data Science',
        institution: 'MIT',
        year: 2019
      }
    ],
    resume: 'https://example.com/resumes/michael-chen.pdf',
    source: 'Referral',
    appliedDate: '2024-03-11',
    stage: RecruitmentStage.ASSESSMENT_SENT,
    jobId: '3',
    notes: 'Strong background in machine learning',
    assessment: {
      score: 88,
      feedback: 'Excellent problem-solving skills',
      completed: true
    }
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    phone: '+1-555-456-7890',
    currentTitle: 'Frontend Developer',
    currentCompany: 'WebTech',
    location: 'San Francisco, CA',
    experience: 4,
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Vue.js'],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'UC Berkeley',
        year: 2020
      }
    ],
    resume: 'https://example.com/resumes/emily-rodriguez.pdf',
    source: 'LinkedIn',
    appliedDate: '2024-03-03',
    stage: RecruitmentStage.APPLIED,
    jobId: '1',
    notes: 'Good potential, needs more experience',
    assessment: {
      score: 75,
      feedback: 'Solid technical skills, room for growth',
      completed: true
    }
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david.kim@example.com',
    phone: '+1-555-567-8901',
    currentTitle: 'Senior Product Manager',
    currentCompany: 'ProductVision',
    location: 'New York, NY',
    experience: 6,
    skills: ['Product Management', 'Agile', 'JIRA', 'User Research', 'Data Analysis'],
    education: [
      {
        degree: 'Bachelor of Science in Business',
        institution: 'NYU',
        year: 2018
      }
    ],
    resume: 'https://example.com/resumes/david-kim.pdf',
    source: 'Company Website',
    appliedDate: '2024-03-07',
    stage: RecruitmentStage.RESUME_SHORTLISTED,
    jobId: '2',
    notes: 'Extensive product experience',
    assessment: {
      score: 92,
      feedback: 'Strong leadership and strategic thinking',
      completed: true
    }
  },
  {
    id: '6',
    name: 'Lisa Patel',
    email: 'lisa.patel@example.com',
    phone: '+1-555-678-9012',
    currentTitle: 'Data Science Lead',
    currentCompany: 'AnalyticsPro',
    location: 'Boston, MA',
    experience: 7,
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'TensorFlow', 'PyTorch'],
    education: [
      {
        degree: 'PhD in Computer Science',
        institution: 'Carnegie Mellon University',
        year: 2017
      }
    ],
    resume: 'https://example.com/resumes/lisa-patel.pdf',
    source: 'LinkedIn',
    appliedDate: '2024-03-12',
    stage: RecruitmentStage.INTERVIEW_SCHEDULED,
    jobId: '3',
    notes: 'Exceptional research background',
    assessment: {
      score: 95,
      feedback: 'Outstanding technical expertise',
      completed: true
    }
  }
]; 