# webtini

*minimalistic view modeling framework*

* [source](https://github.com/datadink/webtini)
* [documentation](https://datadink.github.io/webtini)
* <a href="https://datadink.github.io/webtini/standard-binder-package.min.js.zip" download>download (latest)</a>

Similarities to `knockout` and `vue` but smaller and rawer.

* Minimalistic
* Conformant
* Declarative
* Unobtrusive
* Modular

> ![WARNING]
> Nothing is fully tested yet. Use at your own risk.

# Quick Start

```html
<html>
  <head>
    <title>webtini quick-start</title>
    <!-- A style to hide the page until its ready -->
    <style>.loading { display: none; }</style>
  </head>
  <!-- Bind the "loading" class to the isLoading property on the Application -->
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
      // Binders are the engines for webtini applications.
      // The StandardBinder includes all standard modules / functionality.
      import StandardBinder from 'https://datadink.github.io/webtini/StandardBinder.js'; // NOTE: Be aware of COORS

      // The application is a viewmodel that the web view can be bound to using the Binder.
      // It defines all of the exposed data & functionality for binding from the view.
      class Application {
        // Instance of the binder to be used with this application
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

### Standard

Includes all standard modules

```html
<!-- to pull directly from github (not for production) -->
<script src="https://datadink.github.io/webtini/standard-binder-package.min.js"></script>
```

```javascript
// less optimal & also not for production
import StandardBinder from 'https://datadink.github.io/webtini/StandardBinder.js';
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

```html
<!-- to pull directly from github (not for production) -->
<script src="https://datadink.github.io/webtini/minimal-binder-package.min.js"></script>
```

```javascript
// less optimal & also not for production
import MinimalBinder from 'https://datadink.github.io/webtini/MinimalBinder.js';
```

**Includes:**

* TemplateBinder
* EventBinder

# Modules

### AttributeBinder

Enables `bind-attribute-name` attributes to bind values to other attributes on an element

```html
<img bind-attribute-alt="data.context.text" />
```

### ClassBinder

Enables `bind-class-name` attributes to toggle classes on an element from a boolean(ish) value

```html
<div bind-class-bordered="data.context.selected">...</div>
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

* When does it make sense to use this?
  * When you need something fast with little effort.
* Can this be used for large applications?
  * Yes. 
* Does this work on legacy browsers?
  * No: webtini targets modern browsers only
* Is it performant?
  * Depends: webtini leaves performance up to you. You have full control over the render/update loop, etc.
* Does it scale?
  * Depends: webtini only focuses on connecting your view with your data & functionality. The scalability of the app you write is up to you.
* What do I have to learn?
  * Raw javascript, html, css, etc.
* How does this fit in with REACT?
  * It doesn't. React obfuscates web technologies. webtini embraces them.
