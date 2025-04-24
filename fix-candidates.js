const fs = require('fs');
const path = require('path');

const candidatesFilePath = path.join(__dirname, 'src', 'data', 'candidates.ts');

// Generate a random Indian mobile number
function generateIndianMobileNumber() {
  const prefix = ['6', '7', '8', '9'][Math.floor(Math.random() * 4)];
  let number = '';
  for (let i = 0; i < 9; i++) {
    number += Math.floor(Math.random() * 10);
  }
  return `+91 ${prefix}${number.substring(0, 4)} ${number.substring(4)}`;
}

// Read the file
fs.readFile(candidatesFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // 1. Replace example.com email addresses
  let modified = data.replace(/sarah\.johnson@example\.com/g, 'sarah.johnson@techsolutions.com')
                     .replace(/raj\.sharma@example\.com/g, 'raj.sharma@globaltech.com')
                     .replace(/amit\.patel@example\.com/g, 'amit.patel@techinnovate.com')
                     .replace(/priya\.gupta@example\.com/g, 'priya.gupta@ailabs.com')
                     .replace(/vikram\.m@example\.com/g, 'vikram.m@techcorp.com');

  // 2. Replace example.com resume URLs
  modified = modified.replace(/https:\/\/example\.com\/([a-z-]+)-resume/g, 'https://resumes.hirehub.ai/$1-resume');

  // 3. Replace phone numbers with valid Indian format
  const phoneRegex = /phone: ['"](\+91[^'"]+)['"]/g;
  const phones = [];
  
  // First, collect all existing phone numbers
  let match;
  while ((match = phoneRegex.exec(data)) !== null) {
    phones.push(match[0]);
  }
  
  // Then replace each one with a new valid phone number
  phones.forEach(phone => {
    modified = modified.replace(phone, `phone: '${generateIndianMobileNumber()}'`);
  });

  // Write the modified content back to the file
  fs.writeFile(candidatesFilePath, modified, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('✅ Successfully updated candidate data:');
    console.log('- Replaced example.com emails with company domain emails');
    console.log('- Updated resume URLs to use hirehub.ai domain');
    console.log('- Fixed phone numbers to use valid Indian mobile format');
  });
}); 