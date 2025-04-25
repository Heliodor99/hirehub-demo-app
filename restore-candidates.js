const fs = require('fs');
const path = require('path');

// Determine paths
const candidatesPath = path.join(__dirname, 'src', 'data', 'candidates.ts');
const backupPath = path.join(__dirname, 'src', 'data', 'candidates.ts.backup');

console.log('Checking for backup file...');

// Check if backup exists
if (!fs.existsSync(backupPath)) {
  console.error(`Backup file not found at ${backupPath}`);
  console.log('Checking for alternate backup files...');
  
  // Look for any backup files in the same directory
  const dataDir = path.join(__dirname, 'src', 'data');
  const files = fs.readdirSync(dataDir);
  const backupFiles = files.filter(file => file.startsWith('candidates.ts.backup'));
  
  if (backupFiles.length === 0) {
    console.error('No backup files found. Cannot restore.');
    process.exit(1);
  }
  
  // Sort by modification time (newest first)
  const backupFilesWithStats = backupFiles.map(file => {
    const filePath = path.join(dataDir, file);
    return {
      path: filePath,
      stats: fs.statSync(filePath)
    };
  });
  
  backupFilesWithStats.sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime());
  
  // Use the most recent backup
  const newestBackup = backupFilesWithStats[0].path;
  console.log(`Found alternate backup: ${newestBackup}`);
  console.log(`Restoring from: ${newestBackup}`);
  
  // Make a backup of current file first
  const safeguardBackup = `${candidatesPath}.before-restore-${Date.now()}`;
  fs.copyFileSync(candidatesPath, safeguardBackup);
  console.log(`Created safeguard backup at: ${safeguardBackup}`);
  
  // Restore from backup
  fs.copyFileSync(newestBackup, candidatesPath);
  console.log(`Successfully restored candidates.ts from ${newestBackup}`);
} else {
  // Make a backup of current file first
  const safeguardBackup = `${candidatesPath}.before-restore-${Date.now()}`;
  fs.copyFileSync(candidatesPath, safeguardBackup);
  console.log(`Created safeguard backup at: ${safeguardBackup}`);
  
  // Restore from backup
  fs.copyFileSync(backupPath, candidatesPath);
  console.log(`Successfully restored candidates.ts from ${backupPath}`);
}

console.log('Restoration complete'); 