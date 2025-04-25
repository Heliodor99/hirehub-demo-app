const fs = require('fs');
const path = require('path');

// Define paths
const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
const backupPath = `${candidatesPath}.backup-clean-${Date.now()}`;

// Create backup
fs.copyFileSync(candidatesPath, backupPath);
console.log(`Created backup at ${backupPath}`);

// Create a fresh candidates file with proper syntax
const cleanContent = `import { Candidate, RecruitmentStage } from '@/types';

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
  resume: 'https://divyakrishnan.dev',
  source: 'LinkedIn',
  appliedDate: '2023-10-15',
  stage: RecruitmentStage.INTERVIEWED,
  jobId: '1',
  notes: 'Excellent React skills, 5+ years of experience in frontend development',
  assessment: {
    score: 92,
    feedback: 'Strong technical skills and great cultural fit',
    completed: true
  }
};

export const candidates: Candidate[] = [
  divyaKrishnan,
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    phone: '+91-98765-43210',
    currentTitle: 'Senior Frontend Developer',
    currentCompany: 'TechCorp India',
    location: 'Bangalore, Karnataka',
    experience: 7,
    skills: ['React', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Redux'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'IIT Delhi',
        year: 2016
      }
    ],
    resume: 'https://rahulsharma.dev',
    source: 'LinkedIn',
    appliedDate: '2023-10-12',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '1',
    notes: 'Strong React experience with enterprise applications',
    assessment: {
      score: 85,
      feedback: 'Good technical skills and communication',
      completed: true
    }
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@outlook.com',
    phone: '+91-87654-32109',
    currentTitle: 'UI/UX Designer',
    currentCompany: 'DesignHub',
    location: 'Mumbai, Maharashtra',
    experience: 5,
    skills: ['Figma', 'Adobe XD', 'UI/UX', 'Sketch', 'Prototyping'],
    education: [
      {
        degree: 'B.Des in UI/UX Design',
        institution: 'NID Ahmedabad',
        year: 2018
      }
    ],
    resume: 'https://priyapatel.design',
    source: 'Dribbble',
    appliedDate: '2023-10-14',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '2',
    notes: 'Excellent portfolio with mobile-first approach',
    assessment: {
      score: 90,
      feedback: 'Strong design skills and user-centered approach',
      completed: true
    }
  },
  {
    id: '3',
    name: 'Vikram Singh',
    email: 'vikram.singh@gmail.com',
    phone: '+91-76543-21098',
    currentTitle: 'Backend Developer',
    currentCompany: 'CloudTech Solutions',
    location: 'Hyderabad, Telangana',
    experience: 6,
    skills: ['Node.js', 'Express', 'MongoDB', 'AWS', 'Microservices'],
    education: [
      {
        degree: 'B.Tech in Information Technology',
        institution: 'BITS Pilani',
        year: 2017
      }
    ],
    resume: 'https://vikramsingh.tech',
    source: 'AngelList',
    appliedDate: '2023-10-10',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '3',
    notes: 'Strong backend architecture experience',
    assessment: {
      score: 88,
      feedback: 'Excellent system design skills',
      completed: true
    }
  },
  {
    id: '4',
    name: 'Neha Gupta',
    email: 'neha.gupta@yahoo.com',
    phone: '+91-65432-10987',
    currentTitle: 'Product Manager',
    currentCompany: 'ProductFirst',
    location: 'Pune, Maharashtra',
    experience: 8,
    skills: ['Product Strategy', 'Roadmapping', 'User Research', 'Agile', 'JIRA'],
    education: [
      {
        degree: 'MBA in Product Management',
        institution: 'IIM Bangalore',
        year: 2015
      },
      {
        degree: 'B.E. in Computer Science',
        institution: 'COEP Pune',
        year: 2013
      }
    ],
    resume: 'https://nehagupta.pm',
    source: 'Referral',
    appliedDate: '2023-10-08',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '4',
    notes: 'Strong product sense and technical background',
    assessment: {
      score: 92,
      feedback: 'Excellent product vision and leadership skills',
      completed: true
    }
  },
  {
    id: '5',
    name: 'Arjun Reddy',
    email: 'arjun.reddy@gmail.com',
    phone: '+91-54321-09876',
    currentTitle: 'DevOps Engineer',
    currentCompany: 'InfraCore',
    location: 'Bangalore, Karnataka',
    experience: 6,
    skills: ['Kubernetes', 'Docker', 'Jenkins', 'Terraform', 'AWS', 'CI/CD'],
    education: [
      {
        degree: 'B.Tech in Computer Engineering',
        institution: 'NIT Surathkal',
        year: 2017
      }
    ],
    resume: 'https://arjunreddy.cloud',
    source: 'Stack Overflow',
    appliedDate: '2023-10-15',
    stage: RecruitmentStage.SHORTLISTED,
    jobId: '1',
    notes: 'Strong experience with cloud infrastructure',
    assessment: {
      score: 87,
      feedback: 'Good technical skills in cloud and automation',
      completed: true
    }
  },
  {
    id: '7',
    name: 'Anil Kumar',
    email: 'anil.kumar@outlook.com',
    phone: '+91-89012-34567',
    currentTitle: 'Data Scientist',
    currentCompany: 'DataInsights',
    location: 'Delhi, NCR',
    experience: 5,
    skills: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'Data Analysis'],
    education: [
      {
        degree: 'M.Tech in AI',
        institution: 'IIT Bombay',
        year: 2018
      }
    ],
    resume: 'https://anilkumar.ai',
    source: 'Company Website',
    appliedDate: '2023-10-11',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '3',
    notes: 'Strong ML background with published research',
    assessment: {
      score: 89,
      feedback: 'Excellent technical skills in ML and data analysis',
      completed: true
    }
  },
  {
    id: '8',
    name: 'Deepak Joshi',
    email: 'deepak.joshi@gmail.com',
    phone: '+91-78901-23456',
    currentTitle: 'Full Stack Developer',
    currentCompany: 'TechStartup',
    location: 'Bangalore, Karnataka',
    experience: 4,
    skills: ['React', 'Node.js', 'TypeScript', 'GraphQL', 'MongoDB'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'IIIT Hyderabad',
        year: 2019
      }
    ],
    resume: 'https://deepakjoshi.dev',
    source: 'AngelList',
    appliedDate: '2023-10-13',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '1',
    notes: 'Strong full-stack skills with startup experience',
    assessment: {
      score: 88,
      feedback: 'Good technical depth and problem-solving skills',
      completed: true
    }
  },
  {
    id: '9',
    name: 'Sneha Patel',
    email: 'sneha.patel@yahoo.com',
    phone: '+91-67890-12345',
    currentTitle: 'Frontend Developer',
    currentCompany: 'E-commerce Tech',
    location: 'Mumbai, Maharashtra',
    experience: 3,
    skills: ['React', 'JavaScript', 'CSS', 'Redux', 'Responsive Design'],
    education: [
      {
        degree: 'B.E. in Information Technology',
        institution: 'Mumbai University',
        year: 2020
      }
    ],
    resume: 'https://snehapatel.tech',
    source: 'LinkedIn',
    appliedDate: '2023-10-14',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '2',
    notes: 'Good experience with e-commerce frontend',
    assessment: {
      score: 82,
      feedback: 'Solid technical skills with good UI sensibility',
      completed: true
    }
  },
  {
    id: '10',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@gmail.com',
    phone: '+91-56789-01234',
    currentTitle: 'DevOps Engineer',
    currentCompany: 'Cloud Solutions',
    location: 'Bangalore, Karnataka',
    experience: 7,
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'CI/CD', 'Python'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'VIT Vellore',
        year: 2016
      }
    ],
    resume: 'https://rajeshkumar.cloud',
    source: 'Referral',
    appliedDate: '2023-10-10',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '4',
    notes: 'Expert in AWS and Kubernetes with large-scale experience',
    assessment: {
      score: 91,
      feedback: 'Exceptional DevOps knowledge and experience',
      completed: true
    }
  },
  {
    id: '11',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@outlook.com',
    phone: '+91-45678-90123',
    currentTitle: 'UX Researcher',
    currentCompany: 'Design Agency',
    location: 'Delhi, NCR',
    experience: 4,
    skills: ['User Research', 'Usability Testing', 'Information Architecture', 'Figma', 'Prototyping'],
    education: [
      {
        degree: 'M.Des in User Experience',
        institution: 'NID Ahmedabad',
        year: 2019
      }
    ],
    resume: 'https://ananyasharma.design',
    source: 'Dribbble',
    appliedDate: '2023-10-11',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '2',
    notes: 'Strong background in user research methodologies',
    assessment: {
      score: 87,
      feedback: 'Excellent research approach and user-centered thinking',
      completed: true
    }
  },
  {
    id: '12',
    name: 'Suresh Menon',
    email: 'suresh.menon@gmail.com',
    phone: '+91-34567-89012',
    currentTitle: 'Backend Engineer',
    currentCompany: 'FinTech Startup',
    location: 'Bangalore, Karnataka',
    experience: 5,
    skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Kafka'],
    education: [
      {
        degree: 'M.Tech in Computer Science',
        institution: 'IIT Madras',
        year: 2018
      }
    ],
    resume: 'https://sureshmenon.tech',
    source: 'AngelList',
    appliedDate: '2023-10-12',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '3',
    notes: 'Strong in building scalable microservices',
    assessment: {
      score: 86,
      feedback: 'Good technical skills with high-load experience',
      completed: true
    }
  },
  {
    id: '13',
    name: 'Kavita Singh',
    email: 'kavita.singh@yahoo.com',
    phone: '+91-23456-78901',
    currentTitle: 'Product Manager',
    currentCompany: 'Health Tech',
    location: 'Pune, Maharashtra',
    experience: 6,
    skills: ['Product Strategy', 'Agile', 'User Stories', 'Market Research', 'Data Analysis'],
    education: [
      {
        degree: 'MBA',
        institution: 'ISB Hyderabad',
        year: 2017
      }
    ],
    resume: 'https://kavitasingh.pm',
    source: 'LinkedIn',
    appliedDate: '2023-10-09',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '4',
    notes: 'Experience in healthcare product management',
    assessment: {
      score: 88,
      feedback: 'Excellent domain knowledge and product sense',
      completed: true
    }
  },
  {
    id: '14',
    name: 'Karthik Raman',
    email: 'karthik.raman@gmail.com',
    phone: '+91-12345-67890',
    currentTitle: 'ML Engineer',
    currentCompany: 'AI Solutions',
    location: 'Bangalore, Karnataka',
    experience: 4,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision'],
    education: [
      {
        degree: 'M.Tech in AI',
        institution: 'IISc Bangalore',
        year: 2019
      }
    ],
    resume: 'https://karthikraman.ai',
    source: 'Company Website',
    appliedDate: '2023-10-15',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '3',
    notes: 'Expertise in deep learning models',
    assessment: {
      score: 90,
      feedback: 'Strong technical knowledge in ML/AI',
      completed: true
    }
  },
  {
    id: '15',
    name: 'Meera Reddy',
    email: 'meera.reddy@outlook.com',
    phone: '+91-98765-43210',
    currentTitle: 'UI Designer',
    currentCompany: 'Digital Agency',
    location: 'Hyderabad, Telangana',
    experience: 3,
    skills: ['Figma', 'Adobe XD', 'UI Design', 'Illustration', 'Interaction Design'],
    education: [
      {
        degree: 'BFA in Design',
        institution: 'Symbiosis Institute of Design',
        year: 2020
      }
    ],
    resume: 'https://meerareddy.design',
    source: 'Dribbble',
    appliedDate: '2023-10-13',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '2',
    notes: 'Strong visual design portfolio',
    assessment: {
      score: 85,
      feedback: 'Excellent visual design skills and creativity',
      completed: true
    }
  },
  {
    id: '16',
    name: 'Ashok Kumar',
    email: 'ashok.kumar@gmail.com',
    phone: '+91-87654-32109',
    currentTitle: 'Frontend Lead',
    currentCompany: 'Tech Solutions',
    location: 'Bangalore, Karnataka',
    experience: 8,
    skills: ['React', 'TypeScript', 'Frontend Architecture', 'Performance Optimization', 'Team Leadership'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'IIT Roorkee',
        year: 2015
      }
    ],
    resume: 'https://ashokkumar.dev',
    source: 'LinkedIn',
    appliedDate: '2023-10-08',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '1',
    notes: 'Expert in frontend architecture and performance',
    assessment: {
      score: 93,
      feedback: 'Exceptional technical skills and leadership qualities',
      completed: true
    }
  },
  {
    id: '17',
    name: 'Ravi Desai',
    email: 'ravi.desai@yahoo.com',
    phone: '+91-76543-21098',
    currentTitle: 'Site Reliability Engineer',
    currentCompany: 'E-commerce Giant',
    location: 'Bangalore, Karnataka',
    experience: 6,
    skills: ['Kubernetes', 'Prometheus', 'Grafana', 'AWS', 'Python', 'Go'],
    education: [
      {
        degree: 'B.Tech in Computer Engineering',
        institution: 'BITS Pilani',
        year: 2017
      }
    ],
    resume: 'https://ravidesai.cloud',
    source: 'Referral',
    appliedDate: '2023-10-09',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '4',
    notes: 'Experience with large-scale infrastructure',
    assessment: {
      score: 89,
      feedback: 'Strong in managing complex cloud environments',
      completed: true
    }
  }
];`;

// Write the clean file
fs.writeFileSync(candidatesPath, cleanContent);
console.log(`Created clean candidates file at ${candidatesPath}`);

// Verify the file
try {
  const testContent = fs.readFileSync(candidatesPath, 'utf8');
  console.log(`File verified: ${testContent.length} bytes`);
  
  // Count the number of candidates
  const candidateCount = (testContent.match(/id: ['"]\d+['"],/g) || []).length;
  console.log(`Found ${candidateCount} candidates`);
  
  // Count INTERVIEWED candidates
  const interviewedCount = (testContent.match(/stage: RecruitmentStage\.INTERVIEWED,/g) || []).length;
  console.log(`INTERVIEWED candidates: ${interviewedCount}`);
} catch (error) {
  console.error('Error verifying file:', error);
} 