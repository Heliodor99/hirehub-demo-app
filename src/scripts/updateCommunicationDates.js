// Script to ensure communication timeline dates stay within recent timeframes
const fs = require('fs');
const path = require('path');

// Path to the communication.ts file
const communicationPath = path.resolve(__dirname, '../utils/communication.ts');

// Read the file
try {
  let fileContent = fs.readFileSync(communicationPath, 'utf8');
  
  // Update the outreach date logic to ensure dates stay recent
  let updatedContent = fileContent.replace(
    /const startDate = addDays\(applicationDate, (-?\d+)\);/g,
    `// Start date will be 14 days before application date for outreach
  // But ensure we're not generating dates too far in the past
  const today = new Date();
  const sixtyDaysAgo = new Date(today);
  sixtyDaysAgo.setDate(today.getDate() - 60);
  
  // For outreach, go back 14 days from application date, but no earlier than 60 days ago
  let startDate = addDays(applicationDate, -14);
  if (startDate < sixtyDaysAgo) {
    startDate = new Date(sixtyDaysAgo);
  }`
  );
  
  // Update the follow-up message timing to respect application date
  updatedContent = updatedContent.replace(
    /currentDate = addDays\(currentDate, 3\);/,
    `// Make sure follow-up doesn't go beyond application date
    if (addDays(currentDate, 3) < applicationDate) {
      currentDate = addDays(currentDate, 3);
    } else {
      currentDate = addDays(applicationDate, -1); // One day before application
    }`
  );
  
  // Update the third message timing for HireHub sources
  updatedContent = updatedContent.replace(
    /currentDate = addDays\(currentDate, 4\);/,
    `// Ensure third message doesn't exceed application date
    if (addDays(currentDate, 4) < applicationDate) {
      currentDate = addDays(currentDate, 4);
    } else {
      currentDate = new Date(applicationDate); // Use application date
    }`
  );
  
  // Update interview date logic to stay within a reasonable timeframe
  updatedContent = updatedContent.replace(
    /const interviewDate = addDays\(currentDate, 3\);/,
    `// Ensure interview date is reasonable and recent
    const maxInterviewDate = addDays(new Date(), -3); // No more than 3 days ago
    const suggestedInterviewDate = addDays(currentDate, 3);
    const interviewDate = suggestedInterviewDate > maxInterviewDate ? suggestedInterviewDate : maxInterviewDate;`
  );
  
  // Save the updated file
  fs.writeFileSync(communicationPath, updatedContent);
  
  console.log(`Successfully updated communication timeline date logic to ensure recent dates.`);
  
} catch (error) {
  console.error('Error updating communication dates:', error);
} 