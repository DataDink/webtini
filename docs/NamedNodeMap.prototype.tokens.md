# Description

Extends NamedNodeMap with the `tokens` boolean property map that 
adds and removes named attributes on truthy/falsey values.
This simplifies databinding attributes on elements.

# Example

```javascript
let element = document.createElement('input');
element.attributes.tokens.disabled = true;
// results in `<input disabled/>
```