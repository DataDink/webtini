/**
 * @author Greenwald
 * @license PDL
 */

/**
 * @class Route
 * @description A class for selecting and assigning values in a data model.
 * @example
 * ```javascript
 * var model = { a: { b: { c: 'value' } } };
 * var route = Route.select(model, ['a', 'b', 'c']);
 * JSON.stringify(route.data); // { c: 'value' }
 * console.log(route.index); // 'c'
 * console.log(route.result); // 'value'
 * ```
 * 
 * ```javascript
 * var model = { x: { y: { z: 'value' } } };
 * var route = Route.select(model, ['a', 'b', 'c']);
 * [...route].map(node => node.name).join(', '); // null, 'a', 'b', 'c'
 * [...route].map(node => node.value).join(', '); // object, null, null, null
 * ```
 */
export default class Route {
  /**
   * @property root
   * @description The root node of the route.
   * @type {Route}
   */
  get root() { return this.#root; } #root;
  /**
   * @property parent
   * @description The previous sibling of this node.
   * @type {Route}
   */
  get parent() { return this.#parent; } #parent;
  /**
   * @property name
   * @description The name of this node.
   * @type {string}
   */
  get name() { return this.#name; } #name;
  /**
   * @property value
   * @description The value of this node.
   * @type {*}
   */
  get value() { return this.#value; } #value;
  /**
   * @property next
   * @description The next sibling of this node.
   * @type {Route}
   */
  get next() { return this.#next; } #next;
  /**
   * @property last
   * @description The last node in the route.
   * @type {Route}
   */
  get last() { return this.#root.#last; } #last;
  /**
   * @property path
   * @description The key path of the route.
   * @type {string[]}
   */
  get path() { return [...this].map(node => node.name); }
  /**
   * @property data
   * @description The end data model of the route containing the result.
   * @type {*}
   */
  get data() { return this.last.parent?.value; }
  /**
   * @property index
   * @description The end key name of the route indexing the result.
   * @type {string}
   */
  get index() { return this.last.name; }
  /**
   * @property result
   * @description The result of the route.
   * @type {*}
   */
  get result() { return this.last.value; }
  /**
   * @constructor
   * @description Creates a new instance of the Route class with an optional root value.
   * @param {*} root 
   */
  constructor(root = null) { (this.#root = this.#last = this).#value = root; }
  *[Symbol.iterator]() { for (var node = this.#root; node; node = node.#next) { yield node; } }
  /**
   * @function append
   * @description Adds a node to the end of this {@link Route}.
   * @returns {Route}
   */
  append(name, value) {
    var next = this.#next = new Route();
    next.#name = name;
    next.#value = value;
    next.#root = this.#root;
    next.#parent = this;
    this.#root.#last = next;
    return next;
  }
  /**
   * @function clone
   * @description Creates a duplicate of this {@link Route}
   * @returns {Route}
   */
  clone() {
    var clone = new Route(this.value);
    for (var node = this.#next; node; node = node.#next) {
      clone = clone.append(node.#name, node.#value);
    }
    return clone;
  }
  /**
   * @function find
   * @description Performs a case-insensitive search for a matching key in the data object or defaults to the name.
   * @returns {string}
   */
  static find(data, name) {
    if (data == null || name in data) { return name; }
    var lower = name.toLowerCase();
    for (var key in data) { if (key.toLowerCase() === lower) { return key; } }
    return name;
  }
  /**
   * @function select
   * @description Extends this {@link Route} using the path and returns a new {@link Route} instance with the result.
   * @returns {Route}
   */
  select(path) { return Route.select(this, path); }
  /**
   * @function select
   * @description Creates or extends an existing {@link Route} using the path and returns a new {@link Route} instance with the result.
   * @returns {Route}
   */
  static select(source, path) {
    return (Array.isArray(path) ? path : []).reduce((r,m) => {
      if (!m?.length || m === '.') { return r; }
      else if (m === '~') { r = r.#root; r.#last = r; r.#next = null; }
      else if (m === '^') { r = r.#parent ?? r; r.#root.#last = r; r.#next = null; }
      else {
        var name = Route.find(r.#value, m);
        r = r.append(name, r.#value?.[name]); 
      }
      return r;
    }, source instanceof Route ? source.clone() : new Route(source));
  }
  /**
   * @function assign
   * @description Creates an updated {@link Route}, creating {@link object}s as necessary, and updating the {@link Route}s result to the value.
   * @returns {Route}
   */
  assign(value) { return Route.assign(this, value); }
  /**
   * @function assign
   * @description Creates an updated {@link Route}, creating {@link object}s as necessary, and updating the {@link Route}s result to the value.
   * @returns {Route}
   */
  static assign(route, value) {
    if (!(route instanceof Route)) { throw new Error('Route.assign: route must be an instance of a Route.'); }
    var result = new Route(route.#root.#value);
    if (route.root.next == null || result.value == null) { return result; }
    for (var node = route.root.next; node; node = node.next) {
      var name = Route.find(result.value, node.name);
      result = result.append(name, result.value[name] ?? (result.value[name] = {}));
    }
    result.#value = result.parent.value[result.name] = value;
    return result;
  }
}