const fs = require("fs");
const path = require("path");

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (/\.tsx$/.test(e.name)) files.push(p);
  }
  return files;
}

const root = path.join(__dirname, "..", "src");
const reps = [
  [
    /bg-gradient-to-tr from-blue-600 to-blue-600/g,
    "bg-[#1d4ed8]",
  ],
  [
    /bg-gradient-to-tr from-blue-600 to-blue-700/g,
    "bg-[#1d4ed8]",
  ],
  [
    /bg-gradient-to-r from-blue-600 to-blue-600/g,
    "bg-[#1d4ed8]",
  ],
  [
    /bg-purple-50\/70/g,
    "bg-sky-50/80",
  ],
  [
    /border-purple-100/g,
    "border-sky-100",
  ],
  [
    /text-purple-800/g,
    "text-sky-800",
  ],
  [
    /text-purple-700/g,
    "text-sky-700",
  ],
  [
    /bg-purple-100 text-purple-800 border border-purple-300/g,
    "bg-amber-50 text-amber-800 border border-amber-200",
  ],
  [
    /bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-\[11px\] rounded-lg border border-purple-200/g,
    "bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-[11px] rounded-md border border-slate-200",
  ],
  [
    /bg-purple-100 text-purple-800 border-purple-300/g,
    "bg-slate-100 text-slate-800 border-slate-200",
  ],
  [
    /bg-purple-100 text-purple-900 border border-purple-200/g,
    "bg-blue-100 text-blue-900 border border-blue-200",
  ],
  [
    /bg-purple-50 hover:bg-purple-100 text-sky-700 font-bold rounded-lg transition-colors border border-purple-200/g,
    "bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-md transition-colors border border-slate-200",
  ],
  [
    /bg-purple-50 hover:bg-purple-100 text-sky-800 font-bold text-\[11px\] rounded-lg border border-purple-200/g,
    "bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-[11px] rounded-md border border-slate-200",
  ],
  [
    /bg-purple-100 text-sky-800 border-purple-200/g,
    "bg-slate-100 text-slate-800 border-slate-200",
  ],
  [
    /bg-purple-100 text-sky-800 border-purple-300/g,
    "bg-slate-100 text-slate-800 border-slate-200",
  ],
  [
    /bg-purple-50 text-sky-700 border-purple-200/g,
    "bg-slate-100 text-slate-700 border-slate-200",
  ],
  [
    /bg-purple-50 text-sky-800 border-purple-200/g,
    "bg-slate-100 text-slate-800 border-slate-200",
  ],
  [
    /bg-purple-100 text-sky-800 border-purple-200/g,
    "bg-slate-100 text-slate-800 border-slate-200",
  ],
  [
    /bg-purple-50\/50/g,
    "bg-slate-50",
  ],
  [
    /text-purple-600/g,
    "text-blue-600",
  ],
  [
    /bg-purple-600 h-2/g,
    "bg-blue-600 h-2",
  ],
  [
    /text-purple-600">94\.8%/g,
    'text-blue-600">94.8%',
  ],
];

let n = 0;
for (const f of walk(root)) {
  if (f.includes("ReviewSubmissionWorkspace")) continue;
  let s = fs.readFileSync(f, "utf8");
  const o = s;
  for (const [re, to] of reps) s = s.replace(re, to);
  if (s !== o) {
    fs.writeFileSync(f, s);
    n++;
    console.log(path.relative(root, f));
  }
}
console.log("hallmark-de-slop:", n, "files");
