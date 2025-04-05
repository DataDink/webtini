import Binder from './src/Binder.js';
import Route from './src/Route.js';

run('Binder.PREFIX unchanged', assert => {
  assert.equal(Binder.PREFIX, 'bind-', 'changing Binder.PREFIX may break existing code');
});

run('Binder.ATTRIBUTE unchanged', assert => {
  assert.equal(Binder.ATTRIBUTE, 'bind', 'Binder.ATTRIBUTE may break existing code');
});

run('new Binder()', assert => {
  assert.succeeds(() => { new Binder(); }, "new Binder w/ no arguments");
});

run('new Binder.Extension()', assert => {
  assert.succeeds(() => { new Binder.Extension(); }, "new Binder.Extension w/ no arguments");
});

run('Binder.Extension.handleElement default false', assert => {
  const extension = new Binder.Extension();
  assert.falsey(extension.handleElement(null, null, null), 'Extension.handleElement should default to false');
});

run('Binder.Extension.handleAttribute default false', assert => {
  const extension = new Binder.Extension();
  assert.falsey(extension.handleAttribute(null, null, null, null, null), 'Extension.handleAttribute should default to false');
});

run('Binder.bind succeeds with no parameters', assert => {
  const binder = new Binder();
  assert.succeeds(() => binder.bind(), 'Expected bind() to not throw');
});

run('Binder.bind succeeds with no data', assert => {
  const binder = new Binder();
  const view = document.createElement('div');
  assert.succeeds(() => binder.bind(view), 'Expected bind() to not throw');
});

run('Binder sets property with value', assert => {
  const binder = new Binder();
  const view = document.createElement('div');
  view.setAttribute(Binder.PREFIX + 'test', 'value');
  binder.bind(view, {value: 123});
  assert.equal(view.test, 123, 'Expected view.test to be 123');
});

run('Binder unsets property with missing value', assert => {
  const binder = new Binder();
  const view = document.createElement('div');
  view.setAttribute(Binder.PREFIX + 'test', 'value');
  view.test = 123
  binder.bind(view, {missing: 123});
  assert.nothing(view.test, 'Expected view.test to be nothing');
});

run('Binder sets nested property with value', assert => {
  const binder = new Binder();
  const view = document.createElement('div');
  view.setAttribute(Binder.PREFIX + 'test-test', 'value');
  binder.bind(view, {value: 123});
  assert.something(view.test, 'Expected view.test to be an object');
  assert.equal(view.test.test, 123, 'Expected view.test.test to be 123');
});

run('Binder unsets nested property with missing value', assert => {
  const binder = new Binder();
  const view = document.createElement('div');
  view.setAttribute(Binder.PREFIX + 'test-test', 'value');
  view.test = { test: 123 }; 
  binder.bind(view, {missing: 123}); 
  assert.nothing(view.test.test, 'Expected view.test.test to be nothing after unbinding missing value');
});

run('Binder sets property with nested value', assert => {
  const binder = new Binder();
  const view = document.createElement('div');
  view.setAttribute(Binder.PREFIX + 'test', 'value.value');
  binder.bind(view, {value: {value: 123}});
  assert.equal(view.test, 123, 'Expected view.test to be 123');
});

run('Binder unsets property with missing nested value', assert => {
  const binder = new Binder();
  const view = document.createElement('div');
  view.setAttribute(Binder.PREFIX + 'test', 'value.value');
  view.test = 'asdf'; 
  binder.bind(view, {value: {}}); 
  assert.nothing(view.test, 'Expected view.test to be nothing after unbinding missing nested value');
});

run('Binder binds descendants', assert => {
  const binder = new Binder();
  const parent = document.createElement('div');
  const child = parent.appendChild(document.createElement('div'));
  child.setAttribute(Binder.PREFIX + 'test', 'value');
  binder.bind(parent, {value: 123});
  assert.equal(child.test, 123, 'Expected child.test to be 123');
});

run('Binder binds Nodes', assert => {
  const node = document.createDocumentFragment();
  const binder = new Binder();
  assert.succeeds(() => binder.bind(node, {}), 'Expected bind() to not throw with Node instance');
});

run('Binder binds with dummy extension', assert => {
  const binder = new Binder(new Binder.Extension());
  const parent = document.createElement('div');
  parent.setAttribute(Binder.PREFIX + 'test', 'value');
  const child = parent.appendChild(document.createElement('div'));
  child.setAttribute(Binder.PREFIX + 'test', 'value');
  binder.bind(parent, {value: 123});
  assert.equal(parent.test, 123, 'Expected parent.test to be 123');
  assert.equal(child.test, 123, 'Expected child.test to be 123');
});

run('Binder triggers attribute extension', assert => {
  const element = document.createElement('div');
  element.setAttribute(Binder.PREFIX + 'test', 'value');
  var args = {};
  const binder = new Binder(new class extends Binder.Extension {
    handleAttribute(binder, view, data, name, value) { 
      args = { binder, view, data, name, value };
      return true; 
    } 
  }());
  binder.bind(element, {value: 123});
  assert.equal(args.binder, binder, 'Expected binder to be the same instance');
  assert.equal(args.view, element, 'Expected view to be the element');
  assert.truthy(args.data instanceof Route, 'Expected data to be a route');
  assert.equal(args.name, 'test', 'Expected name to be test');
  assert.equal(args.value, 'value', 'Expected value to be value');
});

run('Binder respects attribute extension return value', assert => {
  const element = document.createElement('div');
  element.setAttribute(Binder.PREFIX + 'test', 'value');
  element.setAttribute(Binder.PREFIX + 'test2', 'value');
  const binder = new Binder(new class extends Binder.Extension {
    handleAttribute(binder, view, data, name, value) { 
      return name === 'test'; 
    } 
  }());
  binder.bind(element, {value: 123});
  assert.equal(element.test2, 123, 'Expected element.test to be 123');
  assert.nothing(element.test, 'Expected element.test2 to remain unchanged');
});

run('Binder triggers element extension', assert => {
  const element = document.createElement('div');
  var args = {};
  const binder = new Binder(new class extends Binder.Extension {
    handleElement(binder, view, data) {
      args = { binder, view, data };
      return true;
    }
  }());
  binder.bind(element, {value: 123});
  assert.equal(args.binder, binder, 'Expected binder to be the same instance');
  assert.equal(args.view, element, 'Expected view to be the element');
  assert.truthy(args.data instanceof Route, 'Expected data to be a Route instance');
});

run('Binder respects element extension return value', assert => {
  const element = document.createElement('div');
  element.setAttribute(Binder.PREFIX + 'test', 'value');
  const binder = new Binder(new class extends Binder.Extension {
    handleElement(binder, view, data) {
      return true; 
    }
  }());
  binder.bind(element, {value: 123});
  assert.nothing(element.test, 'Expected element to be unprocessed');
});

run('Defer postpones', async assert => {
  const binder = new Binder();
  const view = document.createElement('div');
  view.setAttribute(Binder.PREFIX + 'test', 'value');
  binder.defer(view, { value: 123 });
  assert.nothing(view.test, 'Expected view.test to be nothing in the same stack as defer() is called');
  await new Promise(r => setTimeout(r));
  assert.equal(view.test, 123, 'Expected view.test to be 123 after defer() stack is ended'); 
});

run('Defer ignores multiple calls per stack', async assert => {
  const binder = new Binder();
  const view = document.createElement('div');
  view.setAttribute(Binder.PREFIX + 'test', 'value');
  var values = [];
  var stacks = []
  Object.defineProperty(view, 'test', { set(value) { 
    values.push(value); 
    stacks.push(new Error().stack.split('\n').slice(1).map(v => v.trim()).join('\n'));
  } });
  binder.defer(view, { value: 123 });
  binder.defer(view, { value: 234 });
  binder.defer(view, { value: 345 });
  binder.defer(view, { value: 456 });
  binder.defer(view, { value: 567 });
  binder.defer(view, { value: 678 });
  binder.defer(view, { value: 789 });
  assert.equal(values.length, 0, 'Expected view.test setter not to be called immediately');
  await new Promise(r => setTimeout(r));
  assert.equal(values.length, 1, `Expected view.test setter to be called only once after the stack is ended: ${values.join(',')}\n\n${stacks.join('\n\n---\n\n')}`);
});

run('Defer applies the last call per stack', async assert => {
  const binder = new Binder();
  const view = document.createElement('div');
  view.setAttribute(Binder.PREFIX + 'test', 'value');
  binder.defer(view, { value: 123 });
  binder.defer(view, { value: 456 });
  await new Promise(r => setTimeout(r));
  assert.equal(view.test, 456, 'Expected view.test to be 456 after the last defer() call in the stack is applied');
});
