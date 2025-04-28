const fs = require('fs');

// Read the SQL file
const sqlContent = fs.readFileSync('candidates_inserts.sql', 'utf8');

// Split by semicolon to get individual INSERT statements
const statements = sqlContent.split(';').filter(stmt => stmt.trim());

// Group statements into chunks under 5000 characters
const chunks = [];
let currentChunk = '';
let chunkIndex = 1;

statements.forEach(statement => {
    // Add semicolon back to the statement
    const fullStatement = statement + ';';
    
    // If adding this statement would exceed 5000 characters, start a new chunk
    if ((currentChunk + fullStatement).length > 5000) {
        if (currentChunk) {
            chunks.push(currentChunk);
            currentChunk = '';
        }
    }
    
    currentChunk += fullStatement;
});

// Add the last chunk if it's not empty
if (currentChunk) {
    chunks.push(currentChunk);
}

// Write each chunk to a separate file
chunks.forEach((chunk, index) => {
    const filename = `candidates_inserts_chunk_${index + 1}.sql`;
    fs.writeFileSync(filename, chunk);
    console.log(`Created ${filename} with ${chunk.length} characters`);
});

console.log(`Split SQL file into ${chunks.length} chunks`); 