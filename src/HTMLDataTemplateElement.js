/*
 * @Author: Greenwald
 * @Documentation: https://github.com/DataDink/webtini/blob/main/docs/HTMLDataTemplateElement.md
 */
import Binding from './Element.prototype.bind.js';
export default class HTMLDataTemplateElement extends HTMLTemplateElement {
  #data;
  #content = [];

  get data() { return this.#data; }
  set data(value) {
    this.#data = value;
    this.#rebind();
  }

  static #observedAttributes = ['filter', 'sort', 'src'];
  constructor() {
    super();
    for (const name of HTMLDataTemplateElement.#observedAttributes) {
      Object.defineProperty(this, name, {
        enumerable: true, configurable: false,
        get: () => this.getAttribute(name),
        set: value => value==null ? this.removeAttribute(name) : this.setAttribute(name, value)
      });
    }
    this.reload();
  }
  #rebind() {
    if (this.hasAttribute('debug-binding')) { debugger; }
    if (!this.isConnected) { return; }
    let values = HTMLDataTemplateElement.enumerate(this.#data, this.filter, this.sort);
    const insert = this.#content.at(-1)?.at(-1)?.nextSibling ?? this.nextSibling;
    while (values.length < this.#content.length) {
      for (let node of this.#content.pop()) { node.parentNode?.removeChild(node); }
    }
    while (values.length > this.#content.length) {
      this.#content.push([...this.content.cloneNode(true).childNodes]);
      for (let node of this.#content.at(-1)) { this.parentNode.insertBefore(node, insert); }
    }
    for (let nodes of this.#content) {
      const data = values.shift();
      for (let node of nodes) { new HTMLDataTemplateElement.#TemplateBinding(node, data).bind(); }
    }
  }
  async reload() {
    if (!this.hasAttribute('src')) { return; }
    this.setAttribute('loading', '');
    const text = await fetch(this.src).then(res => res.text());
    this.removeAttribute('loading');
    this.innerHTML = text;
    this.clear();
    this.#rebind();
  }
  clear() {
    while (this.#content.length) {
      for (let node of this.#content.pop()) { node.parentNode?.removeChild(node); }
    }
  }

  static enumerate(data, filter, sort) { 
    const values = data==null ? [] 
      : Array.isArray(data) ? [...data]
      : typeof(data) === 'object' ? Object.values(data)
      : [data]; 
    const filtered = filter==null ? values : values.filter(v => Binding.read(v, filter.split('.')));
    const sorted = sort==null ? filtered : filtered.sort((a,b) => ((x,y) => 
      x === y ? 0 : x > y ? 1 : -1
    )(Binding.read(a, sort.split('.')), Binding.read(b, sort.split('.'))));
    return sorted;
  }

  disconnectedCallback() { this.clear(); }
  connectedCallback() { }
  attributeChangedCallback(name) { name === 'src' ? this.reload() : this.#rebind(); }
  static #TemplateBinding = class TemplateBinding extends Binding {
    #model;
    constructor(view, model) {
      super(view);
      this.#model = model;
    }
    bind() { return Binding.prototype.bind.call(this, this.#model); }
  }
}
customElements.define('data-template', HTMLDataTemplateElement, { extends: 'template' });
