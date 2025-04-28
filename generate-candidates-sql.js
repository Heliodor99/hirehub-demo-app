const fs = require('fs');
const candidates = JSON.parse(fs.readFileSync('candidates.json', 'utf8'));

// Valid stages as per the database constraint
const VALID_STAGES = [
  'Outreached',
  'Applied',
  'Shortlisted',
  'Interviewed',
  'Rejected',
  'Offer Extended',
  'Offer Rejected',
  'Hired'
];

// Map our old stage values to the new ones
const STAGE_MAPPING = {
  'OUTREACHED': 'Outreached',
  'APPLIED': 'Applied',
  'SCREENING': 'Shortlisted', // Map SCREENING to Shortlisted
  'SHORTLISTED': 'Shortlisted',
  'INTERVIEWING': 'Interviewed',
  'OFFERED': 'Offer Extended',
  'HIRED': 'Hired',
  'REJECTED': 'Rejected'
};

function escape(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

function toSQLValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'string') return `'${escape(val)}'`;
  if (Array.isArray(val)) return `'${escape(JSON.stringify(val))}'`;
  if (typeof val === 'object') return `'${escape(JSON.stringify(val))}'`;
  return val;
}

// Validate and fix stage values
candidates.forEach(candidate => {
  if (!candidate.stage || candidate.stage === 'undefined') {
    console.warn(`Missing or undefined stage for candidate ${candidate.id}. Defaulting to 'Outreached'`);
    candidate.stage = 'Outreached';
  } else {
    // Map the stage to the correct value
    const mappedStage = STAGE_MAPPING[candidate.stage.toUpperCase()];
    if (mappedStage) {
      candidate.stage = mappedStage;
    } else if (!VALID_STAGES.includes(candidate.stage)) {
      console.warn(`Invalid stage '${candidate.stage}' for candidate ${candidate.id}. Defaulting to 'Outreached'`);
      candidate.stage = 'Outreached';
    }
  }
});

// Before generating SQL, fix invalid leap day
candidates.forEach(candidate => {
  if (candidate.appliedDate === '2025-02-29') {
    candidate.appliedDate = '2025-02-28'; // or another valid date
  }
});

const sqlLines = candidates.map(c => `
INSERT INTO candidates (
  id, name, email, phone, current_title, current_company, location, experience,
  skills, education, resume, source, applied_date, stage, job_id, notes, assessment,
  skill_competencies, interview, last_updated, communication_timeline
) VALUES (
  ${toSQLValue(c.id)},
  ${toSQLValue(c.name)},
  ${toSQLValue(c.email)},
  ${toSQLValue(c.phone)},
  ${toSQLValue(c.currentTitle)},
  ${toSQLValue(c.currentCompany)},
  ${toSQLValue(c.location)},
  ${c.experience || 0},
  ${toSQLValue(c.skills)},
  ${toSQLValue(c.education)},
  ${toSQLValue(c.resume)},
  ${toSQLValue(c.source)},
  ${toSQLValue(c.appliedDate)},
  ${toSQLValue(c.stage)},
  ${toSQLValue(c.jobId)},
  ${toSQLValue(c.notes)},
  ${c.assessment ? toSQLValue(c.assessment) : 'NULL'},
  ${c.skillCompetencies ? toSQLValue(c.skillCompetencies) : 'NULL'},
  ${c.interview ? toSQLValue(c.interview) : 'NULL'},
  ${c.lastUpdated ? toSQLValue(c.lastUpdated) : 'NULL'},
  ${c.communicationTimeline ? toSQLValue(c.communicationTimeline) : 'NULL'}
);
`).join('\n');

fs.writeFileSync('candidates_inserts.sql', sqlLines);
console.log('Created candidates_inserts.sql');