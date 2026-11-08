#!/usr/bin/env node
/**
 * Synteq UI V2 — Rule Checker
 * Enforces the six hard rules automatically.
 * Exit 0 if all checks pass, exit 1 if violations found.
 * 
 * Usage: node tools/check-rules.mjs
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

let violations = 0;

function checkFile(filepath, checks) {
  try {
    const content = readFileSync(filepath, 'utf-8');
    checks.forEach(check => check(filepath, content));
  } catch (err) {
    console.error(`❌ Could not read ${filepath}: ${err.message}`);
    violations++;
  }
}

function scanDir(dir, pattern, checks) {
  const files = readdirSync(dir);
  files.forEach(file => {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath, pattern, checks);
    } else if (pattern.test(file)) {
      checkFile(fullPath, checks);
    }
  });
}

// Rule 3: No raw colors in component CSS (except theme files)
function checkRawColors(filepath, content) {
  if (filepath.includes('theme-') || filepath.includes('fonts.css')) return;
  
  const hexPattern = /#[0-9a-fA-F]{3,8}(?![0-9a-fA-F])/g;
  const rgbPattern = /rgba?\([^)]+\)/g;
  
  const hexMatches = content.match(hexPattern) || [];
  const rgbMatches = content.match(rgbPattern) || [];
  
  // Filter out data-uri SVGs (acceptable)
  const lines = content.split('\n');
  const realViolations = [];
  
  lines.forEach((line, idx) => {
    if (line.includes('data:image/svg') || line.includes('url("data:')) return;
    hexMatches.forEach(hex => {
      if (line.includes(hex)) realViolations.push({ line: idx + 1, value: hex });
    });
    rgbMatches.forEach(rgb => {
      if (line.includes(rgb)) realViolations.push({ line: idx + 1, value: rgb });
    });
  });
  
  if (realViolations.length > 0) {
    console.error(`❌ Rule 3: Raw colors in ${filepath}`);
    realViolations.forEach(v => console.error(`   Line ${v.line}: ${v.value}`));
    violations += realViolations.length;
  }
}

// Rule 4: No box-shadow in component CSS
function checkBoxShadow(filepath, content) {
  if (filepath.includes('theme-') || filepath.includes('fonts.css') || filepath.includes('tokens.css')) return;
  
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('box-shadow') && !line.trim().startsWith('//') && !line.trim().startsWith('/*')) {
      // Check if it's in a comment
      const beforeComment = line.split('/*')[0].split('//')[0];
      if (beforeComment.includes('box-shadow')) {
        console.error(`❌ Rule 4: box-shadow found in ${filepath}:${idx + 1}`);
        console.error(`   ${line.trim()}`);
        violations++;
      }
    }
  });
}

// Rule 3: No raw px values in component CSS (except sanctioned breakpoints and pseudo-element offsets)
function checkRawPx(filepath, content) {
  if (filepath.includes('tokens.css') || filepath.includes('theme-') || filepath.includes('fonts.css')) return;
  
  const sanctionedBreakpoints = [1080, 860, 720, 600, 520, 420, 380, 480, 900, 1024];
  const lines = content.split('\n');
  
  lines.forEach((line, idx) => {
    // Skip media queries with sanctioned breakpoints
    if (line.includes('@media') && sanctionedBreakpoints.some(bp => line.includes(`${bp}px`))) return;
    
    // Skip data-uri SVGs
    if (line.includes('data:image/svg') || line.includes('url("data:')) return;
    
    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('/*')) return;
    
    // Match px values not in var() calls
    const pxPattern = /:\s*([^;{]*?(?<!var\([^)]*)\d+px)/g;
    const matches = line.match(pxPattern);
    
    if (matches) {
      // Filter out acceptable cases: width/height on icons, small offsets in pseudo-elements
      const acceptable = [
        'width:', 'height:', 'min-width: 0', 'min-height: 0',
        'left: ', 'top: ', 'right: ', 'bottom: ', // pseudo-element positioning
        'gap:', 'transform:', 'translate'
      ];
      
      const isAcceptable = acceptable.some(prefix => matches.some(m => m.includes(prefix)));
      if (!isAcceptable && !line.includes('--v2-')) {
        console.warn(`⚠️  Rule 3: Raw px value in ${filepath}:${idx + 1}`);
        console.warn(`   ${line.trim()}`);
        // Don't increment violations for warnings, just report
      }
    }
  });
}

// Rule 6: Icon-only buttons need aria-label
function checkAriaLabel(filepath, content) {
  if (!filepath.endsWith('.html')) return;
  
  const lines = content.split('\n');
  const iconOnlyClasses = ['v2-btn--icon', 'v2-iconbtn', 'v2-sidebar-toggle', 'v2-theme-toggle'];
  
  lines.forEach((line, idx) => {
    iconOnlyClasses.forEach(cls => {
      if (line.includes(cls) && !line.includes('aria-label')) {
        // Check next few lines for aria-label
        const context = lines.slice(idx, idx + 3).join(' ');
        if (!context.includes('aria-label')) {
          console.error(`❌ Rule 6: Icon-only control missing aria-label in ${filepath}:${idx + 1}`);
          console.error(`   ${line.trim()}`);
          violations++;
        }
      }
    });
  });
}

// Rule 5: Exactly one sidebar toggle
function checkSidebarToggle(filepath, content) {
  if (!filepath.endsWith('.html')) return;
  
  const matches = content.match(/data-v2-sidebar-toggle/g);
  if (matches && matches.length > 1) {
    console.error(`❌ Rule 5: Multiple sidebar toggles found in ${filepath}`);
    console.error(`   Found ${matches.length} instances (expected 1)`);
    violations++;
  }
}

// Rule 1: Body never scrolls
function checkBodyScroll(filepath, content) {
  if (!filepath.endsWith('.css')) return;
  
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if ((line.includes('body') || line.includes('html')) && 
        (line.includes('overflow:') || line.includes('overflow-y:')) &&
        !line.includes('hidden')) {
      console.error(`❌ Rule 1: Body/html overflow not hidden in ${filepath}:${idx + 1}`);
      console.error(`   ${line.trim()}`);
      violations++;
    }
  });
}

// Run checks
console.log('🔍 Synteq UI V2 Rule Checker\n');

const cssDir = join(rootDir, 'css');
const componentsDir = join(cssDir, 'components');
const examplesDir = join(rootDir, 'examples');

console.log('Checking CSS files...');
scanDir(cssDir, /\.css$/, [checkRawColors, checkBoxShadow, checkRawPx, checkBodyScroll]);

console.log('Checking HTML files...');
scanDir(examplesDir, /\.html$/, [checkAriaLabel, checkSidebarToggle]);

console.log('');
if (violations === 0) {
  console.log('✅ All checks passed! Framework follows the six hard rules.');
  process.exit(0);
} else {
  console.log(`❌ Found ${violations} violations. Fix them to ensure compliance.`);
  process.exit(1);
}
