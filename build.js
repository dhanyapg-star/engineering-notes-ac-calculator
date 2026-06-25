const fs = require('fs');
const path = require('path');

const publishDir = 'dist';

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

fs.rmSync(publishDir, { recursive: true, force: true });
fs.mkdirSync(publishDir, { recursive: true });

copyDir('ac-calculator', path.join(publishDir, 'ac-calculator'));
copyDir('engineering-notes', path.join(publishDir, 'engineering-notes'));

fs.writeFileSync(
  path.join(publishDir, '_redirects'),
  `/ac-calculator/*  /ac-calculator/:splat  200
/engineering-notes/*  /engineering-notes/:splat  200
/ac-calculator  /ac-calculator/index.html  200
/engineering-notes  /engineering-notes/index.html  200
/  /ac-calculator/index.html  302
`
);

console.log('Build complete: both sites copied to dist/');