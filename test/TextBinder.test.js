import TextBinder from './src/TextBinder.js';
import Binder from './src/Binder.js';
import Route from './src/Route.js';

run('new TextBinder()', assert => {
  assert.succeeds(() => { new TextBinder(); }, "new TextBinder w/ no arguments");
});

run('TextBinder parses null', assert => {
  const results = TextBinder.parse(null);
  assert.truthy(Array.isArray(results), 'Expected parse(null) to return an array');
  assert.equal(results.length, 0, 'Expected parse(null) to return an empty array');
});

run('TextBinder parses empty string', assert => {
  const results = TextBinder.parse('');
  assert.truthy(Array.isArray(results), 'Expected parse("") to return an array');
  assert.equal(results.length, 0, 'Expected parse("") to return an empty array');
});

run('TextBinder parses simple text', assert => {
  const results = TextBinder.parse('Hello World');
  assert.truthy(Array.isArray(results), 'Expected parse("Hello World") to return an array');
  assert.equal(results.length, 0, 'Expected parse("Hello World") to return an array of length 0');
});

run('TextBinder parses single binding at end', assert => {
  const results = TextBinder.parse('Hello {name}');
  assert.truthy(Array.isArray(results), 'Expected parse("Hello {name}") to return an array');
  assert.equal(results.length, 2, 'Expected parse("Hello {name}") to return an array of length 2');
  assert.equal(results[0].text, 'Hello ', 'Expected first part text to be "Hello "');
  assert.equal(results[0].selector, 'name', 'Expected first part selector to be "name"');
  assert.nothing(results[1].selector, 'Expected second part to have no selector');
  assert.equal(results[1].text, '', 'Expected second part text to be ""');
});

run('TextBinder parses single binding at front', assert => {
  const results = TextBinder.parse('{name} Hello');
  assert.truthy(Array.isArray(results), 'Expected parse("{name} Hello") to return an array');
  assert.equal(results.length, 2, 'Expected parse("{name} Hello") to return an array of length 2');
  assert.equal(results[0].text, '', 'Expected first part text to be ""');
  assert.equal(results[0].selector, 'name', 'Expected first part selector to be "name"');
  assert.nothing(results[1].selector, 'Expected second part to have no selector');
  assert.equal(results[1].text, ' Hello', 'Expected second part text to be " Hello"');
});

run('TextBinder parses single binding at middle', assert => {
  const results = TextBinder.parse('Hello {name} Hello');
  assert.truthy(Array.isArray(results), 'Expected parse("Hello {name} Hello") to return an array');
  assert.equal(results.length, 2, 'Expected parse("Hello {name} Hello") to return an array of length 2');
  assert.equal(results[0].text, 'Hello ', 'Expected first part text to be "Hello "');
  assert.equal(results[0].selector, 'name', 'Expected first part selector to be "name"');
  assert.nothing(results[1].selector, 'Expected second part to have no selector');
  assert.equal(results[1].text, ' Hello', 'Expected second part text to be " Hello"');
});

run('TextBinder parses multiple bindings', assert => {
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

run('TextBinder parses escaped braces', assert => {
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

run('TextBinder.handleElement false for non-Text node', assert => {
  const binder = new TextBinder();
  const element = document.createElement('div');
  const result = binder.handleElement(new Binder(), element, new Route());
  assert.falsey(result, 'Expected handleElement to return false for non-Text node');
});

run('TextBinder.handleElement true for Text node without bindings', assert => {
  const binder = new TextBinder();
  const element = document.createTextNode('No bindings here');
  const result = binder.handleElement(new Binder(), element, new Route());
  assert.truthy(result, 'Expected handleElement to return true for Text node without bindings');
  assert.equal(element.textContent, 'No bindings here', 'Expected text content to remain unchanged');
});

run('TextBinder.handleElement updates Text node with bindings', assert => {
  const binder = new TextBinder();
  const model = { name: 'Alice', place: 'Wonderland' };
  const element = document.createTextNode('Hello {name}, welcome to {place}!');
  const route = new Route(model);
  binder.handleElement(new Binder(), element, route);
  assert.equal(element.textContent, 'Hello Alice, welcome to Wonderland!', 'Expected text content to be updated correctly');
});

run('TextBinder does not bind text in a style element', assert => {
  const text = 'Hello {name}, welcome to {place}!';
  const binder = new TextBinder();
  const model = { name: 'Alice', place: 'Wonderland' };
  const element = document.createTextNode(text);
  const styleElement = document.createElement('style');
  styleElement.appendChild(element);
  const route = new Route(model);
  binder.handleElement(new Binder(), element, route);
  assert.equal(element.textContent, text, 'Expected text content to remain unchanged in a style element');
});
