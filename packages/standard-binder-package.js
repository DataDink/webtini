
(function() {
/**
 * @author Greenwald
 * @license PDL
 * @module Route
 */

/**
 * @class Route
 * @description A class for selecting and assigning values in a data model.
 * @memberof module:Route
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
this.Route = class Route {
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
})();

(function() {
/**
 * @author Greenwald
 * @license PDL
 * @module Binder
 */

/**
 * @description The core of webtini functionality. Renders a view using a data model.
 * @member module:Binder
 * @example
 * ```html
 * <html>
 *  <body>
 *    <h1 bind-textcontent="title"></h1>
 *    <p bind-textcontent="content"></p>
 *  </body>
 * </html>
 * ```
 * 
 * ```javascript
 * var datamodel = {
 *  title: 'The Page Title',
 *  content: 'The page content',
 * };
 * var binder = new Binder();
 * binder.bind(document.body, data)
 * ```
 */
this.Binder = class Binder {
  /**
   * @member {string} module:Binder.ATTRIBUTE
   * @description The attribute for defining the data scope for descendant elements.
   * @type {string}
   */
  static get ATTRIBUTE() { return 'bind'; }
  /**
   * @member {string} module:Binder.PREFIX
   * @description The prefix for identifying binding attributes.
   * @type {string}
   */
  static get PREFIX() { return 'bind-'; }

  #active = 0;
  /**
   * @member {boolean} module:Binder.active
   * @description Indicates whether the binder is currently processing a view.
   * @type {boolean}
   */
  get active() { return this.#active > 0; }

  #extensions = [];
  /**
   * @constructor
   * @description Creates a new instance of the Binder class with optional extensions.
   * @param  {...Binder.Extension} extensions 
   * @example
   * ```javascript
   * import {TemplateBinder} from './TemplateBinder.js';
   * import {EventBinder} from './EventBinder.js';
   * import {StyleBinder} from './StyleBinder.js';
   * import {ClassBinder} from './ClassBinder.js';
   * var binder = new Binder(
   *  new TemplateBinder(), 
   *  new EventBinder(), 
   *  new StyleBinder(), 
   *  new ClassBinder()
   * );
   * ```
   */
  constructor(...extensions) { this.#extensions = extensions ?? []; }

  /**
   * @member {function} module:Binder.bind
   * @description Renders the view using the data.
   * @param {Element} view 
   * @param {*} data 
   * @returns {Element}
   */
  bind(view, data) {
    this.#active++;
    data = data instanceof Route ? data : new Route(data);
    const handled = this.#extensions.find(e => e.handleElement(this, view, data)) || !(view instanceof Element);
    if (handled) { 
      this.#active--;
      return view; 
    }
    for (var attr of [...view.attributes]) {
      var name = attr.name.toLowerCase();
      if (!attr.name.startsWith(Binder.PREFIX)) { continue; }
      name = name.substring(Binder.PREFIX.length);
      if (this.#extensions.find(e => e.handleAttribute(this, view, data, name, attr.value))) { continue; }
      var selection = data.select(attr.value?.split('.')).value;
      var assignment = Route.select(view, name.split('-'));
      assignment.assign(selection);
    }
    var scope = view.hasAttribute(Binder.ATTRIBUTE) ? data.select(view.getAttribute(Binder.ATTRIBUTE)?.split('.')) : data;
    for (var child of [...view.childNodes]) {
      this.bind(child, scope);
    }
    this.#active--;
    return view;
  }
  /**
   * @member module:Binder.Extension
   * @description An interface for extending the functionality of the {@link Binder} class.
   * @example
   * ```javascript
   * import {Binder} from './Binder.js';
   * export default class MyExtension extends Binder.Extension {
   *   handleElement(binder, element, route) {
   *    if (!(element instanceof HTMLDivElement)) { return false; } // Only handle div elements
   *    element.style.borderColor = 'red'; // Outline them in red
   *    binder.bind(element, route); // Apply normal binding (optional)
   *    return true; // Indicate that the element was handled and prevent further processing
   *   }
   * }
   */
  static Extension = class Extension {
    /**
     * @member {function} module:Binder.Extension.handleElement
     * @description A method for handling descendant elements.
     * @param {Binder} binder 
     * @param {Element} element 
     * @param {Route} route 
     * @returns {boolean}
     */
    handleElement(binder, element, route) { return false; }
    /**
     * @member {function} module:Binder.Extension.handleAttribute
     * @description A method for handling an attribute on an element
     * @param {Binder} binder 
     * @param {Element} element 
     * @param {Route} route 
     * @param {string} name 
     * @param {string} value 
     * @returns {boolean}
     */
    handleAttribute(binder, element, route, name, value) { return false; }
  }
}
})();

(function() {
/**
 * @author Greenwald
 * @license PDL
 * @module TemplateBinder
 */

/**
 * @class TemplateBinder
 * @description Enables the use of {@link HTMLTemplateElement} elements as data-templates.
 * @memberof module:TemplateBinder
 * @example
 * ```html
 * <html>
 *  <body>
 *    <template bind="model.items">
 *      <h1 bind-textcontent="title"></h1>
 *      <p bind-textcontent="content"></p>
 *    </template>
 *  </body>
 * </html>
 * ```
 * 
 * ```javascript
 * var model = { items: [
 *  { title: 'Item 1', content: 'Item 1 content' },
 *  { title: 'Item 2', content: 'Item 2 content' },
 *  { title: 'Item 3', content: 'Item 3 content' },
 * ] };
 * var binder = new Binder(new TemplateBinder());
 * binder.bind(document.body, model);
 * ```
 */
this.TemplateBinder = class TemplateBinder extends Binder.Extension {
  /**
   * @property RECURSE
   * @description The attribute for defining recursive data-templates.
   * @type {string}
   */
  static get RECURSE() { return 'recurse'; }
  static #instances = Symbol('template-instances');
  static #instance = Symbol('template-instance');
  /**
   * @method handleElement
   * @description Binds an {@link HTMLTemplateElement} to a data model.
   * @param {Binder} binder
   * @param {HTMLElement} element
   * @param {Route} route
   * @returns {boolean}
   */
  handleElement(binder, element, route) {
    if (element[TemplateBinder.#instance]) { return true; }
    if (!(element instanceof HTMLTemplateElement)) { return false; }
    route = element.hasAttribute(Binder.ATTRIBUTE) ? route.select(element.getAttribute(Binder.ATTRIBUTE)?.split('.')) : route;
    var recurse = element.hasAttribute(Binder.ATTRIBUTE) && element.hasAttribute(TemplateBinder.RECURSE);
    var items = route.result == null ? []
              : Array.isArray(route.result) ? route.result.map((v,i) => route.clone().append(i.toString(), v))
              : [route];
    var instances = element[TemplateBinder.#instances] ??= [];
    while (instances.length > items.length) {
      var instance = instances.pop();
      for (var e of instance) {
        e[TemplateBinder.#instance] = false;
        if (e instanceof HTMLTemplateElement) { 
          binder.bind(e, null); 
        }
        e.remove();
      }
    }
    var insert = instances.at(-1)?.at(-1)?.nextSibling ?? element.nextSibling;
    while (instances.length < items.length) {
      var instance = [...element.content.cloneNode(true).childNodes];
      instances.push(instance);
      for (var e of instance) {
        e[TemplateBinder.#instance] = true;
        element.parentNode.insertBefore(e, insert);
      }
      if (recurse) { 
        var recursion = element.cloneNode(true);
        instance.push(recursion);
        element.parentNode.insertBefore(recursion, insert);
      }
    }
    for (var i = 0; i < items.length; i++) { 
      for (var e of instances[i]) {
        e[TemplateBinder.#instance] = false;
        binder.bind(e, items[i]);
        e[TemplateBinder.#instance] = true;
      }
    }
    return true;
  }
}
})();

(function() {
/**
 * @author Greenwald
 * @license PDL
 * @module EventBinder
 */


/**
 * @class EventBinder
 * @description Enables the use of event binding attributes.
 * @memberof module:EventBinder
 * @example
 * ```html
 * <html>
 * <body>
 *  <button bind-event-click="data.api.triggerEvent">Click me</button>
 * </body>
 * </html>
 * ```
 */
this.EventBinder = class EventBinder extends Binder.Extension {
  /**
   * @property PREFIX
   * @description The prefix for identifying event binding attributes.
   * @type {string}
   */
  static get PREFIX() { return 'event-'; }
  static #events = Symbol('events');
  handleAttribute(binder, element, route, name, value) {
    if (!name.startsWith(EventBinder.PREFIX)) { return false; }
    var event = name.substring(EventBinder.PREFIX.length);
    var events = element[EventBinder.#events] ??= {};
    var handler = route.select(value.split('.'));
    if (event in events 
      && events[event].data === handler.data 
      && events[event].handler === events[event].result) { 
        return true; 
    }
    if (event in events) {
      element.removeEventListener(event, events[event].binding);
      delete events[event];
    }
    if (typeof(handler.result) !== 'function') { return true; }
    var context = events[event] = { 
      data: handler.data, 
      handler: handler.result,
      binding: function() {
        if (binder.active) { return; }
        return context.handler.apply(context.data, arguments);
      }
    };
    element.addEventListener(event, events[event].binding);
    return true;
  }
}
})();

(function() {
/**
 * @author Greenwald
 * @license PDL
 * @module StyleBinder
 */



/**
 * @class StyleBinder
 * @description Enables the use of style binding attributes.
 * @memberof module:StyleBinder
 * @example
 * ```html
 * <html>
 * <body>
 *  <div bind-style-borderColor="data.styles.alert.color">In A Box</div>
 * </body>
 * </html>
 * ```
 */
this.StyleBinder = class StyleBinder extends Binder.Extension {
  /**
   * @property PREFIX
   * @description The prefix for identifying style binding attributes.
   * @type {string}
   */
  static get PREFIX() { return 'style-'; }
  handleAttribute(binder, element, route, name, value) {
    if (!name.startsWith(StyleBinder.PREFIX)) { return false; }
    var style = Route.find(element.style, name.substring(StyleBinder.PREFIX.length));
    var setting = route.select(value.split('.')).result?.toString();
    if (element.style[style] === setting) { return true; }
    element.style[style] = setting;
    return true;
  }
}
})();

(function() {
/**
 * @author Greenwald
 * @license PDL
 * @module ClassBinder
 */


/**
 * @class ClassBinder
 * @description Enables the use of class name binding attributes.
 * @memberof module:ClassBinder
 * @example
 * ```html
 * <html>
 * <body>
 *  <div bind-class-alert="data.content.isAlert"
 *       bind-textcontent="data.content.text"></div>
 * </body>
 * </html>
 * ```
 */
this.ClassBinder = class ClassBinder extends Binder.Extension {
  /**
   * @property PREFIX
   * @description The prefix for identifying class name binding attributes.
   * @type {string}
   */
  static get PREFIX() { return 'class-'; }
  handleAttribute(binder, element, route, name, value) {
    if (!name.startsWith(ClassBinder.PREFIX)) { return false; }
    var classname = name.substring(ClassBinder.PREFIX.length);
    var state = !!route.select(value.split('.')).result;
    if (element.classList.contains(classname) === state) { return true; }
    element.classList.toggle(classname);
    return true;
  }
}
})();

(function() {
/**
 * @author Greenwald
 * @license PDL
 * @module AttributeBinder
 */


/**
 * @class AttributeBinder
 * @description Enables the use of attribute binding attributes.
 * @memberof module:AttributeBinder
 * @example
 * ```html
 * <html>
 * <body>
 *  <button bind-attribute-disabled="data.state.isDisabled"
 *          bind-event-click="data.trigger">Click Me</button>
 * </body>
 * </html>
 * ```
 */
this.AttributeBinder = class AttributeBinder extends Binder.Extension {
  /**
   * @property PREFIX
   * @member {string} module:AttributeBinder.PREFIX
   * @description The prefix for identifying attribute binding attributes.
   * @type {string}
   */
  static get PREFIX() { return 'attribute-'; }
  handleAttribute(binder, element, route, name, value) {
    if (!name.startsWith(AttributeBinder.PREFIX)) { return false; }
    var attr = name.substring(AttributeBinder.PREFIX.length);
    var content = route.select(value.split('.')).value?.toString();
    if (content == null && !element.hasAttribute(attr)) { return true; }
    var current = element.getAttribute(attr);
    if (content === current) { return true; }
    if (content == null) {
      element.removeAttribute(attr);
    } else {
      element.setAttribute(attr, content);
    }
    return true;
  }
}
})();

(function() {
/**
 * @author Greenwald
 * @license PDL
 */







/**
 * @class StandardBinder
 * @description A standard binder with all the default extensions.
 */
this.StandardBinder = class StandardBinder extends Binder {
  constructor(...extensions) {
    super(
      ...extensions,
      new TemplateBinder(),
      new EventBinder(),
      new StyleBinder(),
      new ClassBinder(),
      new AttributeBinder()
    );
  }
}
})();
