
(function() {
this.Route = class Route {
  get root() { return this.#root; } #root;
  get parent() { return this.#parent; } #parent;
  get name() { return this.#name; } #name;
  get value() { return this.#value; } #value;
  get next() { return this.#next; } #next;
  get last() { return this.#root.#last; } #last;
  get path() { return [...this].map(node => node.name); }
  get data() { return this.last.parent?.value; }
  get index() { return this.last.name; }
  get result() { return this.last.value; }
  constructor(root = null) { (this.#root = this.#last = this).#value = root; }
  *[Symbol.iterator]() { for (var node = this.#root; node; node = node.#next) { yield node; } }
  append(name, value) {
    var next = this.#next = new Route();
    next.#name = name;
    next.#value = value;
    next.#root = this.#root;
    next.#parent = this;
    this.#root.#last = next;
    return next;
  }
  clone() {
    var clone = new Route(this.value);
    for (var node = this.#next; node; node = node.#next) {
      clone = clone.append(node.#name, node.#value);
    }
    return clone;
  }
  static find(data, name) {
    if (data == null || name in data) { return name; }
    var lower = name.toLowerCase();
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
        var name = Route.find(r.#value, m);
        r = r.append(name, r.#value?.[name]); 
      }
      return r;
    }, source instanceof Route ? source.clone() : new Route(source));
  }
  assign(value) { return Route.assign(this, value); }
  static assign(route, value) {
    if (!(route instanceof Route)) { throw new Error('Route.assign: route must be an instance of a Route.'); }
    var result = new Route(route.#root.#value);
    if (route.root.next == null || result.value == null) { return result; }
    for (var node = route.root.next; node; node = node.next) {
      var name = Route.find(result.value, node.name);
      result = result.append(name, result.value[name] ?? (result.value[name] = {}));
    }
    result.#value = result.parent.value[result.name] = value;
    return result;
  }
}
})();

(function() {
this.Binder = class Binder {
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
    var scope = view.hasAttribute(Binder.ATTRIBUTE) ? data.select(view.getAttribute(Binder.ATTRIBUTE)?.split('.')) : data;
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
})();

(function() {
this.TemplateBinder = class TemplateBinder extends Binder.Extension {
  static get RECURSE() { return 'recurse'; }
  static #instances = Symbol('template-instances');
  static #instance = Symbol('template-instance');
  handleElement(binder, element, route) {
    if (element[TemplateBinder.#instance]) { return true; }
    if (!(element instanceof HTMLTemplateElement)) { return false; }
    route = element.hasAttribute(Binder.ATTRIBUTE) ? route.select(element.getAttribute(Binder.ATTRIBUTE)?.split('.')) : route;
    var recurse = element.hasAttribute(Binder.ATTRIBUTE) && element.hasAttribute(TemplateBinder.RECURSE);
    var items = route.result == null ? []
              : Array.isArray(route.result) ? route.result.map((v,i) => route.clone().append(i.toString(), v))
              : [route];
    var instances = element[TemplateBinder.#instances] ??= [];
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
        var recursion = element.cloneNode(true);
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
})();

(function() {
this.EventBinder = class EventBinder extends Binder.Extension {
  static get PREFIX() { return 'event-'; }
  static #events = Symbol('events');
  handleAttribute(binder, element, route, name, value) {
    if (!name.startsWith(EventBinder.PREFIX)) { return false; }
    var event = name.substring(EventBinder.PREFIX.length);
    var events = element[EventBinder.#events] ??= {};
    var handler = route.select(value.split('.'));
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
    var context = events[event] = { 
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
})();

(function() {
this.StyleBinder = class StyleBinder extends Binder.Extension {
  static get PREFIX() { return 'style-'; }
  handleAttribute(binder, element, route, name, value) {
    if (!name.startsWith(StyleBinder.PREFIX)) { return false; }
    var style = Route.find(element.style, name.substring(StyleBinder.PREFIX.length));
    var setting = route.select(value.split('.')).result?.toString();
    if (element.style[style] === setting) { return true; }
    element.style[style] = setting;
    return true;
  }
}
})();

(function() {
this.ClassBinder = class ClassBinder extends Binder.Extension {
  static get PREFIX() { return 'class-'; }
  handleAttribute(binder, element, route, name, value) {
    if (!name.startsWith(ClassBinder.PREFIX)) { return false; }
    var classname = name.substring(ClassBinder.PREFIX.length);
    var state = !!route.select(value.split('.')).result;
    if (element.classList.contains(classname) === state) { return true; }
    element.classList.toggle(classname);
    return true;
  }
}
})();

(function() {
this.AttributeBinder = class AttributeBinder extends Binder.Extension {
  static get PREFIX() { return 'attribute-'; }
  handleAttribute(binder, element, route, name, value) {
    if (!name.startsWith(AttributeBinder.PREFIX)) { return false; }
    var attr = name.substring(AttributeBinder.PREFIX.length);
    var content = route.select(value.split('.')).value?.toString();
    if (content == null && !element.hasAttribute(attr)) { return true; }
    var current = element.getAttribute(attr);
    if (content === current) { return true; }
    if (content == null) {
      element.removeAttribute(attr);
    } else {
      element.setAttribute(attr, content);
    }
    return true;
  }
}
})();

(function() {
this.StandardBinder = class StandardBinder extends Binder {
  constructor(...extensions) {
    super(
      ...extensions,
      new TemplateBinder(),
      new EventBinder(),
      new StyleBinder(),
      new ClassBinder(),
      new AttributeBinder()
    );
  }
}
})();
