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
const replacements = [
  [/font-black/g, 'font-bold'],
  [/font-extrabold/g, 'font-bold'],
  [/group-hover:scale-110/g, ''],
  [/hover:scale-110/g, ''],
  [/active:scale-95/g, ''],
  [/animate-pulse/g, ''],
  // heavy multi-shadow custom often left; soften common pattern
  [/shadow-\[0_25px_60px[^\]]+\]/g, 'shadow-md'],
];

let n = 0;
for (const f of walk(root)) {
  let s = fs.readFileSync(f, 'utf8');
  const orig = s;
  for (const [re, to] of replacements) s = s.replace(re, to);
  // only collapse spaces inside className attribute values — safer
  s = s.replace(/className="([^"]*)"/g, (_, cls) => {
    return `className="${cls.replace(/ {2,}/g, ' ').trim()}"`;
  });
  s = s.replace(/className=\{`([^`]*)`\}/g, (_, cls) => {
    return `className={\`${cls.replace(/ {2,}/g, ' ').trim()}\`}`;
  });
  if (s !== orig) {
    fs.writeFileSync(f, s);
    n += 1;
    console.log(path.relative(root, f));
  }
}
console.log('DONE', n);
