import fs from 'fs';
import path from 'path';
import { RecruitmentStage } from '../src/types';

const updateCandidatesStage = () => {
  // Read the jobs.ts file
  const filePath = path.join(process.cwd(), 'src', 'data', 'jobs.ts');
  let content = fs.readFileSync(filePath, 'utf8');

  // Find all shortlisted candidates and replace their stage
  let count = 0;
  const maxUpdates = 50;

  content = content.replace(
    /stage:\s*RecruitmentStage\.SHORTLISTED/g,
    (match) => {
      if (count < maxUpdates) {
        count++;
        return 'stage: RecruitmentStage.OUTREACHED';
      }
      return match;
    }
  );

  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');

  console.log(`Updated ${count} candidates from SHORTLISTED to OUTREACHED stage`);
};

// Run the update
updateCandidatesStage(); 