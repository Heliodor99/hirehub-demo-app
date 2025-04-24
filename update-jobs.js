const fs = require('fs');
const path = require('path');

// Path to the jobs.ts file
const jobsFilePath = path.join(__dirname, 'src', 'data', 'jobs.ts');

// Read the file
let fileContent = fs.readFileSync(jobsFilePath, 'utf8');

// Find the jobs array
const jobsStartRegex = /export const jobs: Job\[\] = \[/;
const jobsStart = fileContent.search(jobsStartRegex);

if (jobsStart === -1) {
  console.error('Could not find jobs array');
  process.exit(1);
}

// Find all recruiter field instances and replace with "Hirehub"
const recruiterRegex = /recruiter: ['"].*?['"]/g;
const updatedFileContent = fileContent.replace(recruiterRegex, 'recruiter: "Hirehub"');

// Write the updated content back to the file
fs.writeFileSync(jobsFilePath, updatedFileContent, 'utf8');

console.log('Successfully updated all jobs to have Hirehub as the recruiter.'); 