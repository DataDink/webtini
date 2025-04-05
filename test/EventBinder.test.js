import EventBinder from './src/EventBinder.js';
import Binder from './src/Binder.js';
import Route from './src/Route.js';

run('EventBinder.PREFIX is unchanged', assert => {
  assert.equal(EventBinder.PREFIX, 'event-', 'Changing EventBinder.PREFIX may break existing code.');
});

run('new EventBinder()', assert => {
  assert.succeeds(() => { new EventBinder(); }, 'new EventBinder w/ no arguments');
});

run('EventBinder.handleAttribute false without prefix', assert => {
  const extension = new EventBinder();
  assert.falsey(extension.handleAttribute(
    new Binder(),
    document.createElement('div'),
    new Route(),
    'not-attribute',
    'value'
  ), 'Expected handleAttribute to return false without prefix');
});

run('EventBinder.handleAttribute true with prefix', assert => {
  const extension = new EventBinder();
  assert.truthy(extension.handleAttribute(
    new Binder(),
    document.createElement('div'),
    new Route(),
    EventBinder.PREFIX + 'test',
    'value'
  ), 'Expected handleAttribute to return true with prefix');
});

run('EventBinder.handleAttribute assigns function to event', assert => {
  const extension = new EventBinder();
  const element = document.createElement('div');
  const attribute = EventBinder.PREFIX + 'test';
  let triggered = false;
  const handler = () => { triggered = true; };
  assert.truthy(extension.handleAttribute(
    new Binder(),
    element,
    new Route({value: handler}),
    attribute,
    'value'
  ), 'Expected handleAttribute to return false without prefix');
  element.dispatchEvent(new Event('test'));
  assert.truthy(triggered, 'Expected the event handler to be called');
});

run('EventBinder.handleAttribute removes event listener on non-function', assert => {
  const extension = new EventBinder();
  const element = document.createElement('div');
  const attribute = EventBinder.PREFIX + 'test';
  let triggered = false;
  const handler = () => { triggered = true; };
  assert.truthy(extension.handleAttribute(
    new Binder(),
    element,
    new Route({value: handler}),
    attribute,
    'value'
  ), 'Expected handleAttribute to return false without prefix');
  assert.truthy(extension.handleAttribute(
    new Binder(),
    element,
    new Route({value: 123}),
    attribute,
    'value'
  ), 'Expected handleAttribute to return true for non-function value');
  element.dispatchEvent(new Event('test'));
  assert.falsey(triggered, 'Expected the event handler to be removed');
});
