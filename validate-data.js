const fs = require('fs');
const path = require('path');

console.log('Validating interview data consistency with candidate stages...');

// Define the stages that should have interview data
const stagesWithInterviews = ['INTERVIEWED', 'OFFER_EXTENDED', 'OFFER_REJECTED', 'HIRED'];

// Read the candidates.ts file
const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
const candidatesContent = fs.readFileSync(candidatesPath, 'utf8');

// First find all candidates and their stages
const candidateRegex = /id: ['"]([^'"]*)['"]([\s\S]*?)name: ['"]([^'"]*)['"]([\s\S]*?)stage: RecruitmentStage\.([A-Z_]+)([\s\S]*?)(?=id:|export)/g;
const candidateMatches = [...candidatesContent.matchAll(candidateRegex)];

console.log(`Found ${candidateMatches.length} candidate records`);

// Count by stage and check interview data
const stageStats = {};
stagesWithInterviews.forEach(stage => {
  stageStats[stage] = { total: 0, withInterview: 0, withScore: 0 };
});

// Additional stats
const invalidInterviews = [];
const missingInterviews = [];

candidateMatches.forEach(match => {
  const id = match[1];
  const name = match[3];
  const stage = match[5];
  const candidateText = match[0];
  const hasInterview = candidateText.includes('interview:');
  const shouldHaveInterview = stagesWithInterviews.includes(stage);
  
  // Check if there's an AI assessment score
  const scoreMatch = candidateText.match(/overallScore: ([0-9.]+)/);
  const score = scoreMatch ? parseFloat(scoreMatch[1]) : null;
  
  // Track statistics
  if (shouldHaveInterview) {
    stageStats[stage].total++;
    if (hasInterview) {
      stageStats[stage].withInterview++;
      if (score !== null) {
        stageStats[stage].withScore++;
      }
    } else {
      missingInterviews.push({ id, name, stage });
    }
  } else if (hasInterview) {
    invalidInterviews.push({ id, name, stage });
  }
});

// Display results
console.log('\nInterview data by stage:');
Object.entries(stageStats).forEach(([stage, stats]) => {
  const percentComplete = stats.total > 0 
    ? Math.round((stats.withInterview / stats.total) * 100) 
    : 0;
  
  console.log(`${stage}: ${stats.withInterview}/${stats.total} candidates have interview data (${percentComplete}% complete)`);
  
  if (stage === 'HIRED') {
    // Check that HIRED candidates have high scores
    console.log(`  - ${stats.withScore} candidates have AI assessment scores`);
  }
});

// Report any issues
if (missingInterviews.length > 0) {
  console.log('\nWARNING: The following candidates should have interview data but don\'t:');
  missingInterviews.forEach(candidate => {
    console.log(`- ${candidate.name} (ID: ${candidate.id}, Stage: ${candidate.stage})`);
  });
}

if (invalidInterviews.length > 0) {
  console.log('\nWARNING: The following candidates have interview data but shouldn\'t:');
  invalidInterviews.forEach(candidate => {
    console.log(`- ${candidate.name} (ID: ${candidate.id}, Stage: ${candidate.stage})`);
  });
}

// Validate assessment scores
const scoreValidation = {
  HIRED: { min: 97, max: 100 },
  OFFER_EXTENDED: { min: 90, max: 97 },
  OFFER_REJECTED: { min: 90, max: 97 },
  INTERVIEWED: { min: 90, max: 97 }
};

const scoreViolations = [];

candidateMatches.forEach(match => {
  const id = match[1];
  const name = match[3];
  const stage = match[5];
  const candidateText = match[0];
  
  if (stagesWithInterviews.includes(stage)) {
    const scoreMatch = candidateText.match(/overallScore: ([0-9.]+)/);
    if (scoreMatch) {
      const score = parseFloat(scoreMatch[1]);
      const validation = scoreValidation[stage];
      
      if (score < validation.min || score > validation.max) {
        scoreViolations.push({
          id, name, stage, score,
          expected: `${validation.min}-${validation.max}`
        });
      }
    }
  }
});

if (scoreViolations.length > 0) {
  console.log('\nWARNING: The following candidates have assessment scores outside the expected range:');
  scoreViolations.forEach(violation => {
    console.log(`- ${violation.name} (ID: ${violation.id}, Stage: ${violation.stage}): Score ${violation.score}, Expected: ${violation.expected}`);
  });
}

// Overall assessment
const isFullyConsistent = missingInterviews.length === 0 && invalidInterviews.length === 0 && scoreViolations.length === 0;

console.log(`
Validation Complete!
===================
${isFullyConsistent 
  ? '✅ All candidates have consistent interview data matching their stage!' 
  : '⚠️ Some inconsistencies were found in the interview data.'}

Summary:
- INTERVIEWED stage: ${stageStats.INTERVIEWED.withInterview}/${stageStats.INTERVIEWED.total} candidates have interview data
- OFFER_EXTENDED stage: ${stageStats.OFFER_EXTENDED.withInterview}/${stageStats.OFFER_EXTENDED.total} candidates have interview data
- OFFER_REJECTED stage: ${stageStats.OFFER_REJECTED.withInterview}/${stageStats.OFFER_REJECTED.total} candidates have interview data
- HIRED stage: ${stageStats.HIRED.withInterview}/${stageStats.HIRED.total} candidates have interview data
`); 