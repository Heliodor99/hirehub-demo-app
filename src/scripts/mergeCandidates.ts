/**
 * Utility script to merge candidates from different data sources
 * 
 * This script:
 * 1. Reads candidates from specified files
 * 2. Merges them with proper deduplication
 * 3. Updates candidates.ts with the merged data
 * 
 * Run with: npx ts-node src/scripts/mergeCandidates.ts
 * 
 * Note: This file has been updated after the migration from jobs.ts to candidates.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { candidates as existingCandidates } from '../data/candidates';
import { Candidate, RecruitmentStage } from '../types';

// Get absolute paths to our files
const ROOT_DIR = path.resolve(__dirname, '../../');
const CANDIDATES_FILE_PATH = path.resolve(ROOT_DIR, 'src/data/candidates.ts');

// Function to deduplicate candidates based on ID
function mergeCandidates(existingCandidates: Candidate[], newCandidates: Candidate[]): Candidate[] {
  const candidatesMap = new Map<string, Candidate>();
  
  // Add candidates from first source
  existingCandidates.forEach((candidate: Candidate) => {
    candidatesMap.set(candidate.id, candidate);
  });
  
  // Add candidates from second source, overriding if they already exist
  newCandidates.forEach((candidate: Candidate) => {
    // Only add if not already exists
    if (!candidatesMap.has(candidate.id)) {
      candidatesMap.set(candidate.id, candidate);
    } else {
      console.log(`Candidate with ID ${candidate.id} (${candidate.name}) already exists - skipping`);
    }
  });
  
  // Convert back to array
  return Array.from(candidatesMap.values());
}

// Example usage - replace newCandidates with your data source
const newCandidates: Candidate[] = [
  // Add new candidates here if needed in the future
];

// Merge the candidates
const mergedCandidates = mergeCandidates(existingCandidates, newCandidates);

// Count stats
const origCount = existingCandidates.length;
const mergedCount = mergedCandidates.length;
const newCount = mergedCount - origCount;

// Create updated candidates.ts file content
const fileHeader = `import { Candidate, RecruitmentStage } from '@/types';

// This file contains all candidates merged from multiple sources
// Last updated: ${new Date().toISOString()}

`;

const candidatesDeclaration = `export const candidates: Candidate[] = `;
const candidatesContent = JSON.stringify(mergedCandidates, null, 2)
  .replace(/"RecruitmentStage\.([A-Z_]+)"/g, 'RecruitmentStage.$1')
  .replace(/"([^"]+)":/g, '$1:');

// Write to file
fs.writeFileSync(
  CANDIDATES_FILE_PATH,
  fileHeader + candidatesDeclaration + candidatesContent + ';\n'
);

console.log(`
Candidates Update Complete:
==========================
Original candidates: ${origCount}
Updated candidates: ${mergedCount}
Added ${newCount} new candidates
Successfully wrote to ${CANDIDATES_FILE_PATH}
`);

// Log next steps
console.log(`
NEXT STEPS:
==========
1. Run tests to ensure everything works correctly
2. Update any candidates as needed
`); 