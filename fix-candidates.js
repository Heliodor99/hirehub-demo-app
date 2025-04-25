const fs = require('fs');
const path = require('path');

const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
let content = fs.readFileSync(candidatesPath, 'utf8');

// Fix the end of the file, replacing '];%' with '];'
content = content.replace(/];%\s*$/, '];');

// Write the fixed content back to the file
fs.writeFileSync(candidatesPath, content, 'utf8');

console.log('Fixed the end of candidates.ts file'); 