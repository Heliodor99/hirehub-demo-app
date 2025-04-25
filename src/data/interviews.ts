import { Interview } from '@/types';

export const interviews: Interview[] = [
  {
    id: 1,
    candidate: {
      name: 'Sarah Johnson',
      position: 'UI/UX Designer',
    },
    date: '2025-03-20',
    time: '10:00 AM',
    type: 'Technical',
    status: 'Completed',
    interviewers: ['John Smith', 'Emily Davis'],
    location: 'Virtual',
    transcript: [
      {
        timestamp: '10:00:00',
        speaker: 'Interviewer',
        content: 'Good morning Sarah, thank you for joining us today. Could you start by telling us about your experience with UI/UX design?'
      },
      {
        timestamp: '10:00:30',
        speaker: 'Candidate',
        content: 'Thank you for having me. I have 5 years of experience in UI/UX design, primarily working with SaaS products. I specialize in user research, wireframing, and creating interactive prototypes.'
      },
      {
        timestamp: '10:01:15',
        speaker: 'Interviewer',
        content: 'That sounds great. Could you walk us through your design process for a recent project?'
      },
      {
        timestamp: '10:01:30',
        speaker: 'Candidate',
        content: 'Certainly. For my last project, I started with user research to understand pain points, created user personas, developed wireframes, and then moved to high-fidelity prototypes. I used Figma for the entire process.'
      },
      {
        timestamp: '10:02:45',
        speaker: 'Interviewer',
        content: 'How do you handle feedback from stakeholders?'
      },
      {
        timestamp: '10:03:00',
        speaker: 'Candidate',
        content: 'I believe in collaborative design. I present my work with clear rationale, listen to feedback, and iterate based on valid concerns while maintaining design principles.'
      }
    ],
    aiAssessment: {
      overallScore: 92,
      categoryScores: {
        technical: 95,
        communication: 90,
        problemSolving: 88,
        culturalFit: 94
      },
      strengths: [
        'Strong technical skills in modern design tools',
        'Excellent communication and presentation abilities',
        'User-centered design approach',
        'Adaptable to feedback'
      ],
      areasForImprovement: [
        'Could provide more specific metrics for design impact',
        'Consider more diverse user testing methods'
      ],
      recommendations: [
        'Proceed to next round with design challenge',
        'Include in team collaboration session'
      ]
    },
    humanFeedback: {
      score: 90,
      notes: 'Sarah demonstrated strong technical skills and a clear design process. Her portfolio shows excellent attention to detail and user-centered thinking.',
      nextSteps: 'Schedule design challenge and team fit interview',
      decision: 'Further Evaluation'
    }
  },
  {
    id: 2,
    candidate: {
      name: 'Raj Sharma',
      position: 'Sales Executive',
    },
    date: '2025-03-20',
    time: '2:30 PM',
    type: 'Behavioral',
    status: 'Completed',
    interviewers: ['Michael Brown', 'Lisa Chen'],
    location: 'Office - Room 101',
    transcript: [
      {
        timestamp: '14:30:00',
        speaker: 'Interviewer',
        content: 'Welcome Raj. Could you tell us about a challenging sales situation you handled?'
      },
      {
        timestamp: '14:30:30',
        speaker: 'Candidate',
        content: 'Thank you. One challenging situation was when I had to recover a key account that was about to churn. I identified their pain points, proposed a customized solution, and successfully retained them with a 20% upsell.'
      },
      {
        timestamp: '14:31:45',
        speaker: 'Interviewer',
        content: 'How do you handle rejection in sales?'
      },
      {
        timestamp: '14:32:00',
        speaker: 'Candidate',
        content: 'I view rejection as an opportunity to learn. I analyze what went wrong, gather feedback, and use it to improve my approach. It\'s all part of the sales process.'
      }
    ],
    aiAssessment: {
      overallScore: 85,
      categoryScores: {
        technical: 82,
        communication: 88,
        problemSolving: 90,
        culturalFit: 80
      },
      strengths: [
        'Strong problem-solving skills',
        'Excellent communication',
        'Resilient under pressure',
        'Strategic thinking'
      ],
      areasForImprovement: [
        'Could provide more specific metrics',
        'Needs to demonstrate more industry knowledge'
      ],
      recommendations: [
        'Proceed to product knowledge assessment',
        'Include in team role-play exercise'
      ]
    },
    humanFeedback: {
      score: 88,
      notes: 'Raj showed strong sales acumen and problem-solving skills. His approach to handling rejection was particularly impressive.',
      nextSteps: 'Schedule product knowledge test and final interview',
      decision: 'Further Evaluation'
    }
  },
  {
    id: 3,
    candidate: {
      name: 'Amit Patel',
      position: 'Full Stack Developer',
    },
    date: '2025-03-21',
    time: '11:00 AM',
    type: 'Technical',
    status: 'Scheduled',
    interviewers: ['David Wilson', 'Sarah Lee'],
    location: 'Virtual',
    transcript: [],
    aiAssessment: {
      overallScore: 0,
      categoryScores: {
        technical: 0,
        communication: 0,
        problemSolving: 0,
        culturalFit: 0
      },
      strengths: [],
      areasForImprovement: [],
      recommendations: []
    },
    humanFeedback: {
      score: 0,
      notes: '',
      nextSteps: '',
      decision: 'Further Evaluation'
    }
  },
  {
    id: 4,
    candidate: {
      name: 'Priya Gupta',
      position: 'AI Research Intern',
    },
    date: '2025-03-22',
    time: '3:00 PM',
    type: 'Technical',
    status: 'Completed',
    interviewers: ['Robert Johnson', 'Maria Garcia'],
    location: 'Virtual',
    transcript: [
      {
        timestamp: '15:00:00',
        speaker: 'Interviewer',
        content: 'Welcome Priya. Could you tell us about your experience with machine learning?'
      },
      {
        timestamp: '15:00:30',
        speaker: 'Candidate',
        content: 'Thank you. I have worked on several ML projects during my master\'s program, focusing on natural language processing and computer vision. I\'m particularly interested in transformer models and their applications.'
      },
      {
        timestamp: '15:01:45',
        speaker: 'Interviewer',
        content: 'What was your most challenging ML project?'
      },
      {
        timestamp: '15:02:00',
        speaker: 'Candidate',
        content: 'My most challenging project was developing a sentiment analysis model for multilingual social media data. The main challenge was handling code-switching and cultural context in different languages.'
      }
    ],
    aiAssessment: {
      overallScore: 88,
      categoryScores: {
        technical: 92,
        communication: 85,
        problemSolving: 90,
        culturalFit: 85
      },
      strengths: [
        'Strong theoretical foundation in ML',
        'Excellent problem-solving approach',
        'Clear communication of complex concepts',
        'Enthusiastic about research'
      ],
      areasForImprovement: [
        'Could benefit from more practical implementation experience',
        'Needs to work on presenting technical details more concisely'
      ],
      recommendations: [
        'Proceed with technical assessment',
        'Include in research team meeting'
      ]
    },
    humanFeedback: {
      score: 85,
      notes: 'Priya showed strong theoretical knowledge and enthusiasm for ML research. Her project experience is impressive, though she could benefit from more practical implementation experience.',
      nextSteps: 'Schedule technical assessment and team meeting',
      decision: 'Further Evaluation'
    }
  }
]; 