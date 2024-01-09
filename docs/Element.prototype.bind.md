
# Description

Extends the Element prototype with a `bind` method.
Used to bind data to an element and all of its children.
The element and its children are scanned for attributes that begin with `bind-`
followed by a property name or dash(-) separated path on the element. 
The attribute is given a property name or dot(.) separated path on the data.
The property on the data is set to the value of the attribute on the element.
The element must be re-bound if the data changes.
The `bind` attribute can be used to change the data source for a subtree.

> [!NOTE]
> property names are treated with case-insensitivity.

# Example

**The following HTML:**

```html
<h1 bind-textContent="person.info.name"></h1>
<ul bind="person.info">
  <li bind-textContent="age"></li>
  <li bind-textContent="height"></li>
</ul>
```

**When bound to the following data:**

```js
document.body.bind({
  person: {
    info: {
      name: 'John Doe',
      age: 42,
      height: '6\' 2"'
    }
  }
});
```

**Would render as:**

```html
<h1 bind-textContent="person.info.name">John Doe</h1>
<ul bind="person.info">
  <li bind-textContent="age">42</li>
  <li bind-textContent="height">6' 2"</li>
</ul>
```

# Additional Info

## View

The `bind` extension calls the View class.

```javascript
import View from 'https://datadink.github.io/webtini/src/Element.prototype.bind.js';
```

**View.bind**

```javascript
/*
 * @function View.bind(view, model) - Binds the values of the model object to the view element.
 * @parameter view {Element}        - The element the model is bound to
 * @parameter model {Object}        - The object that is bound to the view
 * @returns {Element}               - The view element
 */
View.bind(document.body, { title: 'Page Title', message: 'A message to show' });
```

```html
<html>
  <body>
    <h1 bind-textContent="title"></h1>
    <p bind-textContent="message"></p>
  </body>
</html>
```

**View.read**

```javascript
/*
 * @function View.read(object, selector) - Reads the value at selected path from the root object
 * @parameter object {Object}            - The root object to select from
 * @parameter selector {Array}           - A set of property names addressing the value to read
 * @returns {any}                        - The selected value if the path exists, otherwise undefined
 * @notes
 *   Property names are case-insensitive.
 */
View.read({ a: { b: { c: 123 } } }, ['a', 'b', 'c']); // returns 123
```

**View.select**

```javascript
/*
 * @function View.select(object, selector)     - Queries an object and property name from the root object
 * @parameter object {Object}                  - The root object to select from
 * @parameter selector {Array}                 - A set of property names addressing the value to read
 * @returns {value: {object}, index: {string}} - The selection object and matched property name
 * @notes
 *   Property names are case-insensitive.
 */
View.select({ a: { b: { c: 123 } } }, ['a', 'b', 'c']); // returns { value: { c: 123 }, index: 'c' }
```

**View.match**

```javascript
/*
 * @function View.match(object, index) - Seeks a property name matching the case-insensitive index
 * @parameter object {Object}          - The object to search
 * @parameter index {String}           - The property name to search for
 * @returns {string}                   - The matched name if exists or the original index value
 * @notes
 *   Property names are case-insensitive.
 */
View.match({ a: 1, B: 2, c: 3 }, 'b'); // returns 'B'
```