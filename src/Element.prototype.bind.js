/*
 * @Author: Greenwald
 * @Documentation: https://datadink.github.io/webtini/src/Element.prototype.bind
 */
export default class View {
  static #scope = Symbol('view');
  static #attr = 'bind';
  static #prefix = 'bind-';
  static bind(view, model) {
    view[View.#scope] = true;
    let scan = [view];
    while (scan.length) {
      const node = scan.shift();
      if (!(node instanceof Element)) continue;
      if (node.hasAttribute('debug-binding')) { debugger; }
      if (node.hasAttribute(View.#attr)) {
        View.bind(node, View.read(model, node.getAttribute(View.#attr)?.split('.')));
        continue;
      }
      for (let attr of [...node.attributes]) {
        if (!attr.name.startsWith(View.#prefix)) { continue; }
        const { value: element, index: write } = View.select(node, attr.name.slice(View.#prefix.length).split('-'));
        if (element == null) { continue; }
        const current = element[write];
        const { value: data, index: read } = View.select(model, attr.value?.split('.'));
        let value = data!=null?data[read]:null;
        if (typeof(current) !== 'object' && typeof(value) !== 'object' && current === value) { continue; }
        if (typeof(value) === 'function') { value = value.bind(data); }
        element[write] = value;
      }
      scan.push(...[...node.childNodes].filter(n => !n[View.#scope]));
    }
    return view;
  }
  static read(object, selector) {
    return selector?.reduce((v, p) => v!=null?v[View.match(v,p)]:null, object);
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
}
Element.prototype.bind = function(model) { return View.bind(this, model); }