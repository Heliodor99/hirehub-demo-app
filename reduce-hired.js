const fs = require('fs');
const path = require('path');

console.log('Reducing HIRED stage and increasing OUTREACHED...');

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

// Count current stage distribution
const currentDistribution = {};
RecruitmentStages.forEach(stage => {
  const regex = new RegExp(`RecruitmentStage\\.${stage}`, 'g');
  const matches = content.match(regex) || [];
  currentDistribution[stage] = matches.length;
});

console.log('Current distribution:');
console.log(currentDistribution);

// Function to update stage in content
function updateStage(content, oldStage, newStage, count) {
  let updatedContent = content;
  let remainingCount = count;
  
  const regex = new RegExp(`stage: RecruitmentStage\\.${oldStage}`, 'g');
  
  // Replace only the first 'count' occurrences
  updatedContent = updatedContent.replace(regex, (match) => {
    if (remainingCount > 0) {
      remainingCount--;
      return `stage: RecruitmentStage.${newStage}`;
    }
    return match;
  });
  
  return updatedContent;
}

// Define target count for HIRED
const targetHired = 2;

// Check if we need to move candidates from HIRED
let updatedContent = content;
let movedCount = 0;

if (currentDistribution['HIRED'] > targetHired) {
  const toMove = currentDistribution['HIRED'] - targetHired;
  updatedContent = updateStage(updatedContent, 'HIRED', 'OUTREACHED', toMove);
  movedCount = toMove;
  
  console.log(`Moved ${toMove} candidates from HIRED to OUTREACHED`);
}

// Write the updated content back to the file
fs.writeFileSync(candidatesPath, updatedContent, 'utf8');

// Check new distribution
const newDistribution = {};
RecruitmentStages.forEach(stage => {
  const regex = new RegExp(`RecruitmentStage\\.${stage}`, 'g');
  const matches = updatedContent.match(regex) || [];
  newDistribution[stage] = matches.length;
});

console.log('Final distribution:');
console.log(newDistribution);

console.log(`
HIRED Reduction Complete!
=======================
Moved ${movedCount} candidates from HIRED to OUTREACHED
HIRED stage now has less than 3 candidates.
`); 