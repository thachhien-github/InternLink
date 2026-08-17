const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (/\.tsx$/.test(e.name)) files.push(p);
  }
  return files;
}

const root = path.join(__dirname, '..', 'src');
const files = walk(root);
const bad = [];

for (const f of files) {
  const rel = path.relative(path.join(__dirname, '..'), f).replace(/\\/g, '/');
  const source = fs.readFileSync(f, 'utf8');
  const open = (source.match(/<Panel\b/g) || []).length;
  const close = (source.match(/<\/Panel>/g) || []).length;
  let parseErr = null;
  try {
    esbuild.transformSync(source, { loader: 'tsx', jsx: 'automatic' });
  } catch (err) {
    parseErr = String(err.message || err)
      .replace(/\r/g, '')
      .split('\n')
      .filter(Boolean)
      .slice(0, 4)
      .join(' || ');
  }
  if (open !== close || parseErr) {
    bad.push({ rel, open, close, parseErr });
  }
}

for (const b of bad) {
  console.log(`${b.rel} | Panel ${b.open}/${b.close} | ${b.parseErr || 'count-only'}`);
}
console.log('BAD_COUNT', bad.length);
