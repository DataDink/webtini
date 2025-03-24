/**
 * @author Greenwald
 * @license PDL
 * @module EventBinder
 */
import Binder from './Binder.js';

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