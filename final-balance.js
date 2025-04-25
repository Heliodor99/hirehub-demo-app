const fs = require('fs');
const path = require('path');

// Define paths
const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
const backupPath = `${candidatesPath}.backup-final-balance-${Date.now()}`;

// Create backup
fs.copyFileSync(candidatesPath, backupPath);
console.log(`Created backup at ${backupPath}`);

// Read the current file
const fileContent = fs.readFileSync(candidatesPath, 'utf8');

// Parse the current file content using regular expressions
const importMatch = fileContent.match(/import.*?from.*?;/);
const divyaMatch = fileContent.match(/const divyaKrishnan[\s\S]*?};/);
const candidatesArrayMatch = fileContent.match(/export const candidates: Candidate\[\] = \[([\s\S]*?)\];/);

if (!candidatesArrayMatch) {
  console.error('Could not find candidates array');
  process.exit(1);
}

// Extract all candidate objects
const candidatesString = candidatesArrayMatch[1];
const candidateRegex = /\s*\{[\s\S]*?id: ['"](\d+)['"][\s\S]*?stage: RecruitmentStage\.([A-Z_]+)[\s\S]*?jobId: ['"](\d+)['"][\s\S]*?\}/g;
const candidates = [];
let match;

while ((match = candidateRegex.exec(candidatesString)) !== null) {
  // Get the full match and the captured groups
  const fullMatch = match[0];
  const id = match[1];
  const stage = match[2];
  const jobId = match[3];
  
  candidates.push({
    id,
    stage,
    jobId,
    text: fullMatch
  });
}

console.log(`Found ${candidates.length} candidates`);

// Count stages
const stageCount = {};
candidates.forEach(c => {
  stageCount[c.stage] = (stageCount[c.stage] || 0) + 1;
});
console.log('Current stage distribution:');
console.log(stageCount);

// Count INTERVIEWED by job ID
const interviewedByJobId = {};
candidates.forEach(c => {
  if (c.stage === 'INTERVIEWED') {
    interviewedByJobId[c.jobId] = (interviewedByJobId[c.jobId] || 0) + 1;
  }
});
console.log('Current INTERVIEWED by job ID:');
console.log(interviewedByJobId);

// Calculate target distribution (exactly 17 total, balanced across job IDs)
const TARGET_INTERVIEWED = 17;
const jobIds = Object.keys(interviewedByJobId).sort();
const targetDistribution = {};

// Start with equal distribution
jobIds.forEach(jobId => {
  targetDistribution[jobId] = Math.floor(TARGET_INTERVIEWED / jobIds.length);
});

// Distribute remaining slots
let remaining = TARGET_INTERVIEWED - Object.values(targetDistribution).reduce((a, b) => a + b, 0);
for (let i = 0; i < remaining; i++) {
  targetDistribution[jobIds[i % jobIds.length]]++;
}

console.log('Target INTERVIEWED distribution:');
console.log(targetDistribution);

// Determine which candidates to change
const candidatesToChange = [];

// First, handle cases where we need to reduce INTERVIEWED candidates
jobIds.forEach(jobId => {
  const current = interviewedByJobId[jobId] || 0;
  const target = targetDistribution[jobId];
  
  if (current > target) {
    // Need to convert some INTERVIEWED to SHORTLISTED
    const toConvert = current - target;
    console.log(`Need to convert ${toConvert} INTERVIEWED candidates for job ID ${jobId} to SHORTLISTED`);
    
    // Find candidates to convert
    const interviewedForJobId = candidates.filter(c => 
      c.stage === 'INTERVIEWED' && c.jobId === jobId);
    
    // Add to change list (only as many as needed)
    for (let i = 0; i < Math.min(toConvert, interviewedForJobId.length); i++) {
      candidatesToChange.push({
        id: interviewedForJobId[i].id,
        from: 'INTERVIEWED',
        to: 'SHORTLISTED'
      });
    }
  }
});

// Then, handle cases where we need to increase INTERVIEWED candidates
jobIds.forEach(jobId => {
  const current = interviewedByJobId[jobId] || 0;
  const target = targetDistribution[jobId];
  
  if (current < target) {
    // Need to convert some SHORTLISTED to INTERVIEWED
    const toConvert = target - current;
    console.log(`Need to convert ${toConvert} candidates for job ID ${jobId} to INTERVIEWED`);
    
    // Find candidates to convert, prioritizing SHORTLISTED
    const shortlistedForJobId = candidates.filter(c => 
      c.stage === 'SHORTLISTED' && c.jobId === jobId);
    
    // If not enough SHORTLISTED, look at APPLIED
    let availableCandidates = [...shortlistedForJobId];
    if (availableCandidates.length < toConvert) {
      const appliedForJobId = candidates.filter(c => 
        c.stage === 'APPLIED' && c.jobId === jobId);
      availableCandidates = [...availableCandidates, ...appliedForJobId];
    }
    
    // Add to change list
    for (let i = 0; i < Math.min(toConvert, availableCandidates.length); i++) {
      candidatesToChange.push({
        id: availableCandidates[i].id,
        from: availableCandidates[i].stage,
        to: 'INTERVIEWED'
      });
    }
  }
});

console.log('Candidates to change:');
console.log(candidatesToChange);

// Apply changes to candidates
candidatesToChange.forEach(change => {
  const candidate = candidates.find(c => c.id === change.id);
  if (candidate) {
    // Update stage in text
    candidate.text = candidate.text.replace(
      new RegExp(`stage: RecruitmentStage\\.${change.from}`),
      `stage: RecruitmentStage.${change.to}`
    );
    // Update stage in object
    candidate.stage = change.to;
  }
});

// Rebuild file content
let newContent = '';

// Add import statement
if (importMatch) {
  newContent += importMatch[0] + '\n\n';
}

// Add divyaKrishnan constant
if (divyaMatch) {
  newContent += divyaMatch[0] + '\n\n';
}

// Add candidates array
newContent += 'export const candidates: Candidate[] = [\n';

// Add divyaKrishnan to the array if it exists
if (divyaMatch) {
  newContent += '  divyaKrishnan,\n';
}

// Add each candidate
candidates.forEach((candidate, index) => {
  newContent += candidate.text;
  if (index < candidates.length - 1) {
    newContent += ',\n';
  } else {
    newContent += '\n';
  }
});

// Close the array
newContent += '];\n';

// Write the file
fs.writeFileSync(candidatesPath, newContent);
console.log(`Successfully updated candidates file`);

// Verify the result
const updatedContent = fs.readFileSync(candidatesPath, 'utf8');
const finalInterviewedCount = (updatedContent.match(/stage: RecruitmentStage\.INTERVIEWED/g) || []).length;
console.log(`Final INTERVIEWED count: ${finalInterviewedCount}`);

// Count final INTERVIEWED by job ID
const finalInterviewedByJobId = {};
const interviewedRegex = /jobId: ['"](\d+)['"][\s\S]*?stage: RecruitmentStage\.INTERVIEWED/g;
while ((match = interviewedRegex.exec(updatedContent)) !== null) {
  const jobId = match[1];
  finalInterviewedByJobId[jobId] = (finalInterviewedByJobId[jobId] || 0) + 1;
}

console.log('Final INTERVIEWED by job ID:');
console.log(finalInterviewedByJobId); 