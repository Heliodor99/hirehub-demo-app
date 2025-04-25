const fs = require('fs');
const path = require('path');

console.log('Fixing HIRED and REJECTED stages based on existing assessment scores...');

// Read the candidates.ts file
const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
let content = fs.readFileSync(candidatesPath, 'utf8');

// First identify the existing distribution
const stageRegex = /stage: RecruitmentStage\.([A-Z_]+)/g;
const stageMatches = [...content.matchAll(stageRegex)];
const stageDistribution = {};
stageMatches.forEach(match => {
  const stage = match[1];
  stageDistribution[stage] = (stageDistribution[stage] || 0) + 1;
});

console.log('Current stage distribution:');
console.log(stageDistribution);

// List all candidates with scores
console.log('\nSearching for candidates with assessment scores...');
const candidatesWithScores = [];
let match;
const scoreRegex = /stage: RecruitmentStage\.([A-Z_]+)([\s\S]{0,500}?)score: ([0-9.]+)/g;

while ((match = scoreRegex.exec(content)) !== null) {
  candidatesWithScores.push({
    stage: match[1],
    score: parseFloat(match[3]),
    startIndex: match.index,
    endIndex: match.index + match[0].length,
    matchText: match[0]
  });
}

console.log(`Found ${candidatesWithScores.length} candidates with assessment scores`);

// Analyze scores by stage
const scoreByStage = {};
candidatesWithScores.forEach(candidate => {
  if (!scoreByStage[candidate.stage]) {
    scoreByStage[candidate.stage] = [];
  }
  scoreByStage[candidate.stage].push(candidate.score);
});

console.log('\nCurrent score ranges by stage:');
Object.entries(scoreByStage).forEach(([stage, scores]) => {
  if (scores.length > 0) {
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    console.log(`${stage}: ${scores.length} candidates, Min=${min}, Max=${max}, Avg=${avg.toFixed(2)}`);
  }
});

// Identify high scorers (>97) that should be HIRED
const highScorers = candidatesWithScores.filter(c => c.score > 97 && c.stage !== 'HIRED');
console.log(`\nFound ${highScorers.length} candidates with scores > 97 not in HIRED stage`);

// Identify low scorers (<70) that should be REJECTED
const lowScorers = candidatesWithScores.filter(c => c.score < 70 && c.stage !== 'REJECTED');
console.log(`Found ${lowScorers.length} candidates with scores < 70 not in REJECTED stage`);

// Manually update the content with specific stage changes
let updatedContent = content;

// Update high scorers to HIRED
highScorers.forEach(candidate => {
  console.log(`Moving candidate with score ${candidate.score} from ${candidate.stage} to HIRED`);
  updatedContent = updatedContent.replace(
    `stage: RecruitmentStage.${candidate.stage}`,
    `stage: RecruitmentStage.HIRED`
  );
});

// Update low scorers to REJECTED
lowScorers.forEach(candidate => {
  console.log(`Moving candidate with score ${candidate.score} from ${candidate.stage} to REJECTED`);
  updatedContent = updatedContent.replace(
    `stage: RecruitmentStage.${candidate.stage}`,
    `stage: RecruitmentStage.REJECTED`
  );
});

// Also ensure candidates already in HIRED have high scores
const hiredWithLowScores = candidatesWithScores.filter(c => c.stage === 'HIRED' && c.score <= 97);
console.log(`\nFound ${hiredWithLowScores.length} HIRED candidates with scores <= 97`);

// Ensure candidates in REJECTED have low scores
const rejectedWithHighScores = candidatesWithScores.filter(c => c.stage === 'REJECTED' && c.score >= 70);
console.log(`Found ${rejectedWithHighScores.length} REJECTED candidates with scores >= 70`);

// Write the updated content back to the file
fs.writeFileSync(candidatesPath, updatedContent, 'utf8');

// Verify the updates
const finalStageRegex = /stage: RecruitmentStage\.([A-Z_]+)/g;
const finalStageMatches = [...updatedContent.matchAll(finalStageRegex)];
const finalDistribution = {};
finalStageMatches.forEach(match => {
  const stage = match[1];
  finalDistribution[stage] = (finalDistribution[stage] || 0) + 1;
});

console.log('\nFinal stage distribution:');
console.log(finalDistribution);

// Re-analyze final scores by stage
const finalScoreRegex = /stage: RecruitmentStage\.([A-Z_]+)([\s\S]{0,500}?)score: ([0-9.]+)/g;
const finalCandidatesWithScores = [];
let finalMatch;

while ((finalMatch = finalScoreRegex.exec(updatedContent)) !== null) {
  finalCandidatesWithScores.push({
    stage: finalMatch[1],
    score: parseFloat(finalMatch[3])
  });
}

const finalScoreByStage = {};
finalCandidatesWithScores.forEach(candidate => {
  if (!finalScoreByStage[candidate.stage]) {
    finalScoreByStage[candidate.stage] = [];
  }
  finalScoreByStage[candidate.stage].push(candidate.score);
});

console.log('\nFinal score ranges by stage:');
Object.entries(finalScoreByStage).forEach(([stage, scores]) => {
  if (scores.length > 0) {
    scores.sort((a, b) => b - a);
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    console.log(`${stage}: ${scores.length} candidates`);
    console.log(`  Min=${min}, Max=${max}, Avg=${avg.toFixed(2)}`);
    console.log(`  Scores: ${scores.slice(0, 5).join(', ')}${scores.length > 5 ? '...' : ''}`);
  }
}); 