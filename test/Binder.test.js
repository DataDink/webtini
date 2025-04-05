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

run('Binder.bind succeeds with no extensions or parameters', assert => {
  const binder = new Binder();
  assert.succeeds(() => binder.bind(), 'Expected bind() to not throw');
});

run('Binder.bind succeeds with no extensions or data', assert => {
  const binder = new Binder();
  const view = document.createElement('div');
  assert.succeeds(() => binder.bind(view), 'Expected bind() to not throw');
});

run('Binder binds property with no extensions', assert => {
  const binder = new Binder();
  const view = document.createElement('div');
  view.setAttribute(Binder.PREFIX + 'test', 'value');
  binder.bind(view);
  assert.nothing(view.test, 'Expected view.test to be null when no data is bound');
  binder.bind(view, {value: 123});
  assert.equal(view.test, 123, 'Expected view.test to be 123');
  binder.bind(view);
  assert.nothing(view.test, 'Expected view.test to be nothing again when no data is bound');
  binder.bind(view, {notvalue: 456});
  assert.nothing(view.test, 'Expected view.test to be nothing again when no property matches');
});

run('Binder binds nested property with no extensions', assert => {
  const binder = new Binder();
  const view = document.createElement('div');
  view.setAttribute(Binder.PREFIX + 'test-test', 'value');
  binder.bind(view, {value: 123});
  assert.something(view.test, 'Expected view.test to be an object');
  assert.equal(view.test.test, 123, 'Expected view.test.test to be 123');
});

run('Binder.bind reads nested property with no extensions', assert => {
  const binder = new Binder();
  const view = document.createElement('div');
  view.setAttribute(Binder.PREFIX + 'test', 'value.value');
  binder.bind(view, {value: {value: 123}});
  assert.equal(view.test, 123, 'Expected view.test to be 123');
});

run('Binder binds descendants with no extensions', assert => {
  const binder = new Binder();
  const parent = document.createElement('div');
  const child = parent.appendChild(document.createElement('div'));
  child.setAttribute(Binder.PREFIX + 'test', 'value');
  binder.bind(parent, {value: 123});
  assert.equal(child.test, 123, 'Expected child.test to be 123');
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
  element.setAttribute(Binder.PREFIX + 'test2', 'value');
  const binder = new Binder(new class extends Binder.Extension {
    handleAttribute(binder, view, data, name, value) {
      if (name !== 'test') { return false; }
      assert.truthy(binder instanceof Binder, 'Expected binder to be a binder');
      assert.equal(view, element, 'Expected view to be the element');
      assert.truthy(data instanceof Route, 'Expected data to be a route');
      assert.equal(value, 'value', 'Expected value to be value');
      return true;
    }
  }());
  binder.bind(element, {value: 123});
  assert.nothing(element.test, 'Expected extension to handle test attribute');
  assert.equal(element.test2, 123, 'Expected extension to not handle test2 attribute');
  const binder2 = new Binder(new class extends Binder.Extension {
    handleAttribute(binder, view, data, name, value) {
      return false;
    }
  }());
  binder2.bind(element, {value: 123});
  assert.equal(element.test, 123, 'Expected extension2 to not handle test attribute');
});

run('Binder triggers element extension', assert => {
  const parent = document.createElement('div');
  parent.setAttribute(Binder.PREFIX + 'test', 'value');
  const child = parent.appendChild(document.createElement('div'));
  child.setAttribute(Binder.PREFIX + 'test', 'value');
  const binder = new Binder(new class extends Binder.Extension {
    handleElement(binder, view, data) {
      assert.truthy(binder instanceof Binder, 'Expected binder to be a binder');
      assert.equal(view, parent, 'Expected view to be the parent');
      assert.truthy(data instanceof Route, 'Expected data to be a route');
      return true;
    }
  }());
  assert.nothing(parent.test, 'Expected extension to block parent');
  assert.nothing(child.test, 'Expected extension to block child');
  const binder2 = new Binder(new class extends Binder.Extension {
    handleElement(binder, view, data) {
      return false;
    }
  }());
  binder2.bind(parent, {value: 123});
  assert.equal(parent.test, 123, 'Expected extension2 to not block parent');
  assert.equal(child.test, 123, 'Expected extension2 to not block child');
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
