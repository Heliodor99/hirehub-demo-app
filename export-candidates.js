const { candidates } = require('./candidates');
const fs = require('fs');
fs.writeFileSync('candidates.json', JSON.stringify(candidates, null, 2));
console.log('Exported candidates to candidates.json');