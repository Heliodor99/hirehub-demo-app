const fs = require('fs');
const path = require('path');

const CANDIDATES_FILE_PATH = path.join(__dirname, 'src', 'data', 'candidates.ts');

// Create a backup before making changes
const backupPath = `${CANDIDATES_FILE_PATH}.backup-final-${Date.now()}`;
fs.copyFileSync(CANDIDATES_FILE_PATH, backupPath);
console.log(`Created backup at ${backupPath}`);

// Read the entire candidates file content
const candidatesContent = fs.readFileSync(CANDIDATES_FILE_PATH, 'utf8');

// Extract all candidate objects using a more reliable approach
const candidatesMatches = candidatesContent.match(/\{[\s\S]*?id: ['"](\d+)['"][\s\S]*?stage: RecruitmentStage\.([A-Z_]+)[\s\S]*?jobId: ['"](\d+)['"][\s\S]*?\}/g);

if (!candidatesMatches || candidatesMatches.length === 0) {
  console.error('Could not find properly formatted candidates in the file');
  process.exit(1);
}

console.log(`Found ${candidatesMatches.length} candidate objects`);

// Count by stages
const stages = {};
candidatesMatches.forEach(candidate => {
  const stageMatch = candidate.match(/stage: RecruitmentStage\.([A-Z_]+)/);
  if (stageMatch) {
    const stage = stageMatch[1];
    stages[stage] = (stages[stage] || 0) + 1;
  }
});

console.log('Stages distribution:');
console.log(stages);

// Count by jobIds
const jobIds = {};
candidatesMatches.forEach(candidate => {
  const jobIdMatch = candidate.match(/jobId: ['"](\d+)['"]/);
  if (jobIdMatch) {
    const jobId = jobIdMatch[1];
    jobIds[jobId] = (jobIds[jobId] || 0) + 1;
  }
});

console.log('Job IDs distribution:');
console.log(jobIds);

// Generate new file content with proper formatting
let newContent = 'import { Candidate, RecruitmentStage } from \'@/types\';\n\n';

// Add the divyaKrishnan constant
newContent += `const divyaKrishnan: Candidate = {
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
};\n\n`;

// Add the export statement and opening bracket
newContent += 'export const candidates: Candidate[] = [\n';

// Add each candidate object
candidatesMatches.forEach((candidate, index) => {
  // Format the candidate object (ensure proper indentation)
  const formattedCandidate = candidate
    .replace(/\n\s*/g, '\n  ')  // Fix indentation
    .replace(/^\{/, '  {');     // Add indentation to first line
  
  newContent += formattedCandidate;
  if (index < candidatesMatches.length - 1) {
    newContent += ',\n';
  } else {
    newContent += '\n';
  }
});

// Close the array
newContent += '];\n';

// Write the fixed content back to the file
fs.writeFileSync(CANDIDATES_FILE_PATH, newContent);
console.log(`Fixed candidates file at ${CANDIDATES_FILE_PATH}`); 