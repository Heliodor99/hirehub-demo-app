const fs = require('fs');
const path = require('path');
require('ts-node').register();
const { jobs } = require('../src/data/jobs.ts');
const { generateCommunicationTimeline } = require('../src/utils/communication.ts');
const { RecruitmentStage } = require('../src/types/index.ts');

// Helper function to generate a random time between 9 AM and 6 PM
const getRandomTime = () => {
  const hours = Math.floor(Math.random() * (18 - 9) + 9);
  const minutes = Math.floor(Math.random() * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Helper function to add days to a date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Helper function to format date to ISO string without time
const formatDate = (date) => date.toISOString().split('T')[0];

// Main function to update candidates with communication history
const updateCandidatesWithCommunication = () => {
  try {
    // Find the job for each candidate and generate their communication timeline
    candidates.forEach(candidate => {
      const job = jobs.find(j => j.id === candidate.jobId);
      if (!job) {
        console.warn(`No job found for candidate ${candidate.name} with jobId ${candidate.jobId}`);
        return;
      }
      
      // Generate communication timeline
      const timeline = generateCommunicationTimeline(candidate, job);
      candidate.communicationTimeline = timeline;
    });

    // Read the entire file content
    const filePath = path.join(__dirname, '../src/data/jobs.ts');
    let content = fs.readFileSync(filePath, 'utf8');

    // Find the candidates array in the content
    const candidatesMatch = content.match(/export const candidates: Candidate\[\] = \[([\s\S]*?)\];/);
    if (!candidatesMatch) {
      throw new Error('Could not find candidates array in jobs.ts');
    }

    // Replace the old candidates array with the updated one
    const updatedCandidatesStr = `export const candidates: Candidate[] = ${JSON.stringify(candidates, null, 2)};`;
    content = content.replace(/export const candidates: Candidate\[\] = \[([\s\S]*?)\];/, updatedCandidatesStr);

    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${candidates.length} candidates with communication history`);
  } catch (error) {
    console.error('Error processing candidates:', error);
  }
};

// Run the update
updateCandidatesWithCommunication(); 