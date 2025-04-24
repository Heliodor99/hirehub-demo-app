// Simple script to update 70% of candidates to have source = 'HireHub'
const fs = require('fs');
const path = require('path');

// Path to the jobs.ts file
const jobsPath = path.resolve(__dirname, '../data/jobs.ts');

// Read the file
try {
  const fileContent = fs.readFileSync(jobsPath, 'utf8');
  
  // Extract the candidates section - find all occurrences of the source field pattern
  const sourcePattern = /source: ['"]([^'"]+)['"]/g;
  
  // Count all candidates
  const allSources = fileContent.match(sourcePattern);
  const totalCandidates = allSources ? allSources.length : 0;
  
  console.log(`Found ${totalCandidates} candidates`);
  
  // Calculate 70% of candidates
  const candidatesToUpdate = Math.floor(totalCandidates * 0.7);
  console.log(`Will update ${candidatesToUpdate} candidates to have source = 'HireHub'`);
  
  // Prepare an array of indices to update (70% of total candidates)
  const allIndices = Array.from({ length: totalCandidates }, (_, i) => i);
  const indicesToUpdate = [];
  
  // Select 70% of indices randomly
  while (indicesToUpdate.length < candidatesToUpdate) {
    const randomIndex = Math.floor(Math.random() * allIndices.length);
    const selectedIndex = allIndices.splice(randomIndex, 1)[0];
    indicesToUpdate.push(selectedIndex);
  }
  
  // Sort the indices to process them in order
  indicesToUpdate.sort((a, b) => a - b);
  
  // Replace the sources in the file content
  let newContent = fileContent;
  let currentIndex = 0;
  
  // Create a new file content with updated sources
  newContent = newContent.replace(sourcePattern, (match) => {
    if (indicesToUpdate.includes(currentIndex)) {
      currentIndex++;
      return `source: 'HireHub'`;
    } else {
      currentIndex++;
      return match;
    }
  });
  
  // Write the updated content back to the file
  fs.writeFileSync(jobsPath, newContent);
  
  console.log(`Successfully updated ${candidatesToUpdate} candidates to have source = 'HireHub'`);
  console.log(`${totalCandidates - candidatesToUpdate} candidates kept their original sources.`);
  
} catch (error) {
  console.error('Error updating candidate sources:', error);
} 