/**
 * @author Greenwald
 * @license PDL
 * @module Binder
 */
import Route from './Route.js';

export default class Binder {
  /**
   * @property ATTRIBUTE
   * @memberof module:Binder.Binder
   * @description The attribute for defining the data scope for descendant elements.
   * @type {string}
   */
  static get ATTRIBUTE() { return 'bind'; }
  /**
   * @property PREFIX
   * @memberof module:Binder.Binder
   * @description The prefix for identifying binding attributes.
   * @type {string}
   */
  static get PREFIX() { return 'bind-'; }

  #active = 0;
  /**
   * @property active
   * @memberof module:Binder.Binder
   * @description Indicates whether the binder is currently processing a view.
   * @type {boolean}
   */
  get active() { return this.#active > 0; }

  #extensions = [];
  /**
   * @class Binder
   * @memberof module:Binder
   * @description The core of webtini functionality. Renders a view using a data model.
   * @param  {...Binder.Extension} extensions 
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
   * @function bind
   * @memberof module:Binder.Binder
   * @description Renders the view using the data.
   * @param {Element} view The root element to bind.
   * @param {*} data The Route or data model to bind from.
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
    const scope = view.hasAttribute(Binder.ATTRIBUTE) ? data.select(view.getAttribute(Binder.ATTRIBUTE)?.split('.')) : data;
    for (var child of [...view.childNodes]) {
      this.bind(child, scope);
    }
    this.#active--;
    return view;
  }
  #defer = setTimeout(() => {});
  /**
   * @function defer
   * @memberof module:Binder.Binder
   * @description Queues binding to occur after the current call stack is clear. Only the latest call to this function will execute.
   * @param {Element} view The root element to bind.
   * @param {*} data The Route or data model to bind from.
   */
  defer(view, data) {
    clearTimeout(this.#defer);
    this.#defer = setTimeout(() => this.bind(view, data));
  }
  static Extension = 
  /**
   * @class Extension
   * @memberof module:Binder.Binder
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
  class Extension {
    /**
     * @function handleElement
     * @memberof module:Binder.Binder.Extension
     * @description A method for handling descendant elements.
     * @param {Binder} binder 
     * @param {Element} element 
     * @param {Route} route 
     * @returns {boolean}
     */
    handleElement(binder, element, route) { return false; }
    /**
     * @function handleAttribute
     * @memberof module:Binder.Binder.Extension
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