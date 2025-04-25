const fs = require('fs');
const path = require('path');

console.log('Adjusting assessment scores based on candidate stages...');

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
const allCandidates = [...content.matchAll(candidateRegex)];

console.log(`Found ${allCandidates.length} candidates with stage and assessment information`);

// Identify hired candidates
const hiredCandidates = allCandidates.filter(match => match[1] === 'HIRED');
console.log(`Found ${hiredCandidates.length} candidates in HIRED stage`);

// Identify rejected candidates
const rejectedCandidates = allCandidates.filter(match => match[1] === 'REJECTED');
console.log(`Found ${rejectedCandidates.length} candidates in REJECTED stage`);

// Update function for assessment scores
function updateAssessmentScore(content, candidateMatch, newScore) {
  const [fullMatch, stage, middleText, currentScore] = candidateMatch;
  
  // If assessment is null, we need to create a new assessment object
  if (currentScore === undefined) {
    // Find where the candidate object ends to insert assessment
    const candidateEndIndex = content.indexOf(fullMatch) + fullMatch.length;
    const beforeCandidate = content.substring(0, candidateEndIndex);
    const afterCandidate = content.substring(candidateEndIndex);
    
    // Replace null assessment with a new assessment object
    return beforeCandidate.replace(
      /assessment: null/,
      `assessment: {
      score: ${newScore},
      feedback: "Adjusted score for ${stage} stage candidate",
      date: new Date().toISOString()
    }`
    ) + afterCandidate;
  } else {
    // Replace existing score
    return content.replace(
      new RegExp(`(stage: RecruitmentStage\\.${stage}${middleText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})score: ${currentScore}`),
      `$1score: ${newScore}`
    );
  }
}

// Update hired candidates to have scores > 97
let updatedContent = content;
let hiredUpdated = 0;

for (const candidate of hiredCandidates) {
  const currentScore = candidate[3] ? parseFloat(candidate[3]) : 0;
  
  if (!currentScore || currentScore <= 97) {
    const newScore = 98 + Math.random() * 2; // Score between 98-100
    updatedContent = updateAssessmentScore(updatedContent, candidate, newScore.toFixed(1));
    hiredUpdated++;
  }
}

console.log(`Updated ${hiredUpdated} HIRED candidates to have scores above 97`);

// Update rejected candidates to have low scores
let rejectedUpdated = 0;

for (const candidate of rejectedCandidates) {
  const currentScore = candidate[3] ? parseFloat(candidate[3]) : 100;
  
  if (!candidate[3] || currentScore > 70) {
    const newScore = 40 + Math.random() * 30; // Score between 40-70
    updatedContent = updateAssessmentScore(updatedContent, candidate, newScore.toFixed(1));
    rejectedUpdated++;
  }
}

console.log(`Updated ${rejectedUpdated} REJECTED candidates to have scores below 70`);

// Write the updated content back to the file
fs.writeFileSync(candidatesPath, updatedContent, 'utf8');

// Verify the updates
const verifyHiredRegex = /stage: RecruitmentStage\.HIRED[\s\S]*?score: ([0-9.]+)/g;
const verifyRejectedRegex = /stage: RecruitmentStage\.REJECTED[\s\S]*?score: ([0-9.]+)/g;

const hiredScores = [...updatedContent.matchAll(verifyHiredRegex)].map(match => parseFloat(match[1]));
const rejectedScores = [...updatedContent.matchAll(verifyRejectedRegex)].map(match => parseFloat(match[1]));

const avgHiredScore = hiredScores.reduce((sum, score) => sum + score, 0) / hiredScores.length;
const avgRejectedScore = rejectedScores.reduce((sum, score) => sum + score, 0) / rejectedScores.length;

console.log(`
Score Adjustment Complete!
========================
HIRED candidates: ${hiredScores.length} found, all with scores above 97
Average score for HIRED candidates: ${avgHiredScore.toFixed(2)}

REJECTED candidates: ${rejectedScores.length} found, all with scores below 70
Average score for REJECTED candidates: ${avgRejectedScore.toFixed(2)}
`);

// Display min and max scores for verification
console.log(`
Score Ranges:
- HIRED: Min=${Math.min(...hiredScores)}, Max=${Math.max(...hiredScores)}
- REJECTED: Min=${Math.min(...rejectedScores)}, Max=${Math.max(...rejectedScores)}
`); 