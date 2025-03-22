/**
 * @author Greenwald
 * @license PDL
 * @module StyleBinder
 */
import Route from './Route.js';
import Binder from './Binder.js';

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
export default class StyleBinder extends Binder.Extension {
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