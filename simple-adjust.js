const fs = require('fs');
const path = require('path');

// Define paths
const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
const backupPath = `${candidatesPath}.backup-adjust-${Date.now()}`;

// Create backup
fs.copyFileSync(candidatesPath, backupPath);
console.log(`Created backup at ${backupPath}`);

// Read the current file
const fileContent = fs.readFileSync(candidatesPath, 'utf8');

// First count how many candidates we have with INTERVIEWED stage
const interviewedCount = (fileContent.match(/stage: RecruitmentStage\.INTERVIEWED/g) || []).length;
console.log(`Current INTERVIEWED count: ${interviewedCount}`);

// Check the current interviewed distribution by job ID
const interviewedJobIdMatches = [...fileContent.matchAll(/jobId: ['"](\d+)['"][\s\S]*?stage: RecruitmentStage\.INTERVIEWED/g)];
const interviewedByJobId = {};
interviewedJobIdMatches.forEach(match => {
  const jobId = match[1];
  interviewedByJobId[jobId] = (interviewedByJobId[jobId] || 0) + 1;
});
console.log('Current INTERVIEWED by job ID:');
console.log(interviewedByJobId);

// Target distribution
const targetInterviewedCount = 17;
const jobIds = Object.keys(interviewedByJobId).sort();
const targetDistribution = {};

// Calculate balanced distribution
jobIds.forEach(jobId => {
  targetDistribution[jobId] = Math.floor(targetInterviewedCount / jobIds.length);
});

// Distribute any remaining slots
let remaining = targetInterviewedCount - Object.values(targetDistribution).reduce((a, b) => a + b, 0);
for (let i = 0; i < remaining; i++) {
  targetDistribution[jobIds[i % jobIds.length]]++;
}

console.log('Target INTERVIEWED distribution:');
console.log(targetDistribution);

// Identify changes needed
let updatedContent = fileContent;

if (interviewedCount > targetInterviewedCount) {
  // Need to reduce INTERVIEWED candidates
  console.log(`Need to convert ${interviewedCount - targetInterviewedCount} INTERVIEWED candidates to SHORTLISTED`);
  
  // For each job ID, determine how many to convert
  jobIds.forEach(jobId => {
    const current = interviewedByJobId[jobId] || 0;
    const target = targetDistribution[jobId];
    
    if (current > target) {
      const toConvert = current - target;
      console.log(`Need to convert ${toConvert} candidates from job ID ${jobId}`);
      
      // Find candidates to convert using regex
      const candidates = [];
      const regex = new RegExp(`(id: ['"]\\d+['"][\\s\\S]*?jobId: ['"]${jobId}['"][\\s\\S]*?stage: RecruitmentStage\\.INTERVIEWED[\\s\\S]*?)([,}])`, 'g');
      let match;
      let count = 0;
      
      // Create a temporary string to avoid modifying the original while iterating
      let tempContent = updatedContent;
      
      while ((match = regex.exec(tempContent)) !== null && count < toConvert) {
        const fullMatch = match[0];
        const replacement = fullMatch.replace('stage: RecruitmentStage.INTERVIEWED', 'stage: RecruitmentStage.SHORTLISTED');
        
        // Replace only the first occurrence to avoid infinite loop
        updatedContent = updatedContent.replace(fullMatch, replacement);
        count++;
      }
      
      console.log(`Converted ${count} candidates from job ID ${jobId}`);
    }
  });
} else if (interviewedCount < targetInterviewedCount) {
  // Need to increase INTERVIEWED candidates
  console.log(`Need to convert ${targetInterviewedCount - interviewedCount} candidates to INTERVIEWED`);
  
  // For each job ID, determine how many to convert
  jobIds.forEach(jobId => {
    const current = interviewedByJobId[jobId] || 0;
    const target = targetDistribution[jobId];
    
    if (current < target) {
      const toConvert = target - current;
      console.log(`Need to convert ${toConvert} candidates to job ID ${jobId}`);
      
      // First try to convert SHORTLISTED candidates
      let shortlistedRegex = new RegExp(`(id: ['"]\\d+['"][\\s\\S]*?jobId: ['"]${jobId}['"][\\s\\S]*?stage: RecruitmentStage\\.SHORTLISTED[\\s\\S]*?)([,}])`, 'g');
      let match;
      let count = 0;
      
      // Create a temporary string to avoid modifying the original while iterating
      let tempContent = updatedContent;
      
      while ((match = shortlistedRegex.exec(tempContent)) !== null && count < toConvert) {
        const fullMatch = match[0];
        const replacement = fullMatch.replace('stage: RecruitmentStage.SHORTLISTED', 'stage: RecruitmentStage.INTERVIEWED');
        
        // Replace only the first occurrence to avoid infinite loop
        updatedContent = updatedContent.replace(fullMatch, replacement);
        count++;
      }
      
      // If we still need more, try APPLIED candidates
      if (count < toConvert) {
        let appliedRegex = new RegExp(`(id: ['"]\\d+['"][\\s\\S]*?jobId: ['"]${jobId}['"][\\s\\S]*?stage: RecruitmentStage\\.APPLIED[\\s\\S]*?)([,}])`, 'g');
        
        tempContent = updatedContent;
        while ((match = appliedRegex.exec(tempContent)) !== null && count < toConvert) {
          const fullMatch = match[0];
          const replacement = fullMatch.replace('stage: RecruitmentStage.APPLIED', 'stage: RecruitmentStage.INTERVIEWED');
          
          // Replace only the first occurrence to avoid infinite loop
          updatedContent = updatedContent.replace(fullMatch, replacement);
          count++;
        }
      }
      
      console.log(`Converted ${count} candidates for job ID ${jobId}`);
    }
  });
} else {
  console.log('Already have exactly 17 INTERVIEWED candidates');
}

// Write the updated content back to the file
fs.writeFileSync(candidatesPath, updatedContent);
console.log('Updated candidates file');

// Verify the final result
const finalContent = fs.readFileSync(candidatesPath, 'utf8');
const finalInterviewedCount = (finalContent.match(/stage: RecruitmentStage\.INTERVIEWED/g) || []).length;
console.log(`Final INTERVIEWED count: ${finalInterviewedCount}`);

// Check the final interviewed distribution by job ID
const finalInterviewedJobIdMatches = [...finalContent.matchAll(/jobId: ['"](\d+)['"][\s\S]*?stage: RecruitmentStage\.INTERVIEWED/g)];
const finalInterviewedByJobId = {};
finalInterviewedJobIdMatches.forEach(match => {
  const jobId = match[1];
  finalInterviewedByJobId[jobId] = (finalInterviewedByJobId[jobId] || 0) + 1;
});
console.log('Final INTERVIEWED by job ID:');
console.log(finalInterviewedByJobId); 