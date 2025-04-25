const fs = require('fs');
const path = require('path');

// Define paths
const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
const backupPath = `${candidatesPath}.backup-final-${Date.now()}`;

// Create backup
fs.copyFileSync(candidatesPath, backupPath);
console.log(`Created backup at ${backupPath}`);

// Read the file
const fileContent = fs.readFileSync(candidatesPath, 'utf8');

// Find SHORTLISTED candidates with jobId 4
const shortlistedRegex = /id: ['"](\d+)['"][\s\S]*?jobId: ['"]4['"][\s\S]*?stage: RecruitmentStage\.SHORTLISTED/g;
const matches = [...fileContent.matchAll(shortlistedRegex)];

console.log(`Found ${matches.length} SHORTLISTED candidates with jobId 4`);

// Convert up to 2 of them to INTERVIEWED
let updatedContent = fileContent;
const toConvert = Math.min(2, matches.length);

for (let i = 0; i < toConvert; i++) {
  const id = matches[i][1];
  const pattern = new RegExp(`id: ['"]${id}['"][\\s\\S]*?stage: RecruitmentStage\\.SHORTLISTED`);
  const replacement = `id: '${id}'${matches[i][0].split('stage: RecruitmentStage.SHORTLISTED')[0]}stage: RecruitmentStage.INTERVIEWED`;
  
  updatedContent = updatedContent.replace(pattern, replacement);
  console.log(`Converted candidate with ID ${id} from SHORTLISTED to INTERVIEWED`);
}

// Write the file
fs.writeFileSync(candidatesPath, updatedContent);
console.log('Updated candidates file');

// Verify changes
const newContent = fs.readFileSync(candidatesPath, 'utf8');
const interviewedCount = (newContent.match(/stage: RecruitmentStage\.INTERVIEWED/g) || []).length;
console.log(`New total INTERVIEWED count: ${interviewedCount}`);

// Check distribution by job ID
const byJobId = {
  '1': 0,
  '2': 0,
  '3': 0,
  '4': 0
};

const jobIdRegex = /jobId: ['"](\d+)['"][\s\S]*?stage: RecruitmentStage\.INTERVIEWED/g;
let match;
while ((match = jobIdRegex.exec(newContent)) !== null) {
  const jobId = match[1];
  byJobId[jobId]++;
}

console.log('New INTERVIEWED distribution by job ID:');
console.log(byJobId); 