const fs = require('fs');
const path = require('path');

console.log('Updating interview data to align with candidate stages...');

// Define the RecruitmentStage enum values to match the application
const RecruitmentStage = {
  OUTREACHED: 'OUTREACHED',
  APPLIED: 'APPLIED', 
  SHORTLISTED: 'SHORTLISTED',
  INTERVIEWED: 'INTERVIEWED',
  OFFER_EXTENDED: 'OFFER_EXTENDED',
  OFFER_REJECTED: 'OFFER_REJECTED',
  REJECTED: 'REJECTED',
  HIRED: 'HIRED'
};

// Read the candidates.ts file
const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
const jobsPath = path.join(__dirname, 'src', 'data', 'jobs.ts');

let candidatesContent = fs.readFileSync(candidatesPath, 'utf8');
const jobsContent = fs.readFileSync(jobsPath, 'utf8');

// Find all candidate stages
console.log('\nExtracting candidate stages...');
const candidateStageRegex = /stage: RecruitmentStage\.([A-Z_]+)/g;
const candidateMatches = [...candidatesContent.matchAll(candidateStageRegex)];

// Count stages
const stageCount = {};
Object.values(RecruitmentStage).forEach(stage => {
  stageCount[stage] = 0;
});

candidateMatches.forEach(match => {
  const stage = match[1];
  stageCount[stage] = (stageCount[stage] || 0) + 1;
});

console.log('Current stage distribution:');
console.log(stageCount);

// Find candidates with interview property
console.log('\nChecking for interview data consistency...');
const interviewRegex = /interview: {[\s\S]*?}/g;
const interviewMatches = [...candidatesContent.matchAll(interviewRegex)];

console.log(`Found ${interviewMatches.length} candidates with interview data`);

// Regex to find candidates with their stage and ID
const candidateWithStageRegex = /id: ['"]([^'"]*)['"]([\s\S]*?)stage: RecruitmentStage\.([A-Z_]+)([\s\S]*?)(?:interview: {[\s\S]*?}|(?=\n\w))/g;
const candidatesWithStage = [...candidatesContent.matchAll(candidateWithStageRegex)];

// Track changes
let updatesMade = {
  added: 0,
  removed: 0
};

let updatedContent = candidatesContent;

// Process each candidate
for (const match of candidatesWithStage) {
  const id = match[1];
  const fullMatch = match[0];
  const stage = match[3];
  const hasInterview = fullMatch.includes('interview: {');
  
  // Check if candidate should have interview data (INTERVIEWED, OFFER_EXTENDED, OFFER_REJECTED, HIRED)
  const shouldHaveInterview = ['INTERVIEWED', 'OFFER_EXTENDED', 'OFFER_REJECTED', 'HIRED'].includes(stage);
  
  // If mismatch, update the candidate
  if (shouldHaveInterview && !hasInterview) {
    console.log(`Adding interview data for candidate ${id} in stage ${stage}`);
    
    // Find a job ID for this candidate
    const jobIdMatch = fullMatch.match(/jobId: ['"]([^'"]*)['"]/);
    const jobId = jobIdMatch ? jobIdMatch[1] : '1'; // Default to job 1 if not found
    
    // Create minimal placeholder interview data
    const interviewData = `
  interview: {
    id: ${id},
    candidate: {
      name: "Candidate ${id}",
      position: "Position Title"
    },
    date: new Date().toISOString().split('T')[0],
    time: "10:00 AM",
    type: "Technical",
    status: "Completed",
    interviewers: ["Interviewer 1", "Interviewer 2"],
    location: "Virtual/Zoom",
    transcript: [
      {
        timestamp: "10:00:00",
        speaker: "Interviewer",
        content: "Could you tell us about your relevant experience?"
      },
      {
        timestamp: "10:01:00",
        speaker: "Candidate",
        content: "I have several years of experience in this field working on various projects."
      }
    ],
    aiAssessment: {
      overallScore: 91,
      categoryScores: {
        technical: 92,
        communication: 90,
        problemSolving: 93,
        culturalFit: 89
      },
      strengths: [
        "Strong technical knowledge",
        "Clear communication",
        "Excellent problem-solving approach"
      ],
      areasForImprovement: [
        "Could provide more specific examples"
      ],
      recommendations: [
        "Candidate shows strong potential for the role"
      ]
    },
    humanFeedback: {
      score: 90,
      notes: "Demonstrated strong technical skills and good problem-solving abilities.",
      nextSteps: "${stage === 'INTERVIEWED' ? 'Schedule follow-up interview' : 'Proceed with offer discussion'}",
      decision: "${stage === 'INTERVIEWED' ? 'Further Evaluation' : 'Hire'}"
    }
  },`;
    
    // Insert interview data before the closing bracket of the candidate object
    const candidateEndIndex = updatedContent.indexOf(fullMatch) + fullMatch.length;
    updatedContent = updatedContent.substring(0, candidateEndIndex) + interviewData + updatedContent.substring(candidateEndIndex);
    updatesMade.added++;
  } 
  else if (!shouldHaveInterview && hasInterview) {
    console.log(`Removing interview data for candidate ${id} in stage ${stage}`);
    
    // Remove interview data
    const updatedCandidate = fullMatch.replace(/\s*interview: {[\s\S]*?},/, '');
    updatedContent = updatedContent.replace(fullMatch, updatedCandidate);
    updatesMade.removed++;
  }
}

// Write the updated content back to the file
fs.writeFileSync(candidatesPath, updatedContent, 'utf8');

// Verify the updates
const finalInterviewRegex = /interview: {[\s\S]*?}/g;
const finalInterviewMatches = [...updatedContent.matchAll(finalInterviewRegex)];

// Count final stages with interviews
const finalStageWithInterviewRegex = /stage: RecruitmentStage\.([A-Z_]+)([\s\S]*?)interview: {/g;
const finalStageMatches = [...updatedContent.matchAll(finalStageWithInterviewRegex)];

const finalDistribution = {};
finalStageMatches.forEach(match => {
  const stage = match[1];
  finalDistribution[stage] = (finalDistribution[stage] || 0) + 1;
});

console.log('\nFinal interview data distribution by stage:');
console.log(finalDistribution);

console.log(`
Interview Data Update Complete!
==============================
- Added interview data to ${updatesMade.added} candidates
- Removed interview data from ${updatesMade.removed} candidates
- Total candidates with interview data: ${finalInterviewMatches.length}

Interview data now exists only for candidates in these stages:
- INTERVIEWED
- OFFER_EXTENDED
- OFFER_REJECTED
- HIRED
`); 