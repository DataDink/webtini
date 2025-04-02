// GOOD GRIEF! Someone has to have a better solution for testing browser-based modules without transpiling
// TODO: Find an alternative method for <script type="module"> testing

import FS from 'fs';
import PATH from 'path';
import HTTP from 'http';
import {exec} from 'child_process';

const ouput = './test/test-results.html';
const testPath = './test';
const template = FS.readFileSync(PATH.resolve(testPath, 'test.html'), 'utf8');
const testFiles = FS.readdirSync(testPath)
  .filter(file => file.endsWith('.test.js'))
  .map(file => PATH.resolve(testPath, file));
const testPort = 8765;
const testCommand = (process.platform === 'darwin' ? 'open': process.platform === 'win32' ? 'start' : 'xdg-open');
const launch = () => setTimeout(() => exec(`${testCommand} http://localhost:${testPort}/`), 250);

console.pass = message => console.log(`\x1b[32m${message}\x1b[0m`);
console.fail = message => console.error(`\x1b[31m${message}\x1b[0m`);
console.warn = message => console.error(`\x1b[33m${message}\x1b[0m`);

const results = {};

// Okay, so we serve templated files and launch a browser to run the tests and then submit results
const server = HTTP.createServer((req, res) => {
  if (req.method === 'GET' && req.url.length > 1) {
    const path = PATH.resolve(req.url.replace( /^\//, ''));
    if (!FS.existsSync(path)) { 
      console.fail(`404 Not Found: ${path}`);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found\n');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
    res.end(FS.readFileSync(path, 'utf8'));
    return;
  }
  if (req.method === 'GET') {
    const file = testFiles.shift();
    const suite = PATH.basename(file.replace( /\.test\.js$/, ''));
    const content = FS.readFileSync(file, 'utf8');
    results[suite] = { file, suite };
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate' // Prevent caching
    });
    res.end(template.replace('{{testSuite}}', suite).replace('{{testScript}}', content));
    return;
  }
  if (req.method === 'POST') {
    let response = '';
    req.on('data', chunk => { response += chunk.toString(); });
    req.on('end', () => {
      try {
        const result = JSON.parse(response);
        const suite = results[result.suite];
        suite.notes = result.notes ?? [];
        suite.tests = result.tests ?? [];
        suite.fails = suite.tests.filter(test => test.asserts.length);
        suite.passes = suite.tests.filter(test => !test.asserts.length);
      } catch (e) { console.fail("Error parsing POST data"); }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
      if (testFiles.length) { 
        launch(); 
      } else {
        let html = `<html><head><title>WEBTINI TEST RESULTS</title></head><body><h1>WEBTINI TEST RESULTS: <small>${new Date().toUTCString()}</small></h1>`;
        console.warn("Test Results:");
        for (const suite of Object.values(results)) {
          html += `<h2>${suite.suite}</h2><ul>`;
          if (suite.fails.length) { console.fail( `✘ ${suite.suite}:`); }
          else { console.pass(`✔ ${suite.suite}:`); }
          for (const note of suite.notes) {
            console.warn(`  Note: ${note}`);
          }
          for (const test of suite.fails) {
            html += `<li style="color:red;">${test.description}<ul>`;
            console.fail(`  ✘ ${test.description}:`);
            for (const failure of test.asserts) {
              console.log(`    ${failure}`);
            }
          }
          for (const test of suite.passes) {
            html += `<li style="color:green;">${test.description}</li>`;
            console.pass(`  ✔ ${test.description}:`);
          }
          html += '</ul>';
        }
        const tests = Object.values(results).flatMap(s => s.tests).length;
        const passes = Object.values(results).flatMap(s => s.passes).length;
        const failed = tests - passes;
        const resultText = `Tests: ${tests}, Passed: ${passes}, Failed: ${failed}`;
        if (failed) { console.fail(resultText); }
        else { console.warn(resultText); }
        html += `<h2>${resultText}</h2>`;
        html += '</body></html>';
        FS.writeFileSync(ouput, html);
        process.exit(failed ? 1 : 0); 
      }
    });
    return;
  }
}).listen(testPort);

launch();