/**
 * @author Greenwald
 * @license PDL
 */
import Binder from './Binder.js';

/**
 * @class EventBinder
 * @description Enables the use of event binding attributes.
 * @example
 * ```html
 * <html>
 * <body>
 *  <button bind-event-click="data.api.triggerEvent">Click me</button>
 * </body>
 * </html>
 * ```
 */
export default class EventBinder extends Binder.Extension {
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
    var handler = route.select(value.split('.')).result;
    if (event in events && events[event].source === handler) { return true; }
    if (event in events) {
      element.removeEventListener(event, events[event].binding);
      delete events[event];
    }
    if (typeof(handler) !== 'function') { return true; }
    events[event] = { source: handler, binding: handler.bind(route.result) };
    element.addEventListener(event, events[event].binding);
    return true;
  }
}