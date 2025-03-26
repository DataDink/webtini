/**
 * @author Greenwald
 * @license PDL
 * @module AttributeBinder
 */
import Binder from './Binder.js';

export default 
/**
 * @class AttributeBinder
 * @memberof module:AttributeBinder
 * @description Enables the use of attribute binding attributes.
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
class AttributeBinder extends Binder.Extension {
  /**
   * @property PREFIX
   * @memberof module:AttributeBinder.AttributeBinder
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