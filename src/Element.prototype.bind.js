  /* 
   * @class View - Provides data binding for DOM elements
   * @description
   *   Extends the Element prototype with a `bind` method.
   *   Used to bind data to an element and all of its children.
   *   The element and its children are scanned for attributes that begin with `bind-`
   *   followed by a property name or dash(-) separated path on the element. 
   *   The attribute is given a property name or dot(.) separated path on the data.
   *   The property on the data is set to the value of the attribute on the element.
   *   The element must be re-bound if the data changes.
   *   The `bind` attribute can be used to change the data source for a subtree.
   *   NOTE: property names are treated with case-insensitivity.
   * @example
   *   The following HTML:
   *   ```html
   *   <h1 bind-textContent="person.info.name"></h1>
   *   <ul bind="person.info">
   *     <li bind-textContent="age"></li>
   *     <li bind-textContent="height"></li>
   *   </ul>
   *   ```
   *   When bound to the following data:
   *   ```js
   *   document.body.bind({
   *     person: {
   *       info: {
   *         name: 'John Doe',
   *         age: 42,
   *         height: '6\' 2"'
   *       }
   *     }
   *   });
   *   ```
   *   Would render as:
   *   ```html
   *   <h1 bind-textContent="person.info.name">John Doe</h1>
   *   <ul bind="person.info">
   *     <li bind-textContent="age">42</li>
   *     <li bind-textContent="height">6' 2"</li>
   *   </ul>
   *   ```
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