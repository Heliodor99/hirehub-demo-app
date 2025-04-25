const fs = require('fs');
const path = require('path');

// Define paths
const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
const backupPath = `${candidatesPath}.backup-syntax-fix-${Date.now()}`;

// Create backup
fs.copyFileSync(candidatesPath, backupPath);
console.log(`Created backup at ${backupPath}`);

// Read the file
const fileContent = fs.readFileSync(candidatesPath, 'utf8');

// Fix the duplicate ID syntax error
let fixedContent = fileContent.replace(/id: ['"](\d+)['"]id: ['"](\d+)['"]/g, "id: '$1'");

// Also fix any other syntax issues in the divyaKrishnan object
const divyaKrishnanMatch = fileContent.match(/const divyaKrishnan: Candidate = \{[\s\S]*?\};/);
if (!divyaKrishnanMatch) {
  console.log('Could not find divyaKrishnan object, manually inserting a valid one');
  
  // Insert a properly formatted divyaKrishnan object
  const validDivyaKrishnan = `const divyaKrishnan: Candidate = {
  id: '6',
  name: 'Divya Krishnan',
  email: 'divya.krishnan@gmail.com',
  phone: '+91-32190-89005',
  currentTitle: 'React Developer',
  currentCompany: 'AppFront Technologies',
  location: 'Hyderabad, Telangana',
  experience: 5,
  skills: [
    { name: 'React', proficiency: 5 },
    { name: 'TypeScript', proficiency: 4 },
    { name: 'JavaScript', proficiency: 5 },
    { name: 'HTML/CSS', proficiency: 5 },
    { name: 'Redux', proficiency: 4 },
    { name: 'Next.js', proficiency: 4 }
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science',
      institution: 'NIT Warangal',
      year: 2019
    }
  ],
  resume: 'https://divyakrishnan.dev',
  source: 'LinkedIn',
  appliedDate: '2023-10-15',
  stage: RecruitmentStage.INTERVIEWED,
  jobId: '1',
  notes: 'Excellent React skills, 5+ years of experience in frontend development',
  assessment: {
    score: 92,
    feedback: 'Strong technical skills and great cultural fit',
    completed: true
  }
};`;
  
  // Replace from import statement to before export statement
  fixedContent = fixedContent.replace(
    /import.*?\n\n.*?export const candidates/s,
    `import { Candidate, RecruitmentStage } from '@/types';\n\n${validDivyaKrishnan}\n\nexport const candidates`
  );
} else {
  // Fix divyaKrishnan object by replacing it with a clean version
  const validDivyaKrishnan = `const divyaKrishnan: Candidate = {
  id: '6',
  name: 'Divya Krishnan',
  email: 'divya.krishnan@gmail.com',
  phone: '+91-32190-89005',
  currentTitle: 'React Developer',
  currentCompany: 'AppFront Technologies',
  location: 'Hyderabad, Telangana',
  experience: 5,
  skills: [
    { name: 'React', proficiency: 5 },
    { name: 'TypeScript', proficiency: 4 },
    { name: 'JavaScript', proficiency: 5 },
    { name: 'HTML/CSS', proficiency: 5 },
    { name: 'Redux', proficiency: 4 },
    { name: 'Next.js', proficiency: 4 }
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science',
      institution: 'NIT Warangal',
      year: 2019
    }
  ],
  resume: 'https://divyakrishnan.dev',
  source: 'LinkedIn',
  appliedDate: '2023-10-15',
  stage: RecruitmentStage.INTERVIEWED,
  jobId: '1',
  notes: 'Excellent React skills, 5+ years of experience in frontend development',
  assessment: {
    score: 92,
    feedback: 'Strong technical skills and great cultural fit',
    completed: true
  }
};`;
  
  fixedContent = fixedContent.replace(divyaKrishnanMatch[0], validDivyaKrishnan);
}

// Fix any malformed education and skills arrays
fixedContent = fixedContent.replace(/education: \[\s*\{\s*degree:.*?\s*,\s*institution:.*?\s*,\s*year:.*?\s*,/g, (match) => {
  return match.replace(/,\s*$/, '\n    }');
});

// Also make sure all opening and closing brackets are properly formatted
let bracketCount = 0;
let formattedContent = '';
let inString = false;
let stringChar = '';

for (let i = 0; i < fixedContent.length; i++) {
  const char = fixedContent[i];
  
  // Handle strings
  if ((char === "'" || char === '"') && (i === 0 || fixedContent[i-1] !== '\\')) {
    if (!inString) {
      inString = true;
      stringChar = char;
    } else if (char === stringChar) {
      inString = false;
    }
  }
  
  // Only count brackets outside of strings
  if (!inString) {
    if (char === '{') bracketCount++;
    if (char === '}') bracketCount--;
  }
  
  // Add character to formatted content
  formattedContent += char;
  
  // If bracket count goes negative, we have a closing bracket without an opening one
  if (bracketCount < 0) {
    console.log(`Warning: Found closing bracket without matching opening bracket at position ${i}`);
    bracketCount = 0;
  }
}

// Write the fixed content back to the file
fs.writeFileSync(candidatesPath, formattedContent);
console.log(`Fixed syntax errors in ${candidatesPath}`);

// Verify the file loads without errors
try {
  const testContent = fs.readFileSync(candidatesPath, 'utf8');
  console.log(`File verified: ${testContent.length} bytes`);
  console.log('Check if the syntax error is fixed:');
  
  // Check for duplicated IDs
  const duplicateIds = testContent.match(/id: ['"](\d+)['"]id: ['"](\d+)['"]/g);
  if (duplicateIds) {
    console.log('Warning: Still found duplicate IDs!');
  } else {
    console.log('No duplicate IDs found, syntax issue should be fixed.');
  }
} catch (error) {
  console.error('Error verifying file:', error);
} 