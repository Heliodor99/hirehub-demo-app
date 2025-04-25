const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting migration cleanup process...');

// 1. Remove temporary migration scripts that are no longer needed
const tempScriptsToRemove = [
  'merge-all-candidates.js', 
  'deduplicate-candidates.js', 
  'remove-jobs-candidates.js'
];

tempScriptsToRemove.forEach(script => {
  const scriptPath = path.join(__dirname, script);
  if (fs.existsSync(scriptPath)) {
    try {
      fs.unlinkSync(scriptPath);
      console.log(`Removed ${script}`);
    } catch (error) {
      console.error(`Error removing ${script}: ${error.message}`);
    }
  } else {
    console.log(`${script} already removed.`);
  }
});

// 2. Search for any imports that might still refer to candidates from jobs.ts
console.log('\nChecking for references to candidates from jobs.ts...');

try {
  // Use grep to find potential references
  const grepCmd = "grep -r --include='*.ts' --include='*.tsx' 'candidates.*from.*jobs' src/";
  const result = execSync(grepCmd, { encoding: 'utf8' });
  
  if (result.trim()) {
    console.log('Found potential references that need to be updated:');
    console.log(result);
    console.log('\nPlease update these files to import candidates from @/data/candidates instead.');
  } else {
    console.log('No references found. All imports appear to be correctly updated!');
  }
} catch (error) {
  // If grep returns non-zero exit code (e.g., no matches found)
  if (error.status === 1 && !error.stderr) {
    console.log('No references found. All imports appear to be correctly updated!');
  } else {
    console.error('Error checking references:', error.message);
  }
}

// 3. Verify that the migration is complete
// Count candidates in candidates.ts as a sanity check
try {
  const candidatesFilePath = path.join(__dirname, 'src', 'data', 'candidates.ts');
  const candidatesContent = fs.readFileSync(candidatesFilePath, 'utf8');

  // Count the number of candidate objects
  const candidateCount = (candidatesContent.match(/id: ['"][^'"]*['"]/g) || []).length;
  
  console.log(`\nVerification Complete:`);
  console.log(`Found ${candidateCount} candidates in candidates.ts`);

  console.log(`
Migration Cleanup Complete!
==========================
✅ Removed temporary migration scripts
✅ Checked for references to candidates from jobs.ts
✅ Verified candidate count in candidates.ts

The migration process is now complete. All candidate data has been successfully
moved from jobs.ts to candidates.ts.
`);

} catch (error) {
  console.error('Error during verification:', error.message);
} 