const fs = require('fs');
const path = require('path');

const CANDIDATES_FILE_PATH = path.join(__dirname, 'src', 'data', 'candidates.ts');

// Create a backup before making changes
const backupPath = `${CANDIDATES_FILE_PATH}.backup-fixed-${Date.now()}`;
fs.copyFileSync(CANDIDATES_FILE_PATH, backupPath);
console.log(`Created backup at ${backupPath}`);

// Read the candidates file
const candidatesContent = fs.readFileSync(CANDIDATES_FILE_PATH, 'utf8');

// Extract all candidate objects using a more reliable approach
const candidatesMatches = candidatesContent.match(/\{[\s\S]*?id: ['"](\d+)['"][\s\S]*?stage: RecruitmentStage\.([A-Z_]+)[\s\S]*?jobId: ['"](\d+)['"][\s\S]*?\}/g);

if (!candidatesMatches || candidatesMatches.length === 0) {
  console.error('Could not find properly formatted candidates in the file');
  process.exit(1);
}

console.log(`Found ${candidatesMatches.length} candidate objects`);

// Generate new file content with proper formatting
let newContent = 'import { Candidate, RecruitmentStage } from \'@/types\';\n\n';

// If we have the divyaKrishnan object at the beginning, include it
const divyaMatch = candidatesContent.match(/const divyaKrishnan: Candidate = \{[\s\S]*?\};/);
if (divyaMatch) {
  newContent += divyaMatch[0] + '\n\n';
}

// Add the export statement and opening bracket
newContent += 'export const candidates: Candidate[] = [\n';

// Add each candidate object
candidatesMatches.forEach((candidate, index) => {
  newContent += '  ' + candidate.trim();
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

// Count candidates by stage
const stageRegex = /stage: RecruitmentStage\.([A-Z_]+)/g;
const stages = {};
let match;
while ((match = stageRegex.exec(newContent)) !== null) {
  const stage = match[1];
  stages[stage] = (stages[stage] || 0) + 1;
}

console.log('Candidate distribution by stage:');
console.log(stages);

// Count candidates by job ID
const jobIdRegex = /jobId: ['"](\d+)['"]/g;
const jobIds = {};
while ((match = jobIdRegex.exec(newContent)) !== null) {
  const jobId = match[1];
  jobIds[jobId] = (jobIds[jobId] || 0) + 1;
}

console.log('Candidate distribution by job ID:');
console.log(jobIds);

// Count interviewed candidates by job ID
const interviewedRegex = /stage: RecruitmentStage\.INTERVIEWED[\s\S]*?jobId: ['"](\d+)['"]/g;
const interviewedByJobId = {};
while ((match = interviewedRegex.exec(newContent)) !== null) {
  const jobId = match[1];
  interviewedByJobId[jobId] = (interviewedByJobId[jobId] || 0) + 1;
}

console.log('INTERVIEWED candidates by job ID:');
console.log(interviewedByJobId); 