#!/usr/bin/env node
// Enforces the rule: src/domain/ must never import from data/, store/, or app/.
// Violations break the layer isolation that keeps domain rules testable in isolation.

const fs = require('fs');
const path = require('path');

const DOMAIN_DIR = path.join('src', 'domain');

if (!fs.existsSync(DOMAIN_DIR)) {
  process.exit(0);
}

const VIOLATION_PATTERN =
  /from\s+['"](?:(?:\.\.\/)+(?:data|store|app)\/|@\/(?:data|store|app)\/)/;

function collectFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full));
    } else if (entry.isFile() && /\.(tsx?)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

const violations = [];

for (const file of collectFiles(DOMAIN_DIR)) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (VIOLATION_PATTERN.test(line)) {
      violations.push(`${file}:${i + 1}: ${line.trim()}`);
    }
  });
}

if (violations.length > 0) {
  console.error('\nDomain boundary violation: src/domain/ must not import from data/, store/, or app/\n');
  violations.forEach((v) => console.error(' ', v));
  console.error('');
  process.exit(1);
}

process.exit(0);
