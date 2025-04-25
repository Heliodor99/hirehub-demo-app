
const fs = require('fs');
const path = require('path');

// Restore from the specific backup
const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
const backupPath = '/Users/kaashika/hirehub-demo/src/data/candidates.ts.backup-simple-1745540402448';

if (fs.existsSync(backupPath)) {
  fs.copyFileSync(backupPath, candidatesPath);
  console.log('Restored candidates.ts from backup');
} else {
  console.error('Backup file not found');
}
