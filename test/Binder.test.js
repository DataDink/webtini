import Binder from './src/Binder.js';

run('Binder.PREFIX unchanged', () => {
  assert.equal(Binder.PREFIX, 'bind-', 'changing Binder.PREFIX may break existing code');
});

run('Binder.ATTRIBUTE unchanged', () => {
  assert.equal(Binder.ATTRIBUTE, 'bind', 'Binder.ATTRIBUTE may break existing code');
});

run('new Binder()', () => {
  assert.succeeds(() => { new Binder(); }, "new Binder w/ no arguments");
});

run('new Binder.Extension()', () => {
  assert.succeeds(() => { new Binder.Extension(); }, "new Binder.Extension w/ no arguments");
});

run('Binder.Extension.handleElement default false', () => {
  const extension = new Binder.Extension();
  assert.falsey(extension.handleElement(null, null, null), 'Extension.handleElement should default to false');
});

run('Binder.Extension.handleAttribute default false', () => {
  const extension = new Binder.Extension();
  assert.falsey(extension.handleAttribute(null, null, null, null, null), 'Extension.handleAttribute should default to false');
});

run('Binder.bind succeeds with no extensions or parameters', () => {
  const binder = new Binder();
  assert.succeeds(() => binder.bind(), 'Expected bind() to not throw');
});

run('Binder.bind succeeds with no extensions or data', () => {
  const binder = new Binder();
  const view = document.createElement('div');
  assert.succeeds(() => binder.bind(view), 'Expected bind() to not throw');
});

run('Binder.bind binds property with no extensions', () => {
  const binder = new Binder();
  const view = document.createElement('div');
  view.setAttribute(Binder.PREFIX + 'test', 'value');
  binder.bind(view);
  assert.nothing(view.test, 'Expected view.test to be null when no data is bound');
  binder.bind(view, {value: 123});
  assert.equal(view.test, 123, 'Expected view.test to be bound to 123');
  binder.bind(view);
  assert.nothing(view.test, 'Expected view.test to be nothing again when no data is bound');
  binder.bind(view, {notvalue: 456});
  assert.nothing(view.test, 'Expected view.test to be nothing again when no property matches');
});
