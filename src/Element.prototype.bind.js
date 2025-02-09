/*
 * @Author: Greenwald
 * @Documentation: https://github.com/DataDink/webtini/blob/main/docs/Element.prototype.bind.md
 */
export default class Binding {
  static #attr = 'bind';
  static #prefix = 'bind-';
  static #binding = Symbol('binding');
  #view;
  constructor(view) { 
    this.#view = view;
    view[Binding.#binding] = this;
  }
  bind(model) { return Binding.bind(this.#view, model); }
  static bind(view, model) {
    if (!(view instanceof Element)) { return view; }
    if (view.hasAttribute('debug-binding')) { debugger; }
    if (view.hasAttribute(Binding.#attr)) { 
      model = Binding.read(model, view.getAttribute(Binding.#attr)?.split('.')); 
    }
    for (let attr of [...view.attributes]) {
      if (!attr.name.startsWith(Binding.#prefix)) { continue; }
      const { value: element, index: write } = Binding.select(view, attr.name.slice(Binding.#prefix.length).split('-'));
      if (element == null) { continue; }
      const prev = element[write];
      const { value: data, index: read } = Binding.select(model, attr.value?.split('.'));
      const next = data?.[read];
      if (prev === next) { continue; }
      if (typeof(prev) === 'function' && prev[Binding.#binding] === next) { continue; }
      if (typeof(next) === 'function') {
        (element[write] = next.bind(model))[Binding.#binding] = next;
        continue;
      }
      element[write] = next;
    }
    let child = view.firstChild;
    while (child) {
      var binding = child[Binding.#binding] ?? new Binding(child);
      binding.bind(model);
      child = child.nextSibling;
    }
    return view;
  }
  static read(object, selector) {
    return selector?.reduce((v, p) => v!=null?(p?.length?v[Binding.match(v,p)]:v):null, object);
  }
  static select(object, selector) {
    return {
      value : object = Binding.read(object, selector?.slice(0, -1)),
      index : Binding.match(object, selector?.at(-1))
    };
  }
  static match(object, index) {
    if (object == null || index == null || index in object) { return index; }
    const search = index.toLowerCase();
    for (let key in object) { if (key.toLowerCase() === search) { return key; } }
    return index;
  }
}
Element.prototype.bind = function(model) { return new Binding(this).bind(model); }