/**
 * @author Greenwald
 * @license PDL
 * @module TextBinder
 */
import Binder from './Binder.js';

export default 
/**
 * @class TextBinder
 * @memberof module:TextBinder
 * @description Enables the use of `{data}` binders in text content.
 * @example
 * ```html
 * <html>
 *  <body>
 *   <h1>{title}</h1>
 *   <p>{content}</p>
 *  </body>
 * </html>
 * ```
 * 
 * ```javascript
 * var model = { title: 'Hello', content: 'World' };
 * var binder = new Binder(new TextBinder());
 * binder.bind(document.body, model);
 * ```
 */
class TextBinder extends Binder.Extension {
  static #text = Symbol('textContent');
  handleElement(binder, element, route) {
    if (!(element instanceof Text)) { return false; }
    const text = element[TextBinder.#text] ??= element.textContent;
    const bindings = [...text.matchAll(/\{\{|\}\}|\{([^\}]+)\}/g)];
    if (!bindings.length) { return true; }
    var format = '';
    for (var i = 0; i < bindings.length; i++) {
      var previous = bindings[i-1];
      var binding = bindings[i];
      format += text.substring(previous ? previous.index + previous[0].length : 0, binding.index);
      format += binding[1] == null ? binding[0][0] : route.select(binding[1].split('.')).result?.toString() ?? '';
    }
    var last = bindings.at(-1);
    format += text.substring(last.index + last[0].length);
    element.textContent = format;
    return true;
  }
}