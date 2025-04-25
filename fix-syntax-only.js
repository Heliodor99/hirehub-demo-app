const fs = require('fs');
const path = require('path');

// Define paths
const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');

// Find the most recent non-clean backup
const candidatesDir = path.dirname(candidatesPath);
const backups = fs.readdirSync(candidatesDir)
  .filter(f => f.startsWith('candidates.ts.backup') && !f.includes('clean') && !f.includes('syntax'))
  .map(f => path.join(candidatesDir, f));

if (backups.length === 0) {
  console.error('No valid backup files found!');
  process.exit(1);
}

// Sort by creation time (newest first)
backups.sort((a, b) => {
  return fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime();
});

const backupPath = backups[0];
console.log(`Using backup: ${backupPath}`);

// Create a new backup of the current file
const newBackupPath = `${candidatesPath}.backup-syntax-fix-${Date.now()}`;
fs.copyFileSync(candidatesPath, newBackupPath);
console.log(`Created backup of current file at ${newBackupPath}`);

// Read the backup file
let content = fs.readFileSync(backupPath, 'utf8');
console.log(`Read backup file (${content.length} bytes)`);

// Fix the duplicate ID syntax error
content = content.replace(/id: ['"](\d+)['"]id: ['"](\d+)['"]/g, "id: '$1'");

// Fix missing commas before 'interview'
content = content.replace(/}\s+interview:/g, "}, interview:");

// Fix the divyaKrishnan object syntax
const divyaKrishnanObject = `const divyaKrishnan: Candidate = {
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

const divyaKrishnanMatch = content.match(/const divyaKrishnan: Candidate = \{[\s\S]*?\};/);
if (divyaKrishnanMatch) {
  content = content.replace(divyaKrishnanMatch[0], divyaKrishnanObject);
} else {
  console.log('divyaKrishnan object not found, will insert it');
  content = content.replace(/import.*?from.*?;/, `import { Candidate, RecruitmentStage } from '@/types';\n\n${divyaKrishnanObject}`);
}

// Fix any malformed education arrays
content = content.replace(/education: \[\s*\{\s*degree:.*?\s*,\s*institution:.*?\s*,\s*year:.*?\s*,/g, (match) => {
  return match.replace(/,\s*$/, '\n    }');
});

// Write the fixed content back to the file
fs.writeFileSync(candidatesPath, content);
console.log(`Fixed syntax errors in ${candidatesPath}`);

// Verify the content
try {
  const verifiedContent = fs.readFileSync(candidatesPath, 'utf8');
  
  // Count candidates
  const candidateMatches = verifiedContent.match(/id: ['"](\d+)['"]/g);
  const uniqueIds = new Set();
  if (candidateMatches) {
    candidateMatches.forEach(match => {
      const id = match.match(/['"](\d+)['"]/)[1];
      uniqueIds.add(id);
    });
  }
  
  console.log(`Verified file with ${uniqueIds.size} unique candidate IDs`);
  
  // Count INTERVIEWED candidates
  const interviewedCount = (verifiedContent.match(/stage: RecruitmentStage\.INTERVIEWED/g) || []).length;
  console.log(`INTERVIEWED candidates: ${interviewedCount}`);
  
  // Check for remaining syntax errors
  console.log('Checking for syntax errors:');
  const duplicateIdCheck = verifiedContent.match(/id: ['"](\d+)['"]id:/g);
  if (duplicateIdCheck) {
    console.log(`- Found ${duplicateIdCheck.length} instances of duplicate ID syntax`);
  } else {
    console.log('- No duplicate ID syntax errors');
  }
  
  const missingCommaCheck = verifiedContent.match(/}\s+\w+:/g);
  if (missingCommaCheck) {
    console.log(`- Found ${missingCommaCheck.length} instances of missing commas`);
  } else {
    console.log('- No missing comma errors');
  }
} catch (error) {
  console.error('Error verifying file:', error);
} 