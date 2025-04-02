import Route from '../src/Route.js';
import run from './run.js';

run('Route.find finds match', {Route}, () => {
  const data = { Test: 123 };
  assert.equal(Route.find(data, 'Test'), 'Test', 'should find exact match');
  assert.equal(Route.find(data, 'test'), 'Test', 'should find insensitive match');
});

run('Route.find defaults to name', {Route}, () => {
  const data = {};
  assert.equal(Route.find(data, 'Test'), 'Test', 'should return name if no match found');
});

run('new Route creates root', {Route}, () => {
  const route = new Route(123);
  assert.equal(route.root, route, 'should set root to itself');
  assert.equal(route.last, route, 'shoule set last to itself');
  assert.equal(route.value, 123, 'should have constructor value');
  assert.nothing(route.name, 'should have no name');
  assert.nothing(route.parent, 'should have no parent');
  assert.nothing(route.next, 'should have no next node');
  assert.nothing(route.data, 'should have no data');
  assert.nothing(route.index, 'should have no index');
  assert.equal(route.result, 123, 'should have result equal to value');
});

run('Route.append adds next node', {Route}, () => {
  const route = new Route(123);
  const next = route.append('test', 456);
  assert.equal(next.name, 'test', 'next name is test');
  assert.equal(next.value, 456, 'next value is 456');
  assert.equal(next.parent, route, 'next parent is the route');
  assert.equal(next.last, next, 'should set last to the new node');
  assert.equal(route.root, route, 'root should remain unchanged');
  assert.equal(route.next, next, 'route next should point to the new node');
  assert.equal(route.last, next, 'should set last to the new node');
  assert.equal([...route].length, 2, 'should iterate over both nodes');
});

run('Route.data returns -2', {Route}, () => {
  const data = 123;
  const root = new Route(data);
  assert.nothing(root.data, 'single node should have no data');
  const next = root.append('test', 321);
  assert.equal(next.data, data, 'next node should return root as data');
});

run('Route.index returns last.name', {Route}, () => {
  const name = 'test';
  const data = 123;
  const root = new Route({ [name]: data });
  assert.nothing(root.index, 'single node should have no index');
  const next = root.append(name, data);
  assert.equal(root.index, name, 'index should be the result index');
  assert.equal(root.result, data, 'result should be the result value');
  assert.equal(root.data, root.value, 'data should be the parent value');
});

run('Route.value returns the node value', {Route}, () => {
  const root = new Route(123);
  const next = root.append('test', 456);
  assert.equal(root.value, 123, 'root value should be 123');
  assert.equal(next.value, 456, 'next value should be 456');
});

run('Route.next and Route.parent and Route.root and Route.last', {Route}, () => {
  const root = new Route(123);
  const next = root.append('test', 456);
  assert.equal(root.next, next, 'root next should point to the first child');
  assert.equal(next.parent, root, 'next parent should point to root');
  assert.equal(root.last, next, 'root last should point to the last child');
  assert.equal(next.last, next, 'next last should point to itself');
  assert.equal(root.root, root, 'root should point to itself as root');
  assert.equal(next.root, root, 'next should point to root as well');
});