const fs = require('fs');
const path = require('path');

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules') continue;
      walk(p, files);
    } else if (/\.(tsx|ts|css)$/.test(e.name)) {
      files.push(p);
    }
  }
  return files;
}

const root = path.join(__dirname, '..', 'src');
const skipNames = new Set(['designTokens.css']);

const replacements = [
  [/rounded-3xl/g, 'rounded-lg'],
  [/rounded-2xl/g, 'rounded-lg'],
  [/rounded-xl/g, 'rounded-md'],
  [/shadow-2xl/g, 'shadow-md'],
  [/shadow-xl/g, 'shadow-md'],
  [/shadow-lg/g, 'shadow-sm'],
  [/from-indigo-/g, 'from-blue-'],
  [/via-indigo-/g, 'via-blue-'],
  [/to-indigo-/g, 'to-blue-'],
  [/to-purple-/g, 'to-blue-'],
  [/from-purple-/g, 'from-blue-'],
  [/bg-indigo-/g, 'bg-blue-'],
  [/text-indigo-/g, 'text-blue-'],
  [/border-indigo-/g, 'border-blue-'],
  [/ring-indigo-/g, 'ring-blue-'],
  [/outline-indigo-/g, 'outline-blue-'],
  [/divide-indigo-/g, 'divide-blue-'],
  [/accent-indigo-/g, 'accent-blue-'],
  [/fill-indigo-/g, 'fill-blue-'],
  [/stroke-indigo-/g, 'stroke-blue-'],
  [/shadow-indigo-[^\s"'`]+/g, ''],
  [/#6366f1/gi, '#1d4ed8'],
  [/#4f46e5/gi, '#1d4ed8'],
  [/#818cf8/gi, '#3b82f6'],
  [/il-bento-card/g, 'il-panel'],
  [/bg-white\/90 backdrop-blur-md/g, 'bg-white'],
  [/bg-white\/80 backdrop-blur-md/g, 'bg-white'],
  [/backdrop-blur-md/g, ''],
  [/backdrop-blur-sm/g, ''],
  [/backdrop-blur-xl/g, ''],
  [/backdrop-blur/g, ''],
  [/hover:-translate-y-1/g, ''],
  [/hover:-translate-y-0\.5/g, ''],
  [/hover:scale-105/g, ''],
  [/hover:scale-\[1\.02\]/g, ''],
];

let changedFiles = 0;
const files = walk(root).filter((f) => !skipNames.has(path.basename(f)));

for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const orig = s;
  for (const [re, to] of replacements) {
    s = s.replace(re, to);
  }
  // collapse accidental double spaces inside class strings
  s = s.replace(/ {2,}/g, ' ');
  s = s.replace(/className=" /g, 'className="');
  s = s.replace(/className=\{` /g, 'className={`');
  if (s !== orig) {
    fs.writeFileSync(f, s);
    changedFiles += 1;
    console.log('updated', path.relative(root, f));
  }
}

console.log('DONE files=', changedFiles);
