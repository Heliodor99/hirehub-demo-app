const fs = require('fs');
const path = require('path');

// Define paths
const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
const allBackupsPath = path.join(__dirname, 'src', 'data');

// Find all backups
console.log('Looking for backup files...');
const backupFiles = fs.readdirSync(allBackupsPath)
  .filter(f => f.startsWith('candidates.ts.backup') && !f.includes('simple'))
  .map(f => path.join(allBackupsPath, f));

if (backupFiles.length === 0) {
  console.error('No backup files found!');
  process.exit(1);
}

// Sort by creation time (newest first)
backupFiles.sort((a, b) => {
  return fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime();
});

console.log(`Found ${backupFiles.length} backup files. Using newest: ${backupFiles[0]}`);

// Read the backup file
const backupContent = fs.readFileSync(backupFiles[0], 'utf8');
console.log(`Read backup file (${backupContent.length} bytes)`);

// Create a new backup of current file before we modify it
const newBackupPath = `${candidatesPath}.backup-restore-${Date.now()}`;
fs.copyFileSync(candidatesPath, newBackupPath);
console.log(`Created backup of current file at ${newBackupPath}`);

// Extract all candidate objects from the backup
const candidateRegex = /\{[\s\S]*?id: ['"](\d+)['"][\s\S]*?stage: RecruitmentStage\.([A-Z_]+)[\s\S]*?jobId: ['"](\d+)['"][\s\S]*?\}/g;
const candidateMatches = [];
let match;

console.log('Extracting candidates from backup...');
while ((match = candidateRegex.exec(backupContent)) !== null) {
  candidateMatches.push({
    full: match[0],
    id: match[1],
    stage: match[2],
    jobId: match[3]
  });
}

console.log(`Found ${candidateMatches.length} candidates in backup`);

// Count stages
const stages = {};
candidateMatches.forEach(c => {
  stages[c.stage] = (stages[c.stage] || 0) + 1;
});
console.log('Original stage distribution:');
console.log(stages);

// Count job IDs
const jobIds = {};
candidateMatches.forEach(c => {
  jobIds[c.jobId] = (jobIds[c.jobId] || 0) + 1;
});
console.log('Original job ID distribution:');
console.log(jobIds);

// Make sure we have 17 INTERVIEWED candidates with balanced job distribution
const interviewedCount = stages['INTERVIEWED'] || 0;
const targetInterviewedCount = 17;
let candidatesToModify = [];

if (interviewedCount !== targetInterviewedCount) {
  console.log(`Adjusting INTERVIEWED count from ${interviewedCount} to ${targetInterviewedCount}`);
  
  if (interviewedCount < targetInterviewedCount) {
    // Need to add more INTERVIEWED candidates
    const toAdd = targetInterviewedCount - interviewedCount;
    console.log(`Need to convert ${toAdd} candidates to INTERVIEWED`);
    
    // Prioritize candidates for job IDs with fewer INTERVIEWED candidates
    const interviewedByJobId = {};
    candidateMatches.forEach(c => {
      if (c.stage === 'INTERVIEWED') {
        interviewedByJobId[c.jobId] = (interviewedByJobId[c.jobId] || 0) + 1;
      }
    });
    
    // Create target distribution
    const targetDistribution = {};
    Object.keys(jobIds).forEach(jobId => {
      targetDistribution[jobId] = Math.floor(targetInterviewedCount / Object.keys(jobIds).length);
    });
    
    // Ensure balanced distribution by adding any remainders
    let remaining = targetInterviewedCount - Object.values(targetDistribution).reduce((a, b) => a + b, 0);
    const jobIdsList = Object.keys(jobIds).sort();
    for (let i = 0; i < remaining; i++) {
      targetDistribution[jobIdsList[i % jobIdsList.length]]++;
    }
    
    console.log('Target INTERVIEWED distribution:');
    console.log(targetDistribution);
    
    // For each job ID, find candidates to convert to INTERVIEWED
    Object.keys(targetDistribution).forEach(jobId => {
      const current = interviewedByJobId[jobId] || 0;
      const target = targetDistribution[jobId];
      
      if (current < target) {
        const toConvert = target - current;
        console.log(`Need to convert ${toConvert} candidates to INTERVIEWED for job ID ${jobId}`);
        
        // Find SHORTLISTED candidates for this job ID
        const shortlisted = candidateMatches.filter(c => 
          c.stage === 'SHORTLISTED' && c.jobId === jobId);
        
        // If not enough SHORTLISTED, also look at APPLIED
        const applied = candidateMatches.filter(c => 
          c.stage === 'APPLIED' && c.jobId === jobId);
        
        // Combine candidates by prioritizing SHORTLISTED first
        const candidates = [...shortlisted, ...applied];
        
        // Mark candidates to convert
        for (let i = 0; i < Math.min(toConvert, candidates.length); i++) {
          candidatesToModify.push({
            id: candidates[i].id,
            from: candidates[i].stage,
            to: 'INTERVIEWED'
          });
        }
      }
    });
  } else {
    // Need to remove some INTERVIEWED candidates
    const toRemove = interviewedCount - targetInterviewedCount;
    console.log(`Need to convert ${toRemove} INTERVIEWED candidates to SHORTLISTED`);
    
    // Count INTERVIEWED candidates by job ID
    const interviewedByJobId = {};
    const interviewedCandidates = candidateMatches.filter(c => c.stage === 'INTERVIEWED');
    
    interviewedCandidates.forEach(c => {
      interviewedByJobId[c.jobId] = (interviewedByJobId[c.jobId] || 0) + 1;
    });
    
    // Create target distribution
    const targetDistribution = {};
    Object.keys(interviewedByJobId).forEach(jobId => {
      targetDistribution[jobId] = Math.floor(targetInterviewedCount / Object.keys(interviewedByJobId).length);
    });
    
    // Ensure balanced distribution by adding any remainders
    let remaining = targetInterviewedCount - Object.values(targetDistribution).reduce((a, b) => a + b, 0);
    const jobIdsList = Object.keys(interviewedByJobId).sort();
    for (let i = 0; i < remaining; i++) {
      targetDistribution[jobIdsList[i % jobIdsList.length]]++;
    }
    
    console.log('Current INTERVIEWED distribution:');
    console.log(interviewedByJobId);
    
    console.log('Target INTERVIEWED distribution:');
    console.log(targetDistribution);
    
    // For each job ID, find candidates to convert from INTERVIEWED
    Object.keys(interviewedByJobId).forEach(jobId => {
      const current = interviewedByJobId[jobId];
      const target = targetDistribution[jobId] || 0;
      
      if (current > target) {
        const toConvert = current - target;
        console.log(`Need to convert ${toConvert} INTERVIEWED candidates for job ID ${jobId}`);
        
        // Find INTERVIEWED candidates for this job ID
        const interviewed = interviewedCandidates.filter(c => c.jobId === jobId);
        
        // Mark candidates to convert
        for (let i = 0; i < Math.min(toConvert, interviewed.length); i++) {
          candidatesToModify.push({
            id: interviewed[i].id,
            from: 'INTERVIEWED',
            to: 'SHORTLISTED'
          });
        }
      }
    });
  }
}

console.log('Candidates to modify:');
console.log(candidatesToModify);

// Create a new properly formatted file
let newContent = 'import { Candidate, RecruitmentStage } from \'@/types\';\n\n';

// Add the divyaKrishnan constant from backup if it exists
const divyaMatch = backupContent.match(/const divyaKrishnan: Candidate = \{[\s\S]*?\};/);
if (divyaMatch) {
  newContent += divyaMatch[0] + '\n\n';
}

// Start candidates array
newContent += 'export const candidates: Candidate[] = [\n';

// Add divyaKrishnan to the candidates array if it exists
if (divyaMatch) {
  newContent += '  divyaKrishnan,\n';
}

// Process each candidate
candidateMatches.forEach((candidate, index) => {
  // Check if this candidate should be modified
  const modifyInfo = candidatesToModify.find(m => m.id === candidate.id);
  
  let candidateText = candidate.full;
  
  if (modifyInfo) {
    // Modify the stage
    candidateText = candidateText.replace(
      new RegExp(`stage: RecruitmentStage\\.${modifyInfo.from}`),
      `stage: RecruitmentStage.${modifyInfo.to}`
    );
  }
  
  // Format and add to content
  const formattedCandidate = candidateText
    .replace(/\n\s*/g, '\n  ')  // Fix indentation
    .replace(/^\{/, '  {');     // Add indentation to first line
  
  newContent += formattedCandidate;
  if (index < candidateMatches.length - 1) {
    newContent += ',\n';
  } else {
    newContent += '\n';
  }
});

// Close the array
newContent += '];\n';

// Write the fixed content back to the file
fs.writeFileSync(candidatesPath, newContent);
console.log(`Successfully wrote formatted file with ${candidateMatches.length} candidates`);

// Verify the file
const finalContent = fs.readFileSync(candidatesPath, 'utf8');
const finalInterviewedCount = (finalContent.match(/stage: RecruitmentStage\.INTERVIEWED/g) || []).length;
console.log(`Final INTERVIEWED count: ${finalInterviewedCount}`);

// Count by job ID
const finalInterviewedByJobId = {};
const interviewedJobIdRegex = /jobId: ['"](\d+)['"][\s\S]*?stage: RecruitmentStage\.INTERVIEWED/g;
while ((match = interviewedJobIdRegex.exec(finalContent)) !== null) {
  const jobId = match[1];
  finalInterviewedByJobId[jobId] = (finalInterviewedByJobId[jobId] || 0) + 1;
}

console.log('Final INTERVIEWED by job ID:');
console.log(finalInterviewedByJobId); 