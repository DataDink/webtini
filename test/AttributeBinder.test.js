import AttributeBinder from './src/AttributeBinder.js';
import Binder from './src/Binder.js';
import Route from './src/Route.js';

run('AttributeBinder.PREFIX unchanged', assert => {
  assert.equal(AttributeBinder.PREFIX, 'attribute-', 'changing AttributeBinder.PREFIX may break existing code');
});

run('new AttributeBinder()', assert => {
  assert.succeeds(() => { new AttributeBinder(); }, "new AttributeBinder w/ no arguments");
});

run('AttributeBinder.handleAttribute false without prefix', assert => {
  const extension = new AttributeBinder();
  assert.falsey(extension.handleAttribute(
    new Binder(),
    document.createElement('div'),
    new Route(),
    'not-attribute',
    'value'
  ), 'Expected handleAttribute to return false without prefix');
});

run('AttributeBinder.handleAttribute true with prefix', assert => {
  const extension = new AttributeBinder();
  assert.truthy(extension.handleAttribute(
    new Binder(),
    document.createElement('div'),
    new Route(),
    AttributeBinder.PREFIX + 'test',
    'value'
  ), 'Expected handleAttribute to return true with prefix');
});

run('AttributeBinder.handleAttribute removes attribute with no data', assert => {
  const extension = new AttributeBinder();
  const element = document.createElement('div');
  const attribute = AttributeBinder.PREFIX + 'test';
  element.setAttribute('test', 'asdf');
  assert.truthy(extension.handleAttribute(
    new Binder(),
    element,
    new Route(),
    attribute,
    'value'
  ), 'Expected handleAttribute to return true');
  assert.falsey(element.hasAttribute('test'), 'Expected attribute to be removed');
});

run('AttributeBinder.handleAttribute sets attribute with data', assert => {
  const extension = new AttributeBinder();
  const element = document.createElement('div');
  const attribute = AttributeBinder.PREFIX + 'test';
  assert.truthy(extension.handleAttribute(
    new Binder(),
    element,
    new Route({value: 123}),
    attribute,
    'value'
  ), 'Expected handleAttribute to return true');
  assert.truthy(element.hasAttribute('test'), 'Expected attribute to be set');
  assert.equal(element.getAttribute('test'), '123', 'Expected attribute to be set to data');
});

