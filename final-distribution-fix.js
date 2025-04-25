const fs = require('fs');
const path = require('path');

console.log('Making final adjustments to recruitment stages...');

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

// Define target distribution
const targetDistribution = {
  'OUTREACHED': 20,
  'APPLIED': 30,
  'SHORTLISTED': 30,
  'INTERVIEWED': 30,
  'OFFER_EXTENDED': 20,
  'OFFER_REJECTED': 10,
  'REJECTED': 30,
  'HIRED': 20
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

// Finalize OUTREACHED count
if (currentDistribution['OUTREACHED'] < targetDistribution['OUTREACHED']) {
  // Need more OUTREACHED - take from APPLIED (which has excess)
  const needed = targetDistribution['OUTREACHED'] - currentDistribution['OUTREACHED'];
  const available = currentDistribution['APPLIED'] - targetDistribution['APPLIED'];
  
  if (available > 0) {
    adjustments.push({
      from: 'APPLIED',
      to: 'OUTREACHED',
      count: Math.min(needed, available)
    });
  }
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
Final Distribution Adjustment Complete!
=====================================
Adjusted ${totalAdjusted} more candidates
The candidates.ts file now has an optimal distribution across all recruitment stages.
`); 