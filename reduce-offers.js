const fs = require('fs');
const path = require('path');

console.log('Reducing offer-related stages...');

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

// Define target distribution for offers
const offerTargets = {
  'OFFER_EXTENDED': 3,
  'OFFER_REJECTED': 3
};

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

// Calculate adjustments needed
const adjustments = [];

// Reduce OFFER_EXTENDED if needed
if (currentDistribution['OFFER_EXTENDED'] > offerTargets['OFFER_EXTENDED']) {
  const excess = currentDistribution['OFFER_EXTENDED'] - offerTargets['OFFER_EXTENDED'];
  adjustments.push({
    from: 'OFFER_EXTENDED',
    to: 'INTERVIEWED',
    count: excess
  });
}

// Reduce OFFER_REJECTED if needed
if (currentDistribution['OFFER_REJECTED'] > offerTargets['OFFER_REJECTED']) {
  const excess = currentDistribution['OFFER_REJECTED'] - offerTargets['OFFER_REJECTED'];
  adjustments.push({
    from: 'OFFER_REJECTED',
    to: 'REJECTED',
    count: excess
  });
}

// Make the adjustments
let updatedContent = content;
let totalAdjusted = 0;

adjustments.forEach(adj => {
  const toMove = adj.count;
  
  if (toMove > 0) {
    updatedContent = updateStage(updatedContent, adj.from, adj.to, toMove);
    totalAdjusted += toMove;
    
    console.log(`Moved ${toMove} candidates from ${adj.from} to ${adj.to}`);
  }
});

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
Offer Stages Adjustment Complete!
================================
Adjusted ${totalAdjusted} candidates
OFFER_EXTENDED and OFFER_REJECTED stages now have less than 4 candidates each.
`); 