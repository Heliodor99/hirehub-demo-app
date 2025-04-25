/**
 * This script updates all dates from 2024 to 2025 in the job and candidate data
 * Run with: node scripts/update-dates.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all relevant files
const dataDir = path.join(__dirname, '../src/data');
const findFilesCmd = `find ${dataDir} -type f -name "*.ts" | grep -v "node_modules" | grep -v "backup"`;
let dataFiles = [];

try {
  const stdout = execSync(findFilesCmd, { encoding: 'utf8' });
  dataFiles = stdout.trim().split('\n').filter(Boolean);
} catch (error) {
  console.error('Error finding data files:', error.message);
  // Default to jobs.ts if find command fails
  dataFiles = [path.join(__dirname, '../src/data/jobs.ts')];
  
  // Check if candidates.ts exists
  const candidatesPath = path.join(__dirname, '../src/data/candidates.ts');
  if (fs.existsSync(candidatesPath)) {
    dataFiles.push(candidatesPath);
  }
}

// Regular expressions to match 2024 dates in various formats
const dateRegex = /\b2024-\d{2}-\d{2}\b/g;              // ISO format: 2024-01-01
const dateTextRegex = /\b2024\b/g;                      // Plain text year mentions
const urlResumeRegex = /(resume-)2024(\.pdf|$)/g;       // URLs with resume-2024.pdf
const resumeYearRegex = /(Resume_)2024(\.pdf|$)/g;      // URLs with Resume_2024.pdf
const otherUrlRegex = /\/([^\/]*?)2024([^\/]*?\.pdf|$)/g; // Other URLs with 2024 in them

let totalReplacements = 0;
let totalIsoReplacements = 0;
let totalTextReplacements = 0;
let totalUrlReplacements = 0;

// Process each file
dataFiles.forEach(filePath => {
  try {
    // Read file content
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Count matches before replacement
    const dateMatches = fileContent.match(dateRegex) || [];
    const textMatches = fileContent.match(dateTextRegex) || [];
    const urlMatches1 = fileContent.match(urlResumeRegex) || [];
    const urlMatches2 = fileContent.match(resumeYearRegex) || [];
    const urlMatches3 = fileContent.match(otherUrlRegex) || [];
    
    // Replace all 2024 dates with 2025
    const updatedContent = fileContent
      .replace(dateRegex, match => match.replace('2024', '2025'))
      .replace(dateTextRegex, '2025')
      .replace(urlResumeRegex, '$12025$2')
      .replace(resumeYearRegex, '$12025$2')
      .replace(otherUrlRegex, '/$12025$2');
    
    // Write the updated content back
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    
    // Track replacements
    const isoReplacements = dateMatches.length;
    const textReplacements = textMatches.length;
    const urlReplacements = urlMatches1.length + urlMatches2.length + urlMatches3.length;
    
    totalIsoReplacements += isoReplacements;
    totalTextReplacements += textReplacements;
    totalUrlReplacements += urlReplacements;
    totalReplacements += isoReplacements + textReplacements + urlReplacements;
    
    // Log progress for each file
    if (isoReplacements > 0 || textReplacements > 0 || urlReplacements > 0) {
      const fileName = path.basename(filePath);
      console.log(`✅ Updated ${fileName}: ${isoReplacements} ISO dates, ${textReplacements} text mentions, ${urlReplacements} URLs`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
  }
});

// Additional check - use grep to find any remaining occurrences
console.log('\nChecking for any remaining instances of 2024...');
try {
  const checkCmd = `grep -r --include="*.ts" --exclude="*backup*" "2024" ${dataDir}`;
  const remainingResults = execSync(checkCmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  
  if (remainingResults.trim()) {
    console.log('⚠️ Some instances of 2024 might still remain:');
    console.log(remainingResults.split('\n').slice(0, 5).join('\n') + (remainingResults.split('\n').length > 5 ? '\n... (more lines)' : ''));
  } else {
    console.log('✅ No remaining instances of 2024 found!');
  }
} catch (error) {
  // grep returns exit code 1 if no matches found - this is actually success for us
  if (error.status === 1) {
    console.log('✅ No remaining instances of 2024 found!');
  } else {
    console.error('Error checking for remaining 2024 mentions:', error.message);
  }
}

// Summary
console.log('\n=== Summary ===');
console.log(`📊 Made ${totalReplacements} total replacements:`);
console.log(`   - ${totalIsoReplacements} ISO format dates (YYYY-MM-DD)`);
console.log(`   - ${totalTextReplacements} plain year mentions`);
console.log(`   - ${totalUrlReplacements} URL references`);
console.log(`   - ${dataFiles.length} files processed`);
console.log('\nℹ️  Remember to restart your development server for changes to take effect.'); 