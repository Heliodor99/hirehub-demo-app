const { tasks } = require('./tasks');
const fs = require('fs');

function escape(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

function toSQLValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'string') return `'${escape(val)}'`;
  if (Array.isArray(val)) {
    return `'{${val.map(escape).join(',')}}'`;
  }
  if (typeof val === 'object') return `'${escape(JSON.stringify(val))}'`;
  return val;
}

// Map keys for SQL columns
const columnMap = {
  dueDate: 'due_date'
};

const columns = Object.keys(tasks[0]).map(col => columnMap[col] || col);
const sqlLines = tasks.map(task =>
  `INSERT INTO tasks (${columns.join(', ')}) VALUES (${columns.map(col => toSQLValue(task[col] ?? task[Object.keys(columnMap).find(key => columnMap[key] === col)] )).join(', ')});`
).join('\n');

fs.writeFileSync('tasks_inserts.sql', sqlLines);
console.log('Created tasks_inserts.sql'); 