const fs = require('fs');
const path = require('path');

console.log('Adjusting early recruitment stages...');

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
  'SHORTLISTED': 40,
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

if (currentDistribution['OUTREACHED'] < targetDistribution['OUTREACHED']) {
  // Need more OUTREACHED - take from SHORTLISTED
  adjustments.push({
    from: 'SHORTLISTED',
    to: 'OUTREACHED',
    count: targetDistribution['OUTREACHED'] - currentDistribution['OUTREACHED']
  });
}

if (currentDistribution['APPLIED'] < targetDistribution['APPLIED']) {
  // Need more APPLIED - take from SHORTLISTED
  adjustments.push({
    from: 'SHORTLISTED',
    to: 'APPLIED',
    count: targetDistribution['APPLIED'] - currentDistribution['APPLIED']
  });
}

// Make the adjustments
let updatedContent = content;
let totalAdjusted = 0;

adjustments.forEach(adj => {
  // Check if we have enough candidates in the source stage
  const available = currentDistribution[adj.from] - (adj.from === 'SHORTLISTED' ? 30 : 0); // Keep at least 30 in SHORTLISTED
  
  if (available <= 0) {
    console.log(`Not enough candidates in ${adj.from} stage to move to ${adj.to}`);
    return;
  }
  
  const toMove = Math.min(adj.count, available);
  
  if (toMove > 0) {
    updatedContent = updateStage(updatedContent, adj.from, adj.to, toMove);
    currentDistribution[adj.from] -= toMove;
    currentDistribution[adj.to] += toMove;
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

console.log('New distribution:');
console.log(newDistribution);

console.log(`
Early Stages Adjustment Complete!
================================
Adjusted ${totalAdjusted} candidates to early recruitment stages
The candidates.ts file now has better distribution across all recruitment stages.
`); 