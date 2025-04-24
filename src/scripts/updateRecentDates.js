// Script to update all dates to be within the last two months
const fs = require('fs');
const path = require('path');

// Path to the jobs.ts file
const jobsPath = path.resolve(__dirname, '../data/jobs.ts');

// Read the file
try {
  let fileContent = fs.readFileSync(jobsPath, 'utf8');
  
  // Set a fixed current date in 2024 (to avoid future dates)
  const currentDate = new Date('2024-04-24');
  const twoMonthsAgo = new Date('2024-02-24');
  
  console.log(`Updating dates to be between ${twoMonthsAgo.toISOString().split('T')[0]} and ${currentDate.toISOString().split('T')[0]}`);
  
  // Function to generate a random date between two dates
  const randomDateBetween = (start, end) => {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    const randomDate = new Date(randomTime);
    return randomDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };
  
  // Update job posting dates
  const jobPostedDatePattern = /postedDate: ['"](\d{4}-\d{2}-\d{2})['"]/g;
  fileContent = fileContent.replace(jobPostedDatePattern, (match) => {
    const newDate = randomDateBetween(twoMonthsAgo, currentDate);
    return `postedDate: '${newDate}'`;
  });
  
  console.log('Updated job posting dates');
  
  // Update candidate application dates
  const appliedDatePattern = /appliedDate: ['"](\d{4}-\d{2}-\d{2})['"]/g;
  
  // Count how many application dates we'll update
  const applicationDates = fileContent.match(appliedDatePattern) || [];
  const applicationDatesCount = applicationDates.length;
  
  console.log(`Found ${applicationDatesCount} application dates to update`);
  
  // Replace all application dates to be within the last two months
  // For realism, make the application dates vary
  fileContent = fileContent.replace(appliedDatePattern, (match) => {
    const newDate = randomDateBetween(twoMonthsAgo, currentDate);
    return `appliedDate: '${newDate}'`;
  });
  
  // Update lastUpdated dates if they exist
  const lastUpdatedPattern = /lastUpdated: ['"](\d{4}-\d{2}-\d{2})['"]/g;
  fileContent = fileContent.replace(lastUpdatedPattern, (match) => {
    const newDate = randomDateBetween(twoMonthsAgo, currentDate);
    return `lastUpdated: '${newDate}'`;
  });
  
  // Save the updated file
  fs.writeFileSync(jobsPath, fileContent);
  
  console.log(`Successfully updated all dates to be within the last two months.`);
  console.log(`- Updated ${applicationDatesCount} application dates`);
  console.log(`- Updated job posting dates`);
  console.log(`- Updated lastUpdated dates`);
  
} catch (error) {
  console.error('Error updating dates:', error);
} 