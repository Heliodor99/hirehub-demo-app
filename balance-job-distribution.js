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

// Count candidates by job ID
const jobIdCount = {};
candidates.forEach(candidate => {
  jobIdCount[candidate.jobId] = (jobIdCount[candidate.jobId] || 0) + 1;
});

console.log('Current job ID distribution:');
console.log(jobIdCount);

// Count interviewed candidates by job ID
const interviewedByJobId = {};
candidates.forEach(candidate => {
  if (candidate.stage === 'INTERVIEWED') {
    interviewedByJobId[candidate.jobId] = (interviewedByJobId[candidate.jobId] || 0) + 1;
  }
});

console.log('Current INTERVIEWED candidates by job ID:');
console.log(interviewedByJobId);

// Determine how many candidates to move from INTERVIEWED to other stages
const currentInterviewedCount = stageCount['INTERVIEWED'] || 0;
const targetInterviewedCount = 17;
const interviewedToReduceCount = Math.max(0, currentInterviewedCount - targetInterviewedCount);

console.log(`Need to move ${interviewedToReduceCount} candidates from INTERVIEWED to other stages`);

// Determine target distribution for job IDs
const jobIds = Object.keys(jobIdCount);
const targetJobDistribution = {};
jobIds.forEach(jobId => {
  targetJobDistribution[jobId] = Math.round(targetInterviewedCount * (jobIdCount[jobId] / candidates.length));
});

console.log('Target INTERVIEWED distribution by job ID:');
console.log(targetJobDistribution);

// Function to update candidate stage while considering job ID balance
function updateStageWithJobBalance(candidates) {
  // Sort job IDs by how many candidates we need to remove (descending)
  const jobIdsToReduce = Object.keys(interviewedByJobId).sort((a, b) => {
    const aExcess = (interviewedByJobId[a] || 0) - (targetJobDistribution[a] || 0);
    const bExcess = (interviewedByJobId[b] || 0) - (targetJobDistribution[b] || 0);
    return bExcess - aExcess;
  });

  let remainingToMove = interviewedToReduceCount;
  const updatedCandidates = [...candidates];
  
  // First pass: prioritize jobs with more excess interviewed candidates
  for (const jobId of jobIdsToReduce) {
    if (remainingToMove <= 0) break;
    
    const excessCount = Math.max(0, (interviewedByJobId[jobId] || 0) - (targetJobDistribution[jobId] || 0));
    const toMoveFromThisJob = Math.min(excessCount, remainingToMove);
    
    let movedFromThisJob = 0;
    for (let i = 0; i < updatedCandidates.length && movedFromThisJob < toMoveFromThisJob; i++) {
      const candidate = updatedCandidates[i];
      if (candidate.stage === 'INTERVIEWED' && candidate.jobId === jobId) {
        // Alternate between SHORTLISTED and APPLIED to maintain balance
        candidate.stage = movedFromThisJob % 2 === 0 ? 'SHORTLISTED' : 'APPLIED';
        movedFromThisJob++;
        remainingToMove--;
      }
    }
  }
  
  // Second pass: if we still need to move candidates, distribute evenly
  if (remainingToMove > 0) {
    for (let i = 0; i < updatedCandidates.length && remainingToMove > 0; i++) {
      const candidate = updatedCandidates[i];
      if (candidate.stage === 'INTERVIEWED') {
        // Alternate between SHORTLISTED and APPLIED
        candidate.stage = remainingToMove % 2 === 0 ? 'SHORTLISTED' : 'APPLIED';
        remainingToMove--;
      }
    }
  }
  
  return updatedCandidates;
}

// Update the candidates' stages
const updatedCandidates = updateStageWithJobBalance(candidates);

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