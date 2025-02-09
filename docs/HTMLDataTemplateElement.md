# Requires

* [https://github.com/DataDink/webtini/wiki/Element.prototype.bind](https://github.com/DataDink/webtini/wiki/Element.prototype.bind)

# Description

  This class extends HTMLTemplateElement to render data to the DOM.
  Setting the `data` property will render the template content and bind it.
  If the `data` is an array, the template will be rendered for each item.
  If the `data` is an object, the template will be rendered for each property.
  If the `data` is a value, the template will be rendered once.
  If the `data` is null or undefined, the template will be cleared.
  The content will be rendered immediately after the template element.

# Example

  **The following code:**

  ```html
  <ul>
    <template is="data-template" bind-data="items">
      <li bind-textContent="name"></li>
    </template>
  </ul>
  ```

  **When bound to:**

  ```js
  document.body.bind({ items: [
    { name: 'Item 1' },
    { name: 'Item 2' },
  ]});
  ```

  **Would render as:**

  ```html
  <ul>
    <template is="data-template" bind-data="items">
      <li bind-textContent="name"></li>
    </template>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>

