// Run: node generate-index.js
// Writes files.json in the current directory (recursively lists .html files, excluding index.html and node_modules).
const fs = require('fs');
const path = require('path');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out = [];
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
      out.push(...walk(full));
    } else if (/\.html?$/i.test(ent.name)) {
      out.push(path.relative(process.cwd(), full).replace(/\\/g, '/'));
    }
  }
  return out;
}

const files = walk(process.cwd())
  .filter(f => !/index\.html$/i.test(f))
  .sort((a,b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

fs.writeFileSync(path.join(process.cwd(), 'files.json'), JSON.stringify(files, null, 2), 'utf8');
console.log('Wrote files.json with', files.length, 'entries.');
