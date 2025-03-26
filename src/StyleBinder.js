/**
 * @author Greenwald
 * @license PDL
 * @module StyleBinder
 */
import Route from './Route.js';
import Binder from './Binder.js';

export default 
/**
 * @class StyleBinder
 * @memberof module:StyleBinder
 * @description Enables the use of style binding attributes.
 * @example
 * ```html
 * <html>
 * <body>
 *  <div bind-style-borderColor="data.styles.alert.color">In A Box</div>
 * </body>
 * </html>
 * ```
 */
class StyleBinder extends Binder.Extension {
  /**
   * @property PREFIX
   * @memberof module:StyleBinder.StyleBinder
   * @description The prefix for identifying style binding attributes.
   * @type {string}
   */
  static get PREFIX() { return 'style-'; }
  handleAttribute(binder, element, route, name, value) {
    if (!name.startsWith(StyleBinder.PREFIX)) { return false; }
    const style = Route.find(element.style, name.substring(StyleBinder.PREFIX.length));
    const setting = route.select(value.split('.')).result?.toString();
    if (element.style[style] === setting) { return true; }
    element.style[style] = setting;
    return true;
  }
}