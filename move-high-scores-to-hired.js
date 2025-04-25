const fs = require('fs');
const path = require('path');

console.log('Moving high-scoring candidates to HIRED and ensuring REJECTED have low scores...');

// Read the candidates.ts file
const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
let content = fs.readFileSync(candidatesPath, 'utf8');

// Find each candidate with their full object context
console.log('\nSearching for candidates by score...');

// First extract all candidate objects with their assessment scores
const candidateRegex = /{[^{]*?stage: RecruitmentStage\.([A-Z_]+)[^{]*?assessment: {[^{]*?score: ([0-9.]+)[^}]*?}[^}]*?}/gs;
const matches = [...content.matchAll(candidateRegex)];

console.log(`Found ${matches.length} candidates with assessment scores`);

// Track candidates by score range
const highScorers = [];  // Score > 97
const lowScorers = [];   // Score < 70
const mediumScorers = []; // 70 <= Score <= 97

matches.forEach(match => {
  const fullMatch = match[0];
  const stage = match[1];
  const score = parseFloat(match[2]);
  
  if (score > 97) {
    highScorers.push({ fullMatch, stage, score });
  } else if (score < 70) {
    lowScorers.push({ fullMatch, stage, score });
  } else {
    mediumScorers.push({ fullMatch, stage, score });
  }
});

console.log(`Candidates by score range:`);
console.log(` - High (>97): ${highScorers.length}`);
console.log(` - Medium (70-97): ${mediumScorers.length}`);
console.log(` - Low (<70): ${lowScorers.length}`);

// Process high scorers - all should be HIRED
let updatedContent = content;
let hiredCount = 0;

highScorers.forEach(candidate => {
  if (candidate.stage !== 'HIRED') {
    console.log(`Moving candidate with score ${candidate.score} from ${candidate.stage} to HIRED`);
    // Create a specific replacement to avoid accidental matches
    const originalText = `stage: RecruitmentStage.${candidate.stage}`;
    const updatedText = `stage: RecruitmentStage.HIRED`;
    
    // Create a unique pattern using the surrounding context
    const pattern = new RegExp(originalText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    
    // Only replace the first occurrence that matches this pattern within the candidate's context
    const candidateStartIndex = updatedContent.indexOf(candidate.fullMatch);
    const candidateEndIndex = candidateStartIndex + candidate.fullMatch.length;
    
    if (candidateStartIndex !== -1) {
      const beforeCandidate = updatedContent.substring(0, candidateStartIndex);
      const candidateSection = updatedContent.substring(candidateStartIndex, candidateEndIndex);
      const afterCandidate = updatedContent.substring(candidateEndIndex);
      
      const updatedCandidateSection = candidateSection.replace(pattern, updatedText);
      updatedContent = beforeCandidate + updatedCandidateSection + afterCandidate;
      hiredCount++;
    }
  }
});

// Process low scorers - all should be REJECTED
let rejectedCount = 0;

lowScorers.forEach(candidate => {
  if (candidate.stage !== 'REJECTED') {
    console.log(`Moving candidate with score ${candidate.score} from ${candidate.stage} to REJECTED`);
    // Create a specific replacement to avoid accidental matches
    const originalText = `stage: RecruitmentStage.${candidate.stage}`;
    const updatedText = `stage: RecruitmentStage.REJECTED`;
    
    // Create a unique pattern using the surrounding context
    const pattern = new RegExp(originalText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    
    // Only replace the first occurrence that matches this pattern within the candidate's context
    const candidateStartIndex = updatedContent.indexOf(candidate.fullMatch);
    const candidateEndIndex = candidateStartIndex + candidate.fullMatch.length;
    
    if (candidateStartIndex !== -1) {
      const beforeCandidate = updatedContent.substring(0, candidateStartIndex);
      const candidateSection = updatedContent.substring(candidateStartIndex, candidateEndIndex);
      const afterCandidate = updatedContent.substring(candidateEndIndex);
      
      const updatedCandidateSection = candidateSection.replace(pattern, updatedText);
      updatedContent = beforeCandidate + updatedCandidateSection + afterCandidate;
      rejectedCount++;
    }
  }
});

// Fix any HIRED candidates with low scores - move to INTERVIEWED
let fixedHiredCount = 0;
const hiredWithLowScore = matches.filter(match => 
  match[1] === 'HIRED' && parseFloat(match[2]) <= 97
);

hiredWithLowScore.forEach(match => {
  const fullMatch = match[0];
  const score = parseFloat(match[2]);
  
  console.log(`Moving HIRED candidate with low score ${score} to INTERVIEWED`);
  const originalText = `stage: RecruitmentStage.HIRED`;
  const updatedText = `stage: RecruitmentStage.INTERVIEWED`;
  
  const candidateStartIndex = updatedContent.indexOf(fullMatch);
  const candidateEndIndex = candidateStartIndex + fullMatch.length;
  
  if (candidateStartIndex !== -1) {
    const beforeCandidate = updatedContent.substring(0, candidateStartIndex);
    const candidateSection = updatedContent.substring(candidateStartIndex, candidateEndIndex);
    const afterCandidate = updatedContent.substring(candidateEndIndex);
    
    const updatedCandidateSection = candidateSection.replace(originalText, updatedText);
    updatedContent = beforeCandidate + updatedCandidateSection + afterCandidate;
    fixedHiredCount++;
  }
});

// Fix any REJECTED candidates with high scores - move to SHORTLISTED
let fixedRejectedCount = 0;
const rejectedWithHighScore = matches.filter(match => 
  match[1] === 'REJECTED' && parseFloat(match[2]) >= 70
);

rejectedWithHighScore.forEach(match => {
  const fullMatch = match[0];
  const score = parseFloat(match[2]);
  
  console.log(`Moving REJECTED candidate with high score ${score} to SHORTLISTED`);
  const originalText = `stage: RecruitmentStage.REJECTED`;
  const updatedText = `stage: RecruitmentStage.SHORTLISTED`;
  
  const candidateStartIndex = updatedContent.indexOf(fullMatch);
  const candidateEndIndex = candidateStartIndex + fullMatch.length;
  
  if (candidateStartIndex !== -1) {
    const beforeCandidate = updatedContent.substring(0, candidateStartIndex);
    const candidateSection = updatedContent.substring(candidateStartIndex, candidateEndIndex);
    const afterCandidate = updatedContent.substring(candidateEndIndex);
    
    const updatedCandidateSection = candidateSection.replace(originalText, updatedText);
    updatedContent = beforeCandidate + updatedCandidateSection + afterCandidate;
    fixedRejectedCount++;
  }
});

// Write the updated content back to the file
fs.writeFileSync(candidatesPath, updatedContent, 'utf8');

// Verify the updates
console.log('\nVerifying results...');

// Extract all candidate objects with their assessment scores after updates
const updatedMatches = [...updatedContent.matchAll(candidateRegex)];

// Count by stage and score
const stageStats = {};
updatedMatches.forEach(match => {
  const stage = match[1];
  const score = parseFloat(match[2]);
  
  if (!stageStats[stage]) {
    stageStats[stage] = {
      count: 0,
      scores: []
    };
  }
  
  stageStats[stage].count++;
  stageStats[stage].scores.push(score);
});

// Calculate stats for each stage
console.log('\nFinal stage statistics:');
Object.entries(stageStats).forEach(([stage, data]) => {
  const scores = data.scores.sort((a, b) => b - a);
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  console.log(`${stage}: ${data.count} candidates`);
  console.log(`  Min=${min}, Max=${max}, Avg=${avg.toFixed(2)}`);
  console.log(`  Top 5 scores: ${scores.slice(0, 5).join(', ')}${scores.length > 5 ? '...' : ''}`);
});

// Summary
console.log(`
Stage Adjustment Complete!
========================
- ${hiredCount} candidates with scores > 97 moved to HIRED
- ${rejectedCount} candidates with scores < 70 moved to REJECTED
- ${fixedHiredCount} HIRED candidates with scores <= 97 moved to INTERVIEWED
- ${fixedRejectedCount} REJECTED candidates with scores >= 70 moved to SHORTLISTED

All HIRED candidates now have scores > 97
All REJECTED candidates now have scores < 70
`); 