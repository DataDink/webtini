import TextBinder from './src/TextBinder.js';
import Binder from './src/Binder.js';
import Route from './src/Route.js';

run('new TextBinder()', () => {
  assert.succeeds(() => { new TextBinder(); }, "new TextBinder w/ no arguments");
});

run('TextBinder parses null', () => {
  const results = TextBinder.parse(null);
  assert.truthy(Array.isArray(results), 'Expected parse(null) to return an array');
  assert.equal(results.length, 0, 'Expected parse(null) to return an empty array');
});

run('TextBinder parses empty string', () => {
  const results = TextBinder.parse('');
  assert.truthy(Array.isArray(results), 'Expected parse("") to return an array');
  assert.equal(results.length, 0, 'Expected parse("") to return an empty array');
});

run('TextBinder parses simple text', () => {
  const results = TextBinder.parse('Hello World');
  assert.truthy(Array.isArray(results), 'Expected parse("Hello World") to return an array');
  assert.equal(results.length, 0, 'Expected parse("Hello World") to return an array of length 0');
});

run('TextBinder parses single binding at end', () => {
  const results = TextBinder.parse('Hello {name}');
  assert.truthy(Array.isArray(results), 'Expected parse("Hello {name}") to return an array');
  assert.equal(results.length, 2, 'Expected parse("Hello {name}") to return an array of length 2');
  assert.equal(results[0].text, 'Hello ', 'Expected first part text to be "Hello "');
  assert.equal(results[0].selector, 'name', 'Expected first part selector to be "name"');
  assert.nothing(results[1].selector, 'Expected second part to have no selector');
  assert.equal(results[1].text, '', 'Expected second part text to be ""');
});

run('TextBinder parses single binding at front', () => {
  const results = TextBinder.parse('{name} Hello');
  assert.truthy(Array.isArray(results), 'Expected parse("{name} Hello") to return an array');
  assert.equal(results.length, 2, 'Expected parse("{name} Hello") to return an array of length 2');
  assert.equal(results[0].text, '', 'Expected first part text to be ""');
  assert.equal(results[0].selector, 'name', 'Expected first part selector to be "name"');
  assert.nothing(results[1].selector, 'Expected second part to have no selector');
  assert.equal(results[1].text, ' Hello', 'Expected second part text to be " Hello"');
});

run('TextBinder parses single binding at middle', () => {
  const results = TextBinder.parse('Hello {name} Hello');
  assert.truthy(Array.isArray(results), 'Expected parse("Hello {name} Hello") to return an array');
  assert.equal(results.length, 2, 'Expected parse("Hello {name} Hello") to return an array of length 2');
  assert.equal(results[0].text, 'Hello ', 'Expected first part text to be "Hello "');
  assert.equal(results[0].selector, 'name', 'Expected first part selector to be "name"');
  assert.nothing(results[1].selector, 'Expected second part to have no selector');
  assert.equal(results[1].text, ' Hello', 'Expected second part text to be " Hello"');
});

run('TextBinder parses multiple bindings', () => {
  const results = TextBinder.parse('Hello {name}, welcome to {place}!');
  assert.truthy(Array.isArray(results), 'Expected parse("Hello {name}, welcome to {place}!") to return an array');
  assert.equal(results.length, 3, 'Expected parse("Hello {name}, welcome to {place}!") to return an array of length 3');
  assert.equal(results[0].text, 'Hello ', 'Expected first part text to be "Hello "');
  assert.equal(results[0].selector, 'name', 'Expected first part selector to be "name"');
  assert.equal(results[1].text, ', welcome to ', 'Expected second part text to be ", welcome to "');
  assert.equal(results[1].selector, 'place', 'Expected second part selector to be "place"');
  assert.nothing(results[2].selector, 'Expected third part to have no selector');
  assert.equal(results[2].text, '!', 'Expected third part text to be "!"');
});

run('TextBinder parses escaped braces', () => {
  const results = TextBinder.parse('Hello {{name}} and {place}!');
  assert.truthy(Array.isArray(results), 'Expected parse("Hello {{name}} and {place}!") to return an array');
  assert.equal(results.length, 4, 'Expected parse("Hello {{name}} and {place}!") to return an array of length 4');
  assert.equal(results[0].text, 'Hello {', 'Expected first part text to be "Hello {"');
  assert.nothing(results[0].selector, 'Expected first part no selector');
  assert.equal(results[1].text, 'name}', 'Expected second part text to be "name}"');
  assert.nothing(results[1].selector, 'Expected second part no selector');
  assert.equal(results[2].text, ' and ', 'Expected third part text to be " and "');
  assert.equal(results[2].selector, 'place', 'Expected third part selector to be "place"');
  assert.nothing(results[3].selector, 'Expected fourth part to have no selector');
  assert.equal(results[3].text, '!', 'Expected fourth part text to be "!"');
});
