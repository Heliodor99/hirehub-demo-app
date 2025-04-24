// Using CommonJS format for compatibility
const fs = require('fs');
const path = require('path');
// We need to dynamically import these since they're ESM
let candidates;
let RecruitmentStage;

// Function to randomly select 70% of candidates and change their source to HireHub
const updateCandidateSources = async () => {
  try {
    // Use dynamic import for ESM modules
    const { candidates: candidatesData } = await import('../data/jobs');
    const { RecruitmentStage: RecruitmentStageEnum } = await import('../types');
    
    candidates = candidatesData;
    RecruitmentStage = RecruitmentStageEnum;

    // Clone candidates array to avoid modifying the original
    const updatedCandidates = [...candidates];
    
    // Number of candidates to update (70% of total)
    const numberOfCandidatesToUpdate = Math.floor(updatedCandidates.length * 0.7);
    
    // Keep track of updated indices to avoid duplicates
    const updatedIndices = new Set();
    
    // Randomly select 70% of candidates
    while (updatedIndices.size < numberOfCandidatesToUpdate) {
      const randomIndex = Math.floor(Math.random() * updatedCandidates.length);
      if (!updatedIndices.has(randomIndex)) {
        updatedIndices.add(randomIndex);
      }
    }
    
    // Update selected candidates
    Array.from(updatedIndices).forEach(index => {
      updatedCandidates[index] = {
        ...updatedCandidates[index],
        source: 'HireHub'
      };
    });
    
    // Build the updated candidates array string
    let updatedCandidatesString = 'export const candidates = [\n';
    
    updatedCandidates.forEach((candidate, index) => {
      updatedCandidatesString += `  {\n`;
      
      // Add each property from the candidate
      Object.entries(candidate).forEach(([key, value]) => {
        if (key === 'id') {
          updatedCandidatesString += `    id: '${value}',\n`;
        } else if (key === 'name') {
          updatedCandidatesString += `    name: '${value}',\n`;
        } else if (key === 'email') {
          updatedCandidatesString += `    email: '${value}',\n`;
        } else if (key === 'phone') {
          updatedCandidatesString += `    phone: '${value}',\n`;
        } else if (key === 'currentTitle') {
          updatedCandidatesString += `    currentTitle: '${value}',\n`;
        } else if (key === 'currentCompany') {
          updatedCandidatesString += `    currentCompany: '${value}',\n`;
        } else if (key === 'location') {
          updatedCandidatesString += `    location: '${value}',\n`;
        } else if (key === 'experience') {
          updatedCandidatesString += `    experience: ${value},\n`;
        } else if (key === 'skills') {
          if (Array.isArray(value)) {
            if (typeof value[0] === 'string') {
              // Handle string array
              updatedCandidatesString += `    skills: [${value.map(s => `'${s}'`).join(', ')}],\n`;
            } else {
              // Handle object array
              updatedCandidatesString += `    skills: ${JSON.stringify(value)},\n`;
            }
          } else {
            updatedCandidatesString += `    skills: [],\n`;
          }
        } else if (key === 'education') {
          updatedCandidatesString += `    education: ${JSON.stringify(value)},\n`;
        } else if (key === 'resume') {
          updatedCandidatesString += `    resume: '${value}',\n`;
        } else if (key === 'source') {
          updatedCandidatesString += `    source: '${value}',\n`;
        } else if (key === 'appliedDate') {
          updatedCandidatesString += `    appliedDate: '${value}',\n`;
        } else if (key === 'stage') {
          // Since RecruitmentStage is a string enum, we need to find the key that corresponds to this value
          // First find which stage enum key has this value
          const stageKey = Object.keys(RecruitmentStage).find(
            k => RecruitmentStage[k] === value
          );
          
          if (stageKey) {
            updatedCandidatesString += `    stage: RecruitmentStage.${stageKey},\n`;
          } else {
            // Fallback - in case we can't find the stage
            updatedCandidatesString += `    stage: RecruitmentStage.APPLIED,\n`;
          }
        } else if (key === 'jobId') {
          updatedCandidatesString += `    jobId: '${value}',\n`;
        } else if (key === 'notes') {
          const safeValue = value ? value.replace(/'/g, "\\'") : '';
          updatedCandidatesString += `    notes: '${safeValue}',\n`;
        } else if (key === 'assessment') {
          updatedCandidatesString += `    assessment: ${JSON.stringify(value)},\n`;
        } else if (key === 'skillCompetencies') {
          updatedCandidatesString += `    skillCompetencies: ${JSON.stringify(value)},\n`;
        } else if (key === 'interview') {
          updatedCandidatesString += `    interview: ${JSON.stringify(value)},\n`;
        } else if (key === 'lastUpdated') {
          updatedCandidatesString += `    lastUpdated: '${value}',\n`;
        }
      });
      
      updatedCandidatesString += `  }${index < updatedCandidates.length - 1 ? ',' : ''}\n`;
    });
    
    updatedCandidatesString += '];\n';
    
    // Find the jobs.ts file content
    const jobsFilePath = path.resolve(__dirname, '../data/jobs.ts');
    const jobsFileContent = fs.readFileSync(jobsFilePath, 'utf8');
    
    // Replace the candidates array in the jobs file
    const startMarker = 'export const candidates = [';
    const endMarker = '];';
    
    const startIndex = jobsFileContent.indexOf(startMarker);
    let endIndex = jobsFileContent.indexOf(endMarker, startIndex);
    
    // Make sure we find the correct closing bracket
    if (startIndex !== -1 && endIndex !== -1) {
      endIndex += endMarker.length;
      
      const newContent = 
        jobsFileContent.substring(0, startIndex) + 
        updatedCandidatesString + 
        jobsFileContent.substring(endIndex);
      
      // Write the updated content back to the file
      fs.writeFileSync(jobsFilePath, newContent, 'utf8');
      
      console.log(`Updated ${updatedIndices.size} out of ${updatedCandidates.length} candidates to have source = 'HireHub'`);
    } else {
      console.error('Could not find candidates array in jobs.ts');
    }
  } catch (error) {
    console.error('Error updating candidate sources:', error);
  }
};

// Execute the async function
updateCandidateSources(); 