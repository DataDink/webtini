# webtini

> *minimalistic view modeling for the web*

* [download latest](https://datadink.github.io/webtini/standard-binder.zip)
* [documentation](https://datadink.github.io/webtini)
* [source](https://github.com/datadink/webtini)
* [tests](https://datadink.github.io/webtini/test-results.html)

> *similarities to `knockout` and `vue` but smaller and rawer*

* Minimalistic
* Conformant
* Declarative
* Unobtrusive
* Modular

# Quick Start

> *the modern web doesn't need to be obfuscated and compiled*

```html
<html>
  <head>
    <title>webtini quick-start</title>
    <script src="https://datadink.github.io/webtini/standard-binder-package.min.js"></script>
    <!-- A style to hide the page until its ready -->
    <style>.loading { display: none; }</style>
  </head>
  <!-- Binds the "loading" class to the isLoading property on the Application -->
  <body class="loading" bind-class-loading="isLoading">
    <header>
      <!-- Binds to the "title" property on the application -->
      <h1>{title}</h1>
    </header>
    <menu>
      <!-- Binds this template to the `links` array on the Application -->
      <!-- Each item in the `links` array will generate an instance of the template content -->
      <template bind="links">
        <li><a bind-href="url">{text}</a></li>
      </template>
    </menu>
    <h1>Count: {count}</h1>
    <!-- Binds the button's "click" event to the "increment" function on the application -->
    <button bind-event-click="increment">Increment</button>
    <!-- Binds the input's "value" property to the application's "count" property -->
    <!-- Binds the input's "input" event to the application's "oninput" function -->
    <input type="number" bind-value="count" bind-event-input="oninput">
    <div>
      <!-- Binds this template to the "items" array on the Application -->
      <!-- Note: Each item is bound to Application.items[x]
        `~` binds the data root (Application)
        `^` binds the parent (Applications.items)
        `^.^` binds the parent-parent (Application)
      -->
      <template bind="items">
        <span>{{{value} of {^.length} or {~.count}/{^.^.count}}}</span>
      </template>
    </div>
    <script type="module">
      // The Application here acts as a viewmodel that the DOM view can be bound to using a `Binder`.
      // It exposes data and functionality for the view to bind to.
      class Application {
        // Binders are the engines for webtini applications.
        binder = new StandardBinder();

        // The body's "loading" class is bound to this value
        isLoading = false; 

        // The heading is bound to this value which pulls from the <title> in the header
        get title() { return document.querySelector('title').textContent; }

        // The page navigation template binds here and generates an instance of its content
        // for each item.
        links = [
          { text: 'source',  url: 'https://github.com/datadink/webtini' },
          { text: 'documentation',  url: 'https://datadink.github.io/webtini' },
        ];

        // A coordinated data value that multiple parts of the application use
        count = 0;

        // An event handler that triggers when the button in the view is clicked
        increment() { 
          this.count++; 
          this.render();
        }

        // An event handler that triggers when the input in the view is altered
        // Warning: Be aware of handlers that trigger events that retrigger handlers -> infinite recursion
        oninput(e) { 
          this.count = parseInt(e.target.value ?? 0); 
          this.render();
        }

        // (Advanced) Creates an array of items based on the "count" that a template in the view binds to.
        get items() { 
          var number = Math.abs(Math.max(-5000, Math.min(100, this.count)));
          return [...new Array(Number.isNaN(number) ? 0 : number)]
            .map((_, i) => ({ value: i + 1 })); 
        }

        // Triggers the binder on the body of this page to (re)render the page with the application's data
        render() { this.binder.bind(document.body, this); }
      }
      const app = new Application();
      app.render();
    </script>
  </body>
</html>
```

# Packages

> *use the web as-is and as it's meant to be*

### Standard

Includes all standard modules

[download](https://datadink.github.io/webtini/standard-binder.zip)

**Common JS**

```html
<!-- to pull directly from github (not for production) -->
<script src="https://datadink.github.io/webtini/standard-binder-package.min.js"></script>
```

**JS Module**

```javascript
// to import directly from github (also not for production)
import StandardBinder from 'https://datadink.github.io/webtini/standard-binder-module.js';
```

**Import Map**

```html
<!-- to define an import map from github (not for production) -->
<html>
  <head>
    <script type="importmap">
      {
        "imports": {
          "StandardBinder": "https://datadink.github.io/webtini/standard-binder-module.js"
        }
      }
    </script>
  </head>
  <body>
    <script type="module">
      import StandardBinder from "StandardBinder";
    </script>
  </body>
</html>
```

**Includes:**

* AttributeBinder
* ClassBinder
* EventBinder
* StyleBinder
* TemplateBinder
* TextBinder

### Minimal

Provides basic model binding, content generation & interactivity

[download](https://datadink.github.io/webtini/minimal-binder.zip)

**Common JS**

```html
<!-- to pull directly from github (not for production) -->
<script src="https://datadink.github.io/webtini/minimal-binder-package.min.js"></script>
```

**JS Module**

```javascript
// to import directly from github (also not for production)
import MinimalBinder from 'https://datadink.github.io/webtini/minimal-binder-module.js';
```

**Import Map**

```html
<!-- to define an import map from github (not for production) -->
<html>
  <head>
    <script type="importmap">
      {
        "imports": {
          "MinimalBinder": "https://datadink.github.io/webtini/minimal-binder-module.js"
        }
      }
    </script>
  </head>
  <body>
    <script type="module">
      import MinimalBinder from "MinimalBinder";
    </script>
  </body>
</html>
```

**Includes:**

* TemplateBinder
* EventBinder

# Basic Binder Components

> *webtini is modular & extensible - use as much or little as you like*

### AttributeBinder

Enables `bind-attribute-name` attributes to bind values to other attributes on an element

```html
<img bind-attribute-alt="data.context.text" />
```

### ClassBinder

Enables `bind-class-name` attributes to toggle classes on an element from a boolean(ish) value

```html
<div bind-class-active="data.context.selected">...</div>
```

### EventBinder

Enables `bind-event-name` attributes to assign functions to events on an element

```html
<button bind-event-click="data.context.submit">Save</button>
```

### StyleBinder

Enables `bind-style-name` attributes to assign values to an element's styles

```html
<div bind-style-background="data.context.color">...</div>
```

### TemplateBinder

Causes `HTMLTemplateElement`s to generate content when bound to an array

```html
<template bind="data.context.items"><span bind-textcontent="name"></span></template>
```

```javascript
binder.bind(element, { data: { context: { items: [{name: 'a'}, {name: 'b'}] } } });
```

### TextBinder

Enables familiar inline `{data.property}` binding from within text.

```html
<h1>Page: {title}</h1>
```

# FAQ

> *constomize webtini to work the way you want*

* When does it make sense to use this?
  * When you need a web app right now with little effort and no overhead.
* What is the benefit?
  * This package helps to keep web development simple, clean and extensible.
  * Modern web technologies no longer need massive processing efforts such as transpiling from something else.
  * By working with & along-side modern web patterns & practices it is easier to prevent your code from becoming obsolete.
  * MVVM and similar patterns help keep concerns decoupled and modular.
* Can this be used for large applications?
  * Yes. 
* Does this work on legacy browsers?
  * No: webtini targets modern browsers only
* Is it performant?
  * Depends: webtini leaves performance up to you. You have full control over the render/update loop, etc.
  * Typically, web applications do not need extreme performance and there's no framework in the world that doesn't add overhead to your application.
* Does it scale?
  * Depends: webtini only focuses on connecting your view with your data & functionality. The scalability of the app you write is up to you.
  * Because of webtini's extensible design, it can be easily customized, optimized and you can even contribute here if you've got something useful!
* What do I have to learn?
  * Just good-ol', raw javascript, html, and css.
  * Understanding data-driven patterns like MVVM will help a lot.
* Can I use typescript?
  * As far as I know.
* How does this fit in with REACT?
  * It doesn't. React obfuscates and entangles web technologies. webtini embraces them.
