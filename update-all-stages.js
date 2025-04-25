const fs = require('fs');
const path = require('path');

console.log('Organizing candidates based on assessment scores across all stages...');

// Define the RecruitmentStage enum values
const RecruitmentStages = [
  'OUTREACHED',
  'APPLIED', 
  'SHORTLISTED',
  'INTERVIEWED',
  'OFFER_EXTENDED',
  'OFFER_REJECTED',
  'REJECTED',
  'HIRED'
];

// Read the candidates.ts file
const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
let content = fs.readFileSync(candidatesPath, 'utf8');

// Find each candidate with their full object context
console.log('\nExtracting all candidates with assessment scores...');

// Regex to match candidate objects with their stage and score
const candidateRegex = /{[^{]*?stage: RecruitmentStage\.([A-Z_]+)[^{]*?assessment: {[^{]*?score: ([0-9.]+)[^}]*?}[^}]*?}/gs;
const matches = [...content.matchAll(candidateRegex)];

console.log(`Found ${matches.length} candidates with assessment scores`);

// Group candidates by stage and track their scores
const candidatesByStage = {};
RecruitmentStages.forEach(stage => {
  candidatesByStage[stage] = [];
});

matches.forEach(match => {
  const fullMatch = match[0];
  const stage = match[1];
  const score = parseFloat(match[2]);
  
  candidatesByStage[stage].push({ fullMatch, stage, score });
});

// Log current distribution
console.log('\nCurrent stage distribution:');
Object.entries(candidatesByStage).forEach(([stage, candidates]) => {
  if (candidates.length > 0) {
    const scores = candidates.map(c => c.score).sort((a, b) => b - a);
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    console.log(`${stage}: ${candidates.length} candidates`);
    console.log(`  Min=${min}, Max=${max}, Avg=${avg.toFixed(2)}`);
    console.log(`  Top scores: ${scores.slice(0, 3).join(', ')}${scores.length > 3 ? '...' : ''}`);
  } else {
    console.log(`${stage}: 0 candidates`);
  }
});

// Define score thresholds for each stage
const stageScoreThresholds = {
  HIRED: 97,
  OFFER_EXTENDED: 90,
  OFFER_REJECTED: 90,
  INTERVIEWED: 90,
  REJECTED: 70  // Below this threshold should be REJECTED
};

// Function to update a candidate's stage
function updateCandidateStage(content, candidateObj, newStage) {
  const { fullMatch, stage } = candidateObj;
  
  if (stage === newStage) return content; // No change needed
  
  console.log(`Moving candidate with score ${candidateObj.score} from ${stage} to ${newStage}`);
  
  const candidateStartIndex = content.indexOf(fullMatch);
  if (candidateStartIndex === -1) return content; // Not found
  
  const candidateEndIndex = candidateStartIndex + fullMatch.length;
  const beforeCandidate = content.substring(0, candidateStartIndex);
  const candidateSection = content.substring(candidateStartIndex, candidateEndIndex);
  const afterCandidate = content.substring(candidateEndIndex);
  
  const updatedCandidateSection = candidateSection.replace(
    `stage: RecruitmentStage.${stage}`,
    `stage: RecruitmentStage.${newStage}`
  );
  
  return beforeCandidate + updatedCandidateSection + afterCandidate;
}

// Organize candidates based on their scores
let updatedContent = content;
let stageChangeCount = {
  toHIRED: 0,
  toOFFER_EXTENDED: 0,
  toOFFER_REJECTED: 0,
  toINTERVIEWED: 0, 
  toREJECTED: 0,
  fromREJECTED: 0,
  fromHIRED: 0
};

// 1. First pass: Move candidates with scores > 97 to HIRED
matches.forEach(match => {
  const fullMatch = match[0];
  const stage = match[1];
  const score = parseFloat(match[2]);
  
  if (score > stageScoreThresholds.HIRED && stage !== 'HIRED') {
    updatedContent = updateCandidateStage(
      updatedContent, 
      { fullMatch, stage, score }, 
      'HIRED'
    );
    stageChangeCount.toHIRED++;
  }
});

// 2. Move candidates with scores < 70 to REJECTED
matches.forEach(match => {
  const fullMatch = match[0];
  const stage = match[1];
  const score = parseFloat(match[2]);
  
  if (score < stageScoreThresholds.REJECTED && stage !== 'REJECTED') {
    updatedContent = updateCandidateStage(
      updatedContent, 
      { fullMatch, stage, score }, 
      'REJECTED'
    );
    stageChangeCount.toREJECTED++;
  }
});

// 3. Move HIRED candidates with scores <= 97 to INTERVIEWED
candidatesByStage.HIRED.forEach(candidate => {
  if (candidate.score <= stageScoreThresholds.HIRED) {
    updatedContent = updateCandidateStage(
      updatedContent, 
      candidate, 
      'INTERVIEWED'
    );
    stageChangeCount.fromHIRED++;
  }
});

// 4. Move OFFER_EXTENDED/OFFER_REJECTED with scores <= 90 to INTERVIEWED
candidatesByStage.OFFER_EXTENDED.concat(candidatesByStage.OFFER_REJECTED).forEach(candidate => {
  if (candidate.score <= stageScoreThresholds.OFFER_EXTENDED) {
    updatedContent = updateCandidateStage(
      updatedContent, 
      candidate, 
      'INTERVIEWED'
    );
  }
});

// 5. Move INTERVIEWED candidates with scores <= 90 to SHORTLISTED
candidatesByStage.INTERVIEWED.forEach(candidate => {
  if (candidate.score <= stageScoreThresholds.INTERVIEWED) {
    updatedContent = updateCandidateStage(
      updatedContent, 
      candidate, 
      'SHORTLISTED'
    );
  }
});

// 6. Move REJECTED candidates with scores >= 70 to SHORTLISTED
candidatesByStage.REJECTED.forEach(candidate => {
  if (candidate.score >= stageScoreThresholds.REJECTED) {
    updatedContent = updateCandidateStage(
      updatedContent, 
      candidate, 
      'SHORTLISTED'
    );
    stageChangeCount.fromREJECTED++;
  }
});

// 7. Move high scoring (>90) SHORTLISTED candidates to INTERVIEWED
candidatesByStage.SHORTLISTED.forEach(candidate => {
  if (candidate.score > stageScoreThresholds.INTERVIEWED) {
    updatedContent = updateCandidateStage(
      updatedContent, 
      candidate, 
      'INTERVIEWED'
    );
    stageChangeCount.toINTERVIEWED++;
  }
});

// Write the updated content back to the file
fs.writeFileSync(candidatesPath, updatedContent, 'utf8');

// Verify the updates
console.log('\nVerifying results...');

// Extract all candidate objects with their assessment scores after updates
const updatedMatches = [...updatedContent.matchAll(candidateRegex)];

// Group by stage after updates
const updatedCandidatesByStage = {};
RecruitmentStages.forEach(stage => {
  updatedCandidatesByStage[stage] = [];
});

updatedMatches.forEach(match => {
  const stage = match[1];
  const score = parseFloat(match[2]);
  
  updatedCandidatesByStage[stage].push({ score });
});

// Log final distribution
console.log('\nFinal stage distribution:');
Object.entries(updatedCandidatesByStage).forEach(([stage, candidates]) => {
  if (candidates.length > 0) {
    const scores = candidates.map(c => c.score).sort((a, b) => b - a);
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    console.log(`${stage}: ${candidates.length} candidates`);
    console.log(`  Min=${min}, Max=${max}, Avg=${avg.toFixed(2)}`);
    console.log(`  Top scores: ${scores.slice(0, 5).join(', ')}${scores.length > 5 ? '...' : ''}`);
    
    // Verify score thresholds are met
    if (stage === 'HIRED') {
      const belowThreshold = scores.filter(s => s <= stageScoreThresholds.HIRED).length;
      console.log(`  ${belowThreshold === 0 ? '✅' : '❌'} All HIRED candidates have scores > ${stageScoreThresholds.HIRED}`);
    }
    else if (stage === 'OFFER_EXTENDED' || stage === 'OFFER_REJECTED') {
      const belowThreshold = scores.filter(s => s <= stageScoreThresholds.OFFER_EXTENDED).length;
      console.log(`  ${belowThreshold === 0 ? '✅' : '❌'} All ${stage} candidates have scores > ${stageScoreThresholds.OFFER_EXTENDED}`);
    }
    else if (stage === 'INTERVIEWED') {
      const belowThreshold = scores.filter(s => s <= stageScoreThresholds.INTERVIEWED).length;
      console.log(`  ${belowThreshold === 0 ? '✅' : '❌'} All INTERVIEWED candidates have scores > ${stageScoreThresholds.INTERVIEWED}`);
    }
    else if (stage === 'REJECTED') {
      const aboveThreshold = scores.filter(s => s >= stageScoreThresholds.REJECTED).length;
      console.log(`  ${aboveThreshold === 0 ? '✅' : '❌'} All REJECTED candidates have scores < ${stageScoreThresholds.REJECTED}`);
    }
  } else {
    console.log(`${stage}: 0 candidates`);
  }
});

console.log(`
Stage Adjustment Complete!
========================
- ${stageChangeCount.toHIRED} candidates with scores > ${stageScoreThresholds.HIRED} moved to HIRED
- ${stageChangeCount.toREJECTED} candidates with scores < ${stageScoreThresholds.REJECTED} moved to REJECTED
- ${stageChangeCount.fromHIRED} HIRED candidates with scores <= ${stageScoreThresholds.HIRED} moved to other stages
- ${stageChangeCount.fromREJECTED} REJECTED candidates with scores >= ${stageScoreThresholds.REJECTED} moved to other stages
- ${stageChangeCount.toINTERVIEWED} candidates moved to INTERVIEWED with scores > ${stageScoreThresholds.INTERVIEWED}

Score thresholds applied:
- HIRED: > ${stageScoreThresholds.HIRED}
- OFFER_EXTENDED/OFFER_REJECTED: > ${stageScoreThresholds.OFFER_EXTENDED}
- INTERVIEWED: > ${stageScoreThresholds.INTERVIEWED}
- REJECTED: < ${stageScoreThresholds.REJECTED}
`); 