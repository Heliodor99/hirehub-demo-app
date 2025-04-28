const { company } = require('./company');
const fs = require('fs');

function escape(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

function toSQLValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'string') return `'${escape(val)}'`;
  if (Array.isArray(val)) {
    // Convert JS array to Postgres array literal
    return `'{${val.map(escape).join(',')}}'`;
  }
  if (typeof val === 'object') return `'${escape(JSON.stringify(val))}'`;
  return val;
}

// Map keys for SQL columns
const columnMap = {
  foundedYear: 'founded_year',
  techStack: 'tech_stack',
  companyCulture: 'company_culture',
  socialMedia: 'social_media'
};

const columns = Object.keys(company).map(col => columnMap[col] || col);
const values = Object.keys(company).map(col => toSQLValue(company[col]));

const sql = `INSERT INTO company (${columns.join(', ')}) VALUES (${values.join(', ')});`;
fs.writeFileSync('company_insert.sql', sql);
console.log('Created company_insert.sql'); 