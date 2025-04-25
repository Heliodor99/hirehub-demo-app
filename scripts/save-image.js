/**
 * This script saves the recruiter image to the public folder
 * Run with: node scripts/save-image.js
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

// URL of the recruiter image (using a sample image URL since we can't get the image directly from chat)
const imageUrl = 'https://raw.githubusercontent.com/vercel/next.js/canary/examples/cms-wordpress/public/favicon/favicon.ico';

// Destination path in the public folder
const destinationDir = path.join(__dirname, '../public/images');
const destinationPath = path.join(destinationDir, 'recruiter.png');

// Create the directory if it doesn't exist
if (!fs.existsSync(destinationDir)) {
  fs.mkdirSync(destinationDir, { recursive: true });
  console.log(`Created directory: ${destinationDir}`);
}

// Download the image
console.log(`Downloading image from ${imageUrl}...`);
https.get(imageUrl, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download image. Status code: ${response.statusCode}`);
    return;
  }

  const fileStream = fs.createWriteStream(destinationPath);
  response.pipe(fileStream);

  fileStream.on('finish', () => {
    fileStream.close();
    console.log(`✅ Image saved to ${destinationPath}`);
    console.log(`You can use it in your components with:`);
    console.log(`<img src="/images/recruiter.png" alt="Recruiter" />`);
    console.log(`Or with Next.js Image component:`);
    console.log(`<Image src="/images/recruiter.png" alt="Recruiter" width={400} height={400} />`);
  });

  fileStream.on('error', (err) => {
    console.error(`Error saving the image: ${err.message}`);
  });
}).on('error', (err) => {
  console.error(`Error downloading the image: ${err.message}`);
}); 