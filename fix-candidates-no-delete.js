const fs = require('fs');
const path = require('path');

console.log('Fixing candidates.ts file and interview data without losing entries...');

// Define the stages that should have interview data
const stagesWithInterviews = ['INTERVIEWED', 'OFFER_EXTENDED', 'OFFER_REJECTED', 'HIRED'];

// Read the current candidates.ts file
const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
const backupPath = path.join(__dirname, 'src', 'data', 'candidates.ts.backup-before-fix');

// Make a backup in case something goes wrong
fs.copyFileSync(candidatesPath, backupPath);
console.log(`Backup created: ${backupPath}`);

// Read the file content
let candidatesContent = fs.readFileSync(candidatesPath, 'utf8');

// First, extract the content before and after the candidates array
const beforeMatch = candidatesContent.match(/([\s\S]*?)export const candidates: Candidate\[\] = \[/);
const afterMatch = candidatesContent.match(/\];([\s\S]*)/);

if (!beforeMatch || !afterMatch) {
  console.error('Could not locate candidates array structure. Exiting without changes.');
  process.exit(1);
}

const beforeContent = beforeMatch[1];
const afterContent = afterMatch[1];

// Now extract all candidate objects
let candidatesText = candidatesContent.replace(beforeContent, '').replace(`];${afterContent}`, '').trim();
candidatesText = candidatesText.replace(/^export const candidates: Candidate\[\] = \[/, '');

console.log('Locating all candidate entries...');

// Split into candidate objects (this approach handles nested arrays/objects better)
let candidateObjects = [];
let currentObject = '';
let braceCount = 0;
let inObject = false;

for (let i = 0; i < candidatesText.length; i++) {
  const char = candidatesText[i];
  
  // Track opening and closing braces to identify objects
  if (char === '{') {
    if (!inObject) inObject = true;
    braceCount++;
    currentObject += char;
  } else if (char === '}') {
    braceCount--;
    currentObject += char;
    
    // When a top-level object is closed, save it
    if (braceCount === 0 && inObject) {
      candidateObjects.push(currentObject.trim());
      currentObject = '';
      inObject = false;
      
      // Skip the comma after the object
      if (i + 1 < candidatesText.length && candidatesText[i + 1] === ',') {
        i++;
      }
    }
  } else if (inObject) {
    currentObject += char;
  }
}

console.log(`Found ${candidateObjects.length} candidate objects to process`);

// Process each candidate object to ensure it's complete and has the right data
const fixedObjects = [];
const skippedIds = [];
let totalFixed = 0;

for (let i = 0; i < candidateObjects.length; i++) {
  console.log(`Processing candidate ${i+1}/${candidateObjects.length}...`);
  let candidateObj = candidateObjects[i];
  
  // Find key identifiers
  const idMatch = candidateObj.match(/id:\s*['"]([^'"]*)['"]/);
  const stageMatch = candidateObj.match(/stage:\s*RecruitmentStage\.([A-Z_]+)/);
  
  if (!idMatch || !stageMatch) {
    console.log(`Candidate ${i+1} is missing ID or stage, attempting to repair...`);
    
    // Add missing ID if needed
    if (!idMatch) {
      const randomId = `auto_${Math.floor(Math.random() * 10000)}`;
      candidateObj = candidateObj.replace(/{/, `{\n  id: "${randomId}",`);
      console.log(`  - Added auto-generated ID: ${randomId}`);
    }
    
    // Add missing stage if needed
    if (!stageMatch) {
      candidateObj = candidateObj.replace(/}$/, `,\n  stage: RecruitmentStage.APPLIED\n}`);
      console.log('  - Added default stage: APPLIED');
    }
    
    totalFixed++;
  }
  
  // Re-check after fixes
  const reIdMatch = candidateObj.match(/id:\s*['"]([^'"]*)['"]/);
  const reStageMatch = candidateObj.match(/stage:\s*RecruitmentStage\.([A-Z_]+)/);
  
  if (!reIdMatch || !reStageMatch) {
    console.log(`Couldn't repair candidate ${i+1}, skipping`);
    skippedIds.push(i+1);
    continue;
  }
  
  const id = reIdMatch[1];
  const stage = reStageMatch[1];
  
  // Check if name is present, fix if missing
  if (!candidateObj.match(/name:\s*['"]/)) {
    candidateObj = candidateObj.replace(/id:/, `name: "Candidate ${id}",\n  id:`);
    totalFixed++;
    console.log(`  - Added missing name for ID ${id}`);
  }
  
  // Clean up any broken structure (look for unclosed arrays/objects)
  if ((candidateObj.match(/{/g) || []).length !== (candidateObj.match(/}/g) || []).length) {
    console.log(`  - Fixing unclosed braces for candidate ${id}`);
    
    // Count opening/closing braces
    const openBraces = (candidateObj.match(/{/g) || []).length;
    const closeBraces = (candidateObj.match(/}/g) || []).length;
    
    if (openBraces > closeBraces) {
      // Add missing closing braces
      candidateObj += '}'.repeat(openBraces - closeBraces);
    } else if (closeBraces > openBraces) {
      // Add missing opening braces at the beginning
      candidateObj = '{'.repeat(closeBraces - openBraces) + candidateObj;
    }
    
    totalFixed++;
  }
  
  // Check if this candidate should have interview data
  const shouldHaveInterview = stagesWithInterviews.includes(stage);
  const hasInterview = candidateObj.includes('interview:');
  
  // Fix interview data if needed
  if (shouldHaveInterview && !hasInterview) {
    console.log(`  - Adding missing interview data for ${id} (${stage})`);
    
    // Get name from candidate
    const nameMatch = candidateObj.match(/name:\s*['"]([^'"]*)['"]/);
    const name = nameMatch ? nameMatch[1] : `Candidate ${id}`;
    
    // Add interview data
    const isHired = stage === 'HIRED';
    const isOfferStage = stage === 'OFFER_EXTENDED' || stage === 'OFFER_REJECTED';
    const score = isHired ? 98 : (isOfferStage ? 94 : 91);
    
    // Add interview to the end of the object
    candidateObj = candidateObj.replace(/}$/, `,
  interview: {
    id: ${parseInt(id) || Math.floor(Math.random() * 1000)},
    candidate: {
      name: "${name}",
      position: "Software Developer"
    },
    date: "2024-04-${Math.floor(Math.random() * 30) + 1}",
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
      overallScore: ${score},
      categoryScores: {
        technical: ${score + Math.floor(Math.random() * 4 - 2)},
        communication: ${score + Math.floor(Math.random() * 4 - 2)},
        problemSolving: ${score + Math.floor(Math.random() * 4 - 2)},
        culturalFit: ${score + Math.floor(Math.random() * 4 - 2)}
      },
      strengths: [
        "Strong technical knowledge",
        "Clear communication",
        "Excellent problem-solving approach"
      ],
      areasForImprovement: [
        ${isHired ? '"Minor improvements in documentation"' : '"Could provide more specific examples"'},
        ${isHired ? '"Could further develop mentoring skills"' : '"Consider more varied test approaches"'}
      ],
      recommendations: [
        ${isHired ? '"Excellent candidate, recommend hiring"' : '"Candidate shows strong potential for the role"'}
      ]
    },
    humanFeedback: {
      score: ${score - 1},
      notes: "Demonstrated strong technical skills and good problem-solving abilities.",
      nextSteps: "${stage === 'INTERVIEWED' ? 'Schedule follow-up interview' : 'Proceed with offer discussion'}",
      decision: "${stage === 'INTERVIEWED' ? 'Further Evaluation' : (isHired ? 'Hire' : 'Further Evaluation')}"
    }
  }
}`);
    totalFixed++;
  } else if (!shouldHaveInterview && hasInterview) {
    console.log(`  - Removing inappropriate interview data for ${id} (${stage})`);
    candidateObj = candidateObj.replace(/,\s*interview:\s*{[\s\S]*?}\s*(?=})/, '');
    totalFixed++;
  }
  
  // Add to fixed objects
  fixedObjects.push(candidateObj);
}

// Rebuild the candidates.ts file
const newContent = `${beforeContent}export const candidates: Candidate[] = [
  ${fixedObjects.join(',\n  ')}
];${afterContent}`;

// Write the fixed content
fs.writeFileSync(candidatesPath, newContent, 'utf8');

// Verify the results
// Count the stages in the new file for verification
const stageRegex = /stage:\s*RecruitmentStage\.([A-Z_]+)/g;
const stageMatches = [...newContent.matchAll(stageRegex)];

const stageCounts = {};
stageMatches.forEach(match => {
  const stage = match[1];
  stageCounts[stage] = (stageCounts[stage] || 0) + 1;
});

// Count interview data
const interviewMatches = newContent.match(/interview:\s*{/g) || [];
const interviewCount = interviewMatches.length;

console.log(`
Candidate File Fix Complete!
==========================
- Processed ${candidateObjects.length} candidates
- Fixed issues in ${totalFixed} candidates
- Skipped ${skippedIds.length} candidates that couldn't be repaired
- ${fixedObjects.length} candidates in the final file
- ${interviewCount} candidates have interview data

Current distribution by stage:
${Object.entries(stageCounts).map(([stage, count]) => `- ${stage}: ${count} candidates`).join('\n')}

Backup available at: ${backupPath}
`);

// If any entries were skipped, note them
if (skippedIds.length > 0) {
  console.log(`
Note: The following candidate entries (indices) could not be repaired:
${skippedIds.join(', ')}
You may want to check the backup file to recover any important data from these entries.
`);
} 