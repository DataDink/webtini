# Description

Extends DOMTokenLists with the `tokens` boolean property map that 
adds and removes named tokens on truthy/falsey values.
This simplifies databinding tokens such as class names on elements.

# Example

```javascript
let element = document.createElement('div');
element.classList.tokens.classA = true;
element.classList.tokens.classB = false;
element.classList.tokens.classC = true;
// results in `<div class="classA classC" />
```