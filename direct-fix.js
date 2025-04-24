const fs = require('fs');
const path = require('path');

const candidatesFilePath = path.join(__dirname, 'src', 'data', 'candidates.ts');

try {
  // Read file content synchronously
  let content = fs.readFileSync(candidatesFilePath, 'utf8');
  console.log('File read successfully, updating data...');

  // Generate random Indian phone numbers
  const phoneNumbers = [];
  for (let i = 0; i < 10; i++) {
    const prefix = ['6', '7', '8', '9'][Math.floor(Math.random() * 4)];
    let number = '';
    for (let j = 0; j < 9; j++) {
      number += Math.floor(Math.random() * 10);
    }
    phoneNumbers.push(`+91 ${prefix}${number.slice(0, 4)} ${number.slice(4)}`);
  }
  
  // Replace specific strings
  content = content
    // Emails
    .replace(/sarah\.johnson@example\.com/g, 'sarah.johnson@techsolutions.com')
    .replace(/raj\.sharma@example\.com/g, 'raj.sharma@globaltech.com')
    .replace(/amit\.patel@example\.com/g, 'amit.patel@techinnovate.com')
    .replace(/priya\.gupta@example\.com/g, 'priya.gupta@ailabs.com')
    .replace(/vikram\.m@example\.com/g, 'vikram.m@techcorp.com')
    
    // Resume URLs
    .replace(/https:\/\/example\.com\/sarah-johnson-resume/g, 'https://resumes.hirehub.ai/sarah-johnson-resume')
    .replace(/https:\/\/example\.com\/raj-sharma-resume/g, 'https://resumes.hirehub.ai/raj-sharma-resume')
    .replace(/https:\/\/example\.com\/amit-patel-resume/g, 'https://resumes.hirehub.ai/amit-patel-resume')
    .replace(/https:\/\/example\.com\/priya-gupta-resume/g, 'https://resumes.hirehub.ai/priya-gupta-resume')
    .replace(/https:\/\/example\.com\/vikram-resume/g, 'https://resumes.hirehub.ai/vikram-resume')
    .replace(/https:\/\/example\.com\/divya-krishnan-resume/g, 'https://resumes.hirehub.ai/divya-krishnan-resume')
    
    // Phone numbers
    .replace(/phone: '\+91-32190-89005'/g, `phone: '${phoneNumbers[0]}'`)
    .replace(/phone: '\+91 9876543210'/g, `phone: '${phoneNumbers[1]}'`)
    .replace(/phone: '\+91 9876543211'/g, `phone: '${phoneNumbers[2]}'`)
    .replace(/phone: '\+91 9876543212'/g, `phone: '${phoneNumbers[3]}'`)
    .replace(/phone: '\+91 9876543213'/g, `phone: '${phoneNumbers[4]}'`)
    .replace(/phone: '\+91 9876543214'/g, `phone: '${phoneNumbers[5]}'`);

  // Write changes back to file synchronously
  fs.writeFileSync(candidatesFilePath, content, 'utf8');
  console.log('✅ Successfully updated candidate data:');
  console.log('- Replaced example.com emails with company domain emails');
  console.log('- Updated resume URLs to use hirehub.ai domain');
  console.log('- Fixed phone numbers to use valid Indian mobile format');
  
  // Verify changes were applied
  const newContent = fs.readFileSync(candidatesFilePath, 'utf8');
  const verifyEmails = !newContent.includes('@example.com');
  const verifyResumes = !newContent.includes('example.com/');
  const verifyPhones = !newContent.includes('+91 9876');
  
  console.log('\nVerification:');
  console.log(`- Email replacement: ${verifyEmails ? 'SUCCESS' : 'FAILED'}`);
  console.log(`- Resume URL replacement: ${verifyResumes ? 'SUCCESS' : 'FAILED'}`);
  console.log(`- Phone number replacement: ${verifyPhones ? 'SUCCESS' : 'FAILED'}`);
  
} catch (err) {
  console.error('Error updating file:', err);
} 