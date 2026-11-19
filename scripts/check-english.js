'use strict';

// Static English UI smoke check. Chinese error-matching patterns in runtime
// code are intentionally permitted because they support localized diagnostics.
const fs = require('fs');
const path = require('path');

const files = [
  'README.md',
  'src/ui/index.html',
  'src/ui/shell.html',
  'src/ui/splash.html',
  'package.json',
];
let failures = 0;
for (const rel of files) {
  const src = fs.readFileSync(path.join(__dirname, '..', rel), 'utf8');
  const match = src.match(/[\u3400-\u9FFF]/u);
  if (match) {
    failures++;
    console.error('Non-English text in', rel, 'at character', match.index);
  } else {
    console.log('English UI:', rel, 'OK');
  }
}

if (failures) process.exitCode = 1;
