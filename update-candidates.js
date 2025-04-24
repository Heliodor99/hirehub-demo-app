const fs = require('fs');
const path = require('path');

// Path to the jobs.ts file
const jobsFilePath = path.join(__dirname, 'src', 'data', 'jobs.ts');

// Read the file
let fileContent = fs.readFileSync(jobsFilePath, 'utf8');

// Find the candidates array
const candidatesStartRegex = /export const candidates: Candidate\[\] = \[/;
const candidatesStart = fileContent.search(candidatesStartRegex);

if (candidatesStart === -1) {
  console.error('Could not find candidates array');
  process.exit(1);
}

// Extract the candidates array content
const bracketsRegex = /\[([^\]]*)\]/gs;
bracketsRegex.lastIndex = candidatesStart;
const match = bracketsRegex.exec(fileContent);

if (!match) {
  console.error('Could not extract candidates array');
  process.exit(1);
}

// Process the content to find individual candidate objects
const candidatesString = match[0];
let updatedCandidatesString = candidatesString;

// Find all candidate objects within the array
const candidateRegex = /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/gs;
const candidateMatches = [];
let candidateMatch;

while ((candidateMatch = candidateRegex.exec(candidatesString)) !== null) {
  candidateMatches.push(candidateMatch[0]);
}

// For 70% of the candidates, update source to "Recruiter" and add recruiter: "Hirehub"
const totalCandidates = candidateMatches.length;
const candidatesToUpdate = Math.floor(totalCandidates * 0.7);

console.log(`Found ${totalCandidates} candidates. Will update ${candidatesToUpdate} to have Recruiter source and Hirehub recruiter.`);

// Select random candidates to update
const indices = Array.from({ length: totalCandidates }, (_, i) => i);
// Shuffle the array
for (let i = indices.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [indices[i], indices[j]] = [indices[j], indices[i]];
}
const indicesToUpdate = indices.slice(0, candidatesToUpdate);

// Update the selected candidates
for (let i of indicesToUpdate) {
  const candidate = candidateMatches[i];
  
  // Check if candidate already has source field
  if (candidate.includes('source:')) {
    // Replace existing source with "Recruiter"
    const updatedCandidate = candidate.replace(
      /source: ['"].*?['"]/,
      'source: "Recruiter"'
    );
    
    // Add recruiter field if it doesn't exist, or update it
    if (updatedCandidate.includes('recruiter:')) {
      const finalCandidate = updatedCandidate.replace(
        /recruiter: ['"].*?['"]/,
        'recruiter: "Hirehub"'
      );
      updatedCandidatesString = updatedCandidatesString.replace(candidate, finalCandidate);
    } else {
      // Add the recruiter field after the source field
      const finalCandidate = updatedCandidate.replace(
        /source: "Recruiter",/,
        'source: "Recruiter",\n    recruiter: "Hirehub",'
      );
      updatedCandidatesString = updatedCandidatesString.replace(candidate, finalCandidate);
    }
  } else {
    // If no source field exists, add both fields after the resume field
    const updatedCandidate = candidate.replace(
      /resume: ['"].*?['"],/,
      '$&\n    source: "Recruiter",\n    recruiter: "Hirehub",'
    );
    updatedCandidatesString = updatedCandidatesString.replace(candidate, updatedCandidate);
  }
}

// Replace the original candidates array with the updated one
const updatedFileContent = fileContent.replace(candidatesString, updatedCandidatesString);

// Write the updated content back to the file
fs.writeFileSync(jobsFilePath, updatedFileContent, 'utf8');

console.log('Successfully updated candidates. 70% now have Recruiter source and Hirehub recruiter.'); 