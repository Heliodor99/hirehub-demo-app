import { Candidate } from '@/types';

export const candidates: Candidate[] = [
  {
    id: '1',
    name: {
      first: 'Sarah',
      last: 'Johnson'
    },
    contact: {
      email: 'sarah.johnson@example.com',
      phone: '+91 9876543210',
      location: 'Bangalore'
    },
    experience: [
      {
        title: 'Senior UI/UX Designer',
        company: 'TechSolutions Inc.',
        duration: {
          start: '2020-01-01',
          end: '2024-02-29'
        },
        responsibilities: [
          'Led the redesign of core product features resulting in 40% increase in user engagement',
          'Managed a team of 3 designers and collaborated with product managers',
          'Conducted user research and usability testing sessions',
          'Implemented and maintained design system documentation'
        ]
      },
      {
        title: 'UI Designer',
        company: 'DesignHub',
        duration: {
          start: '2018-06-01',
          end: '2019-12-31'
        },
        responsibilities: [
          'Created user interfaces for web and mobile applications',
          'Collaborated with development team for design implementation',
          'Participated in design sprints and brainstorming sessions'
        ]
      }
    ],
    education: [
      {
        degree: 'Bachelor of Design',
        institution: 'National Institute of Design',
        year: 2018
      }
    ],
    skills: [
      { name: 'Figma', proficiency: 5 },
      { name: 'Adobe XD', proficiency: 4 },
      { name: 'User Research', proficiency: 4 },
      { name: 'Prototyping', proficiency: 5 },
      { name: 'Design Systems', proficiency: 4 }
    ],
    applications: [
      {
        jobId: '1',
        status: 'Interview',
        appliedDate: '2024-03-05',
        aiAssessment: {
          strengths: [
            'Strong portfolio with similar projects',
            'Extensive experience with design systems',
            'Leadership experience in previous roles'
          ],
          concerns: [
            'May need to adapt to our specific tech stack',
            'Higher salary expectations'
          ],
          matchPercentage: 85
        }
      }
    ]
  },
  {
    id: '2',
    name: {
      first: 'Raj',
      last: 'Sharma'
    },
    contact: {
      email: 'raj.sharma@example.com',
      phone: '+91 9876543211',
      location: 'Mumbai'
    },
    experience: [
      {
        title: 'Sales Manager',
        company: 'GlobalTech Solutions',
        duration: {
          start: '2021-03-01',
          end: '2024-02-29'
        },
        responsibilities: [
          'Exceeded quarterly sales targets by average 25%',
          'Managed key client relationships worth ₹2Cr annually',
          'Led a team of 5 sales executives',
          'Implemented new CRM processes improving efficiency by 30%'
        ]
      },
      {
        title: 'Sales Executive',
        company: 'TechStart',
        duration: {
          start: '2019-01-01',
          end: '2021-02-28'
        },
        responsibilities: [
          'Consistently achieved monthly sales targets',
          'Built and maintained strong client relationships',
          'Conducted product demonstrations and presentations'
        ]
      }
    ],
    education: [
      {
        degree: 'MBA in Marketing',
        institution: 'Indian Institute of Management',
        year: 2019
      }
    ],
    skills: [
      { name: 'Sales Strategy', proficiency: 5 },
      { name: 'CRM', proficiency: 4 },
      { name: 'Negotiation', proficiency: 5 },
      { name: 'Lead Generation', proficiency: 4 },
      { name: 'Client Relationship', proficiency: 5 }
    ],
    applications: [
      {
        jobId: '2',
        status: 'Assessment',
        appliedDate: '2024-03-08',
        aiAssessment: {
          strengths: [
            'Proven track record in B2B sales',
            'Strong leadership capabilities',
            'Experience with similar products'
          ],
          concerns: [
            'Current location different from job location',
            'May need industry-specific training'
          ],
          matchPercentage: 78
        }
      }
    ]
  },
  {
    id: '3',
    name: {
      first: 'Amit',
      last: 'Patel'
    },
    contact: {
      email: 'amit.patel@example.com',
      phone: '+91 9876543212',
      location: 'Gurgaon'
    },
    experience: [
      {
        title: 'Senior Full Stack Developer',
        company: 'TechInnovate',
        duration: {
          start: '2020-07-01',
          end: '2024-02-29'
        },
        responsibilities: [
          'Led development of microservices architecture',
          'Implemented CI/CD pipelines reducing deployment time by 60%',
          'Mentored junior developers and conducted code reviews',
          'Optimized database queries improving performance by 40%'
        ]
      },
      {
        title: 'Full Stack Developer',
        company: 'CodeCraft',
        duration: {
          start: '2018-06-01',
          end: '2020-06-30'
        },
        responsibilities: [
          'Developed and maintained web applications',
          'Implemented RESTful APIs',
          'Worked with agile development methodologies'
        ]
      }
    ],
    education: [
      {
        degree: 'Bachelor of Technology',
        institution: 'Indian Institute of Technology',
        year: 2018
      }
    ],
    skills: [
      { name: 'React', proficiency: 5 },
      { name: 'Node.js', proficiency: 5 },
      { name: 'MongoDB', proficiency: 4 },
      { name: 'AWS', proficiency: 4 },
      { name: 'TypeScript', proficiency: 5 }
    ],
    applications: [
      {
        jobId: '3',
        status: 'Offer',
        appliedDate: '2024-03-12',
        aiAssessment: {
          strengths: [
            'Perfect tech stack match',
            'Strong system design experience',
            'Leadership and mentoring experience'
          ],
          concerns: [
            'Multiple ongoing projects at current company',
            'Notice period length'
          ],
          matchPercentage: 92
        }
      }
    ]
  },
  {
    id: '4',
    name: {
      first: 'Priya',
      last: 'Gupta'
    },
    contact: {
      email: 'priya.gupta@example.com',
      phone: '+91 9876543213',
      location: 'Remote'
    },
    experience: [
      {
        title: 'AI Research Intern',
        company: 'AI Labs',
        duration: {
          start: '2023-01-01',
          end: '2023-12-31'
        },
        responsibilities: [
          'Developed ML models for automation tasks',
          'Conducted data analysis and preprocessing',
          'Created documentation for ML pipelines',
          'Participated in research paper publications'
        ]
      }
    ],
    education: [
      {
        degree: 'Master of Science in AI',
        institution: 'Indian Institute of Science',
        year: 2023
      }
    ],
    skills: [
      { name: 'Python', proficiency: 5 },
      { name: 'Machine Learning', proficiency: 4 },
      { name: 'Data Analysis', proficiency: 4 },
      { name: 'TensorFlow', proficiency: 4 },
      { name: 'Statistics', proficiency: 5 }
    ],
    applications: [
      {
        jobId: '4',
        status: 'Screening',
        appliedDate: '2024-03-18',
        aiAssessment: {
          strengths: [
            'Strong academic background in AI',
            'Relevant internship experience',
            'Published research work'
          ],
          concerns: [
            'Limited industry experience',
            'May need mentoring support'
          ],
          matchPercentage: 75
        }
      }
    ]
  }
]; 