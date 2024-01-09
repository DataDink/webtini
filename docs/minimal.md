# Requires

  * [https://github.com/DataDink/webtini/wiki/Element.prototype.bind](https://github.com/DataDink/webtini/wiki/Element.prototype.bind)
  * [https://github.com/DataDink/webtini/wiki/HTMLDataTemplateElement](https://github.com/DataDink/webtini/wiki/HTMLDataTemplateElement)

# Setup

  ## Dev
  ```html
  <script type="module" src="https://datadink.github.io/webtini/minimal.js"></script>
  ```

  ## Prod
  *not yet implemented*

# Description

  This package includes only the minimal modules for data binding your page.
  
  * The `Element.prototype.bind` extension: [https://github.com/DataDink/webtini/wiki/Element.prototype.bind](https://github.com/DataDink/webtini/wiki/Element.prototype.bind)
  * The `HTMLDataTemplateElement` extension: [https://github.com/DataDink/webtini/wiki/HTMLDataTemplateElement](https://github.com/DataDink/webtini/wiki/HTMLDataTemplateElement)

# Example

  **The following code:**

  ```html
  <h1 bind-textContent="title"></h1>
  <ul>
    <template is="data-template" bind-data="items">
      <li bind-textContent="name"></li>
    </template>
  </ul>
  ```

  **When bound to:**

  ```js
  document.body.bind({ 
    title: 'A Title',
    items: [
      { name: 'Item 1' },
      { name: 'Item 2' },
    ]
  });
  ```

  **Would render as:**

  ```html
  <h1 bind-textContent="title">A Title</h1>
  <ul>
    <template is="data-template" bind-data="items">
      <li bind-textContent="name"></li>
    </template>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
