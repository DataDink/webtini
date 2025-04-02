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

run(`Route iterates from root`, {Route}, () => {
  const root = new Route(123);
  var node = root.append('asdf', 456);
  node = node.append('qwer', 789);
  var nodes = [...node];
  assert.equal(nodes.length, 3, 'should be 3 nodes');
  assert.equal(nodes[0], root, 'first node should be root');
  assert.equal(nodes[2], node, 'last node should be the last appended node');
  assert.equal(nodes[1], root.next, 'second node should be the first child of root');
  assert.equal(nodes[1], node.parent, 'second node should be the next of the first child');
});

run(`Route.clone maps from root`, {Route}, () => {
  const root = new Route(123);
  var node = root.append('asdf', 456);
  node = node.append('qwer', 789);
  var clone = root.clone();
  assert.equal(clone.data, root.data, 'clone root data should match original');
  assert.equal(clone.index, root.index, 'clone root index should match original');
  assert.equal(clone.result, root.result, 'clone root value should match original');
  assert.unequal(clone.root, root, 'clone root should not be the same instance as original');
  assert.unequal(clone.last, root.last, 'clone last should not be the same instance as original last');
  assert.unequal(clone, node, 'clone should not be the same instance as the original node');
  assert.unequal(clone.parent, node.parent, 'clone parent should not be the same instance as original parent');
  assert.equal([...clone].length, 3, 'clone should have the same number of nodes');
});

run(`Route.select generates valid route`, {Route}, () => {
  const root = new Route({ a: { b: { c: 123 } } });
  const route = root.select(['a', 'b', 'c']);
  const nodes = [ ...route ];
  assert.equal(route.index, 'c', 'should find the last index correctly');
  assert.equal(route.result, 123, 'should find the correct value at the end of the route');
  assert.equal(route.data, route.parent.value, 'should have the parent value as data');
  assert.equal(route.path.join('.'), 'a.b.c', 'should join the path correctly');
  assert.unequal(route.root, root, 'root should be new instance');
  assert.nothing(route.root.name, 'root should have no name');
  assert.equal(route.root.value, root.value, 'root value should match original root value');
  assert.equal(route.root.next, nodes[1], 'next should point to the first child of the root');
  assert.equal(route.root.next.next, nodes[2], 'next should point to the second child of the root');
});

run(`Route.select handles non-existent paths`, {Route}, () => {
  const root = new Route({});
  const route = root.select(['a', 'b', 'c']);
  const nodes = [ ...route ];
  assert.equal(route.index, 'c', 'should still set index to the last name');
  assert.nothing(route.result, 'non-existent path should have null value');
  assert.equal(route.parent.name, 'b', 'parent name should be parent index');
  assert.nothing(route.parent.value, 'non-existent parent should have null value');
  assert.equal(route.parent.parent.name, 'a', 'grandparent should have grandparent name');
  assert.nothing(route.parent.parent.value, 'grandparent should have null value');
  assert.equal(route.parent.parent.parent, route.root, 'great-grandparent should be root');
  assert.equal(nodes.length, 4, 'should have 3 nodes in the route');
});