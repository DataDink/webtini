# webtini

*minimalistic view modeling framework*

Similarities to `knockout` and `vue` but smaller and rawer.

* Declarative
* Modular
* Conformant
* Unobtrusive

> ![WARNING]
> Nothing is fully documented or tested yet. Use at your own risk.

# Quick Start

```html
<html>
  <head>
    <title>webtini quick-start</title>
    <style>
      /* A style for the page initial loading state */
      .loading { display: none; }
    </style>
  </head>
  <!-- Bind the "loading" class to the isLoading property on the Application -->
  <body class="loading" bind-class-loading="isLoading">
    <header>
      <!-- Binds the textContent of the H1 to the title property on the Application -->
      <h1 bind-textContent="title"></h1>
    </header>
    <menu>
      <!-- Binds this template to the "links" array on the Application -->
      <!-- An instance of the template's content will be bound to each item in the "links" array -->
      <template bind="links">
        <li><a bind-href="url" bind-textContent="text"></a></li>
      </template>
    </menu>
    <!-- Binds the span's textcontent to the "count" property on the application -->
    <h1>Count: <span bind-textcontent="count"></span></h1>
    <!-- Binds the button's "click" event to the "increment" function on the application -->
    <button bind-event-click="increment">Increment</button>
    <!-- Binds the input's "value" property to the application's "count" property -->
    <!-- Binds the input's "input" event to the application's "oninput" function -->
    <input type="number" bind-value="count" bind-event-input="oninput">
    <div>
      <!-- Binds this template to the "items" array on the Application -->
      <template bind="items">
        <span bind-textContent="value"></span>
      </template>
    </div>
    <!-- Note: Be aware of COORS below -->
    <script type="module">
      // The Binder is the core engine for webtini applications. 
      // The StandardBinder contains all of the basic/default extensions:
      //   * AttributeBinder: Allows you to "bind-attribute-name" to bind to an element's attributes
      //   * ClassBinder: Allows you to "bind-class-name" to add/remove classes based on a boolean(ish) binding
      //   * EventBinder: Allows you to "bind-event-name" to bind events to functions
      //   * StyleBinder: Allows you to "bind-style-name" to bind an element's .style[name]
      //   * TemplateBinder: Causes HTMLTemplateElements to generate content when bound to arrays
      import StandardBinder from 'http://localhost/StandardBinder.js'

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
          { text: 'github',  url: 'https://github.com' },
          { text: 'webtini',  url: 'https://github.com/datadink/webtini' },
          { text: 'documentation',  url: 'https://datadink.github.io/webtini/' },
        ];

        // A coordinated data value that multiple parts of the application use
        count = 0;

        // Creates an array of items based on the "count" that a template in the view binds to.
        get items() { 
          var number = Math.abs(Math.min(100, Number.isNaN( this.count) ? 0 : this.count));
          return [...new Array(number)]
            .map((_, i) => ({ value: i + 1 })); 
        }

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

        // Triggers the binder on the body of this page to (re)render the page with the application's data
        render() { this.binder.bind(document.body, this); }
      }
      const app = new Application();
      app.render();
    </script>
  </body>
</html>
```
