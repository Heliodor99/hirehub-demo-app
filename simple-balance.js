const fs = require('fs');
const path = require('path');

// Define paths
const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
const backupPath = `${candidatesPath}.backup-balance-${Date.now()}`;

// Create backup
fs.copyFileSync(candidatesPath, backupPath);
console.log(`Created backup at ${backupPath}`);

// Read current file
let fileContent = fs.readFileSync(candidatesPath, 'utf8');

// Calculate how many more INTERVIEWED candidates we need to add
const interviewedCount = (fileContent.match(/stage: RecruitmentStage\.INTERVIEWED/g) || []).length;
const targetCount = 17;
const toAdd = targetCount - interviewedCount;

console.log(`Current INTERVIEWED count: ${interviewedCount}`);
console.log(`Need to add ${toAdd} more INTERVIEWED candidates`);

if (toAdd <= 0) {
  console.log('No need to add more INTERVIEWED candidates.');
  process.exit(0);
}

// Count current distribution by job ID
const jobIdRegex = /jobId: ['"](\d+)['"][\s\S]*?stage: RecruitmentStage\.INTERVIEWED/g;
const jobIdCounts = { '1': 0, '2': 0, '3': 0, '4': 0 };
let match;

// Reset regex
jobIdRegex.lastIndex = 0;
while ((match = jobIdRegex.exec(fileContent)) !== null) {
  const jobId = match[1];
  jobIdCounts[jobId] = (jobIdCounts[jobId] || 0) + 1;
}

// Create a target distribution with balanced job IDs
const targetDistribution = { ...jobIdCounts };
for (let i = 0; i < toAdd; i++) {
  // Find the job ID with the lowest count
  const minJobId = Object.keys(targetDistribution).reduce((a, b) => 
    targetDistribution[a] <= targetDistribution[b] ? a : b);
  targetDistribution[minJobId]++;
}

console.log('Current INTERVIEWED by job ID:');
console.log(jobIdCounts);

console.log('Target INTERVIEWED by job ID:');
console.log(targetDistribution);

// Add the additional candidates to the file
const candidatesToAdd = [];

// For each job ID, add the needed number of candidates
Object.keys(targetDistribution).forEach(jobId => {
  const needed = targetDistribution[jobId] - (jobIdCounts[jobId] || 0);
  for (let i = 0; i < needed; i++) {
    const newId = `${100 + candidatesToAdd.length}`;
    candidatesToAdd.push({
      jobId,
      id: newId,
      name: `Additional Candidate ${newId}`
    });
  }
});

// Generate additional candidates
const additionalCandidates = candidatesToAdd.map(candidate => `
  {
    id: '${candidate.id}',
    name: '${candidate.name}',
    email: '${candidate.name.toLowerCase().replace(' ', '.')}@example.com',
    phone: '+91-${Math.floor(10000000 + Math.random() * 90000000)}',
    currentTitle: 'Senior Developer',
    currentCompany: 'Tech Company',
    location: 'Bangalore, Karnataka',
    experience: ${Math.floor(3 + Math.random() * 7)},
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS'],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Top University',
        year: ${2010 + Math.floor(Math.random() * 10)}
      }
    ],
    resume: 'https://example.com/resume',
    source: 'LinkedIn',
    appliedDate: '2023-10-${Math.floor(1 + Math.random() * 30)}',
    stage: RecruitmentStage.INTERVIEWED,
    jobId: '${candidate.jobId}',
    notes: 'Excellent technical skills and experience',
    assessment: {
      score: ${Math.floor(80 + Math.random() * 15)},
      feedback: 'Strong technical background with good communication',
      completed: true
    }
  },`);

// Insert the additional candidates into the file (before the closing bracket)
fileContent = fileContent.replace(/\n\];/, `,${additionalCandidates.join('')}\n];`);

// Write back to the file
fs.writeFileSync(candidatesPath, fileContent);

console.log(`Added ${candidatesToAdd.length} new INTERVIEWED candidates`);
console.log('New INTERVIEWED count:', interviewedCount + candidatesToAdd.length); 