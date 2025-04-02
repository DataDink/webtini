(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.StandardBinder = factory());
})(this, (function () { 'use strict';
  class Route {
    get root() { return this.#root; } #root;
    get parent() { return this.#parent; } #parent;
    get name() { return this.#name; } #name;
    get value() { return this.#value; } #value;
    get next() { return this.#next; } #next;
    get last() { return this.#root.#last; } #last;
    get path() { return [...this].slice(1).map(node => node.name); }
    get data() { return this.last.parent?.value; }
    get index() { return this.last.name; }
    get result() { return this.last.value; }
    constructor(root = null) { (this.#root = this.#last = this).#value = root; }
    *[Symbol.iterator]() { for (var node = this.#root; node; node = node.#next) { yield node; } }
    append(name, value) {
      const next = this.#next = new Route();
      next.#name = name;
      next.#value = value;
      next.#root = this.#root;
      next.#parent = this;
      this.#root.#last = next;
      return next;
    }
    clone() {
      var clone = new Route(this.#root.#value);
      for (var node = this.#root.#next; node; node = node.#next) {
        clone = clone.append(node.#name, node.#value);
      }
      return clone;
    }
    static find(data, name) {
      if (data == null || name in data) { return name; }
      const lower = name.toLowerCase();
      for (var key in data) { if (key.toLowerCase() === lower) { return key; } }
      return name;
    }
    select(path) { return Route.select(this, path); }
    static select(source, path) {
      return (Array.isArray(path) ? path : []).reduce((r,m) => {
        if (!m?.length || m === '.') { return r; }
        else if (m === '~') { r = r.#root; r.#last = r; r.#next = null; }
        else if (m === '^') { r = r.#parent ?? r; r.#root.#last = r; r.#next = null; }
        else {
          const name = Route.find(r.#value, m);
          r = r.append(name, r.#value?.[name]);
        }
        return r;
      }, source instanceof Route ? source.clone() : new Route(source));
    }
    assign(value) { return Route.assign(this, value); }
    static assign(route, value) {
      if (!(route instanceof Route)) { throw new Error('Route.assign: route must be an instance of a Route.'); }
      var update = new Route(route.#root.#value);
      if (route.root.next == null || update.value == null) { return update; }
      for (var node = route.root.next; node; node = node.next) {
        var name = Route.find(update.value, node.name);
        update = update.append(name, update.value[name] ??= {});
      }
      update.#value = update.data[update.name] = value;
      return update;
    }
  }
  class Binder {
    static get ATTRIBUTE() { return 'bind'; }
    static get PREFIX() { return 'bind-'; }
    #active = 0;
    get active() { return this.#active > 0; }
    #extensions = [];
    constructor(...extensions) { this.#extensions = extensions ?? []; }
    bind(view, data) {
      this.#active++;
      data = data instanceof Route ? data : new Route(data);
      const handled = this.#extensions.find(e => e.handleElement(this, view, data)) || !(view instanceof Element);
      if (handled) {
        this.#active--;
        return view;
      }
      for (var attr of [...view.attributes]) {
        var name = attr.name.toLowerCase();
        if (!attr.name.startsWith(Binder.PREFIX)) { continue; }
        name = name.substring(Binder.PREFIX.length);
        if (this.#extensions.find(e => e.handleAttribute(this, view, data, name, attr.value))) { continue; }
        var selection = data.select(attr.value?.split('.')).value;
        var assignment = Route.select(view, name.split('-'));
        assignment.assign(selection);
      }
      const scope = view.hasAttribute(Binder.ATTRIBUTE) ? data.select(view.getAttribute(Binder.ATTRIBUTE)?.split('.')) : data;
      for (var child of [...view.childNodes]) {
        this.bind(child, scope);
      }
      this.#active--;
      return view;
    }
    static Extension =
    class Extension {
      handleElement(binder, element, route) { return false; }
      handleAttribute(binder, element, route, name, value) { return false; }
    }
  }
  class TextBinder extends Binder.Extension {
    static #parse = Symbol('parse');
    handleElement(binder, element, route) {
      if (!(element instanceof Text)) { return false; }
      const parse = element[TextBinder.#parse] ??= TextBinder.parse(element.textContent);
      if (!parse.length) { return true; }
      const format = parse
        .map(p => `${p.text}${p.selector ? route.select(p.selector.split('.')).result?.toString() ?? '' : ''}`)
        .join('');
      if (element.textContent !== format) { element.textContent = format; }
      return true;
    }
    static parse(text) {
      var matches = [...text.matchAll(/\{\{|\}\}|\{([^\}]+)\}/g)];
      if (matches.length === 0) { return []; }
      return matches.map((m,i) => ({
        text: text.substring(i > 0 ? matches[i-1].index + matches[i-1][0].length : 0, m.index)
            + (m[0] === '{{' ? '{' : m[0] === '}}' ? '}' : ''),
        selector: m[1] ? m[1].trim() : null
      })).concat([{ text: text.substring(matches.at(-1).index + matches.at(-1)[0].length) }]);
    }
  }
  class TemplateBinder extends Binder.Extension {
    static get RECURSE() { return 'recurse'; }
    static #instances = Symbol('template-instances');
    static #instance = Symbol('template-instance');
    handleElement(binder, element, route) {
      if (element[TemplateBinder.#instance]) { return true; }
      if (!(element instanceof HTMLTemplateElement)) { return false; }
      route = element.hasAttribute(Binder.ATTRIBUTE) ? route.select(element.getAttribute(Binder.ATTRIBUTE)?.split('.')) : route;
      const recurse = element.hasAttribute(Binder.ATTRIBUTE) && element.hasAttribute(TemplateBinder.RECURSE);
      const items = route.result == null ? []
                : Array.isArray(route.result) ? route.result.map((v,i) => route.clone().append(i.toString(), v))
                : [route];
      const instances = element[TemplateBinder.#instances] ??= [];
      while (instances.length > items.length) {
        var instance = instances.pop();
        for (var e of instance) {
          e[TemplateBinder.#instance] = false;
          if (e instanceof HTMLTemplateElement) {
            binder.bind(e, null);
          }
          e.remove();
        }
      }
      var insert = instances.at(-1)?.at(-1)?.nextSibling ?? element.nextSibling;
      while (instances.length < items.length) {
        var instance = [...element.content.cloneNode(true).childNodes];
        instances.push(instance);
        for (var e of instance) {
          e[TemplateBinder.#instance] = true;
          element.parentNode.insertBefore(e, insert);
        }
        if (recurse) {
          const recursion = element.cloneNode(true);
          instance.push(recursion);
          element.parentNode.insertBefore(recursion, insert);
        }
      }
      for (var i = 0; i < items.length; i++) {
        for (var e of instances[i]) {
          e[TemplateBinder.#instance] = false;
          binder.bind(e, items[i]);
          e[TemplateBinder.#instance] = true;
        }
      }
      return true;
    }
  }
  class EventBinder extends Binder.Extension {
    static get PREFIX() { return 'event-'; }
    static #events = Symbol('events');
    handleAttribute(binder, element, route, name, value) {
      if (!name.startsWith(EventBinder.PREFIX)) { return false; }
      const event = name.substring(EventBinder.PREFIX.length);
      const events = element[EventBinder.#events] ??= {};
      const handler = route.select(value.split('.'));
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
      const context = events[event] = {
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
  class StyleBinder extends Binder.Extension {
    static get PREFIX() { return 'style-'; }
    handleAttribute(binder, element, route, name, value) {
      if (!name.startsWith(StyleBinder.PREFIX)) { return false; }
      const style = Route.find(element.style, name.substring(StyleBinder.PREFIX.length));
      const setting = route.select(value.split('.')).result?.toString();
      if (element.style[style] === setting) { return true; }
      element.style[style] = setting;
      return true;
    }
  }
  class ClassBinder extends Binder.Extension {
    static get PREFIX() { return 'class-'; }
    handleAttribute(binder, element, route, name, value) {
      if (!name.startsWith(ClassBinder.PREFIX)) { return false; }
      const classname = name.substring(ClassBinder.PREFIX.length);
      const state = !!route.select(value.split('.')).result;
      if (element.classList.contains(classname) === state) { return true; }
      element.classList.toggle(classname);
      return true;
    }
  }
  class AttributeBinder extends Binder.Extension {
    static get PREFIX() { return 'attribute-'; }
    handleAttribute(binder, element, route, name, value) {
      if (!name.startsWith(AttributeBinder.PREFIX)) { return false; }
      const attr = name.substring(AttributeBinder.PREFIX.length);
      const content = route.select(value.split('.')).value?.toString();
      if (content == null && !element.hasAttribute(attr)) { return true; }
      const current = element.getAttribute(attr);
      if (content === current) { return true; }
      if (content == null) {
        element.removeAttribute(attr);
      } else {
        element.setAttribute(attr, content);
      }
      return true;
    }
  }
  class StandardBinder extends Binder {
    constructor(...extensions) {
      super(
        ...extensions,
        new TextBinder(),
        new TemplateBinder(),
        new EventBinder(),
        new StyleBinder(),
        new ClassBinder(),
        new AttributeBinder()
      );
    }
  }
  return StandardBinder;
}));
