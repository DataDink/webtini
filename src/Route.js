/**
 * @author Greenwald
 * @license PDL
 * @module Route
 */

export default class Route {
  /**
   * @property root
   * @memberof module:Route.Route
   * @description The root node of the route.
   * @type {Route}
   */
  get root() { return this.#root; } #root;
  /**
   * @property parent
   * @memberof module:Route.Route
   * @description The previous sibling of this node.
   * @type {Route}
   */
  get parent() { return this.#parent; } #parent;
  /**
   * @property name
   * @memberof module:Route.Route
   * @description The name of this node.
   * @type {string}
   */
  get name() { return this.#name; } #name;
  /**
   * @property value
   * @memberof module:Route.Route
   * @description The value of this node.
   * @type {*}
   */
  get value() { return this.#value; } #value;
  /**
   * @property next
   * @memberof module:Route.Route
   * @description The next sibling of this node.
   * @type {Route}
   */
  get next() { return this.#next; } #next;
  /**
   * @property last
   * @memberof module:Route.Route
   * @description The last node in the route.
   * @type {Route}
   */
  get last() { return this.#root.#last; } #last;
  /**
   * @property path
   * @memberof module:Route.Route
   * @description The key path of the route.
   * @type {string[]}
   */
  get path() { return [...this].slice(1).map(node => node.name); }
  /**
   * @property data
   * @memberof module:Route.Route
   * @description The end data model of the route containing the result.
   * @type {*}
   */
  get data() { return this.last.parent?.value; }
  /**
   * @property index
   * @memberof module:Route.Route
   * @description The end key name of the route indexing the result.
   * @type {string}
   */
  get index() { return this.last.name; }
  /**
   * @property result
   * @memberof module:Route.Route
   * @description The result of the route.
   * @type {*}
   */
  get result() { return this.last.value; }
  /**
   * @constructor Route
   * @memberof module:Route
   * @description A class for selecting and assigning values in a data model.
   * @param {*} root The root Route or data model this route is based on. 
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
  constructor(root = null) { (this.#root = this.#last = this).#value = root; }
  *[Symbol.iterator]() { for (var node = this.#root; node; node = node.#next) { yield node; } }
  /**
   * @function append
   * @memberof module:Route.Route
   * @description Adds a node to the end of this {@link Route}.
   * @param {string} name The name of the new node.
   * @param {*} value The value of the new node.
   * @returns {Route}
   */
  append(name, value) {
    const next = this.#next = new Route();
    next.#name = name;
    next.#value = value;
    next.#root = this.#root;
    next.#parent = this;
    this.#root.#last = next;
    return next;
  }
  /**
   * @function clone
   * @memberof module:Route.Route
   * @description Creates a duplicate of this {@link Route}
   * @returns {Route}
   */
  clone() {
    var clone = new Route(this.#root.#value);
    for (var node = this.#root.#next; node; node = node.#next) {
      clone = clone.append(node.#name, node.#value);
    }
    return clone;
  }
  /**
   * @function find
   * @memberof module:Route.Route
   * @description Performs a case-insensitive search for a matching key in the data object or defaults to the name.
   * @param {*} data The data object to search in.
   * @param {string} name The name of the key to find.
   * @returns {string}
   */
  static find(data, name) {
    if (data == null || name in data) { return name; }
    const lower = name.toLowerCase();
    for (var key in data) { if (key.toLowerCase() === lower) { return key; } }
    return name;
  }
  /**
   * @function select
   * @memberof module:Route.Route
   * @description Clones the {@link Route} appended with the data selection.
   * @param {string[]} path An array of member names defining the data selection path.
   * @returns {Route}
   */
  select(path) { return Route.select(this, path); }
  /**
   * @function select
   * @memberof module:Route.Route
   * @description Clones the {@link Route} appended with the data selection.
   * @param {*} source The root Route or data model to select from.
   * @param {string[]} path An array of member names defining the data selection path.
   * @returns {Route}
   */
  static select(source, path) {
    return (Array.isArray(path) ? path : []).reduce((r,m) => {
      if (!m?.length || m === '.') { return r; }
      else if (m === '~') { r = r.#root; r.#last = r; r.#next = null; }
      else if (m === '^') { r = r.#parent ?? r; r.#root.#last = r; r.#next = null; }
      else {
        const name = Route.find(r.#value, m);
        r = r.append(name, r.#value?.[name]); 
      }
      return r;
    }, source instanceof Route ? source.clone() : new Route(source));
  }
  /**
   * @function assign
   * @memberof module:Route.Route
   * @description Creates an updated {@link Route}, creating {@link object}s as necessary, and updating the {@link Route}s result to the value.
   * @param {*} value The value to assign to the route's result.
   * @returns {Route}
   */
  assign(value) { return Route.assign(this, value); }
  /**
   * @function assign
   * @memberof module:Route.Route
   * @description Creates an updated {@link Route}, creating {@link object}s as necessary, and updating the {@link Route}s result to the value.
   * @param {*} value The value to assign to the route's result.
   * @returns {Route}
   */
  static assign(route, value) {
    if (!(route instanceof Route)) { throw new Error('Route.assign: route must be an instance of a Route.'); }
    var update = new Route(route.#root.#value);
    if (route.root.next == null || update.value == null) { return update; }
    for (var node = route.root.next; node.next; node = node.next) {
      var name = Route.find(update.value, node.name);
      update = update.append(name, update.value[name] ??= {});
    }
    update.append(route.last.name, update.result ? update.result[route.last.name] = value : value);
    return update;
  }
}