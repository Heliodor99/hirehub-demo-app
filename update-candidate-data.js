const fs = require('fs');
const path = require('path');

// Path to the candidates.ts file
const candidatesFilePath = path.join(__dirname, 'src', 'data', 'candidates.ts');

// Read the file
let fileContent = fs.readFileSync(candidatesFilePath, 'utf8');

// Function to generate proper Indian mobile number
function generateIndianMobileNumber() {
  // Indian mobile numbers typically start with 6, 7, 8, or 9
  const prefixes = ['6', '7', '8', '9'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  
  // Generate remaining 9 digits
  let number = prefix;
  for (let i = 0; i < 9; i++) {
    number += Math.floor(Math.random() * 10);
  }
  
  // Format: +91 XXXXX XXXXX
  return `+91 ${number.substring(0, 5)} ${number.substring(5)}`;
}

// Modify the file content directly
const updatedContent = fileContent
  // Replace example.com email addresses with company-specific ones
  .replace(/email: ['"]([a-zA-Z0-9._-]+)@example\.com['"],/g, (match, username, offset) => {
    // Find the corresponding company name (look ahead in the file after the email)
    const nextLines = fileContent.substring(offset, offset + 500);
    const companyMatch = nextLines.match(/currentCompany: ['"]([^'"]+)['"]/);
    
    if (companyMatch) {
      let companyName = companyMatch[1];
      
      // Clean up the company name
      companyName = companyName
        .replace(/\s+(Inc|Ltd|LLC|Corporation|Technologies|Solutions|Tech)\.?$/i, '')
        .replace(/\s+/g, '')
        .toLowerCase();
      
      return `email: '${username}@${companyName}.com',`;
    }
    
    // Fallback
    return `email: '${username}@techhire.com',`;
  })
  
  // Replace example.com resume URLs
  .replace(/resume: ['"]https:\/\/example\.com\/([^'"]+)['"]/g, 
          `resume: 'https://resumes.hirehub.ai/$1'`)
  
  // Fix phone numbers to use valid Indian format
  .replace(/phone: ['"][+]91[^'"]+['"]/g, () => 
          `phone: '${generateIndianMobileNumber()}'`);

// Write the updated content back to the file
fs.writeFileSync(candidatesFilePath, updatedContent, 'utf8');

// Verify the changes
const verifyContent = fs.readFileSync(candidatesFilePath, 'utf8');

// Count replacements
const exampleEmailCount = (verifyContent.match(/@example\.com/g) || []).length;
const exampleResumeCount = (verifyContent.match(/example\.com\/.*resume/g) || []).length;

console.log('✅ Successfully updated candidate data:');
console.log(`- Replaced email addresses with company domains (${exampleEmailCount === 0 ? 'SUCCESS' : `${exampleEmailCount} remaining`})`);
console.log(`- Updated resume URLs to use hirehub.ai domain (${exampleResumeCount === 0 ? 'SUCCESS' : `${exampleResumeCount} remaining`})`);
console.log('- Fixed phone numbers to use valid Indian mobile format'); 