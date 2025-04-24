import { candidates } from '../data/jobs.js';
import { RecruitmentStage } from '../types/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get __dirname in ESM modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`Found ${candidates.length} candidates`);

// Number of candidates to update (70% of total)
const numberOfCandidatesToUpdate = Math.floor(candidates.length * 0.7);
console.log(`Will update ${numberOfCandidatesToUpdate} candidates to have source = 'HireHub'`);

// Keep track of which candidates were updated
const updatedIndices = new Set();

// Randomly select 70% of candidates
while (updatedIndices.size < numberOfCandidatesToUpdate) {
  const randomIndex = Math.floor(Math.random() * candidates.length);
  if (!updatedIndices.has(randomIndex)) {
    updatedIndices.add(randomIndex);
  }
}

// Update selected candidates
const updatedCandidates = candidates.map((candidate, index) => {
  if (updatedIndices.has(index)) {
    return {
      ...candidate,
      source: 'HireHub'
    };
  }
  return candidate;
});

console.log(`Updated ${updatedIndices.size} candidates to have source = 'HireHub'`);

// Count how many candidates we have in each group
const hireHubCount = updatedCandidates.filter(c => c.source === 'HireHub').length;
const otherSourcesCount = updatedCandidates.length - hireHubCount;

console.log(`HireHub sources: ${hireHubCount} (${(hireHubCount/updatedCandidates.length*100).toFixed(1)}%)`);
console.log(`Other sources: ${otherSourcesCount} (${(otherSourcesCount/updatedCandidates.length*100).toFixed(1)}%)`);

// For demonstration purposes, print 5 random examples of updated candidates
console.log('\nExamples of updated candidates:');
const examples = [...updatedIndices].slice(0, 5);
examples.forEach(index => {
  const candidate = updatedCandidates[index];
  console.log(`- ${candidate.name} (${candidate.id}): Source = ${candidate.source}`);
}); 