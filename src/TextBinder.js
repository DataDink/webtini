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
  static #parse = Symbol('parse');
  handleElement(binder, element, route) {
    if (!(element instanceof Text)) { return false; }
    if (element.parentElement instanceof HTMLStyleElement) { return false; }
    const parse = element[TextBinder.#parse] ??= TextBinder.parse(element.textContent);
    if (!parse.length) { return true; }
    const format = parse
      .map(p => `${p.text}${p.selector ? route.select(p.selector.split('.')).result?.toString() ?? '' : ''}`)
      .join('');
    if (element.textContent !== format) { element.textContent = format; }
    return true;
  }
  /**
   * @function parse
   * @memberof module:TextBinder.TextBinder
   * @description Parses a string into text/selector pairs.
   * @param {string} text The text to parse
   * @returns {Array} An array of parsed segments: {text, selector}
   */
  static parse(text) {
    var matches = [...(text??'').matchAll(/\{\{|\}\}|\{([^\}]+)\}/g)];
    if (matches.length === 0) { return []; }
    return matches.map((m,i) => ({
      text: text.substring(i > 0 ? matches[i-1].index + matches[i-1][0].length : 0, m.index)
          + (m[0] === '{{' ? '{' : m[0] === '}}' ? '}' : ''),
      selector: m[1] ? m[1].trim() : null
    })).concat([{ text: text.substring(matches.at(-1).index + matches.at(-1)[0].length) }]);
  }
}