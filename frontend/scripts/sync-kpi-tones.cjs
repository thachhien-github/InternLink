const fs = require('fs');
const path = require('path');

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (/\.tsx$/.test(e.name)) files.push(p);
  }
  return files;
}

const root = path.join(__dirname, '..', 'src');
const reps = [
  [/border-l-indigo-500/g, 'border-l-[#1d4ed8]'],
  [/border-l-indigo-600/g, 'border-l-[#1d4ed8]'],
  [/shadow-2xs hover:shadow-md/g, ''],
  [/hover:shadow-md transition-all/g, 'transition-colors'],
];

let n = 0;
for (const f of walk(root)) {
  let s = fs.readFileSync(f, 'utf8');
  const o = s;
  for (const [re, to] of reps) s = s.replace(re, to);
  s = s.replace(/className="([^"]*)"/g, (_, c) => `className="${c.replace(/ {2,}/g, ' ').trim()}"`);
  if (s !== o) {
    fs.writeFileSync(f, s);
    n++;
    console.log(path.relative(root, f));
  }
}
console.log('synced', n);
