#!/usr/bin/env node
/**
 * Synteq UI V2 — Size Report
 * Measures raw + gzipped sizes, compares to baseline.
 * 
 * Usage: node tools/size-report.mjs
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { gzipSync } from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Baseline from Phase 0
const BASELINE = {
  css: { raw: 53265, gzip: 11970 },
  js: { raw: 34125, gzip: 9397 }
};

const CEILING = {
  css: { raw: 106530 },
  js: { raw: 68250 }
};

function measureDir(dir, pattern) {
  let raw = 0;
  const files = [];
  
  function scan(d) {
    const items = readdirSync(d);
    items.forEach(item => {
      const fullPath = join(d, item);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (pattern.test(item)) {
        const content = readFileSync(fullPath);
        raw += content.length;
        files.push({ path: fullPath, size: content.length });
      }
    });
  }
  
  scan(dir);
  return { raw, files };
}

function gzipSize(dir, pattern) {
  let combined = '';
  
  function scan(d) {
    const items = readdirSync(d);
    items.forEach(item => {
      const fullPath = join(d, item);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (pattern.test(item)) {
        combined += readFileSync(fullPath, 'utf-8');
      }
    });
  }
  
  scan(dir);
  return gzipSync(combined).length;
}

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(2) + ' KB';
}

function formatPercent(value) {
  return value.toFixed(1) + '%';
}

console.log('📊 Synteq UI V2 — Size Report\n');

// CSS
const cssDir = join(rootDir, 'css');
const cssResult = measureDir(cssDir, /\.css$/);
const cssGzip = gzipSize(cssDir, /\.css$/);

console.log('CSS Files:');
console.log(`  Raw:      ${formatBytes(cssResult.raw)} (${cssResult.files.length} files)`);
console.log(`  Gzipped:  ${formatBytes(cssGzip)}`);
console.log(`  Baseline: ${formatBytes(BASELINE.css.raw)} raw, ${formatBytes(BASELINE.css.gzip)} gzip`);
console.log(`  Delta:    +${formatBytes(cssResult.raw - BASELINE.css.raw)} raw (+${formatPercent((cssResult.raw / BASELINE.css.raw - 1) * 100)})`);
console.log(`            +${formatBytes(cssGzip - BASELINE.css.gzip)} gzip (+${formatPercent((cssGzip / BASELINE.css.gzip - 1) * 100)})`);
console.log(`  Ceiling:  ${formatBytes(CEILING.css.raw)} (${formatPercent(cssResult.raw / CEILING.css.raw * 100)} used)`);

// JS
const jsDir = join(rootDir, 'js');
const jsResult = measureDir(jsDir, /\.js$/);
const jsGzip = gzipSize(jsDir, /\.js$/);

console.log('\nJS Files:');
console.log(`  Raw:      ${formatBytes(jsResult.raw)} (${jsResult.files.length} files)`);
console.log(`  Gzipped:  ${formatBytes(jsGzip)}`);
console.log(`  Baseline: ${formatBytes(BASELINE.js.raw)} raw, ${formatBytes(BASELINE.js.gzip)} gzip`);
console.log(`  Delta:    +${formatBytes(jsResult.raw - BASELINE.js.raw)} raw (+${formatPercent((jsResult.raw / BASELINE.js.raw - 1) * 100)})`);
console.log(`            +${formatBytes(jsGzip - BASELINE.js.gzip)} gzip (+${formatPercent((jsGzip / BASELINE.js.gzip - 1) * 100)})`);
console.log(`  Ceiling:  ${formatBytes(CEILING.js.raw)} (${formatPercent(jsResult.raw / CEILING.js.raw * 100)} used)`);

// Total
const totalRaw = cssResult.raw + jsResult.raw;
const totalGzip = cssGzip + jsGzip;
const baselineTotal = BASELINE.css.raw + BASELINE.js.raw;
const ceilingTotal = CEILING.css.raw + CEILING.js.raw;

console.log('\nTotal:');
console.log(`  Raw:      ${formatBytes(totalRaw)}`);
console.log(`  Gzipped:  ${formatBytes(totalGzip)}`);
console.log(`  Baseline: ${formatBytes(baselineTotal)}`);
console.log(`  Delta:    +${formatBytes(totalRaw - baselineTotal)} (+${formatPercent((totalRaw / baselineTotal - 1) * 100)})`);
console.log(`  Budget:   ${formatBytes(ceilingTotal)} (${formatPercent(totalRaw / ceilingTotal * 100)} used)`);

// File breakdown (top 5 largest)
console.log('\nLargest CSS files:');
cssResult.files.sort((a, b) => b.size - a.size).slice(0, 5).forEach(f => {
  console.log(`  ${formatBytes(f.size).padStart(10)} — ${f.path.replace(rootDir, '.')}`);
});

console.log('\nLargest JS files:');
jsResult.files.sort((a, b) => b.size - a.size).slice(0, 5).forEach(f => {
  console.log(`  ${formatBytes(f.size).padStart(10)} — ${f.path.replace(rootDir, '.')}`);
});

// Health check
console.log('\n');
if (cssResult.raw > CEILING.css.raw) {
  console.log('⚠️  CSS exceeds ceiling!');
  process.exit(1);
}
if (jsResult.raw > CEILING.js.raw) {
  console.log('⚠️  JS exceeds ceiling!');
  process.exit(1);
}
console.log('✅ Size budget healthy. All assets under ceiling.');
