const { exec } = require('child_process');
const path = require('path');

console.log('Starting data update process...');

// Run the candidate update script
console.log('Updating candidates...');
exec('node update-candidates.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error updating candidates: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(stdout);
  
  // After candidate update completes, run the jobs update script
  console.log('Updating jobs...');
  exec('node update-jobs.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error updating jobs: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(stdout);
    
    console.log('All data updates completed successfully!');
    console.log('Now 70% of candidates have "Recruiter" as source with "Hirehub" as the recruiter.');
    console.log('All job listings have been updated to use "Hirehub" as the recruiter.');
  });
}); 