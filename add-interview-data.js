const fs = require('fs');
const path = require('path');

console.log('Adding interview data to appropriate candidates...');

// Define the stages that should have interview data
const stagesWithInterviews = ['INTERVIEWED', 'OFFER_EXTENDED', 'OFFER_REJECTED', 'HIRED'];

// Read the candidates.ts file
const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
let candidatesContent = fs.readFileSync(candidatesPath, 'utf8');

// Function to generate a simple interview data object
function generateInterviewData(id, name, stage) {
  const isHired = stage === 'HIRED';
  const isOfferStage = stage === 'OFFER_EXTENDED' || stage === 'OFFER_REJECTED';
  
  const score = isHired ? 98 : (isOfferStage ? 94 : 91);
  
  return `
  interview: {
    id: ${id},
    candidate: {
      name: "${name}",
      position: "Position Title"
    },
    date: "2024-04-${Math.floor(Math.random() * 30) + 1}",
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
      },
      {
        timestamp: "10:02:00",
        speaker: "Interviewer",
        content: "How would you approach problem-solving in our tech stack?"
      },
      {
        timestamp: "10:03:00",
        speaker: "Candidate",
        content: "I believe in a methodical approach, starting with understanding the requirements, breaking down the problem, and implementing solutions iteratively."
      }
    ],
    aiAssessment: {
      overallScore: ${score},
      categoryScores: {
        technical: ${score + Math.floor(Math.random() * 4 - 2)},
        communication: ${score + Math.floor(Math.random() * 4 - 2)},
        problemSolving: ${score + Math.floor(Math.random() * 4 - 2)},
        culturalFit: ${score + Math.floor(Math.random() * 4 - 2)}
      },
      strengths: [
        "Strong technical knowledge",
        "Clear communication",
        "Excellent problem-solving approach"
      ],
      areasForImprovement: [
        ${isHired ? '"Minor improvements in documentation"' : '"Could provide more specific examples"'},
        ${isHired ? '"Could further develop mentoring skills"' : '"Consider more varied test approaches"'}
      ],
      recommendations: [
        ${isHired ? '"Excellent candidate, recommend hiring"' : '"Candidate shows strong potential for the role"'}
      ]
    },
    humanFeedback: {
      score: ${score - 1},
      notes: "Demonstrated strong technical skills and good problem-solving abilities.",
      nextSteps: "${stage === 'INTERVIEWED' ? 'Schedule follow-up interview' : 'Proceed with offer discussion'}",
      decision: "${stage === 'INTERVIEWED' ? 'Further Evaluation' : (isHired ? 'Hire' : 'Further Evaluation')}"
    }
  }`;
}

// Process all candidates
console.log('Processing candidates:');

// First, let's make sure we have all candidate objects
const candidateObjects = [];
let candidateMatch;
const candidateRegex = /({[^{]*?id: ['"]([^'"]*)['"],[^{]*?name: ['"]([^'"]*)['"],[^{]*?stage: RecruitmentStage\.([A-Z_]+)[^}]*?})/gs;

while ((candidateMatch = candidateRegex.exec(candidatesContent)) !== null) {
  const [fullMatch, candidateObj, id, name, stage] = candidateMatch;
  
  candidateObjects.push({
    fullMatch,
    id,
    name,
    stage,
    hasInterview: candidateObj.includes('interview:')
  });
}

console.log(`Found ${candidateObjects.length} candidate objects`);

// Now process each candidate
let updatedContent = candidatesContent;
let added = 0;
let removed = 0;
let unchanged = 0;

for (const candidate of candidateObjects) {
  const shouldHaveInterview = stagesWithInterviews.includes(candidate.stage);
  
  if (shouldHaveInterview && !candidate.hasInterview) {
    // Need to add interview data
    console.log(`Adding interview data for ${candidate.name} (ID: ${candidate.id}, Stage: ${candidate.stage})`);
    
    // Find where to insert the interview data (right before the closing brace of the candidate object)
    const index = updatedContent.indexOf(candidate.fullMatch) + candidate.fullMatch.length - 1;
    
    // Replace the closing brace with interview data + closing brace
    updatedContent = 
      updatedContent.substring(0, index) + 
      ',' + 
      generateInterviewData(candidate.id, candidate.name, candidate.stage) + 
      updatedContent.substring(index);
    
    added++;
  } 
  else if (!shouldHaveInterview && candidate.hasInterview) {
    // Need to remove interview data
    console.log(`Removing interview data from ${candidate.name} (ID: ${candidate.id}, Stage: ${candidate.stage})`);
    
    // Find and remove the interview property
    const candidateWithoutInterview = candidate.fullMatch.replace(/,\s*interview: {[\s\S]*?}(?=\s*})/, '');
    updatedContent = updatedContent.replace(candidate.fullMatch, candidateWithoutInterview);
    
    removed++;
  }
  else {
    unchanged++;
  }
}

// Write the updated content back to the file
fs.writeFileSync(candidatesPath, updatedContent, 'utf8');

// Verify the updates
const finalCandidateRegex = /stage: RecruitmentStage\.([A-Z_]+)[^{]*?(?:interview: {|[^i])/g;
const finalCandidates = [...updatedContent.matchAll(finalCandidateRegex)];

const finalStageCount = {};
stagesWithInterviews.forEach(stage => {
  finalStageCount[stage] = 0;
});

let interviewCount = 0;
for (const match of finalCandidates) {
  const stage = match[1];
  const hasInterview = match[0].includes('interview: {');
  
  if (hasInterview) {
    interviewCount++;
    if (stagesWithInterviews.includes(stage)) {
      finalStageCount[stage] = (finalStageCount[stage] || 0) + 1;
    }
  }
}

console.log('\nFinal interview data distribution:');
console.log(finalStageCount);

console.log(`
Interview Data Update Complete!
==============================
- Added interview data to ${added} candidates
- Removed interview data from ${removed} candidates
- Left unchanged: ${unchanged} candidates
- Total candidates with interview data: ${interviewCount}

Interview data now exists only for candidates in these stages:
${stagesWithInterviews.map(stage => `- ${stage}`).join('\n')}
`); 