const fs = require('fs');
const path = require('path');

// Read the jobs.ts file
const filePath = path.join(__dirname, 'src', 'data', 'jobs.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Define the stage mappings
const stageMappings = {
  'INTERVIEW_SCHEDULED': 'SHORTLISTED',
  'ASSESSMENT_SENT': 'SHORTLISTED',
  'RESUME_SHORTLISTED': 'SHORTLISTED',
  'FEEDBACK_DONE': 'INTERVIEWED'
};

// Replace all occurrences of the old stages with new ones
Object.entries(stageMappings).forEach(([oldStage, newStage]) => {
  const regex = new RegExp(`RecruitmentStage\\.${oldStage}`, 'g');
  content = content.replace(regex, `RecruitmentStage.${newStage}`);
});

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('Successfully updated candidate stages in jobs.ts'); 