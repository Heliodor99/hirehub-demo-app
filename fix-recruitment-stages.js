const fs = require('fs');
const path = require('path');

// Map old stages to valid RecruitmentStage enum values
const stageMapping = {
  'ASSESSMENT_SENT': 'SHORTLISTED',
  'RESUME_SHORTLISTED': 'SHORTLISTED',
  'FEEDBACK_DONE': 'INTERVIEWED',
  'INTERVIEW_SCHEDULED': 'INTERVIEWED'
};

const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
let content = fs.readFileSync(candidatesPath, 'utf8');

// Replace all invalid stage values with valid ones
Object.entries(stageMapping).forEach(([oldStage, newStage]) => {
  const regex = new RegExp(`RecruitmentStage\\.${oldStage}`, 'g');
  content = content.replace(regex, `RecruitmentStage.${newStage}`);
});

// Also fix any missing 'content' property in transcript entries
content = content.replace(
  /{\s*timestamp:\s*['"][^'"]*['"],\s*speaker:\s*['"]Candidate['"](?!\s*,\s*content:)\s*}/g, 
  match => {
    return match.replace(/}$/, ', content: ""}'
  )}
);

// Write the fixed content back to the file
fs.writeFileSync(candidatesPath, content, 'utf8');

console.log('Fixed RecruitmentStage values and transcript entries in candidates.ts'); 