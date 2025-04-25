import { Candidate, RecruitmentStage } from '@/types';

const divyaKrishnan: Candidate = {
  id: '6',
  name: 'Divya Krishnan',
  email: 'divya.krishnan@gmail.com',
  phone: '+91-32190-89005',
  currentTitle: 'React Developer',
  currentCompany: 'AppFront Technologies',
  location: 'Hyderabad, Telangana',
  experience: 5,
  skills: [
    { name: 'React', proficiency: 5 },
    { name: 'TypeScript', proficiency: 4 },
    { name: 'JavaScript', proficiency: 5 },
    { name: 'HTML/CSS', proficiency: 5 },
    { name: 'Redux', proficiency: 4 },
    { name: 'Next.js', proficiency: 4 }
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science',
      institution: 'NIT Warangal',
      year: 2019
    }
  ],
  resume: 'https://example.com/divya-krishnan-resume',
  source: 'LinkedIn',
  appliedDate: '2025-03-08',
  stage: RecruitmentStage.INTERVIEWED,
  jobId: '1',
  notes: 'Strong frontend development background with excellent React expertise.',
  assessment: {
    score: 89,
    feedback: 'Excellent code quality and test coverage practices',
    completed: true
  },
  interview: {
    id: 4,
    candidate: {
      name: 'Divya Krishnan',
      position: 'Senior Frontend Developer'
    },
    date: '2025-03-20',
    time: '2:30 PM',
    type: 'Technical',
    status: 'Completed',
    interviewers: ['Rajesh Kumar', 'Sneha Reddy'],
    location: 'Virtual/Zoom',
    transcript: [
      {
        timestamp: '2:30 PM',
        speaker: 'Interviewer',
        content: 'Could you explain your experience with React performance optimization?'
      },
      {
        timestamp: '2:33 PM',
        speaker: 'Candidate',
        content: 'In my current role at AppFront, I have implemented several performance optimizations including code splitting, lazy loading, and memoization. For example, we had a complex dashboard that was causing performance issues. I implemented React.memo for expensive components, used useMemo for complex calculations, and set up dynamic imports for different dashboard sections. This reduced the initial load time by 40% and improved overall performance significantly.'
      },
      {
        timestamp: '2:38 PM',
        speaker: 'Interviewer',
        content: 'How do you handle state management in large React applications?'
      },
      {
        timestamp: '2:40 PM',
        speaker: 'Candidate',
        content: 'I follow a hybrid approach to state management. For local component state, I use useState and useReducer hooks. For global application state, I primarily use Redux with Redux Toolkit to reduce boilerplate. I also implement context API for sharing theme, authentication, and other cross-cutting concerns. This approach helps maintain a clear separation of concerns and makes the application more maintainable.'
      }
    ],
    aiAssessment: {
      overallScore: 92,
      categoryScores: {
        technical: 94,
        communication: 90,
        problemSolving: 92,
        culturalFit: 88
      },
      strengths: [
        'Deep understanding of React ecosystem',
        'Strong focus on performance optimization',
        'Excellent problem-solving skills',
        'Clear technical communication'
      ],
      areasForImprovement: [
        'Could expand knowledge of backend integration patterns',
        'More experience with micro-frontend architectures needed'
      ],
      recommendations: [
        'Strong candidate for senior frontend role',
        'Consider for technical leadership track'
      ]
    },
    humanFeedback: {
      score: 4.7,
      notes: 'Excellent technical skills and great cultural fit. Shows strong potential for technical leadership.',
      nextSteps: 'Schedule system design round',
      decision: 'Further Evaluation'
    }
  },
  lastUpdated: '2025-03-20'
};

export const candidates: Candidate[] = [
  divyaKrishnan,
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+91 9876543210',
    currentTitle: 'Senior UI/UX Designer',
    currentCompany: 'TechSolutions Inc.',
    location: 'Bangalore',
    experience: 6,
    skills: [
      { name: 'Figma', proficiency: 5 },
      { name: 'Adobe XD', proficiency: 4 },
      { name: 'User Research', proficiency: 4 },
      { name: 'Prototyping', proficiency: 5 },
      { name: 'Design Systems', proficiency: 4 }
    ],
    education: [
      {
        degree: 'Bachelor of Design',
        institution: 'National Institute of Design',
        year: 2018
      }
    ],
    resume: 'https://example.com/sarah-johnson-resume',
    source: 'LinkedIn',
    appliedDate: '2025-03-05',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '1',
    notes: 'Strong portfolio and system design experience. Technical interview completed with positive feedback.',
    assessment: {
      score: 85,
      feedback: 'Excellent design thinking and problem-solving skills. Strong communication.',
      completed: true
    },
    interview: {
      id: 1,
      candidate: {
        name: 'Sarah Johnson',
        position: 'Senior UI/UX Designer'
      },
      date: '2025-03-15',
      time: '10:00 AM',
      type: 'Technical',
      status: 'Completed',
      interviewers: ['Rajesh Kumar', 'Priya Singh'],
      location: 'Virtual/Zoom',
      transcript: [
        {
          timestamp: '10:00 AM',
          speaker: 'Interviewer',
          content: 'Can you walk us through your experience with design systems?'
        },
        {
          timestamp: '10:02 AM',
          speaker: 'Candidate',
          content: 'I have led the development and implementation of design systems at TechSolutions. Our team created a comprehensive component library that improved design consistency and development speed by 60%. We implemented atomic design principles and established clear documentation standards.'
        },
        {
          timestamp: '10:05 AM',
          speaker: 'Interviewer',
          content: 'How do you approach user research and testing in your design process?'
        },
        {
          timestamp: '10:07 AM',
          speaker: 'Candidate',
          content: 'I follow a user-centered design approach. We start with user interviews and surveys to understand pain points, create prototypes, and conduct usability testing with real users. This iterative process helps us validate design decisions and improve the user experience based on actual feedback.'
        }
      ],
      aiAssessment: {
        overallScore: 88,
        categoryScores: {
          technical: 90,
          communication: 85,
          problemSolving: 88,
          culturalFit: 89
        },
        strengths: [
          'Strong design system knowledge',
          'Excellent problem-solving approach',
          'Clear communication'
        ],
        areasForImprovement: [
          'Could improve on technical architecture knowledge'
        ],
        recommendations: [
          'Proceed with offer stage',
          'Consider for senior design role'
        ]
      },
      humanFeedback: {
        score: 4.5,
        notes: 'Strong candidate with excellent design skills',
        nextSteps: 'Proceed with offer discussion',
        decision: 'Hire'
      }
    },
    lastUpdated: '2025-03-15'
  },
  {
    id: '2',
    name: 'Raj Sharma',
    email: 'raj.sharma@example.com',
    phone: '+91 9876543211',
    currentTitle: 'Sales Manager',
    currentCompany: 'GlobalTech Solutions',
    location: 'Mumbai',
    experience: 5,
    skills: [
      { name: 'Sales Strategy', proficiency: 5 },
      { name: 'CRM', proficiency: 4 },
      { name: 'Negotiation', proficiency: 5 },
      { name: 'Lead Generation', proficiency: 4 },
      { name: 'Client Relationship', proficiency: 5 }
    ],
    education: [
      {
        degree: 'MBA in Marketing',
        institution: 'Indian Institute of Management',
        year: 2019
      }
    ],
    resume: 'https://example.com/raj-sharma-resume',
    source: 'Internal Referral',
    appliedDate: '2025-03-08',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '2',
    notes: 'Strong sales background with excellent track record. Shortlisted for interview round.',
    assessment: {
      score: 78,
      feedback: 'Good domain knowledge and leadership experience',
      completed: true
    },
    lastUpdated: '2025-03-12'
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit.patel@example.com',
    phone: '+91 9876543212',
    currentTitle: 'Senior Full Stack Developer',
    currentCompany: 'TechInnovate',
    location: 'Gurgaon',
    experience: 6,
    skills: [
      { name: 'React', proficiency: 5 },
      { name: 'Node.js', proficiency: 5 },
      { name: 'MongoDB', proficiency: 4 },
      { name: 'AWS', proficiency: 4 },
      { name: 'TypeScript', proficiency: 5 }
    ],
    education: [
      {
        degree: 'Bachelor of Technology',
        institution: 'Indian Institute of Technology',
        year: 2018
      }
    ],
    resume: 'https://example.com/amit-patel-resume',
    source: 'Naukri.com',
    appliedDate: '2025-03-12',
    stage: RecruitmentStage.OFFER_EXTENDED,
    jobId: '3',
    notes: 'Strong technical skills and system design expertise. Offer letter sent.',
    assessment: {
      score: 92,
      feedback: 'Excellent technical skills and system design knowledge',
      completed: true
    },
    interview: {
      id: 2,
      candidate: {
        name: 'Amit Patel',
        position: 'Senior Full Stack Developer'
      },
      date: '2025-03-18',
      time: '2:00 PM',
      type: 'Technical',
      status: 'Completed',
      interviewers: ['Ankit Verma', 'Sneha Reddy'],
      location: 'Virtual/Teams',
      transcript: [
        {
          timestamp: '2:00 PM',
          speaker: 'Interviewer',
          content: 'Could you explain your experience with microservices architecture?'
        },
        {
          timestamp: '2:03 PM',
          speaker: 'Candidate',
          content: 'At TechInnovate, I led the transition from a monolithic to microservices architecture. We broke down our application into smaller, independent services that communicate through well-defined APIs. This improved our deployment flexibility and allowed teams to work independently on different services.'
        },
        {
          timestamp: '2:06 PM',
          speaker: 'Interviewer',
          content: 'How do you handle data consistency across microservices?'
        },
        {
          timestamp: '2:09 PM',
          speaker: 'Candidate',
          content: 'We implement eventual consistency using event-driven architecture. Each service maintains its own database, and we use message queues for asynchronous communication. This ensures data consistency while maintaining service independence.'
        }
      ],
      aiAssessment: {
        overallScore: 92,
        categoryScores: {
          technical: 95,
          communication: 88,
          problemSolving: 92,
          culturalFit: 90
        },
        strengths: [
          'Excellent technical knowledge',
          'Strong system design skills',
          'Good problem-solving approach'
        ],
        areasForImprovement: [
          'Can improve on documentation practices'
        ],
        recommendations: [
          'Highly recommended for senior role',
          'Proceed with offer'
        ]
      },
      humanFeedback: {
        score: 4.8,
        notes: 'Outstanding technical skills and great cultural fit',
        nextSteps: 'Extend offer',
        decision: 'Hire'
      }
    },
    lastUpdated: '2025-03-20'
  },
  {
    id: '4',
    name: 'Priya Gupta',
    email: 'priya.gupta@example.com',
    phone: '+91 9876543213',
    currentTitle: 'AI Research Intern',
    currentCompany: 'AI Labs',
    location: 'Remote',
    experience: 1,
    skills: [
      { name: 'Python', proficiency: 4 },
      { name: 'Machine Learning', proficiency: 4 },
      { name: 'Data Analysis', proficiency: 3 },
      { name: 'TensorFlow', proficiency: 4 }
    ],
    education: [
      {
        degree: 'M.Tech in AI',
        institution: 'IIT Delhi',
        year: 2023
      }
    ],
    resume: 'https://example.com/priya-gupta-resume',
    source: 'University Placement',
    appliedDate: '2025-03-01',
    stage: RecruitmentStage.REJECTED,
    jobId: '4',
    notes: 'Good technical skills but insufficient experience for senior role',
    assessment: {
      score: 72,
      feedback: 'Good theoretical knowledge but lacks practical experience',
      completed: true
    },
    lastUpdated: '2025-03-10'
  },
  {
    id: '5',
    name: 'Vikram Malhotra',
    email: 'vikram.m@example.com',
    phone: '+91 9876543214',
    currentTitle: 'Product Manager',
    currentCompany: 'TechCorp',
    location: 'Bangalore',
    experience: 8,
    skills: [
      { name: 'Product Strategy', proficiency: 5 },
      { name: 'Agile', proficiency: 5 },
      { name: 'Data Analysis', proficiency: 4 },
      { name: 'User Research', proficiency: 5 }
    ],
    education: [
      {
        degree: 'MBA',
        institution: 'IIM Bangalore',
        year: 2016
      }
    ],
    resume: 'https://example.com/vikram-resume',
    source: 'LinkedIn',
    appliedDate: '2025-02-28',
    stage: RecruitmentStage.OFFER_REJECTED,
    jobId: '5',
    notes: 'Excellent candidate but declined offer due to compensation mismatch',
    assessment: {
      score: 88,
      feedback: 'Strong product sense and leadership qualities',
      completed: true
    },
    interview: {
      id: 3,
      candidate: {
        name: 'Vikram Malhotra',
        position: 'Product Manager'
      },
      date: '2025-03-10',
      time: '11:00 AM',
      type: 'Technical',
      status: 'Completed',
      interviewers: ['Deepa Krishnan', 'Rahul Sharma'],
      location: 'Virtual/Zoom',
      transcript: [
        {
          timestamp: '11:00 AM',
          speaker: 'Interviewer',
          content: 'Tell us about a challenging product decision you had to make.'
        },
        {
          timestamp: '11:03 AM',
          speaker: 'Candidate',
          content: 'At TechCorp, we faced a critical decision regarding our product roadmap. We had competing priorities between launching new features and improving platform stability. I conducted extensive user research, analyzed metrics, and collaborated with stakeholders to prioritize platform stability first. This decision led to a 40% reduction in customer complaints and improved user retention.'
        },
        {
          timestamp: '11:06 AM',
          speaker: 'Interviewer',
          content: 'How do you prioritize features in your product backlog?'
        },
        {
          timestamp: '11:09 AM',
          speaker: 'Candidate',
          content: 'I use a combination of quantitative and qualitative data. We score features based on business value, user impact, and implementation effort. I also consider user feedback, market trends, and strategic alignment. This helps us make data-driven decisions while keeping user needs at the forefront.'
        }
      ],
      aiAssessment: {
        overallScore: 89,
        categoryScores: {
          technical: 85,
          communication: 92,
          problemSolving: 88,
          culturalFit: 90
        },
        strengths: [
          'Strong product vision',
          'Excellent stakeholder management',
          'Good analytical skills'
        ],
        areasForImprovement: [
          'Technical depth in certain areas'
        ],
        recommendations: [
          'Suitable for senior product role',
          'Proceed with offer'
        ]
      },
      humanFeedback: {
        score: 4.6,
        notes: 'Strong candidate with great leadership potential',
        nextSteps: 'Extend offer',
        decision: 'Hire'
      }
    },
    lastUpdated: '2025-03-20'
  }
];

export { divyaKrishnan }; 