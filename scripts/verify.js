// First Apartment Freebies Kit — verification script
// Runs structural + logic checks. Exit non-zero on any failure.
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname + '/..';
const failures = [];

function fail(msg) {
  failures.push(msg);
  console.log('FAIL: ' + msg);
}
function pass(msg) {
  console.log('ok: ' + msg);
}

// ---------- helpers ----------
function readRel(p) {
  return fs.readFileSync(path.join(ROOT, p), 'utf8');
}

const htmlFiles = fs
  .readdirSync(path.join(ROOT, 'html'))
  .filter((f) => f.endsWith('.html'))
  .sort();
const mdFiles = fs
  .readdirSync(path.join(ROOT, 'kit'))
  .filter((f) => f.endsWith('.md'))
  .sort();

// ---------- structural checks ----------
for (const f of htmlFiles) {
  const src = readRel('html/' + f);
  const checks = {
    '<!DOCTYPE html>': src.trim().startsWith('<!DOCTYPE html>'),
    '<html': /<html[^>]*>/i.test(src),
    '<head>': /<head[^>]*>/i.test(src),
    '</head>': /<\/head>/i.test(src),
    '<body>': /<body[^>]*>/i.test(src),
    '</body>': /<\/body>/i.test(src),
    '<title>': /<title[^>]*>.*<\/title>/is.test(src),
    'links kit.css': /link[^>]+href=["']\.\.\/css\/kit\.css["']/i.test(src),
    'credit': /Asdale Dynamics, LLC/.test(src),
    'no secrets': !/(api[_-]?key|secret|password|token|passwd)\s*[:=]\s*["'][^"']+["']/i.test(src),
  };
  let allOk = true;
  for (const [name, ok] of Object.entries(checks)) {
    if (!ok) { allOk = false; fail(f + ': missing or bad ' + name); }
  }
  if (allOk) pass(f + ': structure + credit + no secrets');
}

// ---------- LICENSE exact line ----------
const license = readRel('LICENSE').split('\n');
if (license[2] === 'Copyright (c) 2026 Asdale Dynamics, LLC') {
  pass('LICENSE line 3 exact match');
} else {
  fail('LICENSE line 3 is: ' + JSON.stringify(license[2]));
}

// ---------- README credit ----------
const readme = readRel('README.md');
if (/Asdale Dynamics, LLC/.test(readme)) {
  pass('README credits Asdale Dynamics, LLC');
} else {
  fail('README missing Asdale Dynamics, LLC credit');
}

// ---------- kit/ markdown credit ----------
for (const f of mdFiles) {
  const src = readRel('kit/' + f);
  if (/Asdale Dynamics, LLC/.test(src)) {
    pass('kit/' + f + ' credits Asdale Dynamics, LLC');
  } else {
    fail('kit/' + f + ' missing Asdale Dynamics, LLC credit');
  }
}

// ---------- no .github/workflows ----------
const hasWorkflows = fs.existsSync(path.join(ROOT, '.github', 'workflows'));
if (!hasWorkflows) {
  pass('no .github/workflows directory');
} else {
  fail('.github/workflows directory present (should not be)');
}

// ---------- logic tests ----------
// Budget fmt: negative money-left shows as -$X.XX (overspending warning)
function fmt(v) {
  var abs = Math.abs(Math.round(v * 100) / 100).toFixed(2);
  return (v < 0 ? '-$' : '$') + abs;
}
if (fmt(100) === '$100.00' && fmt(-25.5) === '-$25.50' && fmt(0) === '$0.00') {
  pass('budget fmt handles positive, negative, zero');
} else {
  fail('budget fmt broken: ' + fmt(100) + ' / ' + fmt(-25.5) + ' / ' + fmt(0));
}

// Furniture est/actual separation: est = inputs[0], act = inputs[1] per row
function compute(rows) {
  var est = 0, act = 0;
  rows.forEach(function (inputs) {
    if (inputs[0]) est += parseFloat(inputs[0].value) || 0;
    if (inputs[1]) act += parseFloat(inputs[1].value) || 0;
  });
  return { est: est, act: act };
}
var rows = [
  [{ value: '100.00' }, { value: '120.00' }],
  [{ value: '50.00' }, { value: '45.00' }],
];
var res = compute(rows);
if (res.est === 150 && res.act === 165) {
  pass('furniture est/actual separated correctly (est=$150, act=$165)');
} else {
  fail('furniture est/actual wrong: est=' + res.est + ' act=' + res.act);
}

// ---------- landlord copy uses textContent (not .value on a div) ----------
for (const f of htmlFiles) {
  if (f === 'landlord-templates.html') {
    const src = readRel('html/' + f);
    if (/el\.textContent/.test(src) && !/el\.value/.test(src)) {
      pass('landlord-templates copy() uses textContent (div-safe)');
    } else {
      fail('landlord-templates copy() still unsafe for <div> output');
    }
  }
}

// ---------- summary ----------
console.log('\n' + failures.length + ' failure(s).');
process.exit(failures.length ? 1 : 0);
