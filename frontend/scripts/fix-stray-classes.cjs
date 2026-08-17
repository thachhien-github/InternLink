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
let n = 0;

for (const f of walk(root)) {
  let s = fs.readFileSync(f, 'utf8');
  const orig = s;

  // Stray tokens left after removing backdrop-blur-xs / backdrop-blur-sm
  s = s.replace(/(^|[\s"'`])-xs(?=[\s"'`]|$)/g, '$1');
  s = s.replace(/(^|[\s"'`])-sm(?=[\s"'`]|$)/g, '$1');
  s = s.replace(/(^|[\s"'`])-md(?=[\s"'`]|$)/g, '$1');
  s = s.replace(/(^|[\s"'`])-lg(?=[\s"'`]|$)/g, '$1');
  s = s.replace(/(^|[\s"'`])-xl(?=[\s"'`]|$)/g, '$1');

  // Directional rounded leftovers
  s = s.replace(/rounded-([tblr]|[tblr]{2}|ss|ee|se|sw|es|ew)-2xl/g, 'rounded-$1-lg');
  s = s.replace(/rounded-([tblr]|[tblr]{2}|ss|ee|se|sw|es|ew)-xl/g, 'rounded-$1-md');
  s = s.replace(/rounded-b-xl/g, 'rounded-b-md');
  s = s.replace(/rounded-t-xl/g, 'rounded-t-md');
  s = s.replace(/rounded-l-xl/g, 'rounded-l-md');
  s = s.replace(/rounded-r-xl/g, 'rounded-r-md');

  s = s.replace(/className="([^"]*)"/g, (_, c) => `className="${c.replace(/ {2,}/g, ' ').trim()}"`);
  s = s.replace(/className=\{`([^`]*)`\}/g, (_, c) => `className={\`${c.replace(/ {2,}/g, ' ').trim()}\`}`);

  if (s !== orig) {
    fs.writeFileSync(f, s);
    n += 1;
    console.log(path.relative(root, f));
  }
}

console.log('fixed', n);
