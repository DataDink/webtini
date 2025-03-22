# webtini

*minimalistic view modeling framework*

Similarities to `vue` but smaller and rawer.

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
      .loading { display: none; }
    </style>
  </head>
  <body class="loading" bind-class-loading="isLoading">
    <header>
      <h1 bind-textContent="title"></h1>
    </header>
    <menu>
      <template bind="links">
        <li><a bind-href="url" bind-textContent="text"></a></li>
      </template>
    </menu>
    <h1>Count: <span bind-textcontent="count"></span></h1>
    <button bind-event-click="increment">Increment</button>
    <script type="module">
      import StandardBinder from 'https://datadink.github.io/webtini/StandardBinder.js'
      class Application {
        isLoading = false; // Turns off page loading state
        binder = new StandardBinder(); // Reference to the application's binder
        get title() { return document.querySelector('title').textContent; }
        links = [
          { text: 'github',  url: 'https://github.com' },
          { text: 'webtini',  url: 'https://github.com/datadink/webtini' },
          { text: 'documentation',  url: 'https://datadink.github.io/webtini/' },
        ];
        count = 0;
        increment() { 
          this.count++; 
          this.render();
        }
        render() { this.binder.bind(document.body, this); }
      }
      const app = new Application();
      app.render();
    </script>
  </body>
</html>
```

