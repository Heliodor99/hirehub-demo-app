const fs = require('fs');
const path = require('path');

console.log('Adjusting candidate stages based on assessment scores...');

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

// Find all candidates with their stages and assessment scores
const candidateRegex = /stage: RecruitmentStage\.([A-Z_]+)([\s\S]*?)assessment: (?:{[\s\S]*?score: ([0-9.]+)[\s\S]*?}|null)/g;
const allCandidates = [...content.matchAll(candidateRegex)].filter(match => match[3]);

// Filter candidates with scores
const scoredCandidates = allCandidates
  .map(match => ({
    fullMatch: match[0],
    stage: match[1],
    middleText: match[2],
    score: parseFloat(match[3])
  }))
  .filter(candidate => !isNaN(candidate.score));

console.log(`Found ${scoredCandidates.length} candidates with valid assessment scores`);

// Sort candidates by score (descending)
scoredCandidates.sort((a, b) => b.score - a.score);

// Get current distribution
const currentDistribution = {};
RecruitmentStages.forEach(stage => {
  currentDistribution[stage] = scoredCandidates.filter(c => c.stage === stage).length;
});

console.log('Current stage distribution:');
console.log(currentDistribution);

// Function to update candidate stage
function updateCandidateStage(content, candidate, newStage) {
  return content.replace(
    `stage: RecruitmentStage.${candidate.stage}`,
    `stage: RecruitmentStage.${newStage}`
  );
}

// Get top scoring candidates not already HIRED (target for HIRED)
const topScorers = scoredCandidates
  .filter(c => c.stage !== 'HIRED' && c.score > 97)
  .slice(0, 5); // Limit to 5 additional candidates

console.log(`Found ${topScorers.length} candidates with scores > 97 not already HIRED`);

// Get bottom scoring candidates not already REJECTED (target for REJECTED)
const bottomScorers = [...scoredCandidates]
  .sort((a, b) => a.score - b.score)
  .filter(c => c.stage !== 'REJECTED')
  .slice(0, 10); // Limit to 10 additional candidates

console.log(`Found ${bottomScorers.length} lowest scoring candidates not already REJECTED`);

// Update stages
let updatedContent = content;
let hiredCount = 0;
let rejectedCount = 0;

// Move top scorers to HIRED stage
for (const candidate of topScorers) {
  console.log(`Moving candidate with score ${candidate.score} from ${candidate.stage} to HIRED`);
  updatedContent = updateCandidateStage(updatedContent, candidate, 'HIRED');
  hiredCount++;
}

// Move bottom scorers to REJECTED stage
for (const candidate of bottomScorers) {
  console.log(`Moving candidate with score ${candidate.score} from ${candidate.stage} to REJECTED`);
  updatedContent = updateCandidateStage(updatedContent, candidate, 'REJECTED');
  rejectedCount++;
}

// Write the updated content back to the file
fs.writeFileSync(candidatesPath, updatedContent, 'utf8');

// Verify the updates
const finalCandidateRegex = /stage: RecruitmentStage\.([A-Z_]+)([\s\S]*?)assessment: (?:{[\s\S]*?score: ([0-9.]+)[\s\S]*?}|null)/g;
const finalCandidates = [...updatedContent.matchAll(finalCandidateRegex)];

const finalHired = finalCandidates
  .filter(match => match[1] === 'HIRED' && match[3])
  .map(match => parseFloat(match[3]));

const finalRejected = finalCandidates
  .filter(match => match[1] === 'REJECTED' && match[3])
  .map(match => parseFloat(match[3]));

// Calculate new distribution
const newDistribution = {};
RecruitmentStages.forEach(stage => {
  const regex = new RegExp(`RecruitmentStage\\.${stage}`, 'g');
  const matches = updatedContent.match(regex) || [];
  newDistribution[stage] = matches.length;
});

console.log('\nFinal stage distribution:');
console.log(newDistribution);

// Calculate stats for verification
const avgHiredScore = finalHired.reduce((sum, score) => sum + score, 0) / finalHired.length;
const avgRejectedScore = finalRejected.reduce((sum, score) => sum + score, 0) / finalRejected.length;

// Sort scores for better reporting
finalHired.sort((a, b) => b - a);
finalRejected.sort((a, b) => a - b);

console.log(`
Stage Adjustment Complete!
========================
Modified ${hiredCount} candidates to HIRED based on high scores
Modified ${rejectedCount} candidates to REJECTED based on low scores

HIRED candidates: ${finalHired.length} total
- Average score: ${avgHiredScore.toFixed(2)}
- Min score: ${Math.min(...finalHired)}
- Max score: ${Math.max(...finalHired)}
- Score distribution: ${finalHired.slice(0, 10).join(', ')}${finalHired.length > 10 ? '...' : ''}

REJECTED candidates: ${finalRejected.length} total
- Average score: ${avgRejectedScore.toFixed(2)}
- Min score: ${Math.min(...finalRejected)}
- Max score: ${Math.max(...finalRejected)}
- Score distribution: ${finalRejected.slice(0, 10).join(', ')}${finalRejected.length > 10 ? '...' : ''}
`); 