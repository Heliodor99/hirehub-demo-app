const { interviews } = require('./interviews');
const fs = require('fs');

function escape(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/'/g, "''");
}

function toSQLValue(val, forceJson = false) {
  if (val === null || val === undefined) return 'NULL';
  if (forceJson) return `'${escape(JSON.stringify(val))}'`;
  if (typeof val === 'string') return `'${escape(val)}'`;
  if (Array.isArray(val)) {
    return `'{${val.map(escape).join(',')}}'`;
  }
  if (typeof val === 'object') return `'${escape(JSON.stringify(val))}'`;
  return val;
}

const sqlLines = interviews.map(interview => {
  // Flatten candidate fields
  const candidate_name = interview.candidate?.name || null;
  const candidate_position = interview.candidate?.position || null;
  return `INSERT INTO interviews (
    id, candidate_name, candidate_position, date, time, type, status, interviewers, location, transcript, ai_assessment, human_feedback
  ) VALUES (
    ${toSQLValue(interview.id)},
    ${toSQLValue(candidate_name)},
    ${toSQLValue(candidate_position)},
    ${toSQLValue(interview.date)},
    ${toSQLValue(interview.time)},
    ${toSQLValue(interview.type)},
    ${toSQLValue(interview.status)},
    ${toSQLValue(interview.interviewers)},
    ${toSQLValue(interview.location)},
    ${toSQLValue(interview.transcript, true)},
    ${toSQLValue(interview.aiAssessment, true)},
    ${toSQLValue(interview.humanFeedback, true)}
  );`;
}).join('\n');

fs.writeFileSync('interviews_inserts.sql', sqlLines);
console.log('Created interviews_inserts.sql'); 