import ClassBinder from './src/ClassBinder.js';
import Binder from './src/Binder.js';
import Route from './src/Route.js';

run('ClassBinder.PREFIX is unchanged', assert => {
  assert.equal(ClassBinder.PREFIX, 'class-', 'Changing ClassBinder.PREFIX may break existing code.');
});

run('new ClassBinder()', assert => {
  assert.succeeds(() => { new ClassBinder(); }, 'new ClassBinder w/ no arguments');
});

run('ClassBinder.handleAttribute false without prefix', assert => {
  const extension = new ClassBinder();
  assert.falsey(extension.handleAttribute(
    new Binder(),
    document.createElement('div'),
    new Route(),
    'not-attribute',
    'value'
  ), 'Expected handleAttribute to return false without prefix');
});

run('ClassBinder.handleAttribute true with prefix', assert => {
  const extension = new ClassBinder();
  assert.truthy(extension.handleAttribute(
    new Binder(),
    document.createElement('div'),
    new Route(),
    ClassBinder.PREFIX + 'test',
    'value'
  ), 'Expected handleAttribute to return true with prefix');
});

run('ClassBinder.handleAttribute removes class with no data', assert => {
  const extension = new ClassBinder();
  const element = document.createElement('div');
  const attribute = ClassBinder.PREFIX + 'test';
  element.classList.add('test');
  assert.truthy(extension.handleAttribute(
    new Binder(),
    element,
    new Route(),
    attribute,
    'value'
  ), 'Expected handleAttribute to return false without prefix');
  assert.falsey(element.classList.contains('test'), 'Expected class to be removed');
});

run('ClassBinder.handleAttribute adds class with data', assert => {
  const extension = new ClassBinder();
  const element = document.createElement('div');
  const attribute = ClassBinder.PREFIX + 'test';
  assert.truthy(extension.handleAttribute(
    new Binder(),
    element,
    new Route({value: true}),
    attribute,
    'value'
  ), 'Expected handleAttribute to return true');
  assert.truthy(element.classList.contains('test'), 'Expected class to be added');
});

