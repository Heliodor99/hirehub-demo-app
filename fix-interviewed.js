const fs = require('fs');
const path = require('path');

console.log('Fixing remaining INTERVIEWED candidates with scores <= 90...');

// Read the candidates.ts file
const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
let content = fs.readFileSync(candidatesPath, 'utf8');

// Find INTERVIEWED candidates with their scores
const interviewedRegex = /{[^{]*?stage: RecruitmentStage\.INTERVIEWED[^{]*?assessment: {[^{]*?score: ([0-9.]+)[^}]*?}[^}]*?}/gs;
const matches = [...content.matchAll(interviewedRegex)];

console.log(`Found ${matches.length} candidates in INTERVIEWED stage`);

// Count candidates with scores <= 90
const lowScorers = [];
matches.forEach(match => {
  const fullMatch = match[0];
  const score = parseFloat(match[1]);
  
  if (score <= 90) {
    lowScorers.push({ fullMatch, score });
  }
});

console.log(`Found ${lowScorers.length} INTERVIEWED candidates with scores <= 90`);

// Move them to SHORTLISTED
let updatedContent = content;
let updatedCount = 0;

lowScorers.forEach(candidate => {
  console.log(`Moving INTERVIEWED candidate with score ${candidate.score} to SHORTLISTED`);
  
  const candidateStartIndex = updatedContent.indexOf(candidate.fullMatch);
  if (candidateStartIndex === -1) return; // Not found
  
  const candidateEndIndex = candidateStartIndex + candidate.fullMatch.length;
  const beforeCandidate = updatedContent.substring(0, candidateStartIndex);
  const candidateSection = updatedContent.substring(candidateStartIndex, candidateEndIndex);
  const afterCandidate = updatedContent.substring(candidateEndIndex);
  
  const updatedCandidateSection = candidateSection.replace(
    `stage: RecruitmentStage.INTERVIEWED`,
    `stage: RecruitmentStage.SHORTLISTED`
  );
  
  updatedContent = beforeCandidate + updatedCandidateSection + afterCandidate;
  updatedCount++;
});

// Write the updated content back to the file
fs.writeFileSync(candidatesPath, updatedContent, 'utf8');

// Verify the updates
const finalInterviewedRegex = /{[^{]*?stage: RecruitmentStage\.INTERVIEWED[^{]*?assessment: {[^{]*?score: ([0-9.]+)[^}]*?}[^}]*?}/gs;
const finalMatches = [...updatedContent.matchAll(finalInterviewedRegex)];

// Count scores
const finalScores = finalMatches.map(match => parseFloat(match[1])).sort((a, b) => b - a);
const lowScoreCount = finalScores.filter(score => score <= 90).length;

console.log(`
Fix Applied!
============
- Moved ${updatedCount} INTERVIEWED candidates with scores <= 90 to SHORTLISTED
- Remaining INTERVIEWED candidates: ${finalMatches.length}
- Remaining low scorers (<=90): ${lowScoreCount}
- Current INTERVIEWED score range: ${finalScores.length > 0 ? `Min=${Math.min(...finalScores)}, Max=${Math.max(...finalScores)}` : 'None'}
- All scores: ${finalScores.join(', ')}
`); 