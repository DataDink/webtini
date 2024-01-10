/*
 * @Author: Greenwald
 * @Documentation: https://github.com/DataDink/webtini/blob/main/docs/Element.prototype.bind.md
 */
export default class View {
  static #scoped = Symbol('scoped');
  static #attr = 'bind';
  static #prefix = 'bind-';
  static bind(view, model) {
    const rescope = view instanceof View.#Rescope;
    const scope = rescope ? view.element : view;
    scope[View.#scoped] = true;
    let scan = [scope];
    while (scan.length) {
      const node = scan.shift(); 
      if (!(node instanceof Element)) continue;
      if (node.hasAttribute('debug-binding')) { debugger; }
      if (node.hasAttribute(View.#attr) && (!rescope || node !== scope)) {
        View.bind(new View.#Rescope(node), View.read(model, node.getAttribute(View.#attr)?.split('.')));
        continue;
      }
      for (let attr of [...node.attributes]) {
        if (!attr.name.startsWith(View.#prefix)) { continue; }
        const { value: element, index: write } = View.select(node, attr.name.slice(View.#prefix.length).split('-'));
        if (element == null) { continue; }
        const current = element[write];
        const selector = attr.value?.split('.');
        let future = View.read(model, selector);
        if (typeof(current) !== 'object' && typeof(future) !== 'object' && current === future) { continue; }
        if (typeof(future) === 'function') {
          const { value: binding } = View.select(model, selector);
          future = future.bind(binding); 
        }
        element[write] = future;
      }
      scan.push(...[...node.childNodes].filter(n => !n[View.#scoped]));
    }
    return view;
  }
  static read(object, selector) {
    return selector?.reduce((v, p) => v!=null?(p?.length?v[View.match(v,p)]:v):null, object);
  }
  static select(object, selector) {
    return {
      value : object = View.read(object, selector?.slice(0, -1)),
      index : View.match(object, selector?.at(-1))
    };
  }
  static match(object, index) {
    if (object == null || index == null || index in object) { return index; }
    const search = index.toLowerCase();
    for (let key in object) { if (key.toLowerCase() === search) { return key; } }
    return index;
  }
  static #Rescope = class Rescope { 
    get element() { return this.#element; } #element;
    constructor(element) { this.#element = element; }
  };
}
Element.prototype.bind = function(model) { return View.bind(this, model); }