/**
 * @author Greenwald
 * @license PDL
 * @module EventBinder
 */
import Binder from './Binder.js';

export default 
/**
 * @class EventBinder
 * @memberof module:EventBinder
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
class EventBinder extends Binder.Extension {
  /**
   * @property PREFIX
   * @memberof module:EventBinder.EventBinder
   * @description The prefix for identifying event binding attributes.
   * @type {string}
   */
  static get PREFIX() { return 'event-'; }
  static #events = Symbol('events');
  handleAttribute(binder, element, route, name, value) {
    if (!name.startsWith(EventBinder.PREFIX)) { return false; }
    const event = name.substring(EventBinder.PREFIX.length);
    const events = element[EventBinder.#events] ??= {};
    const handler = route.select(value.split('.'));
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
    const context = events[event] = { 
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