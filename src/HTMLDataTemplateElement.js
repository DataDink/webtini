import View from './Element.prototype.bind.js';

/* 
 * class HTMLDataTemplateElement - A template element that renders data to the DOM
 * @extends HTMLTemplateElement
 * @description
 *   This class extends HTMLTemplateElement to render data to the DOM.
 *   Setting the `data` property will render the template content and bind it.
 *   If the `data` is an array, the template will be rendered for each item.
 *   If the `data` is an object, the template will be rendered once.
 *   If the `data` is null or undefined, the template will be cleared.
 *   The content will be rendered immediately after the template element.
 * @example
 *   The following code:
 *   ```html
 *   <ul>
 *     <template is="data-template" bind-data="items">
 *       <li bind-textContent="name"></li>
 *     </template>
 *   </ul>
 *   ```
 *   When bound to:
 *   ```js
 *   document.body.bind({ items: [
 *     { name: 'Item 1' },
 *     { name: 'Item 2' },
 *   ]});
 *   ```
 *   Would render as:
 *   ```html
 *   <ul>
 *     <template is="data-template" bind-data="items">
 *       <li bind-textContent="name"></li>
 *     </template>
 *     <li>Item 1</li>
 *     <li>Item 2</li>
 *   </ul>
 */
export default class HTMLDataTemplateElement extends HTMLTemplateElement {
  #data;
  #content = [];

  get data() { return this.#data; }
  set data(value) {
    this.#data = value;
    this.rebind();
  }

  static observedAttributes = ['filter', 'src'];
  constructor() {
    super();
    for (const name of HTMLDataTemplateElement.observedAttributes) {
      Object.defineProperty(this, name, {
        enumerable: true, configurable: false,
        get: () => this.getAttribute(name),
        set: value => value==null ? this.removeAttribute(name) : this.setAttribute(name, value)
      });
    }
    if (this.hasAttribute('src')) { this.reload(); }
  }

  getValues() { 
    const values = this.#data==null ? [] : Array.isArray(this.#data) ? [...this.#data] : [this.#data]; 
    return this.filter==null ? values : values.filter(v => View.read(v, this.filter.split('.')));
  }
  rebind() {
    if (this.hasAttribute('debug-binding')) { debugger; }
    if (!this.isConnected) { return; }
    let values = this.getValues();
    const insert = this.#content.at(-1)?.at(-1)?.nextSibling ?? this.nextSibling;
    while (values.length < this.#content.length) {
      for (let node of this.#content.pop()) { node.parentNode?.removeChild(node); }
    }
    while (values.length > this.#content.length) {
      this.#content.push([...this.content.cloneNode(true).childNodes]);
      for (let node of this.#content.at(-1)) { this.parentNode.insertBefore(node, insert); }
    }
    while (values.length) {
      const group = this.#content[this.#content.length - values.length];
      const data = values.shift();
      for (let node of group) { View.bind(node, data); }
    }
  }
  async reload() {
    if (!this.hasAttribute('src')) { return; }
    this.setAttribute('loading', '');
    const text = await fetch(this.src).then(res => res.text());
    this.removeAttribute('loading');
    this.innerHTML = text;
    this.clear();
    this.rebind();
  }
  clear() {
    while (this.#content.length) {
      for (let node of this.#content.pop()) { node.parentNode?.removeChild(node); }
    }
  }

  disconnectedCallback() { this.clear(); }
  connectedCallback() { this.clear(); this.rebind(); }
  attributeChangedCallback(name) { name === 'src' ? this.reload() : this.rebind(); }
}
customElements.define('data-template', HTMLDataTemplateElement, { extends: 'template' });
