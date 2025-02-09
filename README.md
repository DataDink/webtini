# webtini

*minimalistic web extensions to fill in the gaps*

Similarities to `vue` but smaller and rawer.

* Declarative
* Modular
* Conformant

It's sort of a loosely related collection of extensions that exist until a W3C standard replaces them. 
*-- just filling in the gaps*

> ![WARNING]
> Nothing is fully documented or tested yet. Use at your own risk.

## Quick Start
```html
<html>
  <head>
    <title>webtini quick-start</title>
    <script type="module" src="https://datadink.github.io/webtini/minimal.js"></script>
  </head>
  <body>
    <header>
      <h1 bind-textContent="title"></h1>
    </header>
    <menu>
      <template is="data-template" bind-data="links">
        <li><a bind-href="url" bind-textContent="text"></a></li>
      </template>
    </menu>
    <script type="module">
      class Model {
        get title() { return document.querySelector('title').textContent; }
        links = [
          { text: 'github',  url: 'https://github.com' },
          { text: 'webtini',  url: 'https://github.com/datadink/webtini' },
          { text: 'documentation',  url: 'https://github.com/github.com/DataDink/webtini/blob/main/README.md' },
        ];
      }
      document.body.bind(new Model());
    </script>
  </body>
</html>
```

## Packages

*link these for general sets of functionality vs linking each module*

> ![NOTE]
> These are dev/debug links only. This repository is not a CDN.

### minimal

```html
<script type="module" src="https://datadink.github.io/webtini/minimal.js"></script>
```
* url: [https://datadink.github.io/webtini/minimal.js](https://datadink.github.io/webtini/minimal.js)

### standard

```html
<script type="module" src="https://datadink.github.io/webtini/standard.js"></script>
```
* url: [https://datadink.github.io/webtini/standard.js](https://datadink.github.io/webtini/standard.js)

## Modules

*link these individually to pick-and-choose functionality*

> ![NOTE]
> These are dev/debug links only. This repository is not a CDN.

### Element.prototype.bind

```html
<script type="module" src="https://datadink.github.io/webtini/src/Element.prototype.bind.js"></script>
```
* source: [https://github.com/DataDink/webtini/blob/main/src/Element.prototype.bind.js](./src/Element.prototype.bind.js)
* docs: [https://github.com/DataDink/webtini/blob/main/docs/Element.prototype.bind.md](./docs/Element.prototype.bind.md)
* url: [https://datadink.github.io/webtini/src/Element.prototype.bind.js](https://datadink.github.io/webtini/src/Element.prototype.bind.js)

### HTMLDataTemplateElement

```html
<script type="module" src="https://datadink.github.io/webtini/src/HTMLDataTemplateElement.js"></script>
```
* source: [https://github.com/DataDink/webtini/blob/main/src/HTMLDataTemplateElement.js](./src/HTMLDataTemplateElement.js)
* docs: [https://github.com/DataDink/webtini/blob/main/docs/HTMLDataTemplateElement.md](./docs/HTMLDataTemplateElement.md)
* url: [https://datadink.github.io/webtini/src/HTMLDataTemplateElement.js](https://datadink.github.io/webtini/src/HTMLDataTemplateElement.js)

### DOMTokenList.prototype.tokens.js

```html
<script type="module" src="https://datadink.github.io/webtini/src/DOMTokenList.prototype.tokens.js"></script>
```
* source: [https://github.com/DataDink/webtini/blob/main/src/DOMTokenList.prototype.tokens.js](./src/DOMTokenList.prototype.tokens.js)
* docs: [https://github.com/DataDink/webtini/blob/main/docs/DOMTokenList.prototype.tokens.md](./docs/DOMTokenList.prototype.tokens.md)
* url: [https://datadink.github.io/webtini/src/DOMTokenList.prototype.tokens.js](https://datadink.github.io/webtini/src/DOMTokenList.prototype.tokens.js)

### NamedNodeMap.prototype.tokens.js

```html
<script type="module" src="https://datadink.github.io/webtini/src/NamedNodeMap.prototype.tokens.js"></script>
```
* source: [https://github.com/DataDink/webtini/blob/main/src/NamedNodeMap.prototype.tokens.js](./src/NamedNodeMap.prototype.tokens.js)
* docs: [https://github.com/DataDink/webtini/blob/main/docs/NamedNodeMap.prototype.tokens.md](./docs/NamedNodeMap.prototype.tokens.md)
* url: [https://datadink.github.io/webtini/src/NamedNodeMap.prototype.tokens.js](https://datadink.github.io/webtini/src/NamedNodeMap.prototype.tokens.js)

