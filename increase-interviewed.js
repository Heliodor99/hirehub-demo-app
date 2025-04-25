const fs = require('fs');
const path = require('path');

const CANDIDATES_FILE_PATH = path.join(__dirname, 'src', 'data', 'candidates.ts');

// Read the candidates file
const candidatesContent = fs.readFileSync(CANDIDATES_FILE_PATH, 'utf8');

// Create a backup before making changes
const backupPath = `${CANDIDATES_FILE_PATH}.backup-${Date.now()}`;
fs.writeFileSync(backupPath, candidatesContent);
console.log(`Created backup at ${backupPath}`);

// Extract the candidates array using regex
const candidatesArrayMatch = candidatesContent.match(/export const candidates: Candidate\[\] = \[([\s\S]*?)\];/);

if (!candidatesArrayMatch) {
  console.error('Could not find candidates array in the file');
  process.exit(1);
}

// Parse the candidates array
const candidatesArrayString = candidatesArrayMatch[1];
const candidates = [];
const candidateObjectsRegex = /\s*\{\s*id: ['"]([^'"]*)['"]([\s\S]*?)stage: RecruitmentStage\.([A-Z_]+)([\s\S]*?)jobId: ['"]([^'"]*)['"]([\s\S]*?)\},?(?=\s*\{|\s*$)/g;

let match;
while ((match = candidateObjectsRegex.exec(candidatesArrayString)) !== null) {
  const id = match[1];
  const stage = match[3];
  const jobId = match[5];
  const fullMatch = match[0].trim();
  
  if (id && stage && jobId) {
    candidates.push({
      id,
      stage,
      jobId,
      originalStr: fullMatch
    });
  }
}

console.log(`Successfully parsed ${candidates.length} candidates`);

// Count candidates by stage
const stageCount = {};
candidates.forEach(candidate => {
  stageCount[candidate.stage] = (stageCount[candidate.stage] || 0) + 1;
});

console.log('Current stage distribution:');
console.log(stageCount);

// Count interviewed candidates by job ID
const interviewedByJobId = {};
candidates.forEach(candidate => {
  if (candidate.stage === 'INTERVIEWED') {
    interviewedByJobId[candidate.jobId] = (interviewedByJobId[candidate.jobId] || 0) + 1;
  }
});

console.log('Current INTERVIEWED candidates by job ID:');
console.log(interviewedByJobId);

// Determine how many candidates to add to INTERVIEWED stage
const currentInterviewedCount = stageCount['INTERVIEWED'] || 0;
const targetInterviewedCount = 17;
const interviewedToAddCount = Math.max(0, targetInterviewedCount - currentInterviewedCount);

console.log(`Need to add ${interviewedToAddCount} candidates to INTERVIEWED stage`);

// Determine which jobIds need more INTERVIEWED candidates
const jobIds = Object.keys(interviewedByJobId);
const targetJobDistribution = {};
let remainingToDistribute = targetInterviewedCount;

// Ensure each job has at least 4 INTERVIEWED candidates
jobIds.forEach(jobId => {
  const currentCount = interviewedByJobId[jobId] || 0;
  const targetCount = Math.max(4, currentCount);
  targetJobDistribution[jobId] = targetCount;
  remainingToDistribute -= targetCount;
});

// Adjust target distribution based on remaining slots
if (remainingToDistribute > 0) {
  console.log(`${remainingToDistribute} additional INTERVIEWED slots to distribute`);
  const sortedJobIds = jobIds.sort((a, b) => {
    return (interviewedByJobId[a] || 0) - (interviewedByJobId[b] || 0);
  });
  
  for (let i = 0; i < sortedJobIds.length && remainingToDistribute > 0; i++) {
    targetJobDistribution[sortedJobIds[i]]++;
    remainingToDistribute--;
  }
}

console.log('Target INTERVIEWED distribution by job ID:');
console.log(targetJobDistribution);

// Function to update candidate stage to balance job distribution
function updateStageToInterviewed(candidates) {
  const updatedCandidates = [...candidates];
  const jobsToIncrease = {};
  
  // Calculate how many more INTERVIEWED candidates we need for each job
  Object.keys(targetJobDistribution).forEach(jobId => {
    const current = interviewedByJobId[jobId] || 0;
    const target = targetJobDistribution[jobId];
    if (target > current) {
      jobsToIncrease[jobId] = target - current;
    }
  });
  
  console.log('Jobs that need more INTERVIEWED candidates:');
  console.log(jobsToIncrease);
  
  // For each job that needs more INTERVIEWED candidates
  Object.keys(jobsToIncrease).forEach(jobId => {
    let toAdd = jobsToIncrease[jobId];
    
    // Prioritize SHORTLISTED candidates first
    for (let i = 0; i < updatedCandidates.length && toAdd > 0; i++) {
      const candidate = updatedCandidates[i];
      if (candidate.stage === 'SHORTLISTED' && candidate.jobId === jobId) {
        candidate.stage = 'INTERVIEWED';
        toAdd--;
      }
    }
    
    // If we still need more, use APPLIED candidates
    if (toAdd > 0) {
      for (let i = 0; i < updatedCandidates.length && toAdd > 0; i++) {
        const candidate = updatedCandidates[i];
        if (candidate.stage === 'APPLIED' && candidate.jobId === jobId) {
          candidate.stage = 'INTERVIEWED';
          toAdd--;
        }
      }
    }
  });
  
  return updatedCandidates;
}

// Update the candidates' stages
const updatedCandidates = updateStageToInterviewed(candidates);

// Count the new distribution
const newStageCount = {};
updatedCandidates.forEach(candidate => {
  newStageCount[candidate.stage] = (newStageCount[candidate.stage] || 0) + 1;
});

console.log('New stage distribution:');
console.log(newStageCount);

// Count the new interviewed by job ID
const newInterviewedByJobId = {};
updatedCandidates.forEach(candidate => {
  if (candidate.stage === 'INTERVIEWED') {
    newInterviewedByJobId[candidate.jobId] = (newInterviewedByJobId[candidate.jobId] || 0) + 1;
  }
});

console.log('New INTERVIEWED candidates by job ID:');
console.log(newInterviewedByJobId);

// Replace the original candidates in the file
let newContent = candidatesContent;
updatedCandidates.forEach(candidate => {
  if (candidate.stage !== 'INTERVIEWED') return; // Only process candidates whose stage was changed
  
  const originalStr = candidate.originalStr;
  // Extract the start of the original string up to the stage
  const beforeStage = originalStr.split(/stage: RecruitmentStage\.[A-Z_]+/)[0];
  // Extract the end of the original string after the stage
  const afterStage = originalStr.split(/stage: RecruitmentStage\.[A-Z_]+/)[1];
  
  if (beforeStage && afterStage) {
    // Create an updated string with the new stage
    const updatedStr = beforeStage + `stage: RecruitmentStage.${candidate.stage}` + afterStage;
    // Replace in the content
    newContent = newContent.replace(originalStr, updatedStr);
  }
});

// Write the updated content back to the file
fs.writeFileSync(CANDIDATES_FILE_PATH, newContent);
console.log(`Updated candidates file at ${CANDIDATES_FILE_PATH}`); 