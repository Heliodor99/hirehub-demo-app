import { Job, Candidate, RecruitmentStage, Interview } from '@/types';
import { generateCommunicationTimeline } from '@/utils/communication';

export const jobs: Job[] = [
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
    recruiter: "Hirehub",
    pipeline: {
      stages: [
        RecruitmentStage.OUTREACHED,
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
  },
  {
    id: '3',
    title: 'Data Scientist',
    company: 'DataInsights India',
    location: 'Hyderabad, Telangana',
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
      min: 1900000,
      max: 2700000,
      currency: 'INR'
    },
    postedDate: '2024-03-10',
    status: 'Active',
    hiringManager: 'Aditya Verma',
    recruiter: "Hirehub",
    pipeline: {
      stages: [
        RecruitmentStage.OUTREACHED,
        RecruitmentStage.APPLIED,
        RecruitmentStage.SHORTLISTED,
        RecruitmentStage.INTERVIEWED,
        RecruitmentStage.OFFER_EXTENDED,
        RecruitmentStage.HIRED,
        RecruitmentStage.REJECTED,
        RecruitmentStage.OFFER_REJECTED
      ]
    },
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'TensorFlow'],
    benefits: [
      'Health and dental insurance',
      'Flexible work arrangements',
      'Conference attendance',
      'Research budget'
    ]
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'CloudSystems India',
    location: 'Pune, Maharashtra',
    department: 'Operations',
    description: 'Seeking an experienced DevOps Engineer to help us scale our infrastructure and improve deployment processes...',
    requirements: [
      '3+ years of experience in DevOps or related field',
      'Strong knowledge of AWS, Docker, and Kubernetes',
      'Experience with CI/CD pipelines',
      'Proficiency in scripting languages like Python or Bash'
    ],
    responsibilities: [
      'Design and implement cloud infrastructure',
      'Automate deployment processes',
      'Monitor system performance and reliability',
      'Collaborate with development teams on infrastructure needs'
    ],
    salary: {
      min: 1700000,
      max: 2600000,
      currency: 'INR'
    },
    postedDate: '2024-03-15',
    status: 'Active',
    hiringManager: 'Sameer Joshi',
    recruiter: "Hirehub",
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
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Python', 'Terraform', 'Linux'],
    benefits: [
      'Comprehensive health benefits',
      'Remote work options',
      'Professional development allowance',
      'Generous paid time off'
    ]
  }
];

export const generateInterviewTranscript = (jobTitle: string, skills: string[]) => {
  const technicalQuestions = [
    { q: "Can you describe your experience with our required technologies?", context: "technical" },
    { q: "Tell me about a challenging project you worked on recently.", context: "technical" },
    { q: "How do you approach problem-solving in your work?", context: "technical" },
    { q: "What's your experience with agile development?", context: "process" },
    { q: "How do you handle technical disagreements in a team?", context: "collaboration" }
  ];

  const behavioralQuestions = [
    { q: "How do you handle tight deadlines?", context: "stress" },
    { q: "Tell me about a time you had to learn a new technology quickly.", context: "learning" },
    { q: "How do you prioritize your work?", context: "organization" },
    { q: "Describe a situation where you had to work with a difficult team member.", context: "collaboration" },
    { q: "What's your approach to giving and receiving feedback?", context: "communication" }
  ];

  const transcript = [];
  const startTime = new Date();
  startTime.setHours(10, 0, 0);

  // Introduction
  transcript.push({
    timestamp: formatTime(startTime),
    speaker: "Interviewer" as const,
    content: `Hello! Thank you for joining us today. We're excited to discuss the ${jobTitle} position with you.`
  });

  transcript.push({
    timestamp: formatTime(addMinutes(startTime, 1)),
    speaker: "Candidate" as const,
    content: "Thank you for having me. I'm very excited about this opportunity."
  });

  // Technical questions
  for (const question of technicalQuestions) {
    startTime.setMinutes(startTime.getMinutes() + 5);
    transcript.push({
      timestamp: formatTime(startTime),
      speaker: "Interviewer" as const,
      content: question.q
    });

    // Generate detailed response based on context
    startTime.setMinutes(startTime.getMinutes() + 2);
    transcript.push({
      timestamp: formatTime(startTime),
      speaker: "Candidate" as const,
      content: generateDetailedResponse(question.context, skills)
    });

    // Follow-up question
    startTime.setMinutes(startTime.getMinutes() + 3);
    transcript.push({
      timestamp: formatTime(startTime),
      speaker: "Interviewer" as const,
      content: generateFollowUpQuestion(question.context)
    });

    // Follow-up response
    startTime.setMinutes(startTime.getMinutes() + 2);
    transcript.push({
      timestamp: formatTime(startTime),
      speaker: "Candidate" as const,
      content: generateFollowUpResponse(question.context, skills)
    });
  }

  // Behavioral questions
  for (const question of behavioralQuestions) {
    startTime.setMinutes(startTime.getMinutes() + 5);
    transcript.push({
      timestamp: formatTime(startTime),
      speaker: "Interviewer" as const,
      content: question.q
    });

    startTime.setMinutes(startTime.getMinutes() + 3);
    transcript.push({
      timestamp: formatTime(startTime),
      speaker: "Candidate" as const,
      content: generateBehavioralResponse(question.context)
    });
  }

  // Closing
  startTime.setMinutes(startTime.getMinutes() + 5);
  transcript.push({
    timestamp: formatTime(startTime),
    speaker: "Interviewer" as const,
    content: "Thank you for your time today. Do you have any questions for us?"
  });

  startTime.setMinutes(startTime.getMinutes() + 2);
  transcript.push({
    timestamp: formatTime(startTime),
    speaker: "Candidate" as const,
    content: "Yes, I'd like to know more about the team structure and development processes. Also, what are the next steps in the interview process?"
  });

  startTime.setMinutes(startTime.getMinutes() + 3);
  transcript.push({
    timestamp: formatTime(startTime),
    speaker: "Interviewer" as const,
    content: "Great questions! Let me address those..."
  });

  return transcript;
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
};

const addMinutes = (date: Date, minutes: number) => {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
};

const generateDetailedResponse = (context: string, skills: string[]) => {
  const responses = {
    technical: `In my current role, I've extensively used ${skills.slice(0, 3).join(', ')}. For example, I recently built a scalable application that processed large amounts of data using ${skills[0]}. We implemented efficient algorithms and optimized the performance using ${skills[1]}.`,
    process: "In my experience with agile development, I've worked in two-week sprints, participated in daily stand-ups, and regularly contributed to sprint planning and retrospectives. This has helped us maintain a steady velocity and continuously improve our processes.",
    collaboration: "I believe in open communication and collaborative problem-solving. In my current team, we use code reviews and pair programming to share knowledge and maintain code quality. This has significantly reduced bugs in production and improved team knowledge sharing.",
  };
  return responses[context as keyof typeof responses] || responses.technical;
};

const generateFollowUpQuestion = (context: string) => {
  const questions = {
    technical: "Can you elaborate on how you handled scalability challenges in that project?",
    process: "How do you handle situations where the sprint commitments are at risk?",
    collaboration: "What strategies do you use to ensure effective code reviews?",
  };
  return questions[context as keyof typeof questions] || questions.technical;
};

const generateFollowUpResponse = (context: string, skills: string[]) => {
  const responses = {
    technical: `To address scalability, we implemented caching using ${skills[2]} and optimized our database queries. This resulted in a 40% improvement in response times.`,
    process: "When sprint commitments are at risk, I immediately communicate with the team and stakeholders. We then prioritize critical features and, if necessary, move less critical items to the next sprint.",
    collaboration: "For code reviews, I follow a checklist that covers code quality, performance, security, and test coverage. I also make sure to provide constructive feedback and explain my reasoning clearly.",
  };
  return responses[context as keyof typeof responses] || responses.technical;
};

const generateBehavioralResponse = (context: string) => {
  const responses = {
    stress: "I maintain a prioritized task list and communicate early with stakeholders when deadlines might be affected. Recently, we had a critical release with a tight deadline. I broke down the work into smaller tasks, delegated effectively, and we delivered on time without compromising quality.",
    learning: "When we adopted a new framework, I dedicated extra hours to learning through documentation and online courses. I also created a knowledge-sharing session for the team, which helped everyone get up to speed quickly.",
    organization: "I use a combination of tools like JIRA and personal task lists. I prioritize based on business impact and dependencies, and I regularly review and adjust priorities with my team lead.",
    collaboration: "I once worked with a team member who had a very different coding style. Instead of creating conflict, I initiated a discussion about establishing team-wide coding standards. This led to better collaboration and more consistent code.",
    communication: "I believe in regular, constructive feedback. I always start with positive observations, then discuss areas for improvement with specific examples. I also actively seek feedback for my own work and use it to improve.",
  };
  return responses[context as keyof typeof responses] || responses.stress;
};

const generateAIAssessment = (transcript: Interview['transcript'], jobSkills: string[]) => {
  // Analyze the transcript and generate scores
  const technicalScore = Math.floor(Math.random() * 20 + 80); // 80-100
  const communicationScore = Math.floor(Math.random() * 20 + 80);
  const problemSolvingScore = Math.floor(Math.random() * 20 + 80);
  const culturalFitScore = Math.floor(Math.random() * 20 + 80);

  return {
    overallScore: Math.floor((technicalScore + communicationScore + problemSolvingScore + culturalFitScore) / 4),
    categoryScores: {
      technical: technicalScore,
      communication: communicationScore,
      problemSolving: problemSolvingScore,
      culturalFit: culturalFitScore,
    },
    strengths: [
      `Strong technical knowledge in ${jobSkills.slice(0, 2).join(' and ')}`,
      'Clear and articulate communication',
      'Structured problem-solving approach',
      'Good cultural alignment',
    ],
    areasForImprovement: [
      'Could provide more specific examples in some responses',
      'Consider discussing more about testing methodologies',
      'Could elaborate more on system design considerations',
    ],
    recommendations: [
      'Candidate shows strong potential for the role',
      'Technical skills align well with requirements',
      'Would work well in a collaborative team environment',
    ],
  };
};

const generateInterviewData = (candidate: Candidate, job: Job): Interview | undefined => {
  if (candidate.stage !== RecruitmentStage.INTERVIEWED && 
      candidate.stage !== RecruitmentStage.OFFER_EXTENDED && 
      candidate.stage !== RecruitmentStage.HIRED) {
    return undefined;
  }

  const jobSkills = job.skills || [];
  if (jobSkills.length === 0) {
    jobSkills.push('general software development');
  }

  const transcript = generateInterviewTranscript(job.title, jobSkills);
  const aiAssessment = generateAIAssessment(transcript, jobSkills);

  return {
    id: parseInt(candidate.id),
    candidateId: candidate.id,
    jobId: job.id,
    date: new Date(new Date(candidate.appliedDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00 AM',
    type: 'Technical',
    status: 'Completed',
    interviewers: [job.hiringManager, job.recruiter].filter(Boolean),
    location: 'Virtual/Zoom',
    transcript,
    aiAssessment,
    humanFeedback: {
      score: Math.min(100, Math.max(0, aiAssessment.overallScore + Math.floor(Math.random() * 10 - 5))),
      notes: `${candidate.name} demonstrated strong technical skills and good problem-solving abilities.${jobSkills.length > 0 ? ` Their experience with ${jobSkills.slice(0, 2).join(' and ')} was particularly impressive.` : ''}`,
      nextSteps: candidate.stage === RecruitmentStage.INTERVIEWED ? 'Schedule follow-up interview' : 'Proceed with offer discussion',
      decision: candidate.stage === RecruitmentStage.INTERVIEWED ? 'Further Evaluation' : 'Hire'
    }
  };
};

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
        institution: 'Indian Institute of Technology, Bombay',
        year: 2018
      }
    ],
    resume: 'https://drive.google.com/file/d/1eXaMpL3/view',
    source: 'LinkedIn',
    appliedDate: '2024-01-15',
    stage: RecruitmentStage.OUTREACHED,
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
    name: 'Meera Sharma',
    email: 'meera.sharma@outlook.com',
    phone: '8765432109',
    currentTitle: 'Product Manager',
    currentCompany: 'InnovateHub',
    location: 'Mumbai, Maharashtra',
    experience: 4,
    skills: ['Product Management', 'Agile', 'JIRA', 'User Research'],
    education: [
      {
        degree: 'MBA',
        institution: 'Indian Institute of Management, Ahmedabad',
        year: 2020
      }
    ],
    resume: 'https://www.dropbox.com/s/aj8f7gh5k/MeeraSharmaResume.pdf',
    source: 'Company Website',
    appliedDate: '2023-11-22',
    stage: RecruitmentStage.OUTREACHED,
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
    name: 'Vikram Reddy',
    email: 'vreddy2019@yahoo.com',
    phone: '+91 7654321098',
    currentTitle: 'Data Scientist',
    currentCompany: 'AnalyticsEdge',
    location: 'Hyderabad, Telangana',
    experience: 4.7,
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL'],
    education: [
      {
        degree: 'M.Tech in Artificial Intelligence',
        institution: 'Indian Institute of Science, Bangalore',
        year: 2019
      }
    ],
    resume: 'https://vikramr.com/data/resume-2024.pdf',
    source: 'Referral',
    appliedDate: '2023-11-11',
    stage: RecruitmentStage.OUTREACHED,
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
    name: 'Neha Gupta',
    email: 'neha.gupta@outlook.com',
    phone: '+91-65432-10987',
    currentTitle: 'Frontend Developer',
    currentCompany: 'WebInnovators',
    location: 'Bangalore, Karnataka',
    experience: 4,
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Vue.js'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'National Institute of Technology, Trichy',
        year: 2020
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/neha-gupta.pdf',
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
    name: 'Rahul Khanna',
    email: 'rahul.khanna@gmail.com',
    phone: '+91-54321-09876',
    currentTitle: 'Senior Product Manager',
    currentCompany: 'ProductGenius',
    location: 'Mumbai, Maharashtra',
    experience: 6,
    skills: ['Product Management', 'Agile', 'JIRA', 'User Research', 'Data Analysis'],
    education: [
      {
        degree: 'B.Tech in Electronics Engineering',
        institution: 'Delhi Technological University',
        year: 2018
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/rahul-khanna.pdf',
    source: 'Company Website',
    appliedDate: '2024-03-07',
    stage: RecruitmentStage.OUTREACHED,
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
    name: 'Anjali Singh',
    email: 'dr.anjali.singh@outlook.com',
    phone: '8143210987',
    currentTitle: 'Data Science Lead',
    currentCompany: 'DataTech Solutions',
    location: 'Hyderabad, Telangana',
    experience: 7,
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'TensorFlow', 'PyTorch'],
    education: [
      {
        degree: 'PhD in Computer Science',
        institution: 'Indian Institute of Technology, Delhi',
        year: 2017
      }
    ],
    resume: 'N/A - See LinkedIn profile',
    source: 'LinkedIn',
    appliedDate: '2024-02-12',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '3',
    notes: 'Exceptional research background. Previously taught at IIIT-H for 2 years.',
    assessment: {
      score: 95,
      feedback: 'Outstanding technical expertise',
      completed: true
    }
  },
  {
    id: '7',
    name: 'Rohan Desai',
    email: 'rohan.desai@gmail.com',
    phone: '9832109876',
    currentTitle: 'DevOps Engineer',
    currentCompany: 'Infracloudtech',
    location: 'Pune, Maharashtra',
    experience: 5,
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Python', 'Terraform'],
    education: [
      {
        degree: 'B.Tech in Computer Engineering',
        institution: 'College of Engineering, Pune',
        year: 2019
      }
    ],
    resume: 'https://bit.ly/rohan-desai-resume',
    source: 'LinkedIn',
    appliedDate: '2024-02-03',
    stage: RecruitmentStage.APPLIED,
    jobId: '4',
    notes: 'Good background in cloud technologies',
    assessment: {
      score: 82,
      feedback: 'Strong technical skills in AWS and containerization',
      completed: true
    }
  },
  {
    id: '8',
    name: 'Priya Mehta',
    email: 'priya.mehta@outlook.com',
    phone: '+91-21098-76543',
    currentTitle: 'Senior React Developer',
    currentCompany: 'CodeCraft India',
    location: 'Gurgaon, Haryana',
    experience: 7,
    skills: ['React', 'TypeScript', 'JavaScript', 'Redux', 'Next.js', 'CSS'],
    education: [
      {
        degree: 'M.Tech in Software Engineering',
        institution: 'Birla Institute of Technology and Science, Pilani',
        year: 2017
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/priya-mehta.pdf',
    source: 'Referral',
    appliedDate: '2024-03-04',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '1',
    notes: 'Extensive experience with modern React frameworks',
    assessment: {
      score: 91,
      feedback: 'Excellent code quality and architecture design',
      completed: true
    }
  },
  {
    id: '9',
    name: 'Aditya Verma',
    email: 'aditya.verma@gmail.com',
    phone: '+91-10987-65432',
    currentTitle: 'Product Manager',
    currentCompany: 'TechInnovate',
    location: 'Delhi, NCR',
    experience: 5,
    skills: ['Product Management', 'Agile', 'JIRA', 'User Research', 'Analytics'],
    education: [
      {
        degree: 'MBA',
        institution: 'Indian Institute of Management, Bangalore',
        year: 2019
      },
      {
        degree: 'B.Tech in Computer Engineering',
        institution: 'Delhi Technological University',
        year: 2015
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/aditya-verma.pdf',
    source: 'LinkedIn',
    appliedDate: '2024-03-08',
    stage: RecruitmentStage.APPLIED,
    jobId: '2',
    notes: 'Technical background combined with business acumen',
    assessment: {
      score: 88,
      feedback: 'Strong product vision and technical understanding',
      completed: true
    }
  },
  {
    id: '10',
    name: 'Sanya Agarwal',
    email: 'sanya.agarwal@outlook.com',
    phone: '+91-09876-54321',
    currentTitle: 'Data Scientist',
    currentCompany: 'AI Research India',
    location: 'Chennai, Tamil Nadu',
    experience: 4,
    skills: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'Data Analysis', 'SQL'],
    education: [
      {
        degree: 'PhD in Statistics',
        institution: 'Indian Statistical Institute, Kolkata',
        year: 2020
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/sanya-agarwal.pdf',
    source: 'Company Website',
    appliedDate: '2024-03-14',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '3',
    notes: 'Published research in machine learning',
    assessment: {
      score: 89,
      feedback: 'Impressive technical knowledge and research experience',
      completed: true
    }
  },
  {
    id: '11',
    name: 'Karan Malhotra',
    email: 'karan.malhotra@gmail.com',
    phone: '+91-9876512345',
    currentTitle: 'Frontend Engineer',
    currentCompany: 'CodeBridge Technologies',
    location: 'Noida, Uttar Pradesh',
    experience: 5,
    skills: ['React', 'JavaScript', 'TypeScript', 'GraphQL', 'Tailwind CSS'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Vellore Institute of Technology',
        year: 2019
      },
      {
        degree: 'High School',
        institution: 'Delhi Public School, Noida',
        year: 2015
      }
    ],
    resume: 'https://resume.karanmalhotra.com/latest.pdf',
    source: 'Naukri',
    appliedDate: '2024-03-05',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '1',
    notes: 'Great problem-solving skills during technical interview',
    assessment: {
      score: 87,
      feedback: 'Strong frontend fundamentals and modern framework knowledge',
      completed: true
    }
  },
  {
    id: '12',
    name: 'Pooja Iyer',
    email: 'pooja.iyer@outlook.com',
    phone: '+91-87654-23456',
    currentTitle: 'Product Owner',
    currentCompany: 'Agile Solutions India',
    location: 'Bangalore, Karnataka',
    experience: 7,
    skills: ['Product Management', 'Agile', 'Scrum', 'User Stories', 'Roadmapping', 'A/B Testing'],
    education: [
      {
        degree: 'MBA',
        institution: 'Indian School of Business, Hyderabad',
        year: 2017
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/pooja-iyer.pdf',
    source: 'Referral',
    appliedDate: '2024-03-09',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '2',
    notes: 'Strong experience working with engineering teams',
    assessment: {
      score: 91,
      feedback: 'Excellent product sense and technical communication skills',
      completed: true
    }
  },
  {
    id: '13',
    name: 'Rajat Kapoor',
    email: 'rajat.kapoor@yahoo.co.in',
    phone: '76543-34567',
    currentTitle: 'Machine Learning Engineer',
    currentCompany: 'AI Dynamics India',
    location: 'Pune, Maharashtra',
    experience: 6.5,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Data Analysis', 'NLP', 'Computer Vision'],
    education: [
      {
        degree: 'M.Tech in Artificial Intelligence',
        institution: 'Indian Institute of Technology, Madras',
        year: 2018
      },
      {
        degree: 'B.Tech in Electronics',
        institution: 'Visvesvaraya National Institute of Technology, Nagpur',
        year: 2015
      }
    ],
    resume: 'https://rkapoor-portfolio.netlify.app/resume.pdf',
    source: 'LinkedIn',
    appliedDate: '2024-01-13',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '3',
    notes: 'Impressive project portfolio in NLP',
    assessment: {
      score: 100,
      feedback: 'Exceptional technical knowledge and excellent communication skills',
      completed: true
    }
  },
  {
    id: '14',
    name: 'Deepika Joshi',
    email: 'deepika.joshi@outlook.com',
    phone: '+91-65432-45678',
    currentTitle: 'Infrastructure Engineer',
    currentCompany: 'CloudOps India',
    location: 'Mumbai, Maharashtra',
    experience: 4,
    skills: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'CI/CD', 'Ansible'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'National Institute of Technology, Surat',
        year: 2020
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/deepika-joshi.pdf',
    source: 'Company Website',
    appliedDate: '2024-03-17',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '4',
    notes: 'Solid experience with container orchestration',
    assessment: {
      score: 84,
      feedback: 'Good technical skills with strong automation experience',
      completed: true
    }
  },
  {
    id: '15',
    name: 'Aryan Sharma',
    email: 'aryan.sharma@gmail.com',
    phone: '+91 5432156789',
    currentTitle: 'UI/UX Developer',
    currentCompany: 'DesignFusion',
    location: 'Delhi, NCR',
    experience: 5.5,
    skills: ['React', 'JavaScript', 'CSS', 'Design Systems', 'Figma', 'Storybook'],
    education: [
      {
        degree: 'Bachelor of Design',
        institution: 'National Institute of Design, Ahmedabad',
        year: 2019
      }
    ],
    resume: 'https://aryansharma.design/cv',
    source: 'Naukri',
    appliedDate: '2023-12-14',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '1',
    notes: 'Strong design background with frontend skills',
    assessment: {
      score: 88,
      feedback: 'Excellent UI implementation skills and attention to detail',
      completed: true
    }
  },
  {
    id: '16',
    name: 'Ishita Patel',
    email: 'ishita.patel@outlook.com',
    phone: '+91-43210-67890',
    currentTitle: 'Product Growth Manager',
    currentCompany: 'GrowthMinds India',
    location: 'Gurgaon, Haryana',
    experience: 6,
    skills: ['Product Management', 'Growth Strategies', 'Analytics', 'A/B Testing', 'User Research'],
    education: [
      {
        degree: 'MBA',
        institution: 'Faculty of Management Studies, Delhi',
        year: 2018
      },
      {
        degree: 'B.Com',
        institution: "St. Xavier's College, Mumbai",
        year: 2014
      }
    ],
    resume: 'https://resumes.hirehub.ai/ishita-resume',
    source: 'LinkedIn',
    appliedDate: '2024-03-10',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '2',
    notes: 'Strong background in product growth and analytics. Looking for next growth opportunity.',
    assessment: {
      score: 90,
      feedback: 'Excellent understanding of product metrics and user acquisition',
      completed: true
    }
  },
  {
    id: '17',
    name: 'Varun Mathur',
    email: 'varun.mathur@gmail.com',
    phone: '+91-32109-78901',
    currentTitle: 'Data Engineer',
    currentCompany: 'DataFlow Systems India',
    location: 'Bangalore, Karnataka',
    experience: 5,
    skills: ['Python', 'Spark', 'SQL', 'ETL', 'AWS', 'Data Modeling'],
    education: [
      {
        degree: 'M.Tech in Data Science',
        institution: 'Indian Institute of Science, Bangalore',
        year: 2019
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/varun-mathur.pdf',
    source: 'Referral',
    appliedDate: '2024-03-15',
    stage: RecruitmentStage.APPLIED,
    jobId: '3',
    notes: 'Extensive experience with data pipelines',
    assessment: {
      score: 86,
      feedback: 'Strong technical skills in data infrastructure',
      completed: true
    }
  },
  {
    id: '18',
    name: 'Arnav Choudhary',
    email: 'arnav.choudhary@outlook.com',
    phone: '+91-21098-89012',
    currentTitle: 'Cloud Solutions Architect',
    currentCompany: 'CloudTech India',
    location: 'Hyderabad, Telangana',
    experience: 8,
    skills: ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes', 'Microservices'],
    education: [
      {
        degree: 'M.Tech in Computer Science',
        institution: 'Indian Institute of Technology, Kharagpur',
        year: 2016
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/arnav-choudhary.pdf',
    source: 'LinkedIn',
    appliedDate: '2024-03-18',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '4',
    notes: 'Impressive cloud architecture experience',
    assessment: {
      score: 94,
      feedback: 'Exceptional multi-cloud knowledge and system design skills',
      completed: true
    }
  },
  {
    id: '19',
    name: 'Tanvi Agarwal',
    email: 'tanvi.agarwal@hotmail.com',
    phone: '9810987901',
    currentTitle: 'Frontend Lead',
    currentCompany: 'Swiggy',
    location: 'Chennai, Tamil Nadu',
    experience: 7,
    skills: ['React', 'TypeScript', 'Next.js', 'Jest', 'CSS-in-JS', 'Performance Optimization'],
    education: [
      {
        degree: 'B.Tech in Software Engineering',
        institution: 'SRM University, Chennai',
        year: 2017
      }
    ],
    resume: 'Will share later',
    source: 'Company Website',
    appliedDate: '2024-02-06',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '1',
    notes: 'Led team of 5 frontend developers at current company',
    assessment: {
      score: 92,
      feedback: 'Strong leadership skills and technical expertise',
      completed: true
    }
  },
  {
    id: '20',
    name: 'Sandeep Kumar',
    email: 'sandeep.kumar@outlook.com',
    phone: '+91-09876-01234',
    currentTitle: 'Technical Product Manager',
    currentCompany: 'TechSoft India',
    location: 'Pune, Maharashtra',
    experience: 5,
    skills: ['Product Management', 'Agile', 'Technical Documentation', 'API Design', 'SQL'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Indian Institute of Information Technology, Allahabad',
        year: 2019
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/sandeep-kumar.pdf',
    source: 'Naukri',
    appliedDate: '2024-03-11',
    stage: RecruitmentStage.APPLIED,
    jobId: '2',
    notes: 'Strong technical background for a product role',
    assessment: {
      score: 86,
      feedback: 'Good balance of technical knowledge and product thinking',
      completed: true
    }
  },
  {
    id: '21',
    name: 'Ananya Chatterjee',
    email: 'ananya.chatterjee@gmail.com',
    phone: '9875612340',
    currentTitle: 'ML Research Scientist',
    currentCompany: 'Ainovas',
    location: 'Bangalore, Karnataka',
    experience: 6,
    skills: ['Python', 'Deep Learning', 'TensorFlow', 'Computer Vision', 'Research', 'Statistics'],
    education: [
      {
        degree: 'PhD in Computer Science',
        institution: 'Indian Institute of Science, Bangalore',
        year: 2018
      }
    ],
    resume: 'https://ananyac.notion.site/resume',
    source: 'LinkedIn',
    appliedDate: '2023-10-16',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '3',
    notes: 'Published papers at top ML conferences',
    assessment: {
      score: 96,
      feedback: 'Outstanding research background and practical implementation skills',
      completed: true
    }
  },
  {
    id: '22',
    name: 'Ravi Shankar',
    email: 'ravi.shankar@outlook.com',
    phone: '+91-87645-23410',
    currentTitle: 'Site Reliability Engineer',
    currentCompany: 'ReliableTech India',
    location: 'Pune, Maharashtra',
    experience: 5,
    skills: ['Linux', 'Docker', 'Kubernetes', 'Prometheus', 'Grafana', 'Bash', 'Python'],
    education: [
      {
        degree: 'B.Tech in Computer Engineering',
        institution: 'Pune Institute of Computer Technology',
        year: 2019
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/ravi-shankar.pdf',
    source: 'Referral',
    appliedDate: '2024-03-19',
    stage: RecruitmentStage.APPLIED,
    jobId: '4',
    notes: 'Strong experience in monitoring and alerting systems',
    assessment: {
      score: 85,
      feedback: 'Good knowledge of observability practices',
      completed: true
    }
  },
  {
    id: '23',
    name: 'Shreya Banerjee',
    email: 'shreya.banerjee@gmail.com',
    phone: '+91-76534-34509',
    currentTitle: 'Frontend Developer',
    currentCompany: 'UserInterface Technologies',
    location: 'Gurgaon, Haryana',
    experience: 3,
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Responsive Design'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Jaypee Institute of Information Technology, Noida',
        year: 2021
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/shreya-banerjee.pdf',
    source: 'Naukri',
    appliedDate: '2024-03-07',
    stage: RecruitmentStage.APPLIED,
    jobId: '1',
    notes: 'Self-taught developer with strong portfolio',
    assessment: {
      score: 79,
      feedback: 'Good practical skills but needs more theoretical foundation',
      completed: true
    }
  },
  {
    id: '24',
    name: 'Karthik Subramanian',
    email: 'karthik.subramanian@outlook.com',
    phone: '+91-65423-45608',
    currentTitle: 'Associate Product Manager',
    currentCompany: 'ProductPath India',
    location: 'Bangalore, Karnataka',
    experience: 2,
    skills: ['Product Management', 'User Stories', 'Product Analytics', 'Wireframing'],
    education: [
      {
        degree: 'MBA',
        institution: 'Indian Institute of Management, Indore',
        year: 2022
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/karthik-subramanian.pdf',
    source: 'Company Website',
    appliedDate: '2024-03-12',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '2',
    notes: 'Promising candidate with fresh perspective',
    assessment: {
      score: 80,
      feedback: 'Shows potential and eagerness to learn',
      completed: true
    }
  },
  {
    id: '25',
    name: 'Jyoti Mishra',
    email: 'jyoti.mishra@gmail.com',
    phone: '05431267807',
    currentTitle: 'Junior Data Scientist',
    currentCompany: 'DataViz India',
    location: 'Chennai, Tamil Nadu',
    experience: 1.8,
    skills: ['Python', 'R', 'SQL', 'Data Visualization', 'Statistical Analysis'],
    education: [
      {
        degree: 'M.Tech in Data Science',
        institution: 'Indian Institute of Technology, Madras',
        year: 2022
      }
    ],
    resume: 'https://jyoti-mishra-portfolio.vercel.app/resume.pdf',
    source: 'LinkedIn',
    appliedDate: '2024-01-17',
    stage: RecruitmentStage.APPLIED,
    jobId: '3',
    notes: 'Strong academic background, limited professional experience',
    assessment: {
      score: 68,
      feedback: 'Good theoretical knowledge, needs more practical experience',
      completed: true
    }
  },
  {
    id: '26',
    name: 'Vivek Nair',
    email: 'vivek.nair@outlook.com',
    phone: '+91-43201-78906',
    currentTitle: 'DevOps Specialist',
    currentCompany: 'CloudScale India',
    location: 'Mumbai, Maharashtra',
    experience: 4,
    skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'Terraform'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'Veermata Jijabai Technological Institute, Mumbai',
        year: 2020
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/vivek-nair.pdf',
    source: 'Naukri',
    appliedDate: '2024-03-20',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '4',
    notes: 'Good experience with CI/CD pipelines',
    assessment: {
      score: 83,
      feedback: 'Solid understanding of containerization and orchestration',
      completed: true
    }
  },
  {
    id: '27',
    name: 'Divya Krishnan',
    email: 'divya.krishnan@gmail.com',
    phone: '+91-32190-89005',
    currentTitle: 'React Developer',
    currentCompany: 'AppFront Technologies',
    location: 'Hyderabad, Telangana',
    experience: 4,
    skills: ['React', 'TypeScript', 'Redux', 'Jest', 'React Testing Library'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'International Institute of Information Technology, Hyderabad',
        year: 2020
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/divya-krishnan.pdf',
    source: 'Referral',
    appliedDate: '2024-03-08',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '1',
    notes: 'Strong focus on testing and quality',
    assessment: {
      score: 89,
      feedback: 'Excellent code quality and test coverage practices',
      completed: true
    }
  },
  {
    id: '28',
    name: 'Nikhil Menon',
    email: 'nm@nmenon.co',
    phone: '21087-90004',
    currentTitle: 'Senior Product Manager',
    currentCompany: 'Flipkart',
    location: 'Delhi, NCR',
    experience: 8.5,
    skills: ['Product Strategy', 'Market Research', 'Competitive Analysis', 'Product Analytics', 'Roadmapping'],
    education: [
      {
        degree: 'MBA',
        institution: 'Indian Institute of Management, Calcutta',
        year: 2016
      }
    ],
    resume: 'http://linkedin.com/in/nikhilmenon',
    source: 'LinkedIn',
    appliedDate: '2024-02-13',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '2',
    notes: 'Extensive experience in B2B products',
    assessment: {
      score: 93,
      feedback: 'Strong strategic thinking and market understanding',
      completed: true
    }
  },
  {
    id: '29',
    name: 'Ritu Agarwal',
    email: 'ritu.agarwal@gmail.com',
    phone: '+91-10978-90103',
    currentTitle: 'AI Research Engineer',
    currentCompany: 'NeuralTech India',
    location: 'Bangalore, Karnataka',
    experience: 5,
    skills: ['Python', 'TensorFlow', 'Machine Learning', 'NLP', 'AWS', 'Research'],
    education: [
      {
        degree: 'M.Tech in Computer Science',
        institution: 'Indian Institute of Technology, Bombay',
        year: 2019
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/ritu-agarwal.pdf',
    source: 'Company Website',
    appliedDate: '2024-03-18',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '3',
    notes: 'Experience with deploying ML models to production',
    assessment: {
      score: 90,
      feedback: 'Excellent balance of research and practical implementation',
      completed: true
    }
  },
  {
    id: '30',
    name: 'Gaurav Saxena',
    email: 'gaurav.saxena@outlook.com',
    phone: '+91-09875-01232',
    currentTitle: 'Platform Engineer',
    currentCompany: 'InfraCloud Technologies',
    location: 'Pune, Maharashtra',
    experience: 6,
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Go', 'Microservices'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Birla Institute of Technology, Mesra',
        year: 2018
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/gaurav-saxena.pdf',
    source: 'LinkedIn',
    appliedDate: '2024-03-21',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '4',
    notes: 'Strong experience building internal developer platforms',
    assessment: {
      score: 88,
      feedback: 'Excellent knowledge of container orchestration and infrastructure as code',
      completed: true
    }
  },
  {
    id: '31',
    name: 'Aditi Kulkarni',
    email: 'aditi.k@gmail.com',
    phone: '9876413201',
    currentTitle: 'Frontend Developer',
    currentCompany: 'MobileFirst Technologies',
    location: 'Nagpur, Maharashtra',
    experience: 4,
    skills: ['React', 'JavaScript', 'TypeScript', 'React Native', 'CSS', 'Redux'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'Visvesvaraya National Institute of Technology, Nagpur',
        year: 2020
      }
    ],
    resume: 'https://aditikulkarni.in/resume',
    source: 'Naukri',
    appliedDate: '2024-02-19',
    stage: RecruitmentStage.APPLIED,
    jobId: '1',
    notes: 'Experience with mobile web development',
    assessment: {
      score: 71,
      feedback: 'Good technical skills, particularly in responsive design. Has potential but needs mentoring.',
      completed: true
    }
  },
  {
    id: '32',
    name: 'Nisha Thakur',
    email: 'nisha.thakur@outlook.com',
    phone: '+91-87645-13420',
    currentTitle: 'Product Marketing Manager',
    currentCompany: 'GrowthWorks India',
    location: 'Bangalore, Karnataka',
    experience: 6,
    skills: ['Product Strategy', 'Market Analysis', 'Product Marketing', 'User Interviews', 'Product Roadmapping'],
    education: [
      {
        degree: 'MBA',
        institution: 'Indian Institute of Management, Bangalore',
        year: 2018
      },
      {
        degree: 'B.Com',
        institution: 'Christ University, Bangalore',
        year: 2015
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/nisha-thakur.pdf',
    source: 'LinkedIn',
    appliedDate: '2024-03-14',
    stage: RecruitmentStage.APPLIED,
    jobId: '2',
    notes: 'Strong background in product marketing',
    assessment: {
      score: 87,
      feedback: 'Good understanding of product-market fit and GTM strategies',
      completed: true
    }
  },
  {
    id: '33',
    name: 'Ashwin Raghavan',
    email: 'ashwin@gmail.com',
    phone: '7600534319',
    currentTitle: 'Data Science Engineer',
    currentCompany: 'PredictTech Solutions',
    location: 'Remote (based in Madurai, TN)',
    experience: 5,
    skills: ['Python', 'Machine Learning', 'Data Engineering', 'Spark', 'SQL', 'MLOps'],
    education: [
      {
        degree: 'M.Tech in Computer Science',
        institution: 'Indian Institute of Technology, Madras',
        year: 2019
      }
    ],
    resume: 'https://linktr.ee/ashwin_raghavan',
    source: 'Company Website',
    appliedDate: '2023-12-19',
    stage: RecruitmentStage.APPLIED,
    jobId: '3',
    notes: 'Experience with ML model deployment. Prefers remote work arrangement.',
    assessment: {
      score: 86,
      feedback: 'Strong technical skills in ML engineering and data pipelines',
      completed: true
    }
  },
  {
    id: '34',
    name: 'Kavita Sharma',
    email: 'kavita.sharma@outlook.com',
    phone: '+91-65423-13518',
    currentTitle: 'Cloud Infrastructure Engineer',
    currentCompany: 'CloudEngineer India',
    location: 'Hyderabad, Telangana',
    experience: 5,
    skills: ['AWS', 'Terraform', 'Ansible', 'Python', 'Linux', 'Networking'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'National Institute of Technology, Warangal',
        year: 2019
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/kavita-sharma.pdf',
    source: 'Referral',
    appliedDate: '2024-03-22',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '4',
    notes: 'Strong background in cloud infrastructure security',
    assessment: {
      score: 89,
      feedback: 'Excellent understanding of secure cloud architecture',
      completed: true
    }
  },
  {
    id: '35',
    name: 'Vikas Goyal',
    email: 'vikas.goyal@gmail.com',
    phone: '+91-54312-31607',
    currentTitle: 'Senior React Developer',
    currentCompany: 'AppCreators India',
    location: 'Gurgaon, Haryana',
    experience: 8,
    skills: ['React', 'TypeScript', 'GraphQL', 'Redux', 'Next.js', 'Performance Optimization'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Delhi Technological University',
        year: 2016
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/vikas-goyal.pdf',
    source: 'LinkedIn',
    appliedDate: '2024-03-10',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '1',
    notes: 'Impressive portfolio of React applications',
    assessment: {
      score: 94,
      feedback: 'Outstanding technical skills and architecture knowledge',
      completed: true
    }
  },
  {
    id: '36',
    name: 'Shikha Bajaj',
    email: 'bajaj.shikha83@outlook.com',
    phone: '+91 87098 38321',
    currentTitle: 'Product Manager',
    currentCompany: 'UserFirst India',
    location: 'Pune, Maharashtra',
    experience: 7,
    skills: ['Product Management', 'Agile', 'User Research', 'Product Analytics', 'Wireframing', 'A/B Testing'],
    education: [
      {
        degree: 'MBA',
        institution: 'Symbiosis Institute of Business Management, Pune',
        year: 2017
      }
    ],
    resume: 'Contacted through third-party recruiter',
    source: 'Naukri',
    appliedDate: '2023-09-15',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '2',
    notes: 'Strong experience in consumer products',
    assessment: {
      score: 49,
      feedback: 'Good user-centric approach but showed inconsistent understanding of technical aspects during assessment',
      completed: true
    }
  },
  {
    id: '37',
    name: 'Deepak Bhatt',
    email: 'deepak.bhatt@gmail.com',
    phone: '+91-32190-31805',
    currentTitle: 'Machine Learning Researcher',
    currentCompany: 'AI Labs India',
    location: 'Bangalore, Karnataka',
    experience: 4,
    skills: ['Python', 'Deep Learning', 'TensorFlow', 'Research', 'NLP', 'Academic Publishing'],
    education: [
      {
        degree: 'PhD in Machine Learning',
        institution: 'Indian Institute of Science, Bangalore',
        year: 2020
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/deepak-bhatt.pdf',
    source: 'Company Website',
    appliedDate: '2024-03-20',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '3',
    notes: 'Published researcher in deep learning',
    assessment: {
      score: 92,
      feedback: 'Excellent theoretical knowledge and research background',
      completed: true
    }
  },
  {
    id: '38',
    name: 'Neelam Patel',
    email: 'neelam.patel@outlook.com',
    phone: '+91-21087-31904',
    currentTitle: 'DevOps Engineer',
    currentCompany: 'DeployNow Technologies',
    location: 'Mumbai, Maharashtra',
    experience: 4,
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Python', 'Bash'],
    education: [
      {
        degree: 'B.Tech in Computer Engineering',
        institution: 'Sardar Patel Institute of Technology, Mumbai',
        year: 2020
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/neelam-patel.pdf',
    source: 'LinkedIn',
    appliedDate: '2024-03-23',
    stage: RecruitmentStage.APPLIED,
    jobId: '4',
    notes: 'Experience with implementing GitOps practices',
    assessment: {
      score: 83,
      feedback: 'Good technical skills in continuous deployment',
      completed: true
    }
  },
  {
    id: '39',
    name: 'Samir Varma',
    email: 'samir.varma@gmail.com',
    phone: '+91-10978-32003',
    currentTitle: 'Frontend Engineer',
    currentCompany: 'WebUI Technologies',
    location: 'Jaipur, Rajasthan',
    experience: 3,
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Styled Components', 'Accessibility'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Netaji Subhas Institute of Technology, Delhi',
        year: 2021
      }
    ],
    resume: 'https://samir-portfolio-2023.web.app/resume',
    source: 'Naukri',
    appliedDate: '2023-09-11',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '1',
    notes: 'Strong focus on web accessibility',
    assessment: {
      score: 84,
      feedback: 'Good technical skills with emphasis on inclusive design',
      completed: true
    }
  },
  {
    id: '40',
    name: 'Anita Reddy',
    email: 'anita.reddy@outlook.com',
    phone: '+91-09875-32102',
    currentTitle: 'Product Owner',
    currentCompany: 'AgileServices India',
    location: 'Hyderabad, Telangana',
    experience: 5,
    skills: ['Product Management', 'Scrum', 'User Stories', 'Backlog Management', 'Stakeholder Management'],
    education: [
      {
        degree: 'MBA',
        institution: 'Indian School of Business, Hyderabad',
        year: 2019
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/anita-reddy.pdf',
    source: 'Referral',
    appliedDate: '2024-03-16',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '2',
    notes: 'Strong background in Agile methodologies',
    assessment: {
      score: 88,
      feedback: 'Excellent understanding of product development process',
      completed: true
    }
  },
  {
    id: '41',
    name: 'Prakash Jain',
    email: 'prakash.jain@gmail.com',
    phone: '+91-98765-42301',
    currentTitle: 'Data Engineer',
    currentCompany: 'BigData Solutions India',
    location: 'Bangalore, Karnataka',
    experience: 6,
    skills: ['Python', 'SQL', 'Spark', 'Hadoop', 'AWS', 'Data Warehousing'],
    education: [
      {
        degree: 'M.Tech in Data Engineering',
        institution: 'Indian Institute of Technology, Kanpur',
        year: 2018
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/prakash-jain.pdf',
    source: 'LinkedIn',
    appliedDate: '2024-03-21',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '3',
    notes: 'Strong experience in big data processing',
    assessment: {
      score: 87,
      feedback: 'Excellent skills in data pipeline architecture',
      completed: true
    }
  },
  {
    id: '42',
    name: 'Radhika Deshmukh',
    email: 'radhika.deshmukh@outlook.com',
    phone: '8765453210',
    currentTitle: 'Infrastructure Architect',
    currentCompany: 'TechInfra Solutions',
    location: 'Working remotely from Indore, MP',
    experience: 7,
    skills: ['AWS', 'Azure', 'Infrastructure as Code', 'Terraform', 'Kubernetes', 'Security'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'College of Engineering, Pune',
        year: 2017
      }
    ],
    resume: 'https://rdeshmukh.dev/resume',
    source: 'Company Website',
    appliedDate: '2023-08-24',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '4',
    notes: 'Experience designing cloud architectures for regulated industries',
    assessment: {
      score: 91,
      feedback: 'Strong technical skills and security focus',
      completed: true
    }
  },
  {
    id: '43',
    name: 'Varun Chadha',
    email: 'varun.chadha@gmail.com',
    phone: '+91-76543-64219',
    currentTitle: 'UI Developer',
    currentCompany: 'Creative UI India',
    location: 'Delhi, NCR',
    experience: 4,
    skills: ['React', 'JavaScript', 'CSS', 'Animation', 'SVG', 'Canvas'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Delhi Technological University',
        year: 2020
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/varun-chadha.pdf',
    source: 'LinkedIn',
    appliedDate: '2024-03-12',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '1',
    notes: 'Strong portfolio of interactive web experiences',
    assessment: {
      score: 88,
      feedback: 'Excellent creative skills and solid technical foundation',
      completed: true
    }
  },
  {
    id: '44',
    name: 'Preeti Tiwari',
    email: 'ptiwari@gmail.com',
    phone: '6543275128',
    currentTitle: 'Product Lead',
    currentCompany: 'UpGrad',
    location: 'Hyderabad, Telangana',
    experience: 9,
    skills: ['Product Strategy', 'Team Leadership', 'Product Roadmapping', 'Stakeholder Management', 'Analytics'],
    education: [
      {
        degree: 'MBA',
        institution: 'Indian School of Business, Hyderabad',
        year: 2015
      },
      {
        degree: 'B.E. in Electronics',
        institution: 'Osmania University, Hyderabad',
        year: 2008
      }
    ],
    resume: 'https://tinyurl.com/preeti-resume-2024',
    source: 'Referral',
    appliedDate: '2024-01-17',
    stage: RecruitmentStage.APPLIED,
    jobId: '2',
    notes: 'Led successful product launches at current company. Took 2 years break (2018-2020) for family reasons.',
    assessment: {
      score: 94,
      feedback: 'Strong leadership experience and strategic vision',
      completed: true
    }
  },
  {
    id: '45',
    name: 'Arjun Nambiar',
    email: 'arjun.nambiar@gmail.com',
    phone: '+91-54321-86037',
    currentTitle: 'NLP Engineer',
    currentCompany: 'LanguageTech India',
    location: 'Bangalore, Karnataka',
    experience: 4,
    skills: ['Python', 'Natural Language Processing', 'Machine Learning', 'BERT', 'Transformers'],
    education: [
      {
        degree: 'M.Tech in Computer Science',
        institution: 'Indian Institute of Technology, Madras',
        year: 2020
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/arjun-nambiar.pdf',
    source: 'LinkedIn',
    appliedDate: '2024-03-22',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '3',
    notes: 'Specialized in conversational AI systems',
    assessment: {
      score: 89,
      feedback: 'Strong NLP expertise and implementation skills',
      completed: true
    }
  },
  {
    id: '46',
    name: 'Sonali Joshi',
    email: 'sonali.joshi@outlook.com',
    phone: '+91-43210-97846',
    currentTitle: 'DevSecOps Engineer',
    currentCompany: 'SecureOps India',
    location: 'Mumbai, Maharashtra',
    experience: 6,
    skills: ['Kubernetes', 'Security Scanning', 'CI/CD', 'Docker', 'Terraform', 'Compliance'],
    education: [
      {
        degree: 'B.Tech in Information Security',
        institution: 'Mumbai University',
        year: 2018
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/sonali-joshi.pdf',
    source: 'Naukri',
    appliedDate: '2024-03-25',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '4',
    notes: 'Strong focus on integrating security into CI/CD pipelines',
    assessment: {
      score: 90,
      feedback: 'Excellent security knowledge within DevOps practices',
      completed: true
    }
  },
  {
    id: '47',
    name: 'Manoj Singhania',
    email: 'manoj.singhania2015@gmail.com',
    phone: '+91 8965432109',
    currentTitle: 'Senior Frontend Engineer',
    currentCompany: 'Paytm',
    location: 'Chennai, Tamil Nadu',
    experience: 9.5,
    skills: ['React', 'TypeScript', 'JavaScript', 'Architecture', 'Team Leadership', 'Performance'],
    education: [
      {
        degree: 'B.Tech in Computer Engineering',
        institution: 'Anna University, Chennai',
        year: 2015
      }
    ],
    resume: 'Resume in portfolio site - manoj-singhania.vercel.app',
    source: 'LinkedIn',
    appliedDate: '2024-01-13',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '1',
    notes: 'Strong system design skills and architectural experience. Applying for internal transfer.',
    assessment: {
      score: 95,
      feedback: 'Outstanding technical leadership and architecture skills',
      completed: true
    }
  },
  {
    id: '48',
    name: 'Leela Prasad',
    email: 'leela.prasad@outlook.com',
    phone: '+91-21098-19664',
    currentTitle: 'Product Operations Manager',
    currentCompany: 'TechOps India',
    location: 'Bangalore, Karnataka',
    experience: 5,
    skills: ['Product Operations', 'Process Improvement', 'Data Analysis', 'Cross-functional Coordination'],
    education: [
      {
        degree: 'MBA',
        institution: 'Indian Institute of Management, Ahmedabad',
        year: 2019
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/leela-prasad.pdf',
    source: 'Company Website',
    appliedDate: '2024-03-18',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '2',
    notes: 'Strong operational background supporting product teams',
    assessment: {
      score: 86,
      feedback: 'Good understanding of product operations and processes',
      completed: true
    }
  },
  {
    id: '49',
    name: 'Kunal Malhotra',
    email: 'kunal.malhotra@gmail.com',
    phone: '+91-10987-20573',
    currentTitle: 'Computer Vision Engineer',
    currentCompany: 'VisionAI Technologies',
    location: 'Pune, Maharashtra',
    experience: 5,
    skills: ['Python', 'Computer Vision', 'Deep Learning', 'OpenCV', 'TensorFlow', 'PyTorch'],
    education: [
      {
        degree: 'PhD in Computer Vision',
        institution: 'Indian Institute of Technology, Bombay',
        year: 2019
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/kunal-malhotra.pdf',
    source: 'Referral',
    appliedDate: '2024-03-23',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '3',
    notes: 'Specialized in object detection systems',
    assessment: {
      score: 93,
      feedback: 'Exceptional technical expertise in computer vision',
      completed: true
    }
  },
  {
    id: '50',
    name: 'Aishwarya Rao',
    email: 'a.rao-1993@outlook.com',
    phone: '(+91) 9987631482',
    currentTitle: 'SRE',
    currentCompany: 'ReliableOps Technologies',
    location: 'Hyderabad, Telangana',
    experience: 6,
    skills: ['Kubernetes', 'Observability', 'SLOs', 'AWS', 'Terraform', 'Go'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'International Institute of Information Technology, Hyderabad',
        year: 2018
      }
    ],
    resume: 'https://mega.nz/file/abcXYZ#hashA1B2C3',
    source: 'LinkedIn',
    appliedDate: '2023-12-26',
    stage: RecruitmentStage.APPLIED,
    jobId: '4',
    notes: 'Experience implementing SRE practices at scale',
    assessment: {
      score: 62,
      feedback: 'Good theoretical knowledge but practical implementation seems limited',
      completed: true
    }
  },
  {
    id: '51',
    name: 'Kartik Iyer',
    email: 'kartik.iyer@gmail.com',
    phone: '9876553401',
    currentTitle: 'React Native Developer',
    currentCompany: 'CureIt',
    location: 'Mumbai, Maharashtra',
    experience: 4,
    skills: ['React Native', 'JavaScript', 'TypeScript', 'Mobile Development', 'Redux'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'Veermata Jijabai Technological Institute, Mumbai',
        year: 2020
      }
    ],
    resume: 'https://kartikiyer.me/static/resume.pdf',
    source: 'Naukri',
    appliedDate: '2023-12-14',
    stage: RecruitmentStage.APPLIED,
    jobId: '1',
    notes: 'Strong experience with cross-platform mobile development',
    assessment: {
      score: 84,
      feedback: 'Good mobile development skills applicable to web frontend',
      completed: true
    }
  },
  {
    id: '52',
    name: 'Shalini Gupta',
    email: 'shalini.gupta@outlook.com',
    phone: '+91-87654-64310',
    currentTitle: 'UX Product Manager',
    currentCompany: 'DesignFirst Technologies',
    location: 'Gurgaon, Haryana',
    experience: 7,
    skills: ['Product Management', 'UX Design', 'User Research', 'Prototyping', 'Agile'],
    education: [
      {
        degree: 'Master of Design',
        institution: 'National Institute of Design, Ahmedabad',
        year: 2017
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/shalini-gupta.pdf',
    source: 'LinkedIn',
    appliedDate: '2024-03-19',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '2',
    notes: 'Strong design background combined with product management',
    assessment: {
      score: 91,
      feedback: 'Excellent user-centered approach to product development',
      completed: true
    }
  },
  {
    id: '53',
    name: 'Vineet Sharma',
    email: 'vineet.sharma@gmail.com',
    phone: '+91-76543-75219',
    currentTitle: 'Data Scientist',
    currentCompany: 'PredictiveAI India',
    location: 'Bangalore, Karnataka',
    experience: 3,
    skills: ['Python', 'Machine Learning', 'Statistics', 'Data Visualization', 'SQL'],
    education: [
      {
        degree: 'M.Tech in Data Science',
        institution: 'Indian Institute of Science, Bangalore',
        year: 2021
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/vineet-sharma.pdf',
    source: 'Company Website',
    appliedDate: '2024-03-24',
    stage: RecruitmentStage.APPLIED,
    jobId: '3',
    notes: 'Promising early career data scientist',
    assessment: {
      score: 82,
      feedback: 'Good technical foundation and eagerness to learn',
      completed: true
    }
  },
  {
    id: '54',
    name: 'Priyanka Verma',
    email: 'priyanka.v@outlook.com',
    phone: '65432-86128',
    currentTitle: 'Platform Engineer',
    currentCompany: 'Razorpay',
    location: 'Pune, Maharashtra',
    experience: 5,
    skills: ['Kubernetes', 'Docker', 'Go', 'AWS', 'CI/CD', 'Infrastructure as Code'],
    education: [
      {
        degree: 'B.Tech in Computer Engineering',
        institution: 'College of Engineering, Pune',
        year: 2019
      }
    ],
    resume: 'No resume submitted - to be requested',
    source: 'Referral',
    appliedDate: '2024-02-27',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '4',
    notes: 'Experience building developer platforms. Currently on notice period - available from June 2024.',
    assessment: {
      score: 87,
      feedback: 'Strong technical skills in platform engineering',
      completed: true
    }
  },
  {
    id: '55',
    name: 'Rahul Mehra',
    email: 'rahul.mehra@gmail.com',
    phone: '+91-54321-97037',
    currentTitle: 'Frontend Tech Lead',
    currentCompany: 'WebLeaders India',
    location: 'Chennai, Tamil Nadu',
    experience: 8,
    skills: ['React', 'TypeScript', 'Next.js', 'Web Performance', 'Team Leadership', 'Mentoring'],
    education: [
      {
        degree: 'M.Tech in Computer Science',
        institution: 'Indian Institute of Technology, Chennai',
        year: 2016
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/rahul-mehra.pdf',
    source: 'LinkedIn',
    appliedDate: '2024-03-15',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '1',
    notes: 'Strong leadership background and technical expertise',
    assessment: {
      score: 93,
      feedback: 'Excellent combination of technical and leadership skills',
      completed: true
    }
  },
  {
    id: '56',
    name: 'Kavya Menon',
    email: 'kavya.menon@outlook.com',
    phone: '+91-43210-08946',
    currentTitle: 'Product Manager',
    currentCompany: 'SaaSTech India',
    location: 'Hyderabad, Telangana',
    experience: 6,
    skills: ['Product Management', 'SaaS Products', 'Agile', 'User Stories', 'Product Analytics'],
    education: [
      {
        degree: 'MBA',
        institution: 'Indian School of Business, Hyderabad',
        year: 2018
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/kavya-menon.pdf',
    source: 'Naukri',
    appliedDate: '2024-03-20',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '2',
    notes: 'Experience with B2B SaaS products',
    assessment: {
      score: 88,
      feedback: 'Strong product sense and analytical skills',
      completed: true
    }
  },
  {
    id: '57',
    name: 'Akash Bhatia',
    email: 'akash_2017@gmail.com',
    phone: '+91 92727 69585',
    currentTitle: 'Research Scientist',
    currentCompany: 'Microsoft Research India',
    location: 'Bangalore, Karnataka',
    experience: 7,
    skills: ['Python', 'Machine Learning', 'Research', 'Scientific Publishing', 'TensorFlow'],
    education: [
      {
        degree: 'PhD in Machine Learning',
        institution: 'Carnegie Mellon University',
        year: 2021
      },
      {
        degree: 'B.Tech in CSE',
        institution: 'IIT Madras',
        year: 2017
      }
    ],
    resume: 'https://scholar.google.com/citations?user=AbCdEf0',
    source: 'Conference (NeurIPS)',
    appliedDate: '2023-08-25',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '3',
    notes: 'Published author in top ML conferences. Currently employed, looking for part-time consulting only.',
    assessment: {
      score: 95,
      feedback: 'Outstanding research background and practical skills',
      completed: false
    }
  },
  {
    id: '58',
    name: 'Sneha Kapoor',
    email: 'sneha.kapoor@outlook.com',
    phone: '+91-21098-20764',
    currentTitle: 'DevOps Team Lead',
    currentCompany: 'AutomateOps India',
    location: 'Mumbai, Maharashtra',
    experience: 8,
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Team Leadership', 'CI/CD'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Mumbai University',
        year: 2016
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/sneha-kapoor.pdf',
    source: 'Company Website',
    appliedDate: '2024-03-28',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '4',
    notes: 'Led team of 8 DevOps engineers',
    assessment: {
      score: 94,
      feedback: 'Strong leadership skills and technical expertise',
      completed: true
    }
  },
  {
    id: '59',
    name: 'Vikrant Khanna',
    email: 'vikrant.khanna@gmail.com',
    phone: '+91-10987-31673',
    currentTitle: 'Frontend Developer',
    currentCompany: 'WebFusion Technologies',
    location: 'Delhi, NCR',
    experience: 3,
    skills: ['React', 'JavaScript', 'CSS', 'Responsive Design', 'Accessibility'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'Netaji Subhas Institute of Technology, Delhi',
        year: 2021
      }
    ],
    resume: 'https://resumes.hirehub.ai/resumes/vikrant-khanna.pdf',
    source: 'LinkedIn',
    appliedDate: '2024-03-16',
    stage: RecruitmentStage.APPLIED,
    jobId: '1',
    notes: 'Strong focus on creating accessible web experiences',
    assessment: {
      score: 83,
      feedback: 'Good technical skills with emphasis on inclusive design',
      completed: true
    }
  },
  {
    id: '60',
    name: 'Meenakshi Sundaram',
    email: 'meena.s@outlook.com',
    phone: '09876-42582',
    currentTitle: 'Associate Product Manager',
    currentCompany: 'Freshworks',
    location: 'Coimbatore, Tamil Nadu',
    experience: 3,
    skills: ['Product Management', 'User Research', 'Data Analysis', 'Agile'],
    education: [
      {
        degree: 'MBA',
        institution: 'PSG Institute of Management, Coimbatore',
        year: 2021
      },
      {
        degree: 'B.E. Computer Science',
        institution: 'Amrita Vishwa Vidyapeetham, Coimbatore',
        year: 2018
      }
    ],
    resume: 'https://onedrive.live.com/resume-meenakshi.pdf',
    source: 'Referral',
    appliedDate: '2023-11-21',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '2',
    notes: 'Promising early career product manager. Worked as developer for 1 year before MBA.',
    assessment: {
      score: 75,
      feedback: 'Good product intuition, still developing analytical skills. Enthusiastic learner.',
      completed: true
    }
  },
  {
    id: '61',
    name: 'Pranav Ahuja',
    email: 'pranav_ahuja1995@rediffmail.com',
    phone: '922-555-8876',
    currentTitle: 'Senior React Developer',
    currentCompany: 'Zeta',
    location: 'Bengaluru (relocated from Chandigarh)',
    experience: 6.5,
    skills: ['React', 'JavaScript', 'TypeScript', 'GraphQL', 'React Query', 'UI Design'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Thapar Institute of Engineering & Technology',
        year: 2016
      }
    ],
    resume: 'https://ipfs.io/ipfs/QmXa12GhST5F',
    source: 'AngelList',
    appliedDate: '2023-10-05',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '1',
    notes: 'Strong portfolio, previously founded a small startup that was acqui-hired',
    assessment: {
      score: 89,
      feedback: 'Excellent technical skills with entrepreneurial mindset',
      completed: true
    }
  },
  {
    id: '62',
    name: 'Lakshmi Kannan',
    email: 'lak.kannan@yahoo.in',
    phone: 'Contact via WhatsApp only: 8876543210',
    currentTitle: 'Director of Product',
    currentCompany: 'Byju\'s',
    location: 'Bengaluru, Karnataka',
    experience: 12,
    skills: ['Product Strategy', 'Leadership', 'EdTech', 'Growth', 'Analytics', 'User Research'],
    education: [
      {
        degree: 'MBA',
        institution: 'XLRI Jamshedpur',
        year: 2012
      },
      {
        degree: 'B.E. in Electronics',
        institution: 'College of Engineering, Guindy',
        year: 2008
      }
    ],
    resume: 'Resume shared privately via email',
    source: 'Hired.com',
    appliedDate: '2023-12-18',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '2',
    notes: 'Interested only if work from home is available 3 days/week. Overqualified but very interested in our mission.',
    assessment: {
      score: 97,
      feedback: 'Exceptional leadership experience and strategic vision',
      completed: true
    }
  },
  {
    id: '63',
    name: 'Arif Mohammed',
    email: 'arifm85@gmail.com',
    phone: '+91 9955 420 699',
    currentTitle: 'Data Engineer',
    currentCompany: 'Reliance Jio',
    location: 'Surat, Gujarat',
    experience: 4,
    skills: ['Python', 'SQL', 'AWS', 'Kafka', 'Hadoop', 'Spark'],
    education: [
      {
        degree: 'M.Sc. Computer Applications',
        institution: 'Sardar Patel University',
        year: 2019
      }
    ],
    resume: 'See attached resume.docx in email thread',
    source: 'Indeed',
    appliedDate: '2024-01-28',
    stage: RecruitmentStage.APPLIED,
    jobId: '3',
    notes: 'Currently commuting 3 hours daily, looking for remote opportunities',
    assessment: {
      score: 72,
      feedback: 'Good foundational knowledge but limited experience with ML pipelines',
      completed: true
    }
  },
  {
    id: '64',
    name: 'Nitin Choudhary',
    email: 'nitinc@protonmail.com',
    phone: '9988776644',
    currentTitle: 'DevOps Lead',
    currentCompany: 'Meesho',
    location: 'Gurgaon, NCR',
    experience: 7,
    skills: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD', 'Monitoring', 'Security'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'NIT Kurukshetra',
        year: 2017
      }
    ],
    resume: 'https://github.com/nitinc-resume/blob/main/NitinC_Resume_2024.pdf',
    source: 'StackOverflow Jobs',
    appliedDate: '2023-09-15',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '4',
    notes: 'Currently managing a team of 6 DevOps engineers. Interested in both IC and management roles.',
    assessment: {
      score: 85,
      feedback: 'Strong technical skills and leadership potential',
      completed: true
    }
  },
  {
    id: '65',
    name: 'Pallavi Joshi',
    email: 'p.joshi1988@gmail.com',
    phone: '080-9876-5432',
    currentTitle: 'Frontend Engineer',
    currentCompany: 'Unacademy',
    location: 'Bangalore',
    experience: 3.5,
    skills: ['React', 'JavaScript', 'CSS', 'Responsive Design', 'Performance Optimization'],
    education: [
      {
        degree: 'Self-taught programmer',
        institution: 'Various online courses',
        year: 2020
      },
      {
        degree: 'B.Com',
        institution: 'Mumbai University',
        year: 2010
      }
    ],
    resume: 'https://pallavijoshi.dev',
    source: 'LinkedIn',
    appliedDate: '2024-02-07',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '2',
    notes: 'Career changer - previously in marketing. Impressive portfolio of personal projects.',
    assessment: {
      score: 77,
      feedback: 'Strong practical skills but some gaps in CS fundamentals',
      completed: true
    }
  },
  {
    id: '66',
    name: 'Ramesh Venkataraman',
    email: 'ramesh.venkat@outlook.com',
    phone: '(+91) 98765-00000',
    currentTitle: 'Senior Product Manager',
    currentCompany: 'PhonePe',
    location: 'Bengaluru, KA',
    experience: 8,
    skills: ['Product Management', 'FinTech', 'UX', 'Analytics', 'Strategy'],
    education: [
      {
        degree: 'MBA',
        institution: 'Indian School of Business',
        year: 2016
      },
      {
        degree: 'B.Tech in Mechanical Engineering',
        institution: 'IIT Madras',
        year: 2013
      }
    ],
    resume: 'https://standardresume.co/r/ramesh-venkataraman',
    source: 'Direct Application',
    appliedDate: '2023-11-02',
    stage: RecruitmentStage.HIRED,
    jobId: '2',
    notes: 'Accepted offer on March 10, 2024. Joining on April 15, 2024.',
    assessment: {
      score: 93,
      feedback: 'Outstanding product sense and analytical skills',
      completed: true
    }
  },
  {
    id: '67',
    name: 'Fatima Sheikh',
    email: 'fatima.s@analyticsindia.org',
    phone: '8794561230',
    currentTitle: 'Senior Data Scientist',
    currentCompany: 'Fractal Analytics',
    location: 'Mumbai (working remotely from Goa currently)',
    experience: 6,
    skills: ['Python', 'R', 'Machine Learning', 'Deep Learning', 'Statistics', 'NLP'],
    education: [
      {
        degree: 'MS in Data Science',
        institution: 'Columbia University',
        year: 2018
      },
      {
        degree: 'B.Tech in Computer Science',
        institution: 'VJTI Mumbai',
        year: 2015
      }
    ],
    resume: 'https://fatimadata.notion.site/Resume-95f26a81c',
    source: 'Kaggle',
    appliedDate: '2024-01-15',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '3',
    notes: 'Returning to India after working in US for 3 years. Top performer in our technical assessment.',
    assessment: {
      score: 98,
      feedback: 'Exceptional technical skills and problem-solving ability',
      completed: true
    }
  },
  {
    id: '68',
    name: 'Kamal Vora',
    email: 'k_vora@outlook.com',
    phone: '+91 76591 07222',
    currentTitle: 'Site Reliability Engineer',
    currentCompany: 'upGrad',
    location: 'Pune, Maharashtra',
    experience: 3,
    skills: ['Linux', 'Docker', 'Kubernetes', 'AWS', 'Monitoring', 'Python'],
    education: [
      {
        degree: 'B.Tech in Electronics & Communication',
        institution: 'RTU Kota',
        year: 2021
      }
    ],
    resume: 'https://www.overleaf.com/read/shared/kamalvora',
    source: 'Internal Referral',
    appliedDate: '2023-09-08',
    stage: RecruitmentStage.REJECTED,
    jobId: '4',
    notes: 'Good skills but not enough experience for our current needs. Consider for junior roles.',
    assessment: {
      score: 65,
      feedback: 'Foundational knowledge is solid but lacks experience with complex systems',
      completed: true
    }
  },
  {
    id: '69',
    name: 'Gayatri Deshpande',
    email: 'g.deshpande@icloud.com',
    phone: '9870654321',
    currentTitle: 'Frontend Architect',
    currentCompany: 'Cred',
    location: 'Bengaluru',
    experience: 9,
    skills: ['React', 'TypeScript', 'State Management', 'Performance', 'CSS-in-JS', 'Design Systems'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'NITK Surathkal',
        year: 2014
      }
    ],
    resume: 'https://read.cv/gayatri',
    source: 'Conference (React India)',
    appliedDate: '2023-12-05',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '1',
    notes: 'Presented at React India 2023. Looking for senior architect role with mentorship opportunities.',
    assessment: {
      score: 94,
      feedback: 'Outstanding technical expertise and system design skills',
      completed: true
    }
  },
  {
    id: '70',
    name: 'Rohit Yadav',
    email: 'rohit.y2017@gmail.com',
    phone: '+91-7654321890',
    currentTitle: 'Growth Product Manager',
    currentCompany: 'Ola',
    location: 'Bengaluru',
    experience: 5,
    skills: ['Product Management', 'Growth Hacking', 'Analytics', 'A/B Testing', 'User Acquisition'],
    education: [
      {
        degree: 'PGDM',
        institution: 'IIM Kozhikode',
        year: 2018
      },
      {
        degree: 'B.E. in Computer Science',
        institution: 'PES University',
        year: 2016
      }
    ],
    resume: 'http://bit.ly/rohit-yadav-resume',
    source: 'Recruiter Outreach',
    appliedDate: '2024-02-18',
    stage: RecruitmentStage.APPLIED,
    jobId: '2',
    notes: 'Was referred by Ankit from marketing. Currently traveling, available for interviews after March 25.',
    assessment: {
      score: 86,
      feedback: 'Strong growth mindset and analytical approach',
      completed: true
    }
  },
  {
    id: '71',
    name: 'Zara Khan',
    email: 'zarakhan93@yahoo.com',
    phone: '8765431290',
    currentTitle: 'Machine Learning Engineer',
    currentCompany: 'Intel India',
    location: 'Bengaluru (relocating from Hyderabad)',
    experience: 4.5,
    skills: ['Python', 'TensorFlow', 'Computer Vision', 'MLOps', 'Deep Learning'],
    education: [
      {
        degree: 'M.Tech in Computer Vision',
        institution: 'IIIT Hyderabad',
        year: 2019
      },
      {
        degree: 'B.Tech in ECE',
        institution: 'Osmania University',
        year: 2017
      }
    ],
    resume: 'https://drive.google.com/file/d/resume-zara-khan/view',
    source: 'ML India Conference',
    appliedDate: '2023-10-10',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '3',
    notes: 'Published research on satellite image processing. Wants to focus on practical ML applications.',
    assessment: {
      score: 91,
      feedback: 'Excellent technical skills with good understanding of ML deployment',
      completed: true
    }
  },
  {
    id: '72',
    name: 'Vihaan Agarwal',
    email: 'vihaan@cloudops.co.in',
    phone: '91-96543-98765',
    currentTitle: 'Platform Engineering Team Lead',
    currentCompany: 'Gojek',
    location: 'Remote from Dharamshala, HP',
    experience: 8,
    skills: ['Kubernetes', 'Terraform', 'GitOps', 'AWS', 'Go', 'Service Mesh'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'BITS Pilani',
        year: 2016
      }
    ],
    resume: 'https://www.vihaan.dev/resume',
    source: 'GitHub (open source contributor)',
    appliedDate: '2023-08-20',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '4',
    notes: 'Open source contributor to Kubernetes. Seeking a fully remote role. Prefers asynchronous communication.',
    assessment: {
      score: 95,
      feedback: 'Excellent technical depth and leadership experience',
      completed: true
    }
  },
  {
    id: '73',
    name: 'Deepti Raghavan',
    email: 'deepti2012@outlook.com',
    phone: '+91 7654-876543',
    currentTitle: 'UI/UX Developer',
    currentCompany: 'Cars24',
    location: 'Gurgaon',
    experience: 5.5,
    skills: ['React', 'JavaScript', 'UI Design', 'Design Systems', 'Figma', 'CSS'],
    education: [
      {
        degree: 'B.Des in UX Design',
        institution: 'Srishti School of Art & Design',
        year: 2019
      }
    ],
    resume: 'https://dribbble.com/deepti/resume',
    source: 'Dribbble',
    appliedDate: '2023-11-14',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '1',
    notes: 'Designer who codes. Strong visual design portfolio with good React implementation skills.',
    assessment: {
      score: 86,
      feedback: 'Strong design skills with good technical implementation',
      completed: true
    }
  },
  {
    id: '74',
    name: 'Manish Malhotra',
    email: 'manish.prod@gmail.com',
    phone: '9912345670',
    currentTitle: 'Senior Product Manager',
    currentCompany: 'MakeMyTrip',
    location: 'Delhi',
    experience: 7,
    skills: ['Product Management', 'Travel Tech', 'Analytics', 'User Research', 'Product Strategy'],
    education: [
      {
        degree: 'MBA',
        institution: 'NMIMS Mumbai',
        year: 2017
      },
      {
        degree: 'B.Tech in Computer Science',
        institution: 'DTU Delhi',
        year: 2014
      }
    ],
    resume: 'https://www.slideshare.net/manishm/resume-2024',
    source: 'TopHire',
    appliedDate: '2024-01-05',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '2',
    notes: 'Interested specifically in product monetization. Used our product extensively and has specific improvement ideas.',
    assessment: {
      score: 88,
      feedback: 'Strong domain knowledge and strategic thinking',
      completed: true
    }
  },
  {
    id: '75',
    name: 'Pradeep Kumar R',
    email: 'pradeep.kumar@zohomail.in',
    phone: '9485201675',
    currentTitle: 'Data Scientist',
    currentCompany: 'Mu Sigma',
    location: 'Chennai, TN',
    experience: 3,
    skills: ['Python', 'R', 'Statistical Analysis', 'Machine Learning', 'Data Visualization'],
    education: [
      {
        degree: 'MSc in Statistics',
        institution: 'CMI Chennai',
        year: 2021
      },
      {
        degree: 'BSc in Mathematics',
        institution: 'Loyola College',
        year: 2019
      }
    ],
    resume: 'To be furnished upon request',
    source: 'Consultancy Referral',
    appliedDate: '2024-02-28',
    stage: RecruitmentStage.APPLIED,
    jobId: '3',
    notes: 'Background in pure statistics with self-taught programming. Strong analytical skills.',
    assessment: {
      score: 79,
      feedback: 'Strong theoretical foundation, needs more practical ML engineering experience',
      completed: true
    }
  },
  {
    id: '76',
    name: 'Jasmine Kaur',
    email: 'jasmine.k@pm.me',
    phone: '(+91) 67890-54321',
    currentTitle: 'DevOps Consultant',
    currentCompany: 'Independent Contractor',
    location: 'Anywhere (Digital Nomad)',
    experience: 6,
    skills: ['AWS', 'GCP', 'Kubernetes', 'Terraform', 'CI/CD', 'Security', 'Monitoring'],
    education: [
      {
        degree: 'B.Tech in IT',
        institution: 'Guru Nanak Dev Engineering College',
        year: 2018
      }
    ],
    resume: 'https://jasmine-kaur.gitlab.io/cv',
    source: 'Twitter',
    appliedDate: '2023-09-30',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '4',
    notes: 'Has worked with 12+ startups as a contractor. Available immediately but only for 100% remote work.',
    assessment: {
      score: 82,
      feedback: 'Broad experience across different environments',
      completed: true
    }
  },
  {
    id: '77',
    name: 'Karthikeyan S',
    email: 'karthik.ui@outlook.com',
    phone: '044-9876543',
    currentTitle: 'React Native Developer',
    currentCompany: 'Dream11',
    location: 'Mumbai, MH',
    experience: 4,
    skills: ['React', 'React Native', 'JavaScript', 'TypeScript', 'Redux', 'Mobile UI'],
    education: [
      {
        degree: 'B.E in Computer Science',
        institution: 'Anna University',
        year: 2020
      }
    ],
    resume: 'https://flowcv.me/karthikeyan',
    source: 'LinkedIn',
    appliedDate: '2024-01-22',
    stage: RecruitmentStage.APPLIED,
    jobId: '1',
    notes: 'Looking to move from mobile to web. Has published 3 apps on Play Store with 100k+ downloads.',
    assessment: {
      score: 75,
      feedback: 'Good React fundamentals but limited web-specific experience',
      completed: true
    }
  },
  {
    id: '78',
    name: 'Alok Sharma',
    email: 'alok.product@gmail.com',
    phone: '+91 88899-77766',
    currentTitle: 'Product Manager',
    currentCompany: 'Urban Company',
    location: 'Gurgaon, Haryana',
    experience: 5,
    skills: ['Product Management', 'On-demand services', 'Analytics', 'User Research', 'Product Operations'],
    education: [
      {
        degree: 'MBA',
        institution: 'FMS Delhi',
        year: 2019
      },
      {
        degree: 'B.Tech in Mechanical Engineering',
        institution: 'IIT Kharagpur',
        year: 2015
      }
    ],
    resume: 'https://docs.google.com/document/d/aloksharma/edit',
    source: 'Product School',
    appliedDate: '2024-02-10',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '2',
    notes: 'Managed hyperlocal services product with 200K+ daily active users. Interested in our company after using our service.',
    assessment: {
      score: 87,
      feedback: 'Strong operational background and analytical skills',
      completed: true
    }
  },
  {
    id: '79',
    name: 'Leela Krishnan',
    email: 'l.krishnan@cmu.edu',
    phone: '18005552019',
    currentTitle: 'AI Research Scientist',
    currentCompany: 'Google Research India',
    location: 'Bengaluru, KA',
    experience: 3,
    skills: ['Python', 'Deep Learning', 'Research', 'NLP', 'Transformers', 'TensorFlow'],
    education: [
      {
        degree: 'PhD in Machine Learning',
        institution: 'Carnegie Mellon University',
        year: 2021
      },
      {
        degree: 'B.Tech in CSE',
        institution: 'IIT Madras',
        year: 2017
      }
    ],
    resume: 'Resume available on Google Scholar profile',
    source: 'Conference (NeurIPS)',
    appliedDate: '2023-12-15',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '3',
    notes: 'Published at top ML conferences. Looking to transition from research to applied ML.',
    assessment: {
      score: 96,
      feedback: 'Exceptional technical knowledge and research background',
      completed: true
    }
  },
  {
    id: '80',
    name: 'Kunal Anand',
    email: 'kanand12@infosys.com',
    phone: '+91 98765-43210 (office)',
    currentTitle: 'Cloud Solutions Architect',
    currentCompany: 'Infosys',
    location: 'Hyderabad, Telangana',
    experience: 9.5,
    skills: ['AWS', 'Azure', 'Cloud Architecture', 'Migration', 'Kubernetes', 'Multi-cloud'],
    education: [
      {
        degree: 'M.Tech in Computer Applications',
        institution: 'NIT Warangal',
        year: 2014
      }
    ],
    resume: 'https://1drv.ms/w/s!kunal-anand-resume',
    source: 'AWS Community Day',
    appliedDate: '2023-11-05',
    stage: RecruitmentStage.REJECTED,
    jobId: '4',
    notes: 'Good experience but compensation expectations significantly above our range. Keep in network for future senior roles.',
    assessment: {
      score: 88,
      feedback: 'Strong technical background and enterprise experience',
      completed: true
    }
  },
  {
    id: '81',
    name: 'Aishwarya Narayanan',
    email: 'a.narayanan@flipkart.com',
    phone: '9812-34-5678',
    currentTitle: 'Frontend Staff Engineer',
    currentCompany: 'Flipkart',
    location: 'Bangalore, Karnataka',
    experience: 10,
    skills: ['React', 'TypeScript', 'Architecture', 'Design Systems', 'Web Performance', 'Mentorship'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'IIIT Bangalore',
        year: 2013
      }
    ],
    resume: 'https://aishwarya.page/resume',
    source: 'Employee Referral',
    appliedDate: '2023-08-12',
    stage: RecruitmentStage.HIRED,
    jobId: '1',
    notes: 'Joined on Jan 15th, 2024. Tech Lead for our new mobile web initiative.',
    assessment: {
      score: 97,
      feedback: 'Exceptional technical skills and leadership experience',
      completed: true
    }
  },
  {
    id: '82',
    name: 'Siddharth Kapoor',
    email: 'sidd.kapoor82@yahoo.co.in',
    phone: '0091-98765-43210',
    currentTitle: 'Product Owner',
    currentCompany: 'Zetwerk',
    location: 'Mysore, Karnataka',
    experience: 5,
    skills: ['Product Management', 'Manufacturing Tech', 'Supply Chain', 'Agile', 'Analytics'],
    education: [
      {
        degree: 'MBA',
        institution: 'SIBM Pune',
        year: 2019
      },
      {
        degree: 'B.E. Manufacturing Engineering',
        institution: 'PSG Tech Coimbatore',
        year: 2015
      }
    ],
    resume: '',
    source: 'Instahyre',
    appliedDate: '2023-10-22',
    stage: RecruitmentStage.APPLIED,
    jobId: '2',
    notes: 'Candidate from manufacturing background - interesting domain expertise for our expansion plans.',
    assessment: {
      score: 0,
      feedback: 'Assessment not started yet',
      completed: false
    }
  },
  {
    id: '83',
    name: 'Mitali Patel',
    email: 'mitu2000@gmail.com',
    phone: '70243 65874',
    currentTitle: 'Data Scientist',
    currentCompany: 'ShareChat',
    location: 'Remote, based in Ahmedabad',
    experience: 2.5,
    skills: ['Python', 'NLP', 'PyTorch', 'SQL', 'Data Analysis', 'Recommendation Systems'],
    education: [
      {
        degree: 'M.Tech in Data Science',
        institution: 'BITS Pilani',
        year: 2021
      }
    ],
    resume: 'https://mitali-patel.github.io',
    source: 'Hackerrank Contest',
    appliedDate: '2024-02-15',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '3',
    notes: 'Won 2nd place in our ML hackathon. Very promising junior candidate.',
    assessment: {
      score: 89,
      feedback: 'Strong technical skills for early career professional',
      completed: true
    }
  },
  {
    id: '84',
    name: 'Anand Krishnamurthy',
    email: 'ak@sre.engineering',
    phone: '+1 (408) 555-1234',
    currentTitle: 'Staff DevOps Engineer',
    currentCompany: 'Google',
    location: 'Mountain View, CA (willing to relocate to India)',
    experience: 12,
    skills: ['Kubernetes', 'SRE', 'Go', 'Cloud Infrastructure', 'System Design', 'Security'],
    education: [
      {
        degree: 'M.S. Computer Science',
        institution: 'Stanford University',
        year: 2011
      },
      {
        degree: 'B.Tech in Computer Science',
        institution: 'IIT Kharagpur',
        year: 2009
      }
    ],
    resume: 'LinkedIn profile only',
    source: 'Headhunter',
    appliedDate: '2023-12-01',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '4',
    notes: 'NRI looking to move back to India for family reasons. Extremely experienced, but salary expectations are very high.',
    assessment: {
      score: 98,
      feedback: 'Outstanding technical depth and system design knowledge',
      completed: true
    }
  },
  {
    id: '85',
    name: 'Ritika Saxena',
    email: 'ritika.s@zomato.com',
    phone: '+91 79 2324 5698',
    currentTitle: 'UI Engineer',
    currentCompany: 'Zomato',
    location: 'Gurgaon, Haryana',
    experience: 4,
    skills: ['React', 'JavaScript', 'CSS', 'Animation', 'Frontend Testing', 'Redux'],
    education: [
      {
        degree: 'B.Tech in ECE',
        institution: 'NSIT Delhi',
        year: 2020
      }
    ],
    resume: 'https://ritikasax.netlify.app/',
    source: 'Stack Overflow',
    appliedDate: '2024-01-10',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '1',
    notes: 'Has worked on high-traffic consumer app. Created Zomato\'s animation library.',
    assessment: {
      score: 82,
      feedback: 'Strong CSS and animation skills, React knowledge is solid',
      completed: true
    }
  },
  {
    id: '86',
    name: 'Vikram Joshi',
    email: 'vikram.joshi@startupindia.org',
    phone: '9632587410',
    currentTitle: 'Product Growth Lead',
    currentCompany: 'Snapdeal',
    location: 'New Delhi',
    experience: 7,
    skills: ['Product Management', 'Growth Hacking', 'E-commerce', 'User Acquisition', 'Marketing'],
    education: [
      {
        degree: 'MBA',
        institution: 'MDI Gurgaon',
        year: 2017
      }
    ],
    resume: 'https://drive.google.com/file/d/vikram-joshi-cv',
    source: 'Indeed',
    appliedDate: '2023-11-17',
    stage: RecruitmentStage.OUTREACHED,
    jobId: '2',
    notes: 'Led acquisition team at Snapdeal. Looking for product role with more strategy involvement.',
    assessment: {
      score: 84,
      feedback: 'Strong growth metrics and acquisition experience',
      completed: true
    }
  },
  {
    id: '87',
    name: 'Neha Bhatnagar',
    email: 'n.bhatnagar1991@outlook.com',
    phone: '+91 78067 78312',
    currentTitle: 'Senior Data Scientist',
    currentCompany: 'American Express',
    location: 'Gurgaon, Haryana',
    experience: 8,
    skills: ['Python', 'Machine Learning', 'Financial Analytics', 'Risk Modeling', 'SQL', 'Statistics'],
    education: [
      {
        degree: 'M.S. in Analytics',
        institution: 'Georgia Tech',
        year: 2016
      },
      {
        degree: 'B.Tech in Mathematics & Computing',
        institution: 'Delhi Technological University',
        year: 2013
      }
    ],
    resume: 'Will be provided after initial discussion',
    source: 'Naukri',
    appliedDate: '2023-10-05',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Currently employed, requesting confidentiality. Strong background in financial ML models.',
    assessment: {
      score: 92,
      feedback: 'Excellent technical and domain expertise in financial analytics',
      completed: true
    }
  },
  {
    id: '88',
    name: 'Rajiv Mehta',
    email: 'rajiv@mehta-cloud.in',
    phone: '022-66554433',
    currentTitle: 'Cloud Architect',
    currentCompany: 'TCS',
    location: 'Mumbai, Maharashtra',
    experience: 15,
    skills: ['AWS', 'Azure', 'GCP', 'Enterprise Architecture', 'Migration', 'Security'],
    education: [
      {
        degree: 'B.E. Computer Science',
        institution: 'Mumbai University',
        year: 2008
      }
    ],
    resume: 'https://rajivmehta.in/resume.pdf',
    source: 'AWS Certification Directory',
    appliedDate: '2023-09-12',
    stage: RecruitmentStage.REJECTED,
    jobId: '4',
    notes: 'Very experienced but looking for leadership role that we don\'t currently have open.',
    assessment: {
      score: 85,
      feedback: 'Strong technical skills, but cultural fit concerns',
      completed: true
    }
  },
  {
    id: '89',
    name: 'Sandeep Gupta',
    email: 'sandeep-1987@rediffmail.com',
    phone: '8877665544',
    currentTitle: 'Senior React Developer',
    currentCompany: 'Razorpay',
    location: 'Bangalore, KA',
    experience: 7.5,
    skills: ['React', 'JavaScript', 'TypeScript', 'Payment Systems', 'Redux', 'React Query'],
    education: [
      {
        degree: 'MCA',
        institution: 'Amrita University',
        year: 2011
      }
    ],
    resume: 'https://resume.io/r/sandeepgupta87',
    source: 'WhatsApp Developer Group',
    appliedDate: '2024-01-20',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '1',
    notes: 'Leads payments team frontend at Razorpay. Interested in fintech opportunities.',
    assessment: {
      score: 91,
      feedback: 'Excellent technical skills with strong domain expertise',
      completed: true
    }
  },
  {
    id: '90',
    name: 'Divya Mohan',
    email: 'divya.mohan@gmail.com',
    phone: '074-0639-4127',
    currentTitle: 'Product Marketing Manager',
    currentCompany: 'Dunzo',
    location: 'Bangalore (WFH from Kochi)',
    experience: 6,
    skills: ['Product Management', 'Go-to-Market', 'Analytics', 'User Research', 'SEO'],
    education: [
      {
        degree: 'MBA',
        institution: 'SPJIMR Mumbai',
        year: 2018
      }
    ],
    resume: 'https://www.figma.com/file/divya-mohan-resume',
    source: 'Outbound Recruitment',
    appliedDate: '2023-12-12',
    stage: RecruitmentStage.APPLIED,
    jobId: '2',
    notes: 'Interested in our product after being a power user. Has strong ideas on positioning.',
    assessment: {
      score: 81,
      feedback: 'Good marketing background but limited core product experience',
      completed: true
    }
  },
  {
    id: '91',
    name: 'Aryan Singh',
    email: 'aryansingh.ds@gmail.com',
    phone: '+91 7878-789789',
    currentTitle: 'ML Engineer',
    currentCompany: 'Freshworks',
    location: 'Chennai',
    experience: 3,
    skills: ['Python', 'Machine Learning', 'FastAPI', 'MLOps', 'SQL', 'Docker'],
    education: [
      {
        degree: 'Master of Computer Applications',
        institution: 'Christ University',
        year: 2021
      }
    ],
    resume: 'https://aryansingh.xyz/assets/resume-2024.pdf',
    source: 'Kaggle',
    appliedDate: '2024-01-15',
    stage: RecruitmentStage.APPLIED,
    jobId: '3',
    notes: 'Active contributor to open source ML libraries. Currently implementing MLOps practices at Freshworks.',
    assessment: {
      score: 83,
      feedback: 'Strong skills in productionizing ML systems',
      completed: true
    }
  },
  {
    id: '92',
    name: 'Raman Verma',
    email: 'r.verma9@yahoo.com',
    phone: '98xx xx1230',
    currentTitle: 'DevOps Engineer',
    currentCompany: 'Grofers',
    location: 'Delhi',
    experience: 4,
    skills: ['Docker', 'Kubernetes', 'Jenkins', 'Ansible', 'AWS', 'Monitoring'],
    education: [
      {
        degree: 'B.Tech in IT',
        institution: 'IP University',
        year: 2020
      }
    ],
    resume: 'https://www.dropbox.com/s/raman_resume_2024',
    source: 'DevOps Meetup',
    appliedDate: '2023-10-18',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '4',
    notes: 'Currently managing CI/CD for grocery delivery platform. Has experience with high-traffic systems.',
    assessment: {
      score: 74,
      feedback: 'Solid foundational skills, needs more experience with complex systems',
      completed: true
    }
  },
  {
    id: '93',
    name: 'Kiran Nair',
    email: 'kiran_n@hotmail.com',
    phone: '(+9) 1909090090',
    currentTitle: 'UX Designer & Developer',
    currentCompany: 'Lowe\'s India',
    location: 'Bangalore, KA',
    experience: 4.5,
    skills: ['React', 'UI Design', 'Figma', 'CSS', 'User Testing', 'Accessibility'],
    education: [
      {
        degree: 'B.Des. in UI/UX',
        institution: 'Srishti Institute of Art & Design',
        year: 2019
      }
    ],
    resume: 'https://kirannair.design',
    source: 'Behance',
    appliedDate: '2024-02-05',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '1',
    notes: 'Strong portfolio combining design and development skills. Passionate about accessibility.',
    assessment: {
      score: 89,
      feedback: 'Excellent design-development hybrid skills',
      completed: true
    }
  },
  {
    id: '94',
    name: 'Priya Jaiswal',
    email: 'priyaj@ymail.com',
    phone: '11-22445566',
    currentTitle: 'Chief Product Officer',
    currentCompany: 'Early stage startup (stealth)',
    location: 'Bangalore',
    experience: 15,
    skills: ['Product Strategy', 'Leadership', 'Startup Scaling', 'UX', 'Product Operations'],
    education: [
      {
        degree: 'MBA',
        institution: 'Harvard Business School',
        year: 2011
      },
      {
        degree: 'B.Tech in Computer Science',
        institution: 'BITS Pilani',
        year: 2006
      }
    ],
    resume: 'Only LinkedIn profile available currently',
    source: 'Personal Network',
    appliedDate: '2023-11-22',
    stage: RecruitmentStage.REJECTED,
    jobId: '2',
    notes: 'Amazing candidate but far too senior for current role. Keep in network for leadership positions.',
    assessment: {
      score: 96,
      feedback: 'Outstanding product leadership experience, overqualified for current openings',
      completed: true
    }
  },
  {
    id: '95',
    name: 'Abdul Rahman',
    email: 'ar1992@gmail.co.in',
    phone: '+91 76138 23578',
    currentTitle: 'Senior Machine Learning Engineer',
    currentCompany: 'Flipkart',
    location: 'Bangalore',
    experience: 7,
    skills: ['Python', 'Deep Learning', 'Recommendation Systems', 'Spark', 'AWS', 'TensorFlow'],
    education: [
      {
        degree: 'M.Tech in Data Science',
        institution: 'IIT Bombay',
        year: 2017
      }
    ],
    resume: 'Via encrypted email',
    source: 'Referral (Internal)',
    appliedDate: '2023-09-20',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Leading recommendation engine team at Flipkart. Built system serving 400+ million users.',
    assessment: {
      score: 94,
      feedback: 'Strong technical depth and experience with large-scale systems',
      completed: true
    }
  },
  {
    id: '96',
    name: 'Jay Patel',
    email: 'jay.devops@gmail.com',
    phone: '9876543210',
    currentTitle: 'Platform Engineer',
    currentCompany: 'Myntra',
    location: 'Bangalore',
    experience: 6,
    skills: ['Kubernetes', 'AWS', 'Terraform', 'Go', 'GitOps', 'CI/CD'],
    education: [
      {
        degree: 'B.E in Computer Science',
        institution: 'RV College of Engineering',
        year: 2018
      }
    ],
    resume: 'https://github.com/jaypatel-docs/resume',
    source: 'Recruiters Campaign',
    appliedDate: '2024-02-02',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Part of platform team that scaled Myntra for festival sales. Interested in developer experience and internal tooling.',
    assessment: {
      score: 89,
      feedback: 'Excellent hands-on experience with modern infrastructure technologies',
      completed: true
    }
  },
  {
    id: '97',
    name: 'Trisha Mukherjee',
    email: 'trisha.ui@outlook.com',
    phone: '+91 95767 55077',
    currentTitle: 'Frontend Team Lead',
    currentCompany: 'MoEngage',
    location: 'Hyderabad',
    experience: 8,
    skills: ['React', 'TypeScript', 'Team Management', 'Performance Optimization', 'Micro-frontends'],
    education: [
      {
        degree: 'B.Tech in CSE',
        institution: 'NIT Rourkela',
        year: 2016
      }
    ],
    resume: 'https://trishamukherjee.com/resume',
    source: 'ReactIndia Conference',
    appliedDate: '2023-10-10',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '1',
    notes: 'Currently managing team of 8 frontend developers. Wants to focus more on architecture role.',
    assessment: {
      score: 90,
      feedback: 'Strong technical leadership and architectural thinking',
      completed: true
    }
  },
  {
    id: '98',
    name: 'Vishal Sharma',
    email: 'v.sharma@ola.com',
    phone: '+91 60515 97655',
    currentTitle: 'Product Manager - Payments',
    currentCompany: 'Ola',
    location: 'Bangalore',
    experience: 5,
    skills: ['Product Management', 'Fintech', 'Payments', 'Analytics', 'Growth'],
    education: [
      {
        degree: 'MBA',
        institution: 'S.P. Jain Institute of Management',
        year: 2019
      },
      {
        degree: 'BBA',
        institution: 'Christ University',
        year: 2016
      }
    ],
    resume: 'Resume shared via secure channel',
    source: 'TopHire',
    appliedDate: '2024-01-07',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '2',
    notes: 'Led payments team at Ola. Scaled payment processing 5x in 18 months. Requests confidentiality.',
    assessment: {
      score: 88,
      feedback: 'Strong domain expertise in payments and good product sense',
      completed: true
    }
  },
  {
    id: '99',
    name: 'Vijay Kumar',
    email: 'vijay.kumar1985@gmail.com',
    phone: '0091 9486 200456',
    currentTitle: 'Principal Data Scientist',
    currentCompany: 'Walmart Global Tech',
    location: 'Bangalore',
    experience: 12,
    skills: ['Python', 'Machine Learning', 'Big Data', 'Leadership', 'System Design', 'Supply Chain ML'],
    education: [
      {
        degree: 'PhD in Statistics',
        institution: 'University of Michigan',
        year: 2012
      },
      {
        degree: 'B.Tech in CS',
        institution: 'IIT Madras',
        year: 2007
      }
    ],
    resume: 'https://vjkumar.net/resume',
    source: 'LinkedIn',
    appliedDate: '2023-08-28',
    stage: RecruitmentStage.HIRED,
    jobId: '3',
    notes: 'Joined as Director of Data Science on Feb 1, 2024. Leading our new ML platform initiative.',
    assessment: {
      score: 98,
      feedback: 'Exceptional technical and leadership skills',
      completed: true
    }
  },
  {
    id: '100',
    name: 'Sunita Patel',
    email: 'sunita.devops@protonmail.com',
    phone: '+91 87830 48479',
    currentTitle: 'DevOps Manager',
    currentCompany: 'Intuit India',
    location: 'Bangalore',
    experience: 9,
    skills: ['AWS', 'DevOps', 'Leadership', 'Security', 'Serverless', 'Cost Optimization'],
    education: [
      {
        degree: 'Post Graduate Diploma in Management',
        institution: 'XLRI Jamshedpur',
        year: 2015
      },
      {
        degree: 'B.Tech in Computer Science',
        institution: 'NIT Surat',
        year: 2009
      }
    ],
    resume: 'https://linktr.ee/sunita_patel',
    source: 'Employee Referral',
    appliedDate: '2023-12-03',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Highly experienced manager who wants to go back to IC role. Values work-life balance over compensation.',
    assessment: {
      score: 91,
      feedback: 'Strong technical and leadership background',
      completed: true
    }
  },
  {
    id: '101',
    name: 'Rajesh Menon',
    email: 'rajeshmenon78@gmail.com',
    phone: '91-98765-43289',
    currentTitle: 'Full Stack Developer',
    currentCompany: 'HCL Technologies',
    location: 'Kochi, Kerala',
    experience: 6.5,
    skills: ['Node.js', 'React', 'MongoDB', 'Express', 'GraphQL', 'AWS'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'Cochin University of Science and Technology',
        year: 2016
      }
    ],
    resume: 'https://rajeshmenon.dev/resume.pdf',
    source: 'Naukri.com',
    appliedDate: '2024-02-15',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '1',
    notes: 'Worked on payment gateway integration projects. Has experience with microservices architecture.',
    assessment: {
      score: 83,
      feedback: 'Good full-stack skills with practical experience',
      completed: true
    }
  },
  {
    id: '102',
    name: 'Kavita Krishnan',
    email: 'kavita.krishnan@outlook.com',
    phone: '9945678123',
    currentTitle: 'Product Growth Manager',
    currentCompany: 'Swiggy',
    location: 'Bangalore, Karnataka',
    experience: 5.2,
    skills: ['Product Management', 'Growth Hacking', 'A/B Testing', 'Data Analysis', 'User Acquisition'],
    education: [
      {
        degree: 'MBA (Marketing)',
        institution: 'NMIMS Mumbai',
        year: 2018
      },
      {
        degree: 'B.E. in Electronics',
        institution: 'Manipal Institute of Technology',
        year: 2014
      }
    ],
    resume: 'https://drive.google.com/kavita_k_resume',
    source: 'AngelList',
    appliedDate: '2024-01-28',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '2',
    notes: 'Led user acquisition initiatives at Swiggy. Increased conversion rates by 28% through targeted campaigns.',
    assessment: {
      score: 87,
      feedback: 'Strong analytical approach to product growth',
      completed: true
    }
  },
  {
    id: '103',
    name: 'Sanjay Venkatesh',
    email: 'sanjay.venk@datainsights.in',
    phone: '+91 8845992167',
    currentTitle: 'Machine Learning Engineer',
    currentCompany: 'Genpact',
    location: 'Hyderabad, Telangana',
    experience: 4.8,
    skills: ['Python', 'TensorFlow', 'Keras', 'Computer Vision', 'NLP', 'Spark'],
    education: [
      {
        degree: 'M.Tech in Data Science',
        institution: 'IIIT Hyderabad',
        year: 2019
      }
    ],
    resume: 'http://sanjayvenk.me/cv',
    source: 'Internal Database',
    appliedDate: '2024-02-05',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Developed computer vision models for retail analytics. Published paper at CVPR 2022.',
    assessment: {
      score: 89,
      feedback: 'Excellent technical knowledge in ML and practical implementation',
      completed: false
    }
  },
  {
    id: '104',
    name: 'Anand Prakash',
    email: 'anand.prakash@yahoo.co.in',
    phone: '7788990012',
    currentTitle: 'DevOps Specialist',
    currentCompany: 'Infosys',
    location: 'Pune, Maharashtra',
    experience: 7.5,
    skills: ['Kubernetes', 'Docker', 'Jenkins', 'Ansible', 'Terraform', 'Linux'],
    education: [
      {
        degree: 'B.E. in Computer Engineering',
        institution: 'Pune Institute of Technology',
        year: 2015
      }
    ],
    resume: 'Will share after initial screening',
    source: 'LinkedIn',
    appliedDate: '2024-01-10',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Certified Kubernetes Administrator. Led migration from on-prem to cloud for major banking client.',
    assessment: {
      score: 85,
      feedback: 'Strong hands-on experience with container orchestration',
      completed: true
    }
  },
  {
    id: '105',
    name: 'Lakshmi Nair',
    email: 'lakshmi.nair92@gmail.com',
    phone: '8712345600',
    currentTitle: 'UI/UX Designer',
    currentCompany: 'Freshworks',
    location: 'Chennai, Tamil Nadu',
    experience: 4,
    skills: ['Figma', 'Adobe XD', 'User Research', 'Design Systems', 'Prototyping', 'UI Animation'],
    education: [
      {
        degree: 'B.Des in Interaction Design',
        institution: 'National Institute of Design, Ahmedabad',
        year: 2018
      }
    ],
    resume: 'https://www.behance.net/lakshminair',
    source: 'Referral',
    appliedDate: '2024-02-22',
    stage: RecruitmentStage.APPLIED,
    jobId: '1',
    notes: 'Impressive portfolio with focus on B2B interfaces. Redesigned Freshworks CRM dashboard.',
    assessment: {
      score: 90,
      feedback: 'Great visual design skills with strong UX methodology',
      completed: true
    }
  },
  {
    id: '106',
    name: 'Prakash Mittal',
    email: 'prakash.mittal@gmail.com',
    phone: '9812567834',
    currentTitle: 'Senior Product Manager',
    currentCompany: 'PhonePe',
    location: 'Bangalore, Karnataka',
    experience: 8,
    skills: ['Product Strategy', 'Fintech', 'Agile', 'Wire-framing', 'Business Analytics', 'Stakeholder Management'],
    education: [
      {
        degree: 'MBA',
        institution: 'IIM Calcutta',
        year: 2016
      },
      {
        degree: 'B.Tech in Mechanical Engineering',
        institution: 'Delhi Technological University',
        year: 2012
      }
    ],
    resume: 'https://shorturl.at/prakashm',
    source: 'TopHire',
    appliedDate: '2023-12-15',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '2',
    notes: 'Managed UPI payment products at PhonePe with 100M+ users. Looking for better work-life balance.',
    assessment: {
      score: 92,
      feedback: 'Excellent product sense and business acumen',
      completed: true
    }
  },
  {
    id: '107',
    name: 'Shreya Agarwal',
    email: 'shreya.datascience@outlook.com',
    phone: '+91 9967453211',
    currentTitle: 'Data Scientist',
    currentCompany: 'Fractal Analytics',
    location: 'Mumbai, Maharashtra',
    experience: 3.5,
    skills: ['Python', 'R', 'Statistical Modeling', 'Pandas', 'Scikit-learn', 'Tableau'],
    education: [
      {
        degree: 'MS in Statistics',
        institution: 'ISI Kolkata',
        year: 2020
      },
      {
        degree: 'B.Sc in Mathematics',
        institution: 'St. Xaviers College, Mumbai',
        year: 2017
      }
    ],
    resume: 'https://bit.ly/shreya-agarwal-cv',
    source: 'Campus Recruitment',
    appliedDate: '2024-03-01',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Good theoretical background in statistics. Worked on BFSI analytics projects.',
    assessment: {
      score: 81,
      feedback: 'Strong mathematical foundation, needs more industry experience',
      completed: false
    }
  },
  {
    id: '108',
    name: 'Vipin Tiwari',
    email: 'vipin.t@rediffmail.com',
    phone: '8877665599',
    currentTitle: 'Site Reliability Engineer',
    currentCompany: 'Persistent Systems',
    location: 'Pune, Maharashtra',
    experience: 6,
    skills: ['AWS', 'GCP', 'Monitoring', 'Automation', 'Python', 'Shell Scripting', 'Prometheus'],
    education: [
      {
        degree: 'B.E. in Information Technology',
        institution: 'Government College of Engineering, Pune',
        year: 2017
      }
    ],
    resume: 'https://vipintiwari.com/about',
    source: 'Indeed',
    appliedDate: '2024-01-05',
    stage: RecruitmentStage.APPLIED,
    jobId: '4',
    notes: 'Managed production infrastructure for multiple enterprise clients. Reduced MTTR by 45%.',
    assessment: {
      score: 78,
      feedback: 'Good operational knowledge but needs stronger coding skills',
      completed: true
    }
  },
  {
    id: '109',
    name: 'Nikhil Iyer',
    email: 'nikhil.iyer@hotmail.com',
    phone: '9823456701',
    currentTitle: 'Frontend Engineer',
    currentCompany: 'Razorpay',
    location: 'Bangalore, Karnataka',
    experience: 5,
    skills: ['React', 'Redux', 'TypeScript', 'NextJS', 'Webpack', 'Storybook'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'VIT Vellore',
        year: 2019
      }
    ],
    resume: 'https://nikhiliyer.dev',
    source: 'Employee Referral',
    appliedDate: '2024-02-10',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '1',
    notes: 'Worked on payment checkout components at Razorpay. Experienced with micro-frontends.',
    assessment: {
      score: 86,
      feedback: 'Strong in frontend development with modern frameworks',
      completed: true
    }
  },
  {
    id: '110',
    name: 'Deepika Malhotra',
    email: 'deepika.pm@irctc.co.in',
    phone: '7045678912',
    currentTitle: 'Associate Product Manager',
    currentCompany: 'IRCTC',
    location: 'New Delhi, Delhi',
    experience: 3,
    skills: ['Product Management', 'User Research', 'JIRA', 'Analytics', 'Government Tech'],
    education: [
      {
        degree: 'MBA',
        institution: 'Faculty of Management Studies, Delhi',
        year: 2021
      }
    ],
    resume: 'Contact HR for CV',
    source: 'Instahyre',
    appliedDate: '2024-03-05',
    stage: RecruitmentStage.APPLIED,
    jobId: '2',
    notes: 'Worked on IRCTC mobile app with 100M downloads. Strong in public sector digital transformation.',
    assessment: {
      score: 75,
      feedback: 'Good domain knowledge but limited private sector experience',
      completed: true
    }
  },
  {
    id: '111',
    name: 'Rahul Mahajan',
    email: 'rahul.ml.engineer@gmail.com',
    phone: '+91 8956234109',
    currentTitle: 'ML Engineer',
    currentCompany: 'Ola Electric',
    location: 'Bangalore, Karnataka',
    experience: 4.5,
    skills: ['Python', 'Deep Learning', 'Computer Vision', 'PyTorch', 'OpenCV', 'MLOps'],
    education: [
      {
        degree: 'M.Tech in Computer Science',
        institution: 'IIT Kharagpur',
        year: 2019
      }
    ],
    resume: 'https://github.com/rahulmahajan/resume',
    source: 'Kaggle Competition',
    appliedDate: '2024-02-07',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Developed computer vision models for battery defect detection. Top 5% in 3 Kaggle competitions.',
    assessment: {
      score: 88,
      feedback: 'Strong practical ML experience with industrial applications',
      completed: true
    }
  },
  {
    id: '112',
    name: 'Manish Arora',
    email: 'manish.arora@protonmail.com',
    phone: '9765438920',
    currentTitle: 'Cloud Infrastructure Engineer',
    currentCompany: 'Jio Platforms',
    location: 'Mumbai, Maharashtra',
    experience: 7,
    skills: ['AWS', 'Azure', 'Infrastructure as Code', 'Terraform', 'Network Security', 'Cost Optimization'],
    education: [
      {
        degree: 'B.E. in Computer Science',
        institution: 'Thadomal Shahani Engineering College, Mumbai',
        year: 2016
      }
    ],
    resume: 'https://manisharora.net/professional',
    source: 'Company Website',
    appliedDate: '2023-12-18',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Led cloud migration projects at Jio. Manages infrastructure supporting 400M+ users.',
    assessment: {
      score: 87,
      feedback: 'Excellent at scale infrastructure management',
      completed: true
    }
  },
  {
    id: '113',
    name: 'Priyanka Sharma',
    email: 'priyanka.webdev@gmail.com',
    phone: '9932108754',
    currentTitle: 'Senior UI Developer',
    currentCompany: 'Flipkart',
    location: 'Bangalore, Karnataka',
    experience: 6,
    skills: ['React', 'JavaScript', 'CSS3', 'Styled Components', 'Performance Optimization', 'A11y'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Jaypee Institute of Information Technology',
        year: 2017
      }
    ],
    resume: 'https://priyankasharma.dev',
    source: 'LinkedIn',
    appliedDate: '2024-01-22',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '1',
    notes: 'Part of Flipkart\'s core UI team. Implemented accessibility improvements that increased user engagement by 15%.',
    assessment: {
      score: 89,
      feedback: 'Strong frontend skills with focus on accessibility and performance',
      completed: true
    }
  },
  {
    id: '114',
    name: 'Kiran Deshmukh',
    email: 'kiran.d@productmanager.co.in',
    phone: '7788123456',
    currentTitle: 'Product Owner',
    currentCompany: 'Byjus',
    location: 'Bangalore, Karnataka',
    experience: 5.5,
    skills: ['Product Management', 'Edtech', 'User Research', 'Agile', 'Analytics', 'Customer Journey Mapping'],
    education: [
      {
        degree: 'MBA',
        institution: 'Symbiosis Institute of Business Management',
        year: 2018
      },
      {
        degree: 'B.E. in Electronics',
        institution: 'PES University',
        year: 2014
      }
    ],
    resume: 'https://linktr.ee/kirandeshmukh',
    source: 'PM School Network',
    appliedDate: '2024-02-28',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '2',
    notes: 'Led K-12 math products at Byju\'s. Strong in education product metrics.',
    assessment: {
      score: 84,
      feedback: 'Good domain knowledge in edtech with solid PM fundamentals',
      completed: true
    }
  },
  {
    id: '115',
    name: 'Aditya Choudhary',
    email: 'aditya.ch@outlook.com',
    phone: '8234567099',
    currentTitle: 'Data Engineer',
    currentCompany: 'ShareChat',
    location: 'Bangalore, Karnataka',
    experience: 4,
    skills: ['Spark', 'Hadoop', 'Python', 'SQL', 'ETL', 'Airflow', 'Kafka'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'NIT Jalandhar',
        year: 2020
      }
    ],
    resume: 'https://adityachoudhary.me/resume',
    source: 'Hired.com',
    appliedDate: '2024-01-15',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Built data pipelines processing 5TB+ daily at ShareChat. Experience with video analytics.',
    assessment: {
      score: 79,
      feedback: 'Good data engineering skills, average analytical skills',
      completed: false
    }
  },
  {
    id: '116',
    name: 'Ganesh Raman',
    email: 'ganesh.raman@zoho.com',
    phone: '9056782301',
    currentTitle: 'Technical Lead - DevOps',
    currentCompany: 'Zoho',
    location: 'Chennai, Tamil Nadu',
    experience: 9,
    skills: ['Kubernetes', 'Docker', 'CI/CD', 'Python', 'GitOps', 'Monitoring', 'Security'],
    education: [
      {
        degree: 'B.E. in Computer Science',
        institution: 'Anna University',
        year: 2013
      }
    ],
    resume: 'https://ganeshramancv.zohocloud.com',
    source: 'Stack Overflow Jobs',
    appliedDate: '2023-11-05',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '4',
    notes: 'Long tenure at Zoho. Built private cloud infrastructure. Looking for new challenges.',
    assessment: {
      score: 93,
      feedback: 'Excellent DevOps architecture skills and leadership potential',
      completed: true
    }
  },
  {
    id: '117',
    name: 'Ritu Jain',
    email: 'ritu.jain@ymail.com',
    phone: '7689012345',
    currentTitle: 'Frontend Developer',
    currentCompany: 'MakeMyTrip',
    location: 'Gurgaon, Haryana',
    experience: 3,
    skills: ['JavaScript', 'React', 'Redux', 'HTML5', 'CSS3', 'Material UI'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Amity University',
        year: 2021
      }
    ],
    resume: 'https://ritujain.vercel.app',
    source: 'GeeksforGeeks Job Portal',
    appliedDate: '2024-03-10',
    stage: RecruitmentStage.APPLIED,
    jobId: '1',
    notes: 'Worked on MakeMyTrips hotel booking interface. Good UI skills but limited system design experience.',
    assessment: {
      score: 76,
      feedback: 'Solid frontend implementation skills, growing technical depth',
      completed: true
    }
  },
  {
    id: '118',
    name: 'Vivek Singhania',
    email: 'vivek.product@gmail.com',
    phone: '9912345678',
    currentTitle: 'Senior Product Manager',
    currentCompany: 'PayTM',
    location: 'Delhi NCR',
    experience: 7,
    skills: ['Product Strategy', 'UX Research', 'FinTech', 'Digital Payments', 'Market Analysis', 'A/B Testing'],
    education: [
      {
        degree: 'MBA',
        institution: 'MDI Gurgaon',
        year: 2017
      },
      {
        degree: 'B.E. in Electronics',
        institution: 'NSIT Delhi',
        year: 2014
      }
    ],
    resume: 'https://tinyurl.com/vsinghania',
    source: 'Cutshort',
    appliedDate: '2024-01-30',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '2',
    notes: 'Led PayTM\'s QR code payments product. Has experience scaling products from 1M to 50M users.',
    assessment: {
      score: 91,
      feedback: 'Excellent product thinking with strong execution track record',
      completed: true
    }
  },
  {
    id: '119',
    name: 'Nandini Reddy',
    email: 'nandini.reddy@gmail.com',
    phone: '8345678210',
    currentTitle: 'Research Scientist - NLP',
    currentCompany: 'Microsoft Research',
    location: 'Hyderabad, Telangana',
    experience: 5,
    skills: ['Python', 'NLP', 'Transformers', 'PyTorch', 'BERT', 'Research', 'Language Models'],
    education: [
      {
        degree: 'M.Tech in Artificial Intelligence',
        institution: 'IIIT Hyderabad',
        year: 2019
      },
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Osmania University',
        year: 2017
      }
    ],
    resume: 'Will be provided after initial discussion',
    source: 'ACL Conference',
    appliedDate: '2024-02-18',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Working on multilingual NLP models at Microsoft Research. 2 research papers published at ACL.',
    assessment: {
      score: 94,
      feedback: 'Exceptional NLP research background with practical implementation experience',
      completed: true
    }
  },
  {
    id: '120',
    name: 'Rohan Kapoor',
    email: 'rohan.devops@yahoo.co.in',
    phone: '9876123450',
    currentTitle: 'DevOps Engineer',
    currentCompany: 'Ather Energy',
    location: 'Bangalore, Karnataka',
    experience: 4.5,
    skills: ['AWS', 'Terraform', 'CI/CD', 'Docker', 'Kubernetes', 'Python', 'Shell Scripting'],
    education: [
      {
        degree: 'B.E. in Information Science',
        institution: 'R.V. College of Engineering',
        year: 2019
      }
    ],
    resume: 'https://rohankapoor.in/resume',
    source: 'Naukri.com',
    appliedDate: '2024-03-02',
    stage: RecruitmentStage.APPLIED,
    jobId: '4',
    notes: 'Built CI/CD pipelines for IoT device firmware updates at Ather. Interested in infrastructure automation.',
    assessment: {
      score: 82,
      feedback: 'Good technical skills with IoT deployment experience',
      completed: true
    }
  },
  {
    id: '121',
    name: 'Aryan Kapoor',
    email: 'aryan.k@gmail.com',
    phone: '9123456780',
    currentTitle: 'Frontend Developer',
    currentCompany: 'Paytm',
    location: 'Noida, Uttar Pradesh',
    experience: 3.5,
    skills: ['React', 'JavaScript', 'CSS3', 'Redux', 'GraphQL', 'Responsive Design'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Jaypee Institute of Information Technology',
        year: 2020
      }
    ],
    resume: 'https://aryankapoor.netlify.app/resume',
    source: 'LinkedIn',
    appliedDate: '2024-03-01',
    stage: RecruitmentStage.APPLIED,
    jobId: '1',
    notes: 'Worked on Paytm merchant dashboard. Created reusable component library.',
    assessment: {
      score: 78,
      feedback: 'Good frontend skills with room for growth in system design',
      completed: true
    }
  },
  {
    id: '122',
    name: 'Sneha Prabhu',
    email: 'sneha.prabhu@outlook.com',
    phone: '7890123456',
    currentTitle: 'Product Manager',
    currentCompany: 'Urban Company',
    location: 'Bangalore, Karnataka',
    experience: 4,
    skills: ['Product Management', 'Service Industry', 'User Research', 'B2C Products', 'Analytics'],
    education: [
      {
        degree: 'MBA',
        institution: 'XLRI Jamshedpur',
        year: 2020
      },
      {
        degree: 'B.Tech in Electronics',
        institution: 'NIT Surathkal',
        year: 2016
      }
    ],
    resume: 'https://drive.google.com/sneha_resume',
    source: 'AngelList',
    appliedDate: '2024-02-12',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '2',
    notes: 'Managed service provider app at Urban Company. Improved provider retention by 22%.',
    assessment: {
      score: 82,
      feedback: 'Good problem-solving skills with focus on user experience',
      completed: true
    }
  },
  {
    id: '123',
    name: 'Karthik Rajan',
    email: 'karthikr@gmail.com',
    phone: '8234567890',
    currentTitle: 'AI Engineer',
    currentCompany: 'Navi',
    location: 'Bangalore, Karnataka',
    experience: 5,
    skills: ['Python', 'NLP', 'Machine Learning', 'TensorFlow', 'Keras', 'FastAPI'],
    education: [
      {
        degree: 'M.Tech in AI',
        institution: 'IIT Madras',
        year: 2019
      }
    ],
    resume: 'https://karthikrajan.com/resume',
    source: 'Hired.com',
    appliedDate: '2024-01-20',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Developed fraud detection models at Navi. Reduced false positives by 35%.',
    assessment: {
      score: 87,
      feedback: 'Strong technical skills with practical ML deployment experience',
      completed: true
    }
  },
  {
    id: '124',
    name: 'Venkat Subramaniam',
    email: 'venkat.devops@gmail.com',
    phone: '+91 9876501234',
    currentTitle: 'DevOps Engineer',
    currentCompany: 'Cred',
    location: 'Bangalore, Karnataka',
    experience: 6,
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'GitOps', 'Security', 'Monitoring'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'SRM University',
        year: 2018
      }
    ],
    resume: 'http://venkats.in/resume',
    source: 'Cutshort',
    appliedDate: '2024-02-05',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Implemented infrastructure automation at Cred. Reduced deployment time from hours to minutes.',
    assessment: {
      score: 85,
      feedback: 'Strong operational skills with good security focus',
      completed: false
    }
  },
  {
    id: '125',
    name: 'Tanvi Mehta',
    email: 'tanvi.mehta@gmail.com',
    phone: '9567890123',
    currentTitle: 'UI Developer',
    currentCompany: 'Dream11',
    location: 'Mumbai, Maharashtra',
    experience: 4,
    skills: ['React', 'JavaScript', 'CSS', 'Animation', 'Performance Optimization', 'Web Components'],
    education: [
      {
        degree: 'B.E. in Information Technology',
        institution: 'Mumbai University',
        year: 2020
      }
    ],
    resume: 'https://tanvimehta.com',
    source: 'Internal Database',
    appliedDate: '2024-02-25',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '1',
    notes: 'Created interactive visualizations for Dream11 fantasy sports platform. Strong in performance optimization.',
    assessment: {
      score: 83,
      feedback: 'Good animation skills and performance optimization knowledge',
      completed: true
    }
  },
  {
    id: '126',
    name: 'Ankit Singh',
    email: 'ankit.singh@yahoo.com',
    phone: '7789012345',
    currentTitle: 'Senior Product Manager',
    currentCompany: 'BigBasket',
    location: 'Bangalore, Karnataka',
    experience: 7,
    skills: ['Product Management', 'E-commerce', 'Food Supply Chain', 'Agile', 'Analytics', 'B2C'],
    education: [
      {
        degree: 'MBA',
        institution: 'IIM Bangalore',
        year: 2017
      },
      {
        degree: 'B.Tech in Production Engineering',
        institution: 'IIT Roorkee',
        year: 2013
      }
    ],
    resume: 'https://ankitsingh.me/resume',
    source: 'LinkedIn',
    appliedDate: '2023-12-10',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '2',
    notes: 'Led grocery delivery product at BigBasket. Improved order fulfillment rate by 18%.',
    assessment: {
      score: 90,
      feedback: 'Excellent product sense with strong supply chain knowledge',
      completed: true
    }
  },
  {
    id: '127',
    name: 'Neha Bhatia',
    email: 'neha.data@gmail.com',
    phone: '8901234567',
    currentTitle: 'Data Scientist',
    currentCompany: 'Myntra',
    location: 'Bangalore, Karnataka',
    experience: 5,
    skills: ['Python', 'Machine Learning', 'Recommendation Systems', 'SQL', 'A/B Testing', 'Data Visualization'],
    education: [
      {
        degree: 'M.Tech in Data Science',
        institution: 'BITS Pilani',
        year: 2019
      }
    ],
    resume: 'https://www.linkedin.com/in/nehadata',
    source: 'Referral',
    appliedDate: '2024-01-15',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Built recommendation engine for Myntra fashion products. Increased conversion by 12%.',
    assessment: {
      score: 86,
      feedback: 'Strong analytical skills with good business understanding',
      completed: true
    }
  },
  {
    id: '128',
    name: 'Vivek Patil',
    email: 'vivek.patil@gmail.com',
    phone: '9123450678',
    currentTitle: 'SRE',
    currentCompany: 'PhonePe',
    location: 'Bangalore, Karnataka',
    experience: 5.5,
    skills: ['AWS', 'Kubernetes', 'Prometheus', 'Grafana', 'Python', 'Linux', 'Incident Management'],
    education: [
      {
        degree: 'B.Tech in Computer Engineering',
        institution: 'College of Engineering, Pune',
        year: 2018
      }
    ],
    resume: 'https://bit.ly/vivek-patil-resume',
    source: 'Naukri.com',
    appliedDate: '2024-02-18',
    stage: RecruitmentStage.APPLIED,
    jobId: '4',
    notes: 'Managed critical payment infrastructure at PhonePe. Implemented robust monitoring solutions.',
    assessment: {
      score: 84,
      feedback: 'Good operational knowledge with strong incident management experience',
      completed: true
    }
  },
  {
    id: '129',
    name: 'Rohit Sharma',
    email: 'rohit.sharma@outlook.com',
    phone: '7012345678',
    currentTitle: 'Frontend Lead',
    currentCompany: 'Zomato',
    location: 'Gurgaon, Haryana',
    experience: 7,
    skills: ['React', 'TypeScript', 'React Native', 'Redux', 'Performance', 'Team Management'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'Delhi Technological University',
        year: 2017
      }
    ],
    resume: 'https://rohitsharma.dev',
    source: 'Company Website',
    appliedDate: '2023-11-20',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '1',
    notes: 'Led frontend team at Zomato. Improved app performance by 40%. Managed team of 8 developers.',
    assessment: {
      score: 92,
      feedback: 'Excellent technical and leadership skills',
      completed: true
    }
  },
  {
    id: '130',
    name: 'Pooja Verma',
    email: 'pooja.product@yahoo.in',
    phone: '8890123456',
    currentTitle: 'Product Manager',
    currentCompany: 'ClearTax',
    location: 'Bangalore, Karnataka',
    experience: 4.5,
    skills: ['Product Management', 'FinTech', 'Taxation', 'User Research', 'Analytics', 'B2B Products'],
    education: [
      {
        degree: 'MBA',
        institution: 'NMIMS Mumbai',
        year: 2019
      },
      {
        degree: 'B.Com',
        institution: 'St. Xavier\'s College, Mumbai',
        year: 2015
      }
    ],
    resume: 'Will share directly',
    source: 'TopHire',
    appliedDate: '2024-01-28',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '2',
    notes: 'Managed tax filing products at ClearTax. Increased user retention by 25%.',
    assessment: {
      score: 85,
      feedback: 'Good domain knowledge with strong user focus',
      completed: true
    }
  },
  {
    id: '131',
    name: 'Amit Jha',
    email: 'amit.jha@gmail.com',
    phone: '9876541230',
    currentTitle: 'ML Engineer',
    currentCompany: 'Meesho',
    location: 'Bangalore, Karnataka',
    experience: 3,
    skills: ['Python', 'Machine Learning', 'Computer Vision', 'TensorFlow', 'AWS', 'Docker'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'IIT Roorkee',
        year: 2021
      }
    ],
    resume: 'https://github.com/amitjha/resume',
    source: 'LinkedIn',
    appliedDate: '2024-02-15',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Developed image classification models at Meesho. Focus on e-commerce product categorization.',
    assessment: {
      score: 80,
      feedback: 'Good technical skills but limited production experience',
      completed: false
    }
  },
  {
    id: '132',
    name: 'Divya Sundaram',
    email: 'divya.devops@outlook.com',
    phone: '8765019234',
    currentTitle: 'DevOps Engineer',
    currentCompany: 'PolicyBazaar',
    location: 'Gurgaon, Haryana',
    experience: 5,
    skills: ['AWS', 'Jenkins', 'Terraform', 'Docker', 'Kubernetes', 'Python', 'Infrastructure as Code'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'VIT Vellore',
        year: 2019
      }
    ],
    resume: 'https://divyasundaram.dev/resume',
    source: 'Indeed',
    appliedDate: '2024-02-10',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Implemented CI/CD pipelines at PolicyBazaar. Achieved 99.9% uptime for critical services.',
    assessment: {
      score: 85,
      feedback: 'Strong automation skills with good security practices',
      completed: true
    }
  },
  {
    id: '133',
    name: 'Vishal Malhotra',
    email: 'vishal.m@gmail.com',
    phone: '9012345678',
    currentTitle: 'Senior Frontend Developer',
    currentCompany: 'Lenskart',
    location: 'Delhi, NCR',
    experience: 5,
    skills: ['React', 'JavaScript', 'Vue.js', 'Webpack', 'Micro-frontends', 'Performance Optimization'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'IIIT Delhi',
        year: 2019
      }
    ],
    resume: 'https://vishalmalhotra.me',
    source: 'LinkedIn',
    appliedDate: '2024-01-05',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '1',
    notes: 'Led development of virtual try-on feature at Lenskart. Experienced with AR integration.',
    assessment: {
      score: 88,
      feedback: 'Strong frontend skills with innovative AR implementation experience',
      completed: true
    }
  },
  {
    id: '134',
    name: 'Naveen Kumar',
    email: 'naveen.product@gmail.com',
    phone: '8901234056',
    currentTitle: 'Product Manager',
    currentCompany: 'Groww',
    location: 'Bangalore, Karnataka',
    experience: 5,
    skills: ['Product Management', 'FinTech', 'Investment Products', 'User Research', 'Analytics'],
    education: [
      {
        degree: 'MBA',
        institution: 'ISB Hyderabad',
        year: 2019
      },
      {
        degree: 'B.Tech in Mechanical Engineering',
        institution: 'NIT Trichy',
        year: 2015
      }
    ],
    resume: 'https://bit.ly/naveen-kumar-pm',
    source: 'AngelList',
    appliedDate: '2024-02-20',
    stage: RecruitmentStage.APPLIED,
    jobId: '2',
    notes: 'Managed mutual fund investment products at Groww. Improved user onboarding completion by 30%.',
    assessment: {
      score: 84,
      feedback: 'Good understanding of fintech products with solid analytical skills',
      completed: true
    }
  },
  {
    id: '135',
    name: 'Preeti Gupta',
    email: 'preeti.gupta@gmail.com',
    phone: '9901234567',
    currentTitle: 'Data Engineer',
    currentCompany: 'Zepto',
    location: 'Mumbai, Maharashtra',
    experience: 4,
    skills: ['Python', 'Spark', 'Kafka', 'Airflow', 'SQL', 'AWS', 'ETL'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'VJTI Mumbai',
        year: 2020
      }
    ],
    resume: 'https://preetig.dev/resume',
    source: 'Referral',
    appliedDate: '2024-01-25',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Built data pipelines for quick commerce logistics at Zepto. Experience with real-time analytics.',
    assessment: {
      score: 82,
      feedback: 'Strong data engineering skills with good real-time processing experience',
      completed: false
    }
  },
  {
    id: '136',
    name: 'Rajiv Singh',
    email: 'rajiv.cloud@gmail.com',
    phone: '7890123405',
    currentTitle: 'Cloud Infrastructure Engineer',
    currentCompany: 'Unacademy',
    location: 'Bangalore, Karnataka',
    experience: 6,
    skills: ['AWS', 'GCP', 'Terraform', 'Kubernetes', 'Docker', 'Infrastructure as Code', 'Cost Optimization'],
    education: [
      {
        degree: 'B.E. in Computer Science',
        institution: 'PES University',
        year: 2018
      }
    ],
    resume: 'https://rajivsingh.cloud/resume',
    source: 'Naukri.com',
    appliedDate: '2023-12-12',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '4',
    notes: 'Managed cloud infrastructure at Unacademy. Reduced cloud costs by 25% while scaling user base.',
    assessment: {
      score: 89,
      feedback: 'Excellent infrastructure skills with strong cost optimization focus',
      completed: true
    }
  },
  {
    id: '137',
    name: 'Leela Krishnan',
    email: 'leela.krishnan@gmail.com',
    phone: '9560123478',
    currentTitle: 'UI Designer',
    currentCompany: 'Cure.fit',
    location: 'Bangalore, Karnataka',
    experience: 4,
    skills: ['UI Design', 'Figma', 'User Research', 'Design Systems', 'Motion Design', 'Usability Testing'],
    education: [
      {
        degree: 'B.Des in Communication Design',
        institution: 'National Institute of Design',
        year: 2020
      }
    ],
    resume: 'https://www.behance.net/leelakrishnan',
    source: 'Design Portfolio',
    appliedDate: '2024-02-08',
    stage: RecruitmentStage.APPLIED,
    jobId: '1',
    notes: 'Designed fitness app interfaces at Cure.fit. Strong focus on intuitive user experience.',
    assessment: {
      score: 86,
      feedback: 'Strong visual design skills with good understanding of fitness domain',
      completed: true
    }
  },
  {
    id: '138',
    name: 'Varun Mishra',
    email: 'varun.prod@outlook.com',
    phone: '8456701923',
    currentTitle: 'Associate Product Manager',
    currentCompany: 'Dunzo',
    location: 'Bangalore, Karnataka',
    experience: 3,
    skills: ['Product Management', 'Quick Commerce', 'Agile', 'User Research', 'Data Analysis'],
    education: [
      {
        degree: 'MBA',
        institution: 'SIBM Pune',
        year: 2021
      }
    ],
    resume: 'https://varunmishra.me/resume',
    source: 'PM School Network',
    appliedDate: '2024-03-05',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '2',
    notes: 'Managed quick delivery products at Dunzo. Improved delivery times by 18%.',
    assessment: {
      score: 79,
      feedback: 'Good product fundamentals, growing strategic thinking',
      completed: true
    }
  },
  {
    id: '139',
    name: 'Sameer Joshi',
    email: 'sameer.joshi@yahoo.in',
    phone: '9012347856',
    currentTitle: 'Machine Learning Engineer',
    currentCompany: 'Sharechat',
    location: 'Bangalore, Karnataka',
    experience: 4.5,
    skills: ['Python', 'Deep Learning', 'NLP', 'Recommendation Systems', 'PyTorch', 'MLOps'],
    education: [
      {
        degree: 'M.Tech in Computer Science',
        institution: 'IIT Bombay',
        year: 2019
      }
    ],
    resume: 'https://sameerjoshi.ai/resume',
    source: 'Kaggle',
    appliedDate: '2024-01-18',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Developed content recommendation models at Sharechat. Experienced with multilingual content.',
    assessment: {
      score: 87,
      feedback: 'Strong ML skills with good understanding of Indian language content',
      completed: true
    }
  },
  {
    id: '140',
    name: 'Madhavi Patil',
    email: 'madhavi.devops@gmail.com',
    phone: '9876540123',
    currentTitle: 'DevOps Engineer',
    currentCompany: 'Razorpay',
    location: 'Bangalore, Karnataka',
    experience: 5,
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Python', 'Security'],
    education: [
      {
        degree: 'B.E. in Information Technology',
        institution: 'Pune University',
        year: 2019
      }
    ],
    resume: 'https://madhavipatil.dev/resume',
    source: 'Internal Referral',
    appliedDate: '2024-02-15',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Managed payment infrastructure at Razorpay. Implemented secure deployment pipelines.',
    assessment: {
      score: 86,
      feedback: 'Strong security focus with good fintech infrastructure experience',
      completed: false
    }
  },
  {
    id: '141',
    name: 'Vipul Mehta',
    email: 'vipul.mehta@hotmail.com',
    phone: '8234561790',
    currentTitle: 'Frontend Architect',
    currentCompany: 'Tata Consultancy Services',
    location: 'Ahmedabad, Gujarat',
    experience: 8,
    skills: ['React', 'JavaScript', 'TypeScript', 'Micro Frontends', 'Design Systems', 'NextJS', 'Performance'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Nirma University',
        year: 2015
      }
    ],
    resume: 'https://mehta-vipul.web.app',
    source: 'Employee Referral',
    appliedDate: '2024-01-08',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '1',
    notes: 'Led frontend architecture team at TCS. Built design system used across 15 internal products.',
    assessment: {
      score: 91,
      feedback: 'Excellent technical depth and architectural thinking',
      completed: true
    }
  },
  {
    id: '142',
    name: 'Nidhi Saxena',
    email: 'nidhi.product@gmail.com',
    phone: '9891267345',
    currentTitle: 'Product Manager',
    currentCompany: 'BookMyShow',
    location: 'Mumbai, Maharashtra',
    experience: 5,
    skills: ['Product Management', 'Entertainment Industry', 'User Research', 'Analytics', 'A/B Testing', 'Wireframing'],
    education: [
      {
        degree: 'MBA',
        institution: 'SP Jain Institute of Management',
        year: 2019
      },
      {
        degree: 'B.Tech in Electronics',
        institution: 'BITS Goa',
        year: 2014
      }
    ],
    resume: 'https://nidhisaxena.notion.site/resume',
    source: 'Referral',
    appliedDate: '2024-02-11',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '2',
    notes: 'Managed ticketing products at BookMyShow. Implemented new pricing strategy that increased conversions by 23%.',
    assessment: {
      score: 86,
      feedback: 'Strong product thinking with entertainment industry expertise',
      completed: true
    }
  },
  {
    id: '143',
    name: 'Gautam Banerjee',
    email: 'gautam.data@outlook.com',
    phone: '8001234567',
    currentTitle: 'Data Science Lead',
    currentCompany: 'MakeMyTrip',
    location: 'Kolkata, West Bengal',
    experience: 7,
    skills: ['Python', 'Machine Learning', 'Data Science', 'NLP', 'SQL', 'Travel Industry Analytics', 'Team Leadership'],
    education: [
      {
        degree: 'M.Tech in Computer Science',
        institution: 'IIT Kharagpur',
        year: 2017
      },
      {
        degree: 'B.E. in Information Technology',
        institution: 'Jadavpur University',
        year: 2014
      }
    ],
    resume: 'https://gautam-b.github.io/cv',
    source: 'LinkedIn',
    appliedDate: '2023-12-05',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Developed dynamic pricing models at MakeMyTrip. Manages team of 5 data scientists.',
    assessment: {
      score: 89,
      feedback: 'Strong technical skills with domain expertise in travel industry',
      completed: true
    }
  },
  {
    id: '144',
    name: 'Siddharth Nair',
    email: 'sidd.devops@gmail.com',
    phone: '9012456789',
    currentTitle: 'Platform Engineer',
    currentCompany: 'Ola',
    location: 'Bangalore, Karnataka',
    experience: 5,
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Go', 'Microservices', 'Service Mesh'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'National Institute of Technology, Calicut',
        year: 2019
      }
    ],
    resume: 'https://siddharthnair.dev',
    source: 'TopHire',
    appliedDate: '2024-01-22',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Built service mesh infrastructure at Ola. Expertise in high-scale microservices deployment.',
    assessment: {
      score: 85,
      feedback: 'Strong platform engineering skills with focus on scalability',
      completed: false
    }
  },
  {
    id: '145',
    name: 'Meera Rajput',
    email: 'meera.raj@yahoo.co.in',
    phone: '7781234567',
    currentTitle: 'Frontend Developer',
    currentCompany: 'Nykaa',
    location: 'Mumbai, Maharashtra',
    experience: 4,
    skills: ['React', 'JavaScript', 'CSS3', 'SASS', 'Redux', 'Performance Optimization', 'Mobile Web'],
    education: [
      {
        degree: 'B.E. in Computer Science',
        institution: 'DJ Sanghvi College of Engineering',
        year: 2020
      }
    ],
    resume: 'https://meerarajput.dev',
    source: 'Linkedin',
    appliedDate: '2024-02-20',
    stage: RecruitmentStage.APPLIED,
    jobId: '1',
    notes: 'Developed mobile web experience at Nykaa. Reduced page load times by 40%.',
    assessment: {
      score: 82,
      feedback: 'Good frontend skills with focus on performance',
      completed: true
    }
  },
  {
    id: '146',
    name: 'Vikash Gupta',
    email: 'vikash.product@gmail.com',
    phone: '9988776655',
    currentTitle: 'Product Manager',
    currentCompany: 'Cars24',
    location: 'Gurgaon, Haryana',
    experience: 6,
    skills: ['Product Management', 'Automotive Industry', 'Marketplace', 'Growth', 'Business Analytics', 'CRM'],
    education: [
      {
        degree: 'MBA',
        institution: 'Faculty of Management Studies, Delhi',
        year: 2018
      },
      {
        degree: 'B.Tech in Mechanical Engineering',
        institution: 'IIT Bombay',
        year: 2014
      }
    ],
    resume: 'https://vikashgupta.me',
    source: 'Company Website',
    appliedDate: '2024-02-08',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '2',
    notes: 'Led seller acquisition products at Cars24. Improved seller onboarding completion rate by 35%.',
    assessment: {
      score: 88,
      feedback: 'Strong product management skills with marketplace expertise',
      completed: true
    }
  },
  {
    id: '147',
    name: 'Avinash Reddy',
    email: 'avinash.r@outlook.com',
    phone: '8987654321',
    currentTitle: 'AI Researcher',
    currentCompany: 'Samsung Research India',
    location: 'Bangalore, Karnataka',
    experience: 6,
    skills: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'Python', 'Research', 'TensorFlow', 'PyTorch'],
    education: [
      {
        degree: 'Ph.D in Computer Science',
        institution: 'IISc Bangalore',
        year: 2021
      },
      {
        degree: 'B.Tech in Computer Science',
        institution: 'NIT Warangal',
        year: 2015
      }
    ],
    resume: 'https://avinashreddy.me/cv.pdf',
    source: 'Research Conference',
    appliedDate: '2024-01-10',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Published 3 papers in top computer vision conferences. Developed vision algorithms for Samsung devices.',
    assessment: {
      score: 93,
      feedback: 'Outstanding research background with practical implementation experience',
      completed: true
    }
  },
  {
    id: '148',
    name: 'Deepak Khanna',
    email: 'deepak.devops@gmail.com',
    phone: '9876543009',
    currentTitle: 'DevOps Lead',
    currentCompany: 'Airtel Digital',
    location: 'Gurgaon, Haryana',
    experience: 7,
    skills: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD', 'Monitoring', 'Security', 'Team Management'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Thapar Institute of Engineering and Technology',
        year: 2017
      }
    ],
    resume: 'https://deepakkhanna.gitlab.io',
    source: 'Naukri.com',
    appliedDate: '2023-12-15',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Built infrastructure supporting Airtel DTH and streaming services. Managed team of 6 engineers.',
    assessment: {
      score: 87,
      feedback: 'Strong infrastructure experience with telecom industry knowledge',
      completed: true
    }
  },
  {
    id: '149',
    name: 'Aisha Malik',
    email: 'aisha.frontend@outlook.com',
    phone: '8765409123',
    currentTitle: 'UI Developer',
    currentCompany: 'Goibibo',
    location: 'Bangalore, Karnataka',
    experience: 4,
    skills: ['React', 'JavaScript', 'CSS3', 'UI Animation', 'Design Systems', 'Travel Industry'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'Jamia Millia Islamia',
        year: 2020
      }
    ],
    resume: 'https://aishamalik.dev',
    source: 'Referral',
    appliedDate: '2024-02-22',
    stage: RecruitmentStage.APPLIED,
    jobId: '1',
    notes: 'Worked on travel booking interfaces with focus on mobile experience. Strong design collaboration skills.',
    assessment: {
      score: 81,
      feedback: 'Good frontend skills with strong UI animation capabilities',
      completed: true
    }
  },
  {
    id: '150',
    name: 'Rajeev Khanna',
    email: 'rajeev.khanna@gmail.com',
    phone: '9988776600',
    currentTitle: 'Product Management Director',
    currentCompany: 'Quikr',
    location: 'Bangalore, Karnataka',
    experience: 9,
    skills: ['Product Strategy', 'Marketplaces', 'Growth', 'Team Leadership', 'Business Analytics', 'Consumer Products'],
    education: [
      {
        degree: 'MBA',
        institution: 'IIM Ahmedabad',
        year: 2015
      },
      {
        degree: 'B.Tech in Civil Engineering',
        institution: 'IIT Delhi',
        year: 2011
      }
    ],
    resume: 'https://rajeevkhanna.io',
    source: 'Executive Search',
    appliedDate: '2023-11-15',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '2',
    notes: 'Led marketplace products at Quikr. Managed team of 8 product managers. Grew revenue by 45% in 2 years.',
    assessment: {
      score: 94,
      feedback: 'Excellent leadership and product strategy skills',
      completed: true
    }
  },
  {
    id: '151',
    name: 'Sarika Patel',
    email: 'sarika.data@gmail.com',
    phone: '8123456790',
    currentTitle: 'Senior Data Scientist',
    currentCompany: 'Reliance Jio',
    location: 'Mumbai, Maharashtra',
    experience: 6,
    skills: ['Machine Learning', 'Python', 'Big Data', 'NLP', 'Spark', 'Recommendation Systems', 'Telecom Analytics'],
    education: [
      {
        degree: 'M.Tech in Artificial Intelligence',
        institution: 'IIIT Bangalore',
        year: 2018
      },
      {
        degree: 'B.E. in Computer Science',
        institution: 'VJTI Mumbai',
        year: 2015
      }
    ],
    resume: 'https://sarikapatel.tech',
    source: 'LinkedIn',
    appliedDate: '2024-01-28',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Built recommendation engines for JioTV and JioCinema. Strong telecom data analytics background.',
    assessment: {
      score: 86,
      feedback: 'Good ML implementation skills with strong domain knowledge',
      completed: false
    }
  },
  {
    id: '152',
    name: 'Karan Sharma',
    email: 'karan.devops@outlook.com',
    phone: '9912345678',
    currentTitle: 'Site Reliability Engineer',
    currentCompany: 'Oyo Rooms',
    location: 'Gurgaon, Haryana',
    experience: 5,
    skills: ['Kubernetes', 'AWS', 'Monitoring', 'Prometheus', 'Grafana', 'Python', 'Incident Management'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Manipal Institute of Technology',
        year: 2019
      }
    ],
    resume: 'https://karansharma.dev',
    source: 'AngelList',
    appliedDate: '2024-02-05',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Managed production infrastructure at Oyo. Improved system uptime from 99.5% to 99.95%.',
    assessment: {
      score: 84,
      feedback: 'Strong operational skills with good incident management experience',
      completed: true
    }
  },
  {
    id: '153',
    name: 'Nisha Mathur',
    email: 'nisha.frontend@yahoo.in',
    phone: '9871234560',
    currentTitle: 'Frontend Developer',
    currentCompany: 'Housing.com',
    location: 'Mumbai, Maharashtra',
    experience: 4,
    skills: ['React', 'JavaScript', 'CSS', 'Redux', 'GraphQL', 'WebGL', 'Maps Integration'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'Mumbai University',
        year: 2020
      }
    ],
    resume: 'https://nishamathur.com',
    source: 'Company Website',
    appliedDate: '2023-12-20',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '1',
    notes: 'Developed map visualization features for Housing.com. Experience with WebGL and 3D rendering.',
    assessment: {
      score: 88,
      feedback: 'Excellent technical skills with strong specialization in map visualizations',
      completed: true
    }
  },
  {
    id: '154',
    name: 'Subhash Chand',
    email: 'subhash.product@gmail.com',
    phone: '8890123789',
    currentTitle: 'Product Manager',
    currentCompany: 'HDFC Bank',
    location: 'Mumbai, Maharashtra',
    experience: 5,
    skills: ['Product Management', 'Banking', 'Fintech', 'UX Design', 'Analytics', 'Regulatory Compliance'],
    education: [
      {
        degree: 'MBA',
        institution: 'Great Lakes Institute of Management',
        year: 2019
      },
      {
        degree: 'B.Com',
        institution: 'Shri Ram College of Commerce',
        year: 2015
      }
    ],
    resume: 'https://tinyurl.com/subhash-chand-resume',
    source: 'Indeed',
    appliedDate: '2024-01-15',
    stage: RecruitmentStage.APPLIED,
    jobId: '2',
    notes: 'Managed mobile banking products at HDFC. Strong understanding of banking regulations and financial products.',
    assessment: {
      score: 83,
      feedback: 'Good product skills with strong banking domain knowledge',
      completed: true
    }
  },
  {
    id: '155',
    name: 'Alok Verma',
    email: 'alok.data@gmail.com',
    phone: '9980123456',
    currentTitle: 'Machine Learning Engineer',
    currentCompany: 'Tata Digital',
    location: 'Bangalore, Karnataka',
    experience: 4,
    skills: ['Python', 'Machine Learning', 'Deep Learning', 'MLOps', 'AWS', 'Retail Analytics', 'Recommendation Systems'],
    education: [
      {
        degree: 'M.Tech in Computer Science',
        institution: 'IIT Guwahati',
        year: 2020
      }
    ],
    resume: 'https://alokverma.github.io/resume',
    source: 'Cutshort',
    appliedDate: '2024-02-10',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Built recommendation systems for Tata Neu app. Experience with multi-category retail data.',
    assessment: {
      score: 82,
      feedback: 'Good technical implementation skills with e-commerce domain knowledge',
      completed: true
    }
  },
  {
    id: '156',
    name: 'Anish Kumar',
    email: 'anish.devops@gmail.com',
    phone: '7890451236',
    currentTitle: 'Cloud Engineer',
    currentCompany: 'Wipro Digital',
    location: 'Hyderabad, Telangana',
    experience: 5,
    skills: ['AWS', 'Azure', 'GCP', 'Terraform', 'CloudFormation', 'Python', 'Multi-cloud Strategy'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'JNTU Hyderabad',
        year: 2019
      }
    ],
    resume: 'https://anishkumar.cloud/resume',
    source: 'Stack Overflow Jobs',
    appliedDate: '2024-01-25',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Designed multi-cloud strategies for enterprise clients at Wipro. AWS and Azure certified professional.',
    assessment: {
      score: 85,
      feedback: 'Strong multi-cloud expertise with good client-facing experience',
      completed: true
    }
  },
  {
    id: '157',
    name: 'Pankaj Mishra',
    email: 'pankaj.ui@outlook.com',
    phone: '8801234567',
    currentTitle: 'Senior UI Developer',
    currentCompany: 'Policybazaar',
    location: 'Gurgaon, Haryana',
    experience: 6,
    skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'Design Systems', 'Micro Frontends', 'Performance'],
    education: [
      {
        degree: 'B.Tech in Computer Engineering',
        institution: 'Delhi Technological University',
        year: 2018
      }
    ],
    resume: 'https://pankajm.dev',
    source: 'LinkedIn',
    appliedDate: '2023-12-10',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '1',
    notes: 'Led frontend team for insurance comparison products. Built design system used across multiple products.',
    assessment: {
      score: 89,
      feedback: 'Strong technical skills with proven leadership experience',
      completed: true
    }
  },
  {
    id: '158',
    name: 'Aditi Bajpai',
    email: 'aditi.product@gmail.com',
    phone: '9845678901',
    currentTitle: 'Product Manager',
    currentCompany: 'Mamaearth',
    location: 'Gurgaon, Haryana',
    experience: 4,
    skills: ['Product Management', 'D2C', 'E-commerce', 'Growth', 'Analytics', 'Consumer Goods'],
    education: [
      {
        degree: 'MBA',
        institution: 'XLRI Jamshedpur',
        year: 2020
      },
      {
        degree: 'B.Tech in Chemical Engineering',
        institution: 'IIT Kanpur',
        year: 2016
      }
    ],
    resume: 'https://aditibajpai.notion.site',
    source: 'Instahyre',
    appliedDate: '2024-02-15',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '2',
    notes: 'Managed skincare product line at Mamaearth. Launched 5 successful products generating 30% of revenue.',
    assessment: {
      score: 85,
      feedback: 'Good D2C product experience with strong analytical approach',
      completed: true
    }
  },
  {
    id: '159',
    name: 'Rohini Desai',
    email: 'rohini.data@gmail.com',
    phone: '9876123450',
    currentTitle: 'Data Scientist',
    currentCompany: 'ICICI Bank',
    location: 'Mumbai, Maharashtra',
    experience: 5,
    skills: ['Python', 'Machine Learning', 'Financial Analytics', 'Risk Modeling', 'SQL', 'Time Series Analysis'],
    education: [
      {
        degree: 'M.Sc in Statistics',
        institution: 'CMI Chennai',
        year: 2019
      },
      {
        degree: 'B.Sc in Mathematics',
        institution: 'St. Stephens College',
        year: 2016
      }
    ],
    resume: 'https://rohinidesai.tech',
    source: 'JobsForHer',
    appliedDate: '2024-01-20',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Developed credit risk models at ICICI Bank. Reduced false positives in fraud detection by 28%.',
    assessment: {
      score: 87,
      feedback: 'Strong statistical background with good finance domain knowledge',
      completed: true
    }
  },
  {
    id: '160',
    name: 'Tushar Sharma',
    email: 'tushar.sre@hotmail.com',
    phone: '8123456789',
    currentTitle: 'DevOps Engineer',
    currentCompany: 'InMobi',
    location: 'Bangalore, Karnataka',
    experience: 4,
    skills: ['Kubernetes', 'Docker', 'AWS', 'Monitoring', 'CI/CD', 'Go', 'Python'],
    education: [
      {
        degree: 'B.E. in Computer Science',
        institution: 'BMS College of Engineering',
        year: 2020
      }
    ],
    resume: 'https://tusharsharma.dev',
    source: 'Naukri.com',
    appliedDate: '2024-02-08',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Managed containerization infrastructure at InMobi. Experience with high-volume ad tech systems.',
    assessment: {
      score: 83,
      feedback: 'Good technical skills with relevant adtech infrastructure experience',
      completed: false
    }
  },
  {
    id: '161',
    name: 'Rishi Kapadia',
    email: 'rishi.frontend@gmail.com',
    phone: '9899012345',
    currentTitle: 'Frontend Developer',
    currentCompany: 'Vedantu',
    location: 'Bangalore, Karnataka',
    experience: 3,
    skills: ['React', 'JavaScript', 'WebRTC', 'EdTech', 'Real-time Applications', 'CSS3', 'Redux'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'PES University',
        year: 2021
      }
    ],
    resume: 'https://rishikapadia.dev',
    source: 'GeeksforGeeks',
    appliedDate: '2024-03-01',
    stage: RecruitmentStage.APPLIED,
    jobId: '1',
    notes: 'Developed live classroom interfaces at Vedantu. Experience with WebRTC and real-time applications.',
    assessment: {
      score: 79,
      feedback: 'Good technical skills with relevant edtech experience',
      completed: true
    }
  },
  {
    id: '162',
    name: 'Neelam Sinha',
    email: 'neelam.product@outlook.com',
    phone: '7789012345',
    currentTitle: 'Product Manager',
    currentCompany: 'Unacademy',
    location: 'Bangalore, Karnataka',
    experience: 4,
    skills: ['Product Management', 'EdTech', 'Growth', 'User Research', 'Analytics', 'Mobile Apps'],
    education: [
      {
        degree: 'MBA',
        institution: 'IIM Indore',
        year: 2020
      },
      {
        degree: 'B.Tech in Electronics',
        institution: 'IIIT Allahabad',
        year: 2016
      }
    ],
    resume: 'https://neelams.co/resume',
    source: 'Linkedin',
    appliedDate: '2024-01-18',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '2',
    notes: 'Led test prep products at Unacademy. Increased user engagement metrics by 45% in six months.',
    assessment: {
      score: 86,
      feedback: 'Strong product management skills with edtech domain expertise',
      completed: true
    }
  },
  {
    id: '163',
    name: 'Vijay Kumar',
    email: 'vijay.ml@gmail.com',
    phone: '8998765432',
    currentTitle: 'Machine Learning Engineer',
    currentCompany: 'Cognizant',
    location: 'Chennai, Tamil Nadu',
    experience: 5,
    skills: ['Python', 'Machine Learning', 'Deep Learning', 'NLP', 'Healthcare ML', 'PyTorch', 'MLOps'],
    education: [
      {
        degree: 'M.Tech in Artificial Intelligence',
        institution: 'IIIT Hyderabad',
        year: 2019
      },
      {
        degree: 'B.E. in Computer Science',
        institution: 'Anna University',
        year: 2016
      }
    ],
    resume: 'https://vijaykumar.ai',
    source: 'Hired.com',
    appliedDate: '2024-02-10',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '3',
    notes: 'Developed healthcare ML models at Cognizant. Built diagnostic assistance systems for major hospital chain.',
    assessment: {
      score: 88,
      feedback: 'Strong ML skills with valuable healthcare domain expertise',
      completed: true
    }
  },
  {
    id: '164',
    name: 'Divyanshu Singh',
    email: 'divyanshu.cloud@outlook.com',
    phone: '9876123456',
    currentTitle: 'DevOps Engineer',
    currentCompany: 'Nagarro',
    location: 'Noida, Uttar Pradesh',
    experience: 6,
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Docker', 'Python', 'Security'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'JIIT Noida',
        year: 2018
      }
    ],
    resume: 'https://divyanshu.cloud',
    source: 'Naukri.com',
    appliedDate: '2023-12-18',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Led cloud migration projects for enterprise clients at Nagarro. Expertise in secure cloud deployments.',
    assessment: {
      score: 84,
      feedback: 'Good technical skills with enterprise-grade deployment experience',
      completed: true
    }
  },
  {
    id: '165',
    name: 'Komal Verma',
    email: 'komal.frontend@gmail.com',
    phone: '8776541230',
    currentTitle: 'UI/UX Developer',
    currentCompany: 'MindTickle',
    location: 'Pune, Maharashtra',
    experience: 4,
    skills: ['React', 'JavaScript', 'UI Design', 'Figma', 'CSS3', 'Design Systems', 'Accessibility'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'COEP Pune',
        year: 2020
      }
    ],
    resume: 'https://komalverma.design',
    source: 'Design Portfolio',
    appliedDate: '2024-02-15',
    stage: RecruitmentStage.APPLIED,
    jobId: '1',
    notes: 'Designed and developed learning experience interfaces at MindTickle. Strong focus on accessibility.',
    assessment: {
      score: 82,
      feedback: 'Good combination of technical and design skills',
      completed: true
    }
  },
  {
    id: '166',
    name: 'Rajat Choudhary',
    email: 'rajat.product@gmail.com',
    phone: '9787456123',
    currentTitle: 'Senior Product Manager',
    currentCompany: 'upGrad',
    location: 'Mumbai, Maharashtra',
    experience: 7,
    skills: ['Product Management', 'EdTech', 'B2B Products', 'Enterprise Solutions', 'Analytics', 'Growth'],
    education: [
      {
        degree: 'MBA',
        institution: 'ISB Hyderabad',
        year: 2017
      },
      {
        degree: 'B.Tech in Electrical Engineering',
        institution: 'IIT Roorkee',
        year: 2013
      }
    ],
    resume: 'https://rajatc.me/resume',
    source: 'TopHire',
    appliedDate: '2024-01-05',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '2',
    notes: 'Led enterprise learning solutions at upGrad. Increased B2B revenue by 120% year over year.',
    assessment: {
      score: 91,
      feedback: 'Excellent product management skills with strong B2B focus',
      completed: true
    }
  },
  {
    id: '167',
    name: 'Pradeep Menon',
    email: 'pradeep.data@gmail.com',
    phone: '8887776665',
    currentTitle: 'Data Engineer',
    currentCompany: 'Uber India',
    location: 'Hyderabad, Telangana',
    experience: 5,
    skills: ['Python', 'Spark', 'Kafka', 'Data Pipelines', 'AWS', 'Airflow', 'SQL'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'NIT Warangal',
        year: 2019
      }
    ],
    resume: 'https://pradeepmenon.com/resume',
    source: 'Referral',
    appliedDate: '2024-01-28',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Built real-time data pipelines at Uber. Experience with high-volume location data processing.',
    assessment: {
      score: 85,
      feedback: 'Strong data engineering skills with good distributed systems knowledge',
      completed: false
    }
  },
  {
    id: '168',
    name: 'Abhishek Goyal',
    email: 'abhishek.sre@outlook.com',
    phone: '7890654321',
    currentTitle: 'SRE',
    currentCompany: 'Walmart Global Tech',
    location: 'Bangalore, Karnataka',
    experience: 6,
    skills: ['Kubernetes', 'AWS', 'Monitoring', 'Incident Management', 'Automation', 'Python', 'SLO'],
    education: [
      {
        degree: 'B.E. in Information Technology',
        institution: 'NSIT Delhi',
        year: 2018
      }
    ],
    resume: 'https://abhishekgoyal.dev',
    source: 'LinkedIn',
    appliedDate: '2024-02-05',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Managed ecommerce infrastructure at Walmart. Implemented SLO framework reducing incidents by 35%.',
    assessment: {
      score: 86,
      feedback: 'Strong SRE skills with good large-scale systems experience',
      completed: true
    }
  },
  {
    id: '169',
    name: 'Ankita Jain',
    email: 'ankita.js@gmail.com',
    phone: '9123456780',
    currentTitle: 'Frontend Engineer',
    currentCompany: 'Meesho',
    location: 'Bangalore, Karnataka',
    experience: 4,
    skills: ['React', 'TypeScript', 'NextJS', 'GraphQL', 'State Management', 'Performance', 'Testing'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'IIIT Delhi',
        year: 2020
      }
    ],
    resume: 'https://ankitajain.dev',
    source: 'Internal Database',
    appliedDate: '2024-02-22',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '1',
    notes: 'Developed seller-facing applications at Meesho. Improved page load times by 60%.',
    assessment: {
      score: 87,
      feedback: 'Excellent frontend skills with strong performance optimization focus',
      completed: true
    }
  },
  {
    id: '170',
    name: 'Nikhil Sharma',
    email: 'nikhil.product@yahoo.in',
    phone: '8765432109',
    currentTitle: 'Product Manager',
    currentCompany: 'Cult.fit',
    location: 'Bangalore, Karnataka',
    experience: 5,
    skills: ['Product Management', 'Health Tech', 'Mobile Apps', 'Fitness Industry', 'Analytics', 'Growth'],
    education: [
      {
        degree: 'MBA',
        institution: 'IIM Bangalore',
        year: 2019
      },
      {
        degree: 'B.Tech in Electronics',
        institution: 'IIT Kanpur',
        year: 2015
      }
    ],
    resume: 'https://nikhilsharma.pm',
    source: 'AngelList',
    appliedDate: '2023-12-12',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '2',
    notes: 'Led fitness and nutrition products at Cult.fit. Increased monthly active users by 85% in one year.',
    assessment: {
      score: 89,
      feedback: 'Strong product skills with good understanding of health tech',
      completed: true
    }
  },
  {
    id: '171',
    name: 'Tanmay Bhatt',
    email: 'tanmay.ml@gmail.com',
    phone: '7776665554',
    currentTitle: 'ML Engineer',
    currentCompany: 'Dailyhunt',
    location: 'Bangalore, Karnataka',
    experience: 4,
    skills: ['Python', 'Machine Learning', 'NLP', 'Content Recommendation', 'Multilingual ML', 'PyTorch'],
    education: [
      {
        degree: 'M.Tech in Computer Science',
        institution: 'IIT Bombay',
        year: 2020
      },
      {
        degree: 'B.Tech in Computer Science',
        institution: 'BITS Pilani',
        year: 2018
      }
    ],
    resume: 'https://tanmaybhatt.ml',
    source: 'Kaggle',
    appliedDate: '2024-01-15',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Built content recommendation systems at Dailyhunt. Expertise in multilingual NLP for Indian languages.',
    assessment: {
      score: 85,
      feedback: 'Excellent NLP skills with multilingual content expertise',
      completed: true
    }
  },
  {
    id: '172',
    name: 'Harsha Vardhan',
    email: 'harsha.cloud@outlook.com',
    phone: '9988776655',
    currentTitle: 'Cloud Architect',
    currentCompany: 'Infosys',
    location: 'Hyderabad, Telangana',
    experience: 8,
    skills: ['AWS', 'Azure', 'Cloud Architecture', 'Migration Strategy', 'Security', 'Cost Optimization', 'Serverless'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'IIIT Hyderabad',
        year: 2016
      }
    ],
    resume: 'https://harshavardhan.cloud',
    source: 'Company Website',
    appliedDate: '2023-11-22',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Led cloud architecture team at Infosys. Designed solutions for Fortune 500 clients.',
    assessment: {
      score: 92,
      feedback: 'Strong cloud architecture expertise with excellent enterprise experience',
      completed: true
    }
  },
  {
    id: '173',
    name: 'Aarti Sharma',
    email: 'aarti.ui@gmail.com',
    phone: '9870123456',
    currentTitle: 'Frontend Developer',
    currentCompany: 'Sharechat',
    location: 'Bangalore, Karnataka',
    experience: 3,
    skills: ['React', 'JavaScript', 'CSS3', 'Mobile Web', 'Performance', 'Social Media Apps'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'NIT Rourkela',
        year: 2021
      }
    ],
    resume: 'https://aartisharma.dev',
    source: 'LinkedIn',
    appliedDate: '2024-02-20',
    stage: RecruitmentStage.APPLIED,
    jobId: '1',
    notes: 'Developed frontend for vernacular social media platform. Experience with low-bandwidth optimizations.',
    assessment: {
      score: 80,
      feedback: 'Good technical skills with understanding of performance constraints',
      completed: true
    }
  },
  {
    id: '174',
    name: 'Arjun Malhotra',
    email: 'arjun.product@gmail.com',
    phone: '8878901234',
    currentTitle: 'Product Manager',
    currentCompany: 'Pharmeasy',
    location: 'Mumbai, Maharashtra',
    experience: 6,
    skills: ['Product Management', 'Healthcare', 'E-commerce', 'Mobile Apps', 'Analytics', 'User Research'],
    education: [
      {
        degree: 'MBA',
        institution: 'FMS Delhi',
        year: 2018
      },
      {
        degree: 'B.Pharm',
        institution: 'NIPER Mohali',
        year: 2014
      }
    ],
    resume: 'https://arjunmalhotra.co/resume',
    source: 'Referral',
    appliedDate: '2024-01-08',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '2',
    notes: 'Led medicine delivery products at Pharmeasy. Unique background with pharmacy education.',
    assessment: {
      score: 88,
      feedback: 'Strong product management skills with valuable healthcare domain expertise',
      completed: true
    }
  },
  {
    id: '175',
    name: 'Mohit Gupta',
    email: 'mohit.data@gmail.com',
    phone: '9112345678',
    currentTitle: 'Data Scientist',
    currentCompany: 'Pine Labs',
    location: 'Noida, Uttar Pradesh',
    experience: 5,
    skills: ['Python', 'Machine Learning', 'Payment Analytics', 'Fraud Detection', 'Time Series', 'SQL'],
    education: [
      {
        degree: 'M.Tech in Computer Science',
        institution: 'IIT Delhi',
        year: 2019
      },
      {
        degree: 'B.E. in Information Technology',
        institution: 'DTU Delhi',
        year: 2016
      }
    ],
    resume: 'https://mohitgupta.ai',
    source: 'Instahyre',
    appliedDate: '2024-02-01',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Developed fraud detection models for payment processing at Pine Labs. Strong fintech analytics experience.',
    assessment: {
      score: 84,
      feedback: 'Good technical skills with relevant fintech domain knowledge',
      completed: false
    }
  },
  {
    id: '176',
    name: 'Bhavya Reddy',
    email: 'bhavya.sre@outlook.com',
    phone: '8765432100',
    currentTitle: 'Site Reliability Engineer',
    currentCompany: 'Postman',
    location: 'Bangalore, Karnataka',
    experience: 5,
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD', 'Monitoring', 'DevOps'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'PES University',
        year: 2019
      }
    ],
    resume: 'https://bhavyareddy.dev',
    source: 'AngelList',
    appliedDate: '2024-02-12',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Managed API testing platform infrastructure at Postman. Experience with high-scale developer tools.',
    assessment: {
      score: 86,
      feedback: 'Strong infrastructure skills with good developer tooling expertise',
      completed: true
    }
  },
  {
    id: '177',
    name: 'Siddharth Roy',
    email: 'siddharth.fe@gmail.com',
    phone: '9800123456',
    currentTitle: 'Senior Frontend Developer',
    currentCompany: '1mg',
    location: 'Gurgaon, Haryana',
    experience: 7,
    skills: ['React', 'TypeScript', 'Redux', 'Design Systems', 'A11y', 'Performance', 'Mobile First'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'NSIT Delhi',
        year: 2017
      }
    ],
    resume: 'https://siddharthroy.dev',
    source: 'LinkedIn',
    appliedDate: '2023-12-05',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '1',
    notes: 'Led frontend team for healthcare e-commerce at 1mg. Improved accessibility compliance from 65% to 98%.',
    assessment: {
      score: 93,
      feedback: 'Excellent technical skills with strong focus on accessibility',
      completed: true
    }
  },
  {
    id: '178',
    name: 'Ishita Das',
    email: 'ishita.product@gmail.com',
    phone: '7712345678',
    currentTitle: 'Product Manager',
    currentCompany: 'Nykaa',
    location: 'Mumbai, Maharashtra',
    experience: 5,
    skills: ['Product Management', 'E-commerce', 'Beauty Industry', 'Analytics', 'Growth', 'User Research'],
    education: [
      {
        degree: 'MBA',
        institution: 'SPJIMR Mumbai',
        year: 2019
      },
      {
        degree: 'B.Com',
        institution: 'St. Xavier College Mumbai',
        year: 2015
      }
    ],
    resume: 'https://ishitadas.co/resume',
    source: 'Company Website',
    appliedDate: '2024-01-25',
    stage: RecruitmentStage.APPLIED,
    jobId: '2',
    notes: 'Managed beauty product categories at Nykaa. Strong understanding of beauty e-commerce industry.',
    assessment: {
      score: 85,
      feedback: 'Good product management skills with relevant industry expertise',
      completed: true
    }
  },
  {
    id: '179',
    name: 'Vikrant Singh',
    email: 'vikrant.data@gmail.com',
    phone: '9871234500',
    currentTitle: 'Data Engineer',
    currentCompany: 'Byju\'s',
    location: 'Bangalore, Karnataka',
    experience: 4,
    skills: ['Python', 'Spark', 'Kafka', 'AWS', 'Airflow', 'ETL', 'Data Warehousing'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'IIIT Bhubaneswar',
        year: 2020
      }
    ],
    resume: 'https://vikrantsingh.io',
    source: 'Cutshort',
    appliedDate: '2024-02-10',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Built data pipelines for learning analytics at Byju\'s. Experience with educational data processing.',
    assessment: {
      score: 82,
      feedback: 'Good data engineering skills with edtech domain knowledge',
      completed: false
    }
  },
  {
    id: '180',
    name: 'Prakash Iyer',
    email: 'prakash.devops@outlook.com',
    phone: '8890123456',
    currentTitle: 'DevOps Lead',
    currentCompany: 'Innovaccer',
    location: 'Noida, Uttar Pradesh',
    experience: 6,
    skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Security', 'Healthcare IT', 'Compliance'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'NIT Trichy',
        year: 2018
      }
    ],
    resume: 'https://prakashiyer.tech',
    source: 'Naukri.com',
    appliedDate: '2023-11-15',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Led infrastructure team for healthcare analytics platform. Experience with HIPAA compliance requirements.',
    assessment: {
      score: 89,
      feedback: 'Strong DevOps skills with valuable healthcare compliance expertise',
      completed: true
    }
  },
  {
    id: '181',
    name: 'Anurag Thakur',
    email: 'anurag.frontend@gmail.com',
    phone: '9087654321',
    currentTitle: 'Frontend Tech Lead',
    currentCompany: 'Paytm',
    location: 'Delhi, NCR',
    experience: 7,
    skills: ['React', 'TypeScript', 'NextJS', 'Performance', 'Team Management', 'Architecture', 'Design Systems'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'Delhi Technological University',
        year: 2017
      }
    ],
    resume: 'https://anuragthakur.dev',
    source: 'LinkedIn',
    appliedDate: '2023-12-01',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '1',
    notes: 'Led payment UI team at Paytm. Redesigned checkout flow increasing conversion by 22%.',
    assessment: {
      score: 92,
      feedback: 'Excellent technical and leadership skills with fintech experience',
      completed: true
    }
  },
  {
    id: '182',
    name: 'Arunima Sen',
    email: 'arunima.product@outlook.com',
    phone: '8765123490',
    currentTitle: 'Product Manager',
    currentCompany: 'Tinder India',
    location: 'Bangalore, Karnataka',
    experience: 5,
    skills: ['Product Management', 'Dating Apps', 'Growth', 'User Research', 'A/B Testing', 'Retention'],
    education: [
      {
        degree: 'MBA',
        institution: 'XLRI Jamshedpur',
        year: 2019
      },
      {
        degree: 'B.E. in Electronics',
        institution: 'BITS Pilani',
        year: 2015
      }
    ],
    resume: 'https://arunima-sen.notion.site',
    source: 'AngelList',
    appliedDate: '2024-01-12',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '2',
    notes: 'Managed user engagement features at Tinder. Experience with dating app market in India.',
    assessment: {
      score: 87,
      feedback: 'Strong product sense with good understanding of social platforms',
      completed: true
    }
  },
  {
    id: '183',
    name: 'Gaurav Mishra',
    email: 'gaurav.data@gmail.com',
    phone: '9876543120',
    currentTitle: 'Lead Data Scientist',
    currentCompany: 'PhonePe',
    location: 'Bangalore, Karnataka',
    experience: 8,
    skills: ['Python', 'Machine Learning', 'Deep Learning', 'NLP', 'Fintech Analytics', 'Team Leadership', 'MLOps'],
    education: [
      {
        degree: 'PhD in Computer Science',
        institution: 'IISc Bangalore',
        year: 2016
      },
      {
        degree: 'B.Tech in Computer Science',
        institution: 'IIT Kanpur',
        year: 2011
      }
    ],
    resume: 'https://gauravmishra.science',
    source: 'Referral',
    appliedDate: '2023-11-10',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Led fraud detection team at PhonePe. Published research papers on fintech ML applications.',
    assessment: {
      score: 95,
      feedback: 'Outstanding technical expertise with proven research background',
      completed: true
    }
  },
  {
    id: '184',
    name: 'Farhan Khan',
    email: 'farhan.devops@gmail.com',
    phone: '8790123456',
    currentTitle: 'DevOps Engineer',
    currentCompany: 'Ajio',
    location: 'Mumbai, Maharashtra',
    experience: 5,
    skills: ['Kubernetes', 'Docker', 'AWS', 'CI/CD', 'Monitoring', 'Python', 'Infrastructure as Code'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Jamia Millia Islamia',
        year: 2019
      }
    ],
    resume: 'https://farhan-khan.tech',
    source: 'Stack Overflow Jobs',
    appliedDate: '2024-02-05',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Managed e-commerce infrastructure at Ajio. Experience with high traffic events like fashion sales.',
    assessment: {
      score: 84,
      feedback: 'Good technical skills with relevant e-commerce infrastructure experience',
      completed: false
    }
  },
  {
    id: '185',
    name: 'Tanya Chopra',
    email: 'tanya.ui@gmail.com',
    phone: '7788990011',
    currentTitle: 'UI/UX Designer',
    currentCompany: 'Swiggy',
    location: 'Bangalore, Karnataka',
    experience: 4,
    skills: ['UI Design', 'UX Research', 'Figma', 'Design Systems', 'User Testing', 'Wireframing', 'Prototyping'],
    education: [
      {
        degree: 'M.Des in Interaction Design',
        institution: 'IDC School of Design, IIT Bombay',
        year: 2020
      },
      {
        degree: 'B.Des in Visual Communication',
        institution: 'NIFT Delhi',
        year: 2017
      }
    ],
    resume: 'https://tanyachopra.design',
    source: 'Behance',
    appliedDate: '2024-02-18',
    stage: RecruitmentStage.APPLIED,
    jobId: '1',
    notes: 'Designed food delivery interfaces at Swiggy. Strong understanding of mobile UX patterns.',
    assessment: {
      score: 89,
      feedback: 'Excellent design skills with strong UX methodology',
      completed: true
    }
  },
  {
    id: '186',
    name: 'Neeraj Kumar',
    email: 'neeraj.prod@outlook.com',
    phone: '9871234560',
    currentTitle: 'Product Manager',
    currentCompany: 'Ola Electric',
    location: 'Bangalore, Karnataka',
    experience: 6,
    skills: ['Product Management', 'Electric Vehicles', 'IoT', 'Hardware Products', 'Analytics', 'Growth'],
    education: [
      {
        degree: 'MBA',
        institution: 'IIM Lucknow',
        year: 2018
      },
      {
        degree: 'B.Tech in Mechanical Engineering',
        institution: 'IIT Madras',
        year: 2014
      }
    ],
    resume: 'https://neerajkumar.pm',
    source: 'LinkedIn',
    appliedDate: '2024-01-20',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '2',
    notes: 'Led vehicle telematics products at Ola Electric. Experience with hardware-software integrated products.',
    assessment: {
      score: 90,
      feedback: 'Strong product management skills with valuable hardware-software expertise',
      completed: true
    }
  },
  {
    id: '187',
    name: 'Vishal Bhatia',
    email: 'vishal.ml@gmail.com',
    phone: '8899001122',
    currentTitle: 'AI Researcher',
    currentCompany: 'Microsoft Research',
    location: 'Bangalore, Karnataka',
    experience: 6,
    skills: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'Research', 'PyTorch', 'TensorFlow', 'Academic Publications'],
    education: [
      {
        degree: 'PhD in Artificial Intelligence',
        institution: 'IIT Delhi',
        year: 2019
      },
      {
        degree: 'B.Tech in Computer Science',
        institution: 'IIIT Hyderabad',
        year: 2014
      }
    ],
    resume: 'https://vishalbhatia.ai',
    source: 'Research Conference',
    appliedDate: '2023-12-15',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '3',
    notes: 'Published 5 papers in top ML conferences. Working on computer vision research at Microsoft.',
    assessment: {
      score: 94,
      feedback: 'Outstanding research background with excellent industrial implementation',
      completed: true
    }
  },
  {
    id: '188',
    name: 'Suresh Pillai',
    email: 'suresh.sre@outlook.com',
    phone: '9988776654',
    currentTitle: 'Site Reliability Engineer',
    currentCompany: 'Flipkart',
    location: 'Bangalore, Karnataka',
    experience: 7,
    skills: ['Kubernetes', 'AWS', 'Terraform', 'Monitoring', 'Incident Management', 'SLO', 'Automation'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'NIT Tiruchirappalli',
        year: 2017
      }
    ],
    resume: 'https://sureshpillai.dev',
    source: 'Internal Database',
    appliedDate: '2024-01-05',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Managed critical e-commerce infrastructure at Flipkart. Experience with Big Billion Day sales traffic.',
    assessment: {
      score: 88,
      feedback: 'Strong SRE skills with excellent high-scale systems experience',
      completed: true
    }
  },
  {
    id: '189',
    name: 'Neha Ahuja',
    email: 'neha.frontend@gmail.com',
    phone: '7654321098',
    currentTitle: 'Frontend Engineer',
    currentCompany: 'Microsoft India',
    location: 'Hyderabad, Telangana',
    experience: 5,
    skills: ['React', 'TypeScript', 'JavaScript', 'Accessibility', 'Design Systems', 'Performance', 'Testing'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'IIIT Bangalore',
        year: 2019
      }
    ],
    resume: 'https://nehaahuja.dev',
    source: 'Company Website',
    appliedDate: '2024-02-10',
    stage: RecruitmentStage.APPLIED,
    jobId: '1',
    notes: 'Working on Microsoft Teams frontend. Strong focus on accessibility and inclusive design.',
    assessment: {
      score: 87,
      feedback: 'Excellent technical skills with strong accessibility expertise',
      completed: true
    }
  },
  {
    id: '190',
    name: 'Aryan Gupta',
    email: 'aryan.product@yahoo.in',
    phone: '9876123450',
    currentTitle: 'Product Manager',
    currentCompany: 'MakeMyTrip',
    location: 'Gurgaon, Haryana',
    experience: 5,
    skills: ['Product Management', 'Travel Industry', 'Growth', 'Analytics', 'Mobile Apps', 'User Research'],
    education: [
      {
        degree: 'MBA',
        institution: 'MDI Gurgaon',
        year: 2019
      },
      {
        degree: 'B.E. in Computer Science',
        institution: 'Thapar University',
        year: 2015
      }
    ],
    resume: 'https://aryangupta.co/resume',
    source: 'Referral',
    appliedDate: '2023-11-25',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '2',
    notes: 'Led hotel booking products at MakeMyTrip. Increased booking conversions by 28% through UI optimizations.',
    assessment: {
      score: 86,
      feedback: 'Strong product sense with good travel industry domain knowledge',
      completed: true
    }
  },
  {
    id: '191',
    name: 'Varun Nair',
    email: 'varun.data@gmail.com',
    phone: '8877665544',
    currentTitle: 'Data Scientist',
    currentCompany: 'Amazon India',
    location: 'Bangalore, Karnataka',
    experience: 4,
    skills: ['Python', 'Machine Learning', 'Supply Chain Analytics', 'Forecasting', 'Time Series', 'SQL', 'AWS'],
    education: [
      {
        degree: 'M.Tech in Data Science',
        institution: 'IIT Madras',
        year: 2020
      },
      {
        degree: 'B.Tech in Computer Science',
        institution: 'College of Engineering Trivandrum',
        year: 2017
      }
    ],
    resume: 'https://varunnair.tech',
    source: 'Hired.com',
    appliedDate: '2024-01-18',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Developed supply chain forecasting models at Amazon. Experience with large-scale inventory management.',
    assessment: {
      score: 85,
      feedback: 'Good technical skills with strong business application understanding',
      completed: false
    }
  },
  {
    id: '192',
    name: 'Karthik Subramanian',
    email: 'karthik.devops@gmail.com',
    phone: '9087654311',
    currentTitle: 'DevOps Lead',
    currentCompany: 'Freshworks',
    location: 'Chennai, Tamil Nadu',
    experience: 7,
    skills: ['Kubernetes', 'AWS', 'Azure', 'Terraform', 'CI/CD', 'Security', 'Monitoring', 'Team Management'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Anna University',
        year: 2016
      }
    ],
    resume: 'https://karthiks.tech',
    source: 'Naukri.com',
    appliedDate: '2023-12-10',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Led DevOps team at Freshworks. Built multi-region deployment infrastructure with 99.99% uptime.',
    assessment: {
      score: 90,
      feedback: 'Excellent technical and leadership skills with SaaS platform experience',
      completed: true
    }
  },
  {
    id: '193',
    name: 'Parul Saxena',
    email: 'parul.ui@gmail.com',
    phone: '9870123456',
    currentTitle: 'UI Developer',
    currentCompany: 'Myntra',
    location: 'Bangalore, Karnataka',
    experience: 4,
    skills: ['React', 'JavaScript', 'CSS3', 'Animation', 'E-commerce', 'Design Systems', 'Mobile UI'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'IIIT Allahabad',
        year: 2020
      }
    ],
    resume: 'https://parulsaxena.dev',
    source: 'LinkedIn',
    appliedDate: '2024-02-15',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '1',
    notes: 'Developed fashion e-commerce interfaces at Myntra. Experience with image-heavy UI performance optimization.',
    assessment: {
      score: 83,
      feedback: 'Good technical skills with relevant e-commerce UI experience',
      completed: true
    }
  },
  {
    id: '194',
    name: 'Mohit Verma',
    email: 'mohit.product@gmail.com',
    phone: '8765012349',
    currentTitle: 'Product Manager',
    currentCompany: 'Zomato',
    location: 'Delhi, NCR',
    experience: 6,
    skills: ['Product Management', 'Food Delivery', 'Marketplace', 'Growth', 'Analytics', 'User Research'],
    education: [
      {
        degree: 'MBA',
        institution: 'IIM Calcutta',
        year: 2018
      },
      {
        degree: 'B.Tech in Electrical Engineering',
        institution: 'IIT Roorkee',
        year: 2014
      }
    ],
    resume: 'https://mohitverma.pm',
    source: 'TopHire',
    appliedDate: '2024-01-15',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '2',
    notes: 'Led restaurant-facing products at Zomato. Increased restaurant retention by 25% through new tools.',
    assessment: {
      score: 89,
      feedback: 'Strong product sense with excellent marketplace optimization skills',
      completed: true
    }
  },
  {
    id: '195',
    name: 'Sanjay Murthy',
    email: 'sanjay.ml@gmail.com',
    phone: '9876512340',
    currentTitle: 'ML Engineer',
    currentCompany: 'Rivigo',
    location: 'Gurgaon, Haryana',
    experience: 5,
    skills: ['Python', 'Machine Learning', 'Logistics Optimization', 'Route Planning', 'GPS Analytics', 'Time Series'],
    education: [
      {
        degree: 'M.Tech in Computer Science',
        institution: 'IIT Kharagpur',
        year: 2019
      }
    ],
    resume: 'https://sanjaymurthy.ai',
    source: 'Cutshort',
    appliedDate: '2024-01-28',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Developed route optimization algorithms at Rivigo. Experience with logistics and transportation ML.',
    assessment: {
      score: 86,
      feedback: 'Strong ML skills with valuable logistics domain expertise',
      completed: true
    }
  },
  {
    id: '196',
    name: 'Naveen Krishnan',
    email: 'naveen.cloud@gmail.com',
    phone: '8901234567',
    currentTitle: 'Cloud Architect',
    currentCompany: 'Accenture India',
    location: 'Bangalore, Karnataka',
    experience: 8,
    skills: ['AWS', 'Azure', 'GCP', 'Multi-cloud Strategy', 'Migration', 'Security', 'Cost Optimization'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'NIT Surathkal',
        year: 2016
      }
    ],
    resume: 'https://naveenkrishnan.cloud',
    source: 'Instahyre',
    appliedDate: '2023-11-20',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '4',
    notes: 'Led cloud migration projects for enterprise clients. Certified in all major cloud platforms.',
    assessment: {
      score: 91,
      feedback: 'Excellent cloud architecture expertise with strong enterprise experience',
      completed: true
    }
  },
  {
    id: '197',
    name: 'Kritika Rao',
    email: 'kritika.fe@outlook.com',
    phone: '9988776655',
    currentTitle: 'Frontend Developer',
    currentCompany: 'Uber India',
    location: 'Bangalore, Karnataka',
    experience: 3,
    skills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'Maps Integration', 'Geolocation', 'Mobile Web'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'VIT Vellore',
        year: 2021
      }
    ],
    resume: 'https://kritikarao.dev',
    source: 'AngelList',
    appliedDate: '2024-02-20',
    stage: RecruitmentStage.APPLIED,
    jobId: '1',
    notes: 'Developed map interfaces at Uber. Experience with real-time location tracking and mapping libraries.',
    assessment: {
      score: 82,
      feedback: 'Good technical skills with specialized mapping experience',
      completed: true
    }
  },
  {
    id: '198',
    name: 'Aakash Patel',
    email: 'aakash.product@gmail.com',
    phone: '7789012345',
    currentTitle: 'Product Manager',
    currentCompany: 'Lenskart',
    location: 'Delhi, NCR',
    experience: 5,
    skills: ['Product Management', 'Retail Tech', 'Omnichannel', 'Analytics', 'User Research', 'E-commerce'],
    education: [
      {
        degree: 'MBA',
        institution: 'ISB Hyderabad',
        year: 2019
      },
      {
        degree: 'B.Tech in Electronics',
        institution: 'NSIT Delhi',
        year: 2015
      }
    ],
    resume: 'https://aakashpatel.co',
    source: 'LinkedIn',
    appliedDate: '2023-12-18',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '2',
    notes: 'Led omnichannel products at Lenskart. Integrated online and offline shopping experiences.',
    assessment: {
      score: 85,
      feedback: 'Strong product skills with good understanding of retail technologies',
      completed: true
    }
  },
  {
    id: '199',
    name: 'Navya Singh',
    email: 'navya.data@gmail.com',
    phone: '9876123450',
    currentTitle: 'Data Scientist',
    currentCompany: 'Nestaway',
    location: 'Bangalore, Karnataka',
    experience: 4,
    skills: ['Python', 'Machine Learning', 'Real Estate Analytics', 'Price Prediction', 'Recommendation Systems', 'SQL'],
    education: [
      {
        degree: 'M.Sc in Statistics',
        institution: 'ISI Kolkata',
        year: 2020
      },
      {
        degree: 'B.Sc in Mathematics',
        institution: 'St. Stephens College',
        year: 2017
      }
    ],
    resume: 'https://navyasingh.io',
    source: 'Referral',
    appliedDate: '2024-02-01',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '3',
    notes: 'Developed rental price prediction models at Nestaway. Experience with real estate data analytics.',
    assessment: {
      score: 83,
      feedback: 'Good analytical skills with relevant domain expertise',
      completed: true
    }
  },
  {
    id: '200',
    name: 'Rohan Mehta',
    email: 'rohan.devops@gmail.com',
    phone: '8765432190',
    currentTitle: 'DevOps Engineer',
    currentCompany: 'Zerodha',
    location: 'Bangalore, Karnataka',
    experience: 6,
    skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Monitoring', 'Security', 'Fintech Infrastructure'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'BITS Pilani',
        year: 2018
      }
    ],
    resume: 'https://rohanmehta.dev',
    source: 'Company Website',
    appliedDate: '2024-01-10',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '4',
    notes: 'Managed trading infrastructure at Zerodha. Experience with high-performance, low-latency systems.',
    assessment: {
      score: 88,
      feedback: 'Strong technical skills with valuable fintech infrastructure experience',
      completed: false
    }
  }
].map(candidate => {
  const job = jobs.find(j => j.id === candidate.jobId);
  if (!job) return candidate;

  const interview = generateInterviewData(candidate, job);
  
  return {
    ...candidate,
    interview
  };
});

export const getStageFromString = (stage: string): typeof RecruitmentStage[keyof typeof RecruitmentStage] => {
  if (stage.toLowerCase() === 'outreached') {
    return RecruitmentStage.OUTREACHED;
  }
  if (stage.toLowerCase() === 'applied') {
    return RecruitmentStage.APPLIED;
  }
  if (stage.toLowerCase() === 'shortlisted') {
    return RecruitmentStage.SHORTLISTED;
  }
  if (stage.toLowerCase() === 'interviewed') {
    return RecruitmentStage.INTERVIEWED;
  }
  if (stage.toLowerCase() === 'rejected') {
    return RecruitmentStage.REJECTED;
  }
  if (stage.toLowerCase() === 'offer extended') {
    return RecruitmentStage.OFFER_EXTENDED;
  }
  if (stage.toLowerCase() === 'offer rejected') {
    return RecruitmentStage.OFFER_REJECTED;
  }
  if (stage.toLowerCase() === 'hired') {
    return RecruitmentStage.HIRED;
  }
  return RecruitmentStage.APPLIED; // Default stage
}; 