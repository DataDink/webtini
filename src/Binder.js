/**
 * @author Greenwald
 * @license PDL
 */
import Route from './Route.js';
/**
 * @class Binder
 * @description The core of webtini functionality. Renders a view using a data model.
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
export default class Binder {
  /**
   * @property ATTRIBUTE
   * @description The attribute for defining the data scope for descendant elements.
   * @type {string}
   */
  static get ATTRIBUTE() { return 'bind'; }
  /**
   * @property PREFIX
   * @description The prefix for identifying binding attributes.
   * @type {string}
   */
  static get PREFIX() { return 'bind-'; }

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
   * @function bind
   * @description Renders the view using the data.
   * @param {Element} view 
   * @param {Route, *} data 
   * @returns {none}
   */
  bind(view, data) {
    if (!(view instanceof Element)) { return view; }
    data = data instanceof Route ? data : new Route(data);
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
      if (this.#extensions.find(e => e.handleElement(this, child, scope))) { continue; }
      this.bind(child, scope);
    }
  }
  /**
   * @class Binder.Extension
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
     * A method for handling descendant elements.
     * @param {Binder} binder 
     * @param {Element} element 
     * @param {Route} route 
     * @returns {boolean}
     */
    handleElement(binder, element, route) { return false; }
    /**
     * A method for handling an attribute on an element
     * @param {Binder} binder 
     * @param {Element} element 
     * @param {Route} route 
     * @param {string} name 
     * @param {string} value 
     * @returns 
     */
    handleAttribute(binder, element, route, name, value) { return false; }
  }
}