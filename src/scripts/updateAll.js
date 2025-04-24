// Unified script to perform all updates in sequence
const { execSync } = require('child_process');
const path = require('path');

console.log('Starting comprehensive data update...');

try {
  // Step 1: Update candidate sources to HireHub (70%)
  console.log('\n==== STEP 1: Updating candidate sources to HireHub (70%) ====');
  execSync('npm run simple-update-sources', { stdio: 'inherit' });
  
  // Step 2: Update all dates to be recent (last two months)
  console.log('\n==== STEP 2: Updating dates to be recent (last two months) ====');
  execSync('npm run update-dates', { stdio: 'inherit' });
  
  // Step 3: Update communication dates logic
  console.log('\n==== STEP 3: Updating communication timeline date logic ====');
  execSync('npm run update-comm-dates', { stdio: 'inherit' });
  
  // Step 4: Build the application
  console.log('\n==== STEP 4: Building the application ====');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('\n✅ All updates completed successfully!');
  console.log('\nChanges applied:');
  console.log('1. 70% of candidates now have "HireHub" as their source');
  console.log('2. All dates are within the last two months');
  console.log('3. Communication timeline dates adjusted to be realistic');
  console.log('4. Application rebuilt with all changes');
  
} catch (error) {
  console.error('Error during update process:', error.message);
  process.exit(1);
} 