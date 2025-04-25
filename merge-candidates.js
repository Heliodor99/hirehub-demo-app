const fs = require('fs');
const path = require('path');

// Candidate data to migrate from jobs.ts
const candidatesFromJobs = [
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
    source: 'HireHub',
    appliedDate: '2024-03-26',
    stage: 'Outreached',
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
    appliedDate: '2024-03-13',
    stage: 'Outreached',
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
    appliedDate: '2024-03-16',
    stage: 'Outreached',
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
    resume: 'https://example.com/resumes/neha-gupta.pdf',
    source: 'HireHub',
    appliedDate: '2024-02-28',
    stage: 'Applied',
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
    resume: 'https://example.com/resumes/rahul-khanna.pdf',
    source: 'HireHub',
    appliedDate: '2024-04-13',
    stage: 'Outreached',
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
    source: 'HireHub',
    appliedDate: '2024-03-23',
    stage: 'Outreached',
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
    source: 'HireHub',
    appliedDate: '2024-03-25',
    stage: 'Applied',
    jobId: '4',
    notes: 'Good background in cloud technologies',
    assessment: {
      score: 82,
      feedback: 'Strong technical skills, especially in AWS',
      completed: true
    }
  }
];

// Read candidates.ts file
const candidatesFilePath = path.join(__dirname, 'src', 'data', 'candidates.ts');
let candidatesFileContent = fs.readFileSync(candidatesFilePath, 'utf8');

// Extract the existing candidates array
const candidatesArrayMatch = candidatesFileContent.match(/export const candidates: Candidate\[\] = \[([\s\S]*?)\];/);
if (!candidatesArrayMatch) {
  console.error('Could not find candidates array in candidates.ts file');
  process.exit(1);
}

// Get the existing candidates content
const existingCandidatesContent = candidatesArrayMatch[1];

// Format the new candidates to add
const newCandidatesContent = candidatesFromJobs.map(candidate => {
  // Convert "stage" string to RecruitmentStage enum
  const stageValue = `RecruitmentStage.${candidate.stage.toUpperCase()}`;
  
  return `  {
    id: '${candidate.id}',
    name: '${candidate.name}',
    email: '${candidate.email}',
    phone: '${candidate.phone}',
    currentTitle: '${candidate.currentTitle}',
    currentCompany: '${candidate.currentCompany}',
    location: '${candidate.location}',
    experience: ${candidate.experience},
    skills: ${JSON.stringify(candidate.skills)},
    education: ${JSON.stringify(candidate.education)},
    resume: '${candidate.resume}',
    source: '${candidate.source}',
    appliedDate: '${candidate.appliedDate}',
    stage: ${stageValue},
    jobId: '${candidate.jobId}',
    notes: '${candidate.notes}',
    assessment: ${JSON.stringify(candidate.assessment)}
  }`;
}).join(',\n');

// Create the updated candidates array
const updatedCandidatesContent = `export const candidates: Candidate[] = [${existingCandidatesContent},
${newCandidatesContent}
];`;

// Replace the candidates array in the file
const updatedFileContent = candidatesFileContent.replace(
  /export const candidates: Candidate\[\] = \[([\s\S]*?)\];/,
  updatedCandidatesContent
);

// Write to candidates.ts
fs.writeFileSync(candidatesFilePath, updatedFileContent, 'utf8');

console.log(`
Candidate Migration Complete:
============================
Added ${candidatesFromJobs.length} candidates from jobs.ts to candidates.ts
Successfully updated ${candidatesFilePath}

NEXT STEPS:
==========
1. Remove the 'candidates' array from jobs.ts manually
2. Run tests to ensure everything works correctly
`); 