const fs = require('fs');
const path = require('path');

console.log('Fixing interview data to match candidate stages...');

// Define the stages that should have interview data
const stagesWithInterviews = ['INTERVIEWED', 'OFFER_EXTENDED', 'OFFER_REJECTED', 'HIRED'];

// Read the candidates.ts file
const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
let candidatesContent = fs.readFileSync(candidatesPath, 'utf8');

// First pass: Find all candidate IDs and their stages
console.log('\nIdentifying all candidates and their stages...');

const idRegex = /id: ['"]([^'"]*)['"]/g;
const stageRegex = /stage: RecruitmentStage\.([A-Z_]+)/g;
const nameRegex = /name: ['"]([^'"]*)['"]/g;

const idMatches = [...candidatesContent.matchAll(idRegex)];
const stageMatches = [...candidatesContent.matchAll(stageRegex)];
const nameMatches = [...candidatesContent.matchAll(nameRegex)];

// Sanity check - we should have the same number of IDs, names, and stages
console.log(`Found ${idMatches.length} IDs, ${nameMatches.length} names, and ${stageMatches.length} stages`);

// Map candidates to their stages
const candidates = [];
for (let i = 0; i < idMatches.length; i++) {
  candidates.push({
    id: idMatches[i][1],
    name: nameMatches[i] ? nameMatches[i][1] : `Candidate ${idMatches[i][1]}`,
    stage: stageMatches[i][1]
  });
}

// Count candidates by stage
const stageCount = {};
candidates.forEach(candidate => {
  stageCount[candidate.stage] = (stageCount[candidate.stage] || 0) + 1;
});

console.log('Candidates by stage:');
console.log(stageCount);

// Second pass: Find which candidates already have interview data
console.log('\nChecking for existing interview data...');

// Check for interview data presence
const interviewDataCount = {};
stagesWithInterviews.forEach(stage => {
  interviewDataCount[stage] = { needed: 0, present: 0 };
});

// Find existing interview data
const interviewRegex = /id: ['"]([^'"]*)['"]([\s\S]*?)stage: RecruitmentStage\.([A-Z_]+)([\s\S]*?)(?:interview:|$)/g;
let interviewMatches = [...candidatesContent.matchAll(interviewRegex)];

interviewMatches.forEach(match => {
  const id = match[1];
  const stage = match[3];
  const hasInterview = match[4].includes('interview:');
  
  // Update our candidate data
  const candidate = candidates.find(c => c.id === id);
  if (candidate) {
    candidate.hasInterview = hasInterview;
    
    if (stagesWithInterviews.includes(stage)) {
      interviewDataCount[stage].needed++;
      if (hasInterview) {
        interviewDataCount[stage].present++;
      }
    } else if (hasInterview) {
      // This candidate shouldn't have interview data
      console.log(`Candidate ${id} (${candidate.name}) in stage ${stage} has interview data that should be removed`);
    }
  }
});

console.log('Interview data status:');
Object.entries(interviewDataCount).forEach(([stage, counts]) => {
  console.log(`${stage}: ${counts.present}/${counts.needed} candidates have interview data`);
});

// Function to generate interview data
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

// Third pass: Update the candidates.ts file
console.log('\nUpdating candidate data...');

// Track changes
let addedCount = 0;
let removedCount = 0;

// Add missing interview data
candidates.forEach(candidate => {
  const shouldHaveInterview = stagesWithInterviews.includes(candidate.stage);
  
  if (shouldHaveInterview && !candidate.hasInterview) {
    // Need to add interview data
    console.log(`Adding interview data for ${candidate.name} (ID: ${candidate.id}, Stage: ${candidate.stage})`);
    
    // Find the candidate object in the content
    const candidateRegex = new RegExp(`id: ["']${candidate.id}["'][\\s\\S]*?stage: RecruitmentStage\\.${candidate.stage}[\\s\\S]*?\\n(\\s*)}`, 'g');
    const candidateMatch = candidateRegex.exec(candidatesContent);
    
    if (candidateMatch) {
      // Insert interview data before the closing brace
      const indent = candidateMatch[1];
      const interviewData = generateInterviewData(candidate.id, candidate.name, candidate.stage);
      
      candidatesContent = candidatesContent.replace(
        `${indent}}`,
        `,${interviewData}\n${indent}}`
      );
      
      addedCount++;
    }
  }
  else if (!shouldHaveInterview && candidate.hasInterview) {
    // Need to remove interview data
    console.log(`Removing interview data from ${candidate.name} (ID: ${candidate.id}, Stage: ${candidate.stage})`);
    
    // Find and remove the interview property
    const interviewPropertyRegex = new RegExp(`(id: ["']${candidate.id}["'][\\s\\S]*?)(,\\s*interview: {[\\s\\S]*?})(\\s*})`, 'g');
    candidatesContent = candidatesContent.replace(interviewPropertyRegex, '$1$3');
    
    removedCount++;
  }
});

// Write the updated content back to the file
fs.writeFileSync(candidatesPath, candidatesContent, 'utf8');

console.log(`
Interview Data Update Complete!
==============================
- Added interview data to ${addedCount} candidates
- Removed interview data from ${removedCount} candidates

Interview data now exists only for candidates in these stages:
${stagesWithInterviews.map(stage => `- ${stage}`).join('\n')}
`); 