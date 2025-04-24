// fix-candidate-links.js
// This script ensures all candidate IDs are consistent string formats
// to prevent "Candidate not found" errors due to type mismatches

const fs = require('fs');
const path = require('path');

// Path to the jobs.ts file that contains candidates array
const jobsFilePath = path.join(__dirname, 'src', 'data', 'jobs.ts');

// Read the file
let fileContent = fs.readFileSync(jobsFilePath, 'utf8');

// Check if the export statement exists
if (!fileContent.includes('export const candidates')) {
  console.error('Could not find candidates array in the file');
  process.exit(1);
}

// Get all candidate objects to check IDs
console.log('Checking candidate IDs...');

let modifiedContent = fileContent;
let candidateIdRegex = /id: ['"]?([^,"']+)['"]?/g;
let match;
let candidateIds = [];

// First pass - collect all IDs
while ((match = candidateIdRegex.exec(fileContent)) !== null) {
  candidateIds.push(match[1]);
}

console.log(`Found ${candidateIds.length} candidates`);

// Check for duplicate IDs
const uniqueIds = [...new Set(candidateIds)];
if (uniqueIds.length !== candidateIds.length) {
  console.warn('Warning: Found duplicate IDs in candidates!');
  
  // Find and log duplicates
  const duplicates = candidateIds.filter((id, index) => 
    candidateIds.indexOf(id) !== index
  );
  
  console.log('Duplicate IDs:', [...new Set(duplicates)]);
}

// Second pass - ensure all IDs are strings
candidateIdRegex.lastIndex = 0; // Reset regex index
let updateCount = 0;

while ((match = candidateIdRegex.exec(fileContent)) !== null) {
  const fullMatch = match[0];
  const id = match[1];
  
  // If ID is not wrapped in quotes, update it
  if (!fullMatch.includes(`'${id}'`) && !fullMatch.includes(`"${id}"`)) {
    const newIdField = `id: '${id}'`;
    modifiedContent = modifiedContent.replace(fullMatch, newIdField);
    updateCount++;
  }
}

// Save changes if needed
if (updateCount > 0) {
  fs.writeFileSync(jobsFilePath, modifiedContent, 'utf8');
  console.log(`Updated ${updateCount} candidate IDs to string format`);
} else {
  console.log('All candidate IDs are already in string format');
}

// Now, also make sure the candidate lookup in the detail page is robust
const candidateDetailPath = path.join(__dirname, 'src', 'app', 'candidates', '[id]', 'page.tsx');

if (fs.existsSync(candidateDetailPath)) {
  console.log('\nUpdating candidate detail page...');
  let detailContent = fs.readFileSync(candidateDetailPath, 'utf8');
  
  // Update the lookup logic to handle both string and number formats
  if (detailContent.includes('c.id === params.id')) {
    const updatedContent = detailContent.replace(
      /c\.id === params\.id/g,
      'String(c.id) === String(params.id)'
    );
    
    fs.writeFileSync(candidateDetailPath, updatedContent, 'utf8');
    console.log('Updated candidate lookup in detail page');
  } else {
    console.log('Candidate lookup in detail page already using robust comparison');
  }
}

// All done!
console.log('\nCandidate ID check and fix completed!'); 