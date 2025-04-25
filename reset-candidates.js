const fs = require('fs');
const path = require('path');

console.log('Creating a clean candidates.ts file with proper interview data...');

// Define the stages that should have interview data
const stagesWithInterviews = ['INTERVIEWED', 'OFFER_EXTENDED', 'OFFER_REJECTED', 'HIRED'];

// Read the current candidates.ts file to extract stage data
const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
const backupPath = path.join(__dirname, 'src', 'data', 'candidates.ts.backup');

// First make a backup
fs.copyFileSync(candidatesPath, backupPath);
console.log(`Backup created: ${backupPath}`);

// Try to extract the candidates array
const candidatesContent = fs.readFileSync(candidatesPath, 'utf8');

console.log('Reading current candidates content...');
// Get all candidates
const regexCandidates = /export const candidates: Candidate\[\] = \[([\s\S]*)\];/;
const candidatesMatch = candidatesContent.match(regexCandidates);

if (!candidatesMatch) {
  console.error('Failed to extract candidates array. Terminating without changes.');
  process.exit(1);
}

// Split into individual candidate objects
const candidateObjectsText = candidatesMatch[1].split(/},\s*{/g);
console.log(`Found ${candidateObjectsText.length} candidate entries`);

// Function to clean and reconstruct a candidate object
function reconstructCandidate(candidateText) {
  if (!candidateText.trim()) return null;
  
  // Add opening/closing braces if missing
  if (!candidateText.trim().startsWith('{')) {
    candidateText = '{' + candidateText;
  }
  if (!candidateText.trim().endsWith('}')) {
    candidateText = candidateText + '}';
  }
  
  // Try to extract basic information
  const idMatch = candidateText.match(/id: ['"]([^'"]*)['"]/);
  const nameMatch = candidateText.match(/name: ['"]([^'"]*)['"]/);
  const stageMatch = candidateText.match(/stage: RecruitmentStage\.([A-Z_]+)/);
  
  if (!idMatch || !nameMatch || !stageMatch) {
    console.warn('Skipping incomplete candidate entry');
    return null;
  }
  
  // Extract skills
  const skills = [];
  const skillsMatch = candidateText.match(/skills: \[([\s\S]*?)\]/);
  if (skillsMatch) {
    const skillItems = skillsMatch[1].match(/['"](.*?)['"](?:,|\s*})/g);
    if (skillItems) {
      skillItems.forEach(skillItem => {
        const skill = skillItem.match(/['"]([^'"]*)['"]/);
        if (skill) {
          skills.push(skill[1]);
        }
      });
    }
  }
  
  // Extract other properties
  const emailMatch = candidateText.match(/email: ['"]([^'"]*)['"]/);
  const phoneMatch = candidateText.match(/phone: ['"]([^'"]*)['"]/);
  const currentTitleMatch = candidateText.match(/currentTitle: ['"]([^'"]*)['"]/);
  const currentCompanyMatch = candidateText.match(/currentCompany: ['"]([^'"]*)['"]/);
  const locationMatch = candidateText.match(/location: ['"]([^'"]*)['"]/);
  const experienceMatch = candidateText.match(/experience: ([0-9]+)/);
  const jobIdMatch = candidateText.match(/jobId: ['"]([^'"]*)['"]/);
  
  // Build a clean candidate object
  const cleanCandidate = {
    id: idMatch[1],
    name: nameMatch[1],
    email: emailMatch ? emailMatch[1] : `${nameMatch[1].toLowerCase().replace(/\s+/g, '.')}@example.com`,
    phone: phoneMatch ? phoneMatch[1] : '+91-' + Math.floor(10000000000 + Math.random() * 90000000000),
    currentTitle: currentTitleMatch ? currentTitleMatch[1] : 'Software Developer',
    currentCompany: currentCompanyMatch ? currentCompanyMatch[1] : 'Tech Solutions Inc',
    location: locationMatch ? locationMatch[1] : 'Bangalore, Karnataka',
    experience: experienceMatch ? parseInt(experienceMatch[1]) : Math.floor(Math.random() * 10) + 2,
    skills: skills.length > 0 ? skills : ['JavaScript', 'React', 'Node.js'],
    stage: stageMatch[1],
    jobId: jobIdMatch ? jobIdMatch[1] : '1'
  };
  
  // Determine if this candidate should have interview data
  if (stagesWithInterviews.includes(cleanCandidate.stage)) {
    const id = cleanCandidate.id;
    const name = cleanCandidate.name;
    const stage = cleanCandidate.stage;
    
    const isHired = stage === 'HIRED';
    const isOfferStage = stage === 'OFFER_EXTENDED' || stage === 'OFFER_REJECTED';
    
    const score = isHired ? 98 : (isOfferStage ? 94 : 91);
    
    cleanCandidate.interview = {
      id: parseInt(id),
      candidate: {
        name: name,
        position: "Software Developer"
      },
      date: `2024-04-${Math.floor(Math.random() * 30) + 1}`,
      time: "10:00 AM",
      type: "Technical",
      status: "Completed",
      interviewers: ["Interviewer 1", "Interviewer 2"],
      location: "Virtual/Zoom",
      transcript: [
        {
          timestamp: "10:00:00",
          speaker: "Interviewer",
          content: "Could you tell us about your relevant experience?"
        },
        {
          timestamp: "10:01:00",
          speaker: "Candidate",
          content: "I have several years of experience in this field working on various projects."
        },
        {
          timestamp: "10:02:00",
          speaker: "Interviewer",
          content: "How would you approach problem-solving in our tech stack?"
        },
        {
          timestamp: "10:03:00",
          speaker: "Candidate",
          content: "I believe in a methodical approach, starting with understanding the requirements, breaking down the problem, and implementing solutions iteratively."
        }
      ],
      aiAssessment: {
        overallScore: score,
        categoryScores: {
          technical: score + Math.floor(Math.random() * 4 - 2),
          communication: score + Math.floor(Math.random() * 4 - 2),
          problemSolving: score + Math.floor(Math.random() * 4 - 2),
          culturalFit: score + Math.floor(Math.random() * 4 - 2)
        },
        strengths: [
          "Strong technical knowledge",
          "Clear communication",
          "Excellent problem-solving approach"
        ],
        areasForImprovement: [
          isHired ? "Minor improvements in documentation" : "Could provide more specific examples",
          isHired ? "Could further develop mentoring skills" : "Consider more varied test approaches"
        ],
        recommendations: [
          isHired ? "Excellent candidate, recommend hiring" : "Candidate shows strong potential for the role"
        ]
      },
      humanFeedback: {
        score: score - 1,
        notes: "Demonstrated strong technical skills and good problem-solving abilities.",
        nextSteps: stage === 'INTERVIEWED' ? "Schedule follow-up interview" : "Proceed with offer discussion",
        decision: stage === 'INTERVIEWED' ? "Further Evaluation" : (isHired ? "Hire" : "Further Evaluation")
      }
    };
  }
  
  return cleanCandidate;
}

// Process each candidate entry
const cleanCandidates = [];
candidateObjectsText.forEach((candidateText, index) => {
  console.log(`Processing candidate ${index + 1}/${candidateObjectsText.length}...`);
  const cleanCandidate = reconstructCandidate(candidateText);
  if (cleanCandidate) {
    cleanCandidates.push(cleanCandidate);
  }
});

console.log(`Successfully processed ${cleanCandidates.length} candidates`);

// Count stages in result
const stageCounts = {};
cleanCandidates.forEach(candidate => {
  stageCounts[candidate.stage] = (stageCounts[candidate.stage] || 0) + 1;
});

console.log('\nCandidate distribution by stage:');
console.log(stageCounts);

// Count interviews
const interviewCount = cleanCandidates.filter(c => c.interview).length;
console.log(`\nCandidates with interview data: ${interviewCount}`);

// Create the new file content
const newContent = `import { Candidate, RecruitmentStage } from '@/types';

export const candidates: Candidate[] = ${JSON.stringify(cleanCandidates, null, 2)};
`;

// Write the clean file
fs.writeFileSync(candidatesPath, newContent, 'utf8');

console.log(`
Clean candidates.ts file created successfully!
=============================================
- Total candidates: ${cleanCandidates.length}
- With interview data: ${interviewCount}
- Original file backed up to: ${backupPath}
`); 