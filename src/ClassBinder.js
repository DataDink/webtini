/**
 * @author Greenwald
 * @license PDL
 */
import Binder from './Binder.js';

/**
 * @class ClassBinder
 * @description Enables the use of class name binding attributes.
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
export default class ClassBinder extends Binder.Extension {
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