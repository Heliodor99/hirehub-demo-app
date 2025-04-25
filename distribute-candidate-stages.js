const fs = require('fs');
const path = require('path');

console.log('Updating candidate stages distribution...');

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

// Define target distribution (approximate percentages)
const targetPercentages = {
  'OUTREACHED': 10,
  'APPLIED': 15,
  'SHORTLISTED': 20,
  'INTERVIEWED': 15,
  'OFFER_EXTENDED': 10,
  'OFFER_REJECTED': 5,
  'REJECTED': 15,
  'HIRED': 10
};

// Find all stage declarations in the file
const stageRegex = /stage: RecruitmentStage\.[A-Z_]+/g;
const stageMatches = Array.from(content.matchAll(stageRegex));

// Calculate how many candidates we need to update for each stage
const totalCandidates = stageMatches.length;
const targetDistribution = {};
let updatedCount = 0;

Object.entries(targetPercentages).forEach(([stage, percentage]) => {
  const target = Math.round((percentage / 100) * totalCandidates);
  targetDistribution[stage] = target;
});

console.log('Target distribution:');
console.log(targetDistribution);

// Create a map of stages that need more candidates
const stagesNeedingMore = {};
RecruitmentStages.forEach(stage => {
  const deficit = targetDistribution[stage] - (currentDistribution[stage] || 0);
  if (deficit > 0) {
    stagesNeedingMore[stage] = deficit;
  }
});

// Create a map of stages that have too many candidates
const stagesWithExcess = {};
RecruitmentStages.forEach(stage => {
  const excess = (currentDistribution[stage] || 0) - targetDistribution[stage];
  if (excess > 0) {
    stagesWithExcess[stage] = excess;
  }
});

// Calculate total candidates to redistribute
const totalToRedistribute = Object.values(stagesWithExcess).reduce((a, b) => a + b, 0);
const totalNeeded = Object.values(stagesNeedingMore).reduce((a, b) => a + b, 0);

console.log(`Need to redistribute ${totalToRedistribute} candidates to fill ${totalNeeded} slots`);

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

// Redistribute candidates
let updatedContent = content;
const sourcesInOrder = ['SHORTLISTED', 'INTERVIEWED', 'APPLIED', 'OUTREACHED'];
const targetsInOrder = ['OFFER_EXTENDED', 'OFFER_REJECTED', 'REJECTED', 'HIRED'];

// Update from sources to targets
for (const targetStage of targetsInOrder) {
  const needed = targetDistribution[targetStage] - (currentDistribution[targetStage] || 0);
  
  if (needed <= 0) continue;
  
  let remaining = needed;
  
  for (const sourceStage of sourcesInOrder) {
    const available = currentDistribution[sourceStage] - targetDistribution[sourceStage];
    
    if (available <= 0) continue;
    
    const toMove = Math.min(remaining, available);
    
    if (toMove > 0) {
      updatedContent = updateStage(updatedContent, sourceStage, targetStage, toMove);
      currentDistribution[sourceStage] -= toMove;
      currentDistribution[targetStage] = (currentDistribution[targetStage] || 0) + toMove;
      remaining -= toMove;
      updatedCount += toMove;
      
      console.log(`Moved ${toMove} candidates from ${sourceStage} to ${targetStage}`);
    }
    
    if (remaining <= 0) break;
  }
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

console.log('New distribution:');
console.log(newDistribution);

console.log(`
Stage Distribution Update Complete!
==================================
Updated ${updatedCount} candidates with new stages
The candidates.ts file now has a better distribution of recruitment stages.
`); 