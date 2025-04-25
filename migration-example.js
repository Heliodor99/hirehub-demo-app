/**
 * Example Migration Script for Candidates
 * 
 * This script demonstrates how to safely move candidates from jobs.ts to candidates.ts
 * with proper error handling and deduplication.
 * 
 * Note: This is a template showing the approach that should be taken.
 * The actual candidates array has already been removed from jobs.ts.
 */

const fs = require('fs');
const path = require('path');

console.log('Starting safe candidate migration...');

try {
  // 1. Read both files
  const jobsFilePath = path.join(__dirname, 'src', 'data', 'jobs.ts');
  const candidatesFilePath = path.join(__dirname, 'src', 'data', 'candidates.ts');
  
  const jobsContent = fs.readFileSync(jobsFilePath, 'utf8');
  const candidatesContent = fs.readFileSync(candidatesFilePath, 'utf8');

  // 2. Parse candidates from jobs.ts
  // This regex looks for the candidates array between the export declaration and the next export
  const candidatesRegex = /export const candidates: Candidate\[\] = \[([\s\S]*?)(?=export)/;
  const candidatesMatch = jobsContent.match(candidatesRegex);
  
  if (!candidatesMatch) {
    console.error('Could not find candidates array in jobs.ts');
    process.exit(1);
  }
  
  // Extract individual candidate objects
  const candidatesFromJobs = candidatesMatch[1].trim();
  
  // 3. Parse existing candidates from candidates.ts
  const existingCandidatesRegex = /export const candidates: Candidate\[\] = \[([\s\S]*?)\];/;
  const existingCandidatesMatch = candidatesContent.match(existingCandidatesRegex);
  
  if (!existingCandidatesMatch) {
    console.error('Could not find candidates array in candidates.ts');
    process.exit(1);
  }
  
  const existingCandidatesContent = existingCandidatesMatch[1].trim();
  
  // 4. Parse individual candidates for deduplication
  // This requires a proper parser to handle nested objects and arrays
  // For demonstration, we'll use a simplified approach
  
  // Extract candidate objects using a regex that matches complete objects with balanced braces
  function extractCandidateObjects(content) {
    const objectsArray = [];
    let currentObject = '';
    let braceCount = 0;
    let inObject = false;
    
    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      
      if (char === '{') {
        braceCount++;
        if (braceCount === 1) inObject = true;
        currentObject += char;
      } else if (char === '}') {
        braceCount--;
        currentObject += char;
        
        if (braceCount === 0 && inObject) {
          objectsArray.push(currentObject.trim());
          currentObject = '';
          inObject = false;
        }
      } else if (inObject) {
        currentObject += char;
      }
    }
    
    return objectsArray;
  }
  
  // Extract candidate IDs for deduplication
  function extractCandidateId(candidateObject) {
    const idMatch = candidateObject.match(/id:\s*['"](.*?)['"]/);
    return idMatch ? idMatch[1] : null;
  }
  
  // Extract candidates
  const jobsCandidates = extractCandidateObjects(candidatesFromJobs);
  const existingCandidates = extractCandidateObjects(existingCandidatesContent);
  
  console.log(`Found ${jobsCandidates.length} candidates in jobs.ts`);
  console.log(`Found ${existingCandidates.length} candidates in candidates.ts`);
  
  // 5. Deduplicate candidates by ID
  const existingIds = new Set();
  existingCandidates.forEach(candidate => {
    const id = extractCandidateId(candidate);
    if (id) existingIds.add(id);
  });
  
  // Filter out candidates that already exist in candidates.ts
  const newCandidates = jobsCandidates.filter(candidate => {
    const id = extractCandidateId(candidate);
    return id && !existingIds.has(id);
  });
  
  console.log(`Found ${newCandidates.length} new candidates to add`);
  
  // 6. Create updated candidates array
  const updatedCandidatesContent = existingCandidatesContent 
    ? `${existingCandidatesContent},\n  ${newCandidates.join(',\n  ')}`
    : newCandidates.join(',\n  ');
  
  const updatedContent = candidatesContent.replace(
    /export const candidates: Candidate\[\] = \[([\s\S]*?)\];/,
    `export const candidates: Candidate[] = [\n  ${updatedCandidatesContent}\n];`
  );
  
  // 7. Write updated content to candidates.ts
  fs.writeFileSync(candidatesFilePath, updatedContent, 'utf8');
  
  console.log(`
Migration Complete:
=================
Added ${newCandidates.length} candidates from jobs.ts to candidates.ts
  
Next Steps:
1. Verify candidates.ts has all the expected candidates
2. Run app tests to ensure everything works
3. Remove the candidates array from jobs.ts
`);

} catch (error) {
  console.error('Migration failed with error:', error.message);
  process.exit(1);
} 