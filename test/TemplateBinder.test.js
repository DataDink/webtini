import TemplateBinder from './src/TemplateBinder.js';
import Route from './src/Route.js';
import Binder from './src/Binder.js';

run('new TemplateBinder()', assert => {
  assert.succeeds(() => { new TemplateBinder(); }, "new TemplateBinder w/ no arguments");
});

run('TemplateBinder.handleElement false with non-template', assert => {
  const binder = new TemplateBinder();
  const element = document.createElement('div'); // Non-template element
  const result = binder.handleElement(new Binder(), element, new Route());
  assert.falsey(result, "Expected handleElement to return false for non-template elements");
});

run('TemplateBinder.handleElement true with template', assert => {
  const extension = new TemplateBinder();
  const binder = new Binder(extension);
  const container = document.createElement('div');
  const element = container.appendChild(document.createElement('template')); 
  element.innerHTML = '<div>adsf</div>';
  const result = extension.handleElement(binder, element, new Route());
  assert.truthy(result, "Expected handleElement to return true for template elements");
});

run('TemplateBinder.handleElement adds no instances for null', assert => {
  const extension = new TemplateBinder();
  const binder = new Binder(extension);
  const container = document.createElement('div');
  const element = container.appendChild(document.createElement('template')); 
  element.innerHTML = '<div>asdf</div>';
  assert.truthy(extension.handleElement(binder, element, new Route(null)));
  assert.equal([...container.childNodes].length, 1, "Expected no new instances to be added for null route");
});

run('TemplateBinder.handleElement single instance for non-array', assert => {
  const extension = new TemplateBinder();
  const binder = new Binder(extension);
  const container = document.createElement('div');
  const element = container.appendChild(document.createElement('template')); 
  element.innerHTML = '<div bind-test="value"></div>';
  const route = new Route({value:123});
  assert.truthy(extension.handleElement(binder, element, route));
  assert.equal([...container.childNodes].length, 2, "Expected one new instance to be added for non-array route");
  const instance = container.querySelector('div');
  assert.truthy(instance, "Expected the new instance to be created");
  assert.equal(instance.test, 123, "Expected the new instance to have the correct bound value");
});

run('TemplateBinder.handleElement two instance for two item array', assert => {
  const extension = new TemplateBinder();
  const binder = new Binder(extension);
  const container = document.createElement('div');
  const element = container.appendChild(document.createElement('template')); 
  element.innerHTML = '<div bind-test="value"></div>';
  const route = new Route([{value: 123}, {value: 456}]);
  assert.truthy(extension.handleElement(binder, element, route));
  assert.equal([...container.childNodes].length, 3, "Expected one new instance to be added for non-array route");
  const instances = [...container.querySelectorAll('div')];
  assert.equal(instances.length, 2, "Expected two new instances to be created");
  assert.equal(instances[0].test, 123, "Expected the first instance to have the correct bound value");
  assert.equal(instances[1].test, 456, "Expected the first instance to have the correct bound value");
});
