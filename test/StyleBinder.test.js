import StyleBinder from './src/StyleBinder.js';
import Binder from './src/Binder.js';
import Route from './src/Route.js';

run('StyleBinder.PREFIX unchanged', () => {
  assert.equal(StyleBinder.PREFIX, 'style-', 'changing StyleBinder.PREFIX may break existing code');
});

run('new StyleBinder()', () => {
  assert.succeeds(() => { new StyleBinder(); }, "new StyleBinder w/ no arguments");
});

run('StyleBinder.handleAttribute false without prefix', () => {
  const extension = new StyleBinder();
  assert.falsey(extension.handleAttribute(
    new Binder(),
    document.createElement('div'),
    new Route(),
    'not-attribute',
    'value'
  ), 'Expected handleAttribute to return false without prefix');
});

run('StyleBinder.handleAttribute true with prefix', () => {
  const extension = new StyleBinder();
  assert.truthy(extension.handleAttribute(
    new Binder(),
    document.createElement('div'),
    new Route(),
    StyleBinder.PREFIX + 'test',
    'value'
  ), 'Expected handleAttribute to return true with prefix');
});

run('StyleBinder.handleAttribute removes style with no data', () => {
  const extension = new StyleBinder();
  const element = document.createElement('div');
  const attribute = StyleBinder.PREFIX + 'border';
  element.style.border = '1px solid red';;
  assert.truthy(extension.handleAttribute(
    new Binder(),
    element,
    new Route(),
    attribute,
    'value'
  ), 'Expected handleAttribute to return true');
  assert.equal(element.style.border, '', 'Expected style to be cleared');
});

run('StyleBinder.handleAttribute sets style with data', () => {
  const extension = new StyleBinder();
  const element = document.createElement('div');
  const attribute = StyleBinder.PREFIX + 'borderColor';
  assert.truthy(extension.handleAttribute(
    new Binder(),
    element,
    new Route({value: 'blue'}), // Simulating data route
    attribute,
    'value'
  ), 'Expected handleAttribute to return true');

  // Check if the style was set correctly
  assert.equal(element.style.borderColor, 'blue', 'Expected borderColor to be set to blue');
});

