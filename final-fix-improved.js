const fs = require('fs');
const path = require('path');

const CANDIDATES_FILE_PATH = path.join(__dirname, 'src', 'data', 'candidates.ts');

// Create a backup before making changes
const backupPath = `${CANDIDATES_FILE_PATH}.backup-final-${Date.now()}`;
fs.copyFileSync(CANDIDATES_FILE_PATH, backupPath);
console.log(`Created backup at ${backupPath}`);

// Read the entire candidates file content
const candidatesContent = fs.readFileSync(CANDIDATES_FILE_PATH, 'utf8');

// Extract all candidate objects with a more specific regex pattern
// Look for objects with all expected fields: id, name, email, skills, stage, jobId, etc.
const candidateRegex = /\{\s*id: ['"](\d+)['"],[\s\S]*?name: ['"][^'"]*['"],[\s\S]*?email: ['"][^'"]*['"],[\s\S]*?phone: ['"][^'"]*['"],[\s\S]*?currentTitle: ['"][^'"]*['"],[\s\S]*?currentCompany: ['"][^'"]*['"],[\s\S]*?location: ['"][^'"]*['"],[\s\S]*?experience: \d+,[\s\S]*?skills: \[[^\]]*\],[\s\S]*?education: \[[^\]]*\],[\s\S]*?resume: ['"][^'"]*['"],[\s\S]*?source: ['"][^'"]*['"],[\s\S]*?appliedDate: ['"][^'"]*['"],[\s\S]*?stage: RecruitmentStage\.([A-Z_]+),[\s\S]*?jobId: ['"](\d+)['"],[\s\S]*?notes: ['"][^'"]*['"],[\s\S]*?assessment: \{[\s\S]*?\}\s*\}/g;

const candidates = [];
let match;
while ((match = candidateRegex.exec(candidatesContent)) !== null) {
  candidates.push({
    id: match[1],
    stage: match[2],
    jobId: match[3],
    object: match[0]
  });
}

console.log(`Found ${candidates.length} properly formatted candidate objects`);

if (candidates.length === 0) {
  console.error('No properly formatted candidates found. Aborting.');
  process.exit(1);
}

// Count by stages
const stages = {};
candidates.forEach(candidate => {
  stages[candidate.stage] = (stages[candidate.stage] || 0) + 1;
});

console.log('Stages distribution:');
console.log(stages);

// Count by jobIds
const jobIds = {};
candidates.forEach(candidate => {
  jobIds[candidate.jobId] = (jobIds[candidate.jobId] || 0) + 1;
});

console.log('Job IDs distribution:');
console.log(jobIds);

// Generate new file content with proper formatting
let newContent = 'import { Candidate, RecruitmentStage } from \'@/types\';\n\n';

// Add the divyaKrishnan constant definition
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

// Add divyaKrishnan to the candidates array
newContent += `  divyaKrishnan,\n`;

// Add each candidate object
candidates.forEach((candidate, index) => {
  // Format the candidate object (ensure proper indentation)
  const formattedCandidate = candidate.object
    .replace(/\n\s*/g, '\n  ')  // Fix indentation
    .replace(/^\{/, '  {');     // Add indentation to first line
  
  newContent += formattedCandidate;
  if (index < candidates.length - 1) {
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

// Verify the file content
const verifyContent = fs.readFileSync(CANDIDATES_FILE_PATH, 'utf8');
console.log(`File size: ${verifyContent.length} bytes`);
console.log(`Contains divyaKrishnan: ${verifyContent.includes('divyaKrishnan')}`);
console.log(`Contains candidates array: ${verifyContent.includes('export const candidates: Candidate[] = [')}`);
console.log(`Contains RecruitmentStage.INTERVIEWED: ${verifyContent.includes('RecruitmentStage.INTERVIEWED')}`);
console.log(`Appears properly formatted: ${!verifyContent.includes('import { Candidate, RecruitmentStage } from \'@/types\';export const candidates: Candidate[] = [')}`); 