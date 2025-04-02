// HACK: Runs tests on modules in a browser (JSDOM) environment
// TODO: Re-evaluate next week/month/year when the web community changes its mind about everything again...

import FS from 'fs';
import PATH from 'path';
import RUN from './test/run.js';

const testPath = './test';
const testFiles = FS.readdirSync(testPath)
  .filter(file => file.endsWith('.test.js'))
  .map(file => PATH.resolve(testPath, file));

console.pass = message => console.log(`\x1b[32m${message}\x1b[0m`);
console.fail = message => console.error(`\x1b[31m${message}\x1b[0m`);
console.warn = message => console.error(`\x1b[33m${message}\x1b[0m`);

var complete = false;
Promise.all(testFiles.map(f => import(f)))
  .then(() => complete = true)
  .catch(err => {
    console.fail(`Error loading tests: ${err.message}\n${err.stack}`);
    complete = true;
  });
var interval = setInterval(() => {
  if (!complete) { return; }
  clearInterval(interval);
  for (var suite of Object.keys(RUN.results).sort()) {
    var tests = RUN.results[suite].sort((a,b) => a.description > b.description ? 1 : -1);
    var failed = tests.some(test => test.failures.length);
    if (failed) { console.fail(`✘ ${suite}:`); }
    else { console.pass(`✔ ${suite}:`); }
    for (var test of tests) {
      if (test.failures.length) { console.fail(`  ✘ ${test.description}:`); }
      else { console.pass(`  ✔ ${test.description}:`); }
      for (var failure of test.failures.sort()) {
        console.log(`    ${failure}`);
      }
    }
  }
  var tests = Object.values(RUN.results).flatMap(s => s);
  var failed = tests.filter(t => t.failures.length).length;
  var passes = tests.length - failed;
  var results = `Tests: ${tests.length}, Passed: ${passes}, Failed: ${failed}`
  if (failed) { console.warn(results); }
  else { console.pass(results); }
}, 100);