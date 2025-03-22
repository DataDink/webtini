/**
 * @author Greenwald
 * @license PDL
 */
import Binder from './Binder.js';
/**
 * @class TemplateBinder
 * @description Enables the use of {@link HTMLTemplateElement} elements as data-templates.
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
export default class TemplateBinder extends Binder.Extension {
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
    while (instances.length > items.length) { instances.pop().map(e => e.remove()); }
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
        binder.bind(e, items[i]);
      }
    }
    return true;
  }
}