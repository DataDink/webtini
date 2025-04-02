// HACK: A test runner for modules in a browser (JSDOM) environment
// TODO: Re-evaluate next week/month/year when the web community changes its mind about everything again...

import {JSDOM} from 'jsdom';

const results = {};

export default function run(description, environment, test) {
  test = typeof(test) === 'function' ? test : typeof(environment) === 'function' ? environment : typeof(description) === 'function' ? description : null;
  environment = typeof(environment) === 'object' ? environment : typeof(description) === 'object' ? description : {};
  description = typeof(description) === 'string' ? description : 'Test';
  const source = /(?<filename>[^/]+):(?<line>\d+):(?<column>\d+)/.exec(new Error().stack.split('\n')[2])?.groups ?? {};
  const result = {
    name: source.filename.replace(/\.[^\.]*$/, '') || '(unknown file)',
    line: parseInt(source.line || 0) || 0,
    column: parseInt(source.column || 0) || 0,
    description,
    failures: []
  };
  var suite = results[result.name] ??= [];
  suite.push(result);
  if (!test) {
    result.failures.push("run called with no test.");
    return;
  }
  const window = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, {
    url: 'http://localhost',
    referrer: 'http://localhost',
    contentType: 'text/html',
    includeNodeLocations: true,
    localStorage: 'memory',
    runScripts: 'dangerously',
    resources: 'usable'
  }).window;
  Object.entries(environment).forEach(([key, value]) => window[key] = value);
  window.console = console;
  window.assert = {
    truthy(value, message) { if (!value) { result.failures.push(`Expected truthy, was ${value}: ${message ?? ''}`); } },
    falsey(value, message) { if (value) { result.failures.push(`Expected falsey, was ${value}: ${message ?? ''}`); } },
    equal(actual, expected, message) { if (actual !== expected) { result.failures.push(`Expected ${expected} but got ${actual}: ${message ?? ''}`); } },
    unequal(actual, expected, message) { if (actual === expected) { result.failures.push(`Did not expect ${expected} but got it: ${message ?? ''}`); } },
    same(actual, expected, message) { if (JSON.stringify(actual) !== JSON.stringify(expected)) { result.failures.push(`Expected similar objects: ${message ?? ''}`); } },
    different(actual, expected, message) { if (JSON.stringify(actual) === JSON.stringify(expected)) { result.failures.push(`Expected different objects: ${message ?? ''}`); } },
    nothing(value, message) { if (value != null) { result.failures.push(`Expected nothing, but got ${value}: ${message ?? ''}`); } },
    something(value, message) { if (value == null) { result.failures.push(`Expected something, but got ${value}: ${message ?? ''}`); } },
    throws(fn, message) { try { fn(); result.failures.push(`Expected throw: ${message ?? ''}`); } catch (e) { } },
    succeeds(fn, message) { try { fn(); } catch (e) { results.failures.push(`Expected success: ${e.message}: ${message ?? ''}`); } }
  };
  try { window.eval(`(${test.toString()})()`); }
  catch (e) { result.failures.push(`Test error: ${e.message}`); }
}
Object.defineProperty(run, 'results', { get: () => results });
