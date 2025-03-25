(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Binder2 = _interopRequireDefault(require("./src/Binder.js"));
var _TemplateBinder = _interopRequireDefault(require("./src/TemplateBinder.js"));
var _EventBinder = _interopRequireDefault(require("./src/EventBinder.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } /**
 * @author Greenwald
 * @license PDL
 */
/**
 * @class MinimalBinder
 * @description A minimal binder with only the basic extensions needed for content generation and interactivity.
 */
var MinimalBinder = exports["default"] = /*#__PURE__*/function (_Binder) {
  function MinimalBinder() {
    _classCallCheck(this, MinimalBinder);
    for (var _len = arguments.length, extensions = new Array(_len), _key = 0; _key < _len; _key++) {
      extensions[_key] = arguments[_key];
    }
    return _callSuper(this, MinimalBinder, [].concat(extensions, [new _TemplateBinder["default"](), new _EventBinder["default"]()]));
  }
  _inherits(MinimalBinder, _Binder);
  return _createClass(MinimalBinder);
}(_Binder2["default"]);
window.MinimalBinder = MinimalBinder;

},{"./src/Binder.js":2,"./src/EventBinder.js":3,"./src/TemplateBinder.js":5}],2:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Route = _interopRequireDefault(require("./Route.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); } /**
 * @author Greenwald
 * @license PDL
 * @module Binder
 */
/**
 * @description The core of webtini functionality. Renders a view using a data model.
 * @member module:Binder
 * @example
 * ```html
 * <html>
 *  <body>
 *    <h1 bind-textcontent="title"></h1>
 *    <p bind-textcontent="content"></p>
 *  </body>
 * </html>
 * ```
 * 
 * ```javascript
 * var datamodel = {
 *  title: 'The Page Title',
 *  content: 'The page content',
 * };
 * var binder = new Binder();
 * binder.bind(document.body, data)
 * ```
 */
var _active = /*#__PURE__*/new WeakMap();
var _extensions = /*#__PURE__*/new WeakMap();
var Binder = exports["default"] = /*#__PURE__*/function () {
  /**
   * @constructor
   * @description Creates a new instance of the Binder class with optional extensions.
   * @param  {...Binder.Extension} extensions 
   * @example
   * ```javascript
   * import {TemplateBinder} from './TemplateBinder.js';
   * import {EventBinder} from './EventBinder.js';
   * import {StyleBinder} from './StyleBinder.js';
   * import {ClassBinder} from './ClassBinder.js';
   * var binder = new Binder(
   *  new TemplateBinder(), 
   *  new EventBinder(), 
   *  new StyleBinder(), 
   *  new ClassBinder()
   * );
   * ```
   */
  function Binder() {
    _classCallCheck(this, Binder);
    _classPrivateFieldInitSpec(this, _active, 0);
    _classPrivateFieldInitSpec(this, _extensions, []);
    for (var _len = arguments.length, extensions = new Array(_len), _key = 0; _key < _len; _key++) {
      extensions[_key] = arguments[_key];
    }
    _classPrivateFieldSet(_extensions, this, extensions !== null && extensions !== void 0 ? extensions : []);
  }

  /**
   * @member {function} module:Binder.bind
   * @description Renders the view using the data.
   * @param {Element} view 
   * @param {*} data 
   * @returns {Element}
   */
  return _createClass(Binder, [{
    key: "active",
    get:
    /**
     * @member {boolean} module:Binder.active
     * @description Indicates whether the binder is currently processing a view.
     * @type {boolean}
     */
    function get() {
      return _classPrivateFieldGet(_active, this) > 0;
    }
  }, {
    key: "bind",
    value: function bind(view, data) {
      var _this$active,
        _this$active2,
        _this$active5,
        _this$active6,
        _this = this,
        _view$getAttribute;
      _classPrivateFieldSet(_active, this, (_this$active = _classPrivateFieldGet(_active, this), _this$active2 = _this$active++, _this$active)), _this$active2;
      data = data instanceof _Route["default"] ? data : new _Route["default"](data);
      var handled = _classPrivateFieldGet(_extensions, this).find(function (e) {
        return e.handleElement(_this, view, data);
      }) || !(view instanceof Element);
      if (handled) {
        var _this$active3, _this$active4;
        _classPrivateFieldSet(_active, this, (_this$active3 = _classPrivateFieldGet(_active, this), _this$active4 = _this$active3--, _this$active3)), _this$active4;
        return view;
      }
      for (var _i = 0, _arr = _toConsumableArray(view.attributes); _i < _arr.length; _i++) {
        var _attr$value;
        var attr = _arr[_i];
        var name = attr.name.toLowerCase();
        if (!attr.name.startsWith(Binder.PREFIX)) {
          continue;
        }
        name = name.substring(Binder.PREFIX.length);
        if (_classPrivateFieldGet(_extensions, this).find(function (e) {
          return e.handleAttribute(_this, view, data, name, attr.value);
        })) {
          continue;
        }
        var selection = data.select((_attr$value = attr.value) === null || _attr$value === void 0 ? void 0 : _attr$value.split('.')).value;
        var assignment = _Route["default"].select(view, name.split('-'));
        assignment.assign(selection);
      }
      var scope = view.hasAttribute(Binder.ATTRIBUTE) ? data.select((_view$getAttribute = view.getAttribute(Binder.ATTRIBUTE)) === null || _view$getAttribute === void 0 ? void 0 : _view$getAttribute.split('.')) : data;
      for (var _i2 = 0, _arr2 = _toConsumableArray(view.childNodes); _i2 < _arr2.length; _i2++) {
        var child = _arr2[_i2];
        this.bind(child, scope);
      }
      _classPrivateFieldSet(_active, this, (_this$active5 = _classPrivateFieldGet(_active, this), _this$active6 = _this$active5--, _this$active5)), _this$active6;
      return view;
    }
    /**
     * @member module:Binder.Extension
     * @description An interface for extending the functionality of the {@link Binder} class.
     * @example
     * ```javascript
     * import {Binder} from './Binder.js';
     * export default class MyExtension extends Binder.Extension {
     *   handleElement(binder, element, route) {
     *    if (!(element instanceof HTMLDivElement)) { return false; } // Only handle div elements
     *    element.style.borderColor = 'red'; // Outline them in red
     *    binder.bind(element, route); // Apply normal binding (optional)
     *    return true; // Indicate that the element was handled and prevent further processing
     *   }
     * }
     */
  }], [{
    key: "ATTRIBUTE",
    get:
    /**
     * @member {string} module:Binder.ATTRIBUTE
     * @description The attribute for defining the data scope for descendant elements.
     * @type {string}
     */
    function get() {
      return 'bind';
    }
    /**
     * @member {string} module:Binder.PREFIX
     * @description The prefix for identifying binding attributes.
     * @type {string}
     */
  }, {
    key: "PREFIX",
    get: function get() {
      return 'bind-';
    }
  }]);
}();
_defineProperty(Binder, "Extension", /*#__PURE__*/function () {
  function Extension() {
    _classCallCheck(this, Extension);
  }
  return _createClass(Extension, [{
    key: "handleElement",
    value:
    /**
     * @member {function} module:Binder.Extension.handleElement
     * @description A method for handling descendant elements.
     * @param {Binder} binder 
     * @param {Element} element 
     * @param {Route} route 
     * @returns {boolean}
     */
    function handleElement(binder, element, route) {
      return false;
    }
    /**
     * @member {function} module:Binder.Extension.handleAttribute
     * @description A method for handling an attribute on an element
     * @param {Binder} binder 
     * @param {Element} element 
     * @param {Route} route 
     * @param {string} name 
     * @param {string} value 
     * @returns {boolean}
     */
  }, {
    key: "handleAttribute",
    value: function handleAttribute(binder, element, route, name, value) {
      return false;
    }
  }]);
}());

},{"./Route.js":4}],3:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Binder = _interopRequireDefault(require("./Binder.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } /**
 * @author Greenwald
 * @license PDL
 * @module EventBinder
 */
/**
 * @class EventBinder
 * @description Enables the use of event binding attributes.
 * @memberof module:EventBinder
 * @example
 * ```html
 * <html>
 * <body>
 *  <button bind-event-click="data.api.triggerEvent">Click me</button>
 * </body>
 * </html>
 * ```
 */
var EventBinder = exports["default"] = /*#__PURE__*/function (_Binder$Extension) {
  function EventBinder() {
    _classCallCheck(this, EventBinder);
    return _callSuper(this, EventBinder, arguments);
  }
  _inherits(EventBinder, _Binder$Extension);
  return _createClass(EventBinder, [{
    key: "handleAttribute",
    value: function handleAttribute(binder, element, route, name, value) {
      var _events$_, _element$_events$_;
      if (!name.startsWith(EventBinder.PREFIX)) {
        return false;
      }
      var event = name.substring(EventBinder.PREFIX.length);
      var events = (_element$_events$_ = element[_events$_ = _events._]) !== null && _element$_events$_ !== void 0 ? _element$_events$_ : element[_events$_] = {};
      var handler = route.select(value.split('.'));
      if (event in events && events[event].data === handler.data && events[event].handler === events[event].result) {
        return true;
      }
      if (event in events) {
        element.removeEventListener(event, events[event].binding);
        delete events[event];
      }
      if (typeof handler.result !== 'function') {
        return true;
      }
      var context = events[event] = {
        data: handler.data,
        handler: handler.result,
        binding: function binding() {
          if (binder.active) {
            return;
          }
          return context.handler.apply(context.data, arguments);
        }
      };
      element.addEventListener(event, events[event].binding);
      return true;
    }
  }], [{
    key: "PREFIX",
    get:
    /**
     * @property PREFIX
     * @description The prefix for identifying event binding attributes.
     * @type {string}
     */
    function get() {
      return 'event-';
    }
  }]);
}(_Binder["default"].Extension);
var _events = {
  _: Symbol('events')
};

},{"./Binder.js":2}],4:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
var _root = /*#__PURE__*/new WeakMap();
var _parent = /*#__PURE__*/new WeakMap();
var _name = /*#__PURE__*/new WeakMap();
var _value = /*#__PURE__*/new WeakMap();
var _next = /*#__PURE__*/new WeakMap();
var _last = /*#__PURE__*/new WeakMap();
/**
 * @author Greenwald
 * @license PDL
 * @module Route
 */
/**
 * @class Route
 * @description A class for selecting and assigning values in a data model.
 * @memberof module:Route
 * @example
 * ```javascript
 * var model = { a: { b: { c: 'value' } } };
 * var route = Route.select(model, ['a', 'b', 'c']);
 * JSON.stringify(route.data); // { c: 'value' }
 * console.log(route.index); // 'c'
 * console.log(route.result); // 'value'
 * ```
 * 
 * ```javascript
 * var model = { x: { y: { z: 'value' } } };
 * var route = Route.select(model, ['a', 'b', 'c']);
 * [...route].map(node => node.name).join(', '); // null, 'a', 'b', 'c'
 * [...route].map(node => node.value).join(', '); // object, null, null, null
 * ```
 */
var Route = exports["default"] = /*#__PURE__*/function () {
  /**
   * @constructor
   * @description Creates a new instance of the Route class with an optional root value.
   * @param {*} root 
   */
  function Route() {
    var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    _classCallCheck(this, Route);
    _classPrivateFieldInitSpec(this, _root, void 0);
    _classPrivateFieldInitSpec(this, _parent, void 0);
    _classPrivateFieldInitSpec(this, _name, void 0);
    _classPrivateFieldInitSpec(this, _value, void 0);
    _classPrivateFieldInitSpec(this, _next, void 0);
    _classPrivateFieldInitSpec(this, _last, void 0);
    _classPrivateFieldSet(_value, _classPrivateFieldSet(_root, this, _classPrivateFieldSet(_last, this, this)), root);
  }
  return _createClass(Route, [{
    key: "root",
    get:
    /**
     * @property root
     * @description The root node of the route.
     * @type {Route}
     */
    function get() {
      return _classPrivateFieldGet(_root, this);
    }
  }, {
    key: "parent",
    get:
    /**
     * @property parent
     * @description The previous sibling of this node.
     * @type {Route}
     */
    function get() {
      return _classPrivateFieldGet(_parent, this);
    }
  }, {
    key: "name",
    get:
    /**
     * @property name
     * @description The name of this node.
     * @type {string}
     */
    function get() {
      return _classPrivateFieldGet(_name, this);
    }
  }, {
    key: "value",
    get:
    /**
     * @property value
     * @description The value of this node.
     * @type {*}
     */
    function get() {
      return _classPrivateFieldGet(_value, this);
    }
  }, {
    key: "next",
    get:
    /**
     * @property next
     * @description The next sibling of this node.
     * @type {Route}
     */
    function get() {
      return _classPrivateFieldGet(_next, this);
    }
  }, {
    key: "last",
    get:
    /**
     * @property last
     * @description The last node in the route.
     * @type {Route}
     */
    function get() {
      return _classPrivateFieldGet(_last, _classPrivateFieldGet(_root, this));
    }
  }, {
    key: "path",
    get:
    /**
     * @property path
     * @description The key path of the route.
     * @type {string[]}
     */
    function get() {
      return _toConsumableArray(this).map(function (node) {
        return node.name;
      });
    }
    /**
     * @property data
     * @description The end data model of the route containing the result.
     * @type {*}
     */
  }, {
    key: "data",
    get: function get() {
      var _this$last$parent;
      return (_this$last$parent = this.last.parent) === null || _this$last$parent === void 0 ? void 0 : _this$last$parent.value;
    }
    /**
     * @property index
     * @description The end key name of the route indexing the result.
     * @type {string}
     */
  }, {
    key: "index",
    get: function get() {
      return this.last.name;
    }
    /**
     * @property result
     * @description The result of the route.
     * @type {*}
     */
  }, {
    key: "result",
    get: function get() {
      return this.last.value;
    }
  }, {
    key: Symbol.iterator,
    value: /*#__PURE__*/_regeneratorRuntime().mark(function value() {
      var node;
      return _regeneratorRuntime().wrap(function value$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            node = _classPrivateFieldGet(_root, this);
          case 1:
            if (!node) {
              _context.next = 7;
              break;
            }
            _context.next = 4;
            return node;
          case 4:
            node = _classPrivateFieldGet(_next, node);
            _context.next = 1;
            break;
          case 7:
          case "end":
            return _context.stop();
        }
      }, value, this);
    })
    /**
     * @function append
     * @description Adds a node to the end of this {@link Route}.
     * @returns {Route}
     */
  }, {
    key: "append",
    value: function append(name, value) {
      var next = _classPrivateFieldSet(_next, this, new Route());
      _classPrivateFieldSet(_name, next, name);
      _classPrivateFieldSet(_value, next, value);
      _classPrivateFieldSet(_root, next, _classPrivateFieldGet(_root, this));
      _classPrivateFieldSet(_parent, next, this);
      _classPrivateFieldSet(_last, _classPrivateFieldGet(_root, this), next);
      return next;
    }
    /**
     * @function clone
     * @description Creates a duplicate of this {@link Route}
     * @returns {Route}
     */
  }, {
    key: "clone",
    value: function clone() {
      var clone = new Route(this.value);
      for (var node = _classPrivateFieldGet(_next, this); node; node = _classPrivateFieldGet(_next, node)) {
        clone = clone.append(_classPrivateFieldGet(_name, node), _classPrivateFieldGet(_value, node));
      }
      return clone;
    }
    /**
     * @function find
     * @description Performs a case-insensitive search for a matching key in the data object or defaults to the name.
     * @returns {string}
     */
  }, {
    key: "select",
    value:
    /**
     * @function select
     * @description Extends this {@link Route} using the path and returns a new {@link Route} instance with the result.
     * @returns {Route}
     */
    function select(path) {
      return Route.select(this, path);
    }
    /**
     * @function select
     * @description Creates or extends an existing {@link Route} using the path and returns a new {@link Route} instance with the result.
     * @returns {Route}
     */
  }, {
    key: "assign",
    value:
    /**
     * @function assign
     * @description Creates an updated {@link Route}, creating {@link object}s as necessary, and updating the {@link Route}s result to the value.
     * @returns {Route}
     */
    function assign(value) {
      return Route.assign(this, value);
    }
    /**
     * @function assign
     * @description Creates an updated {@link Route}, creating {@link object}s as necessary, and updating the {@link Route}s result to the value.
     * @returns {Route}
     */
  }], [{
    key: "find",
    value: function find(data, name) {
      if (data == null || name in data) {
        return name;
      }
      var lower = name.toLowerCase();
      for (var key in data) {
        if (key.toLowerCase() === lower) {
          return key;
        }
      }
      return name;
    }
  }, {
    key: "select",
    value: function select(source, path) {
      return (Array.isArray(path) ? path : []).reduce(function (r, m) {
        if (!(m !== null && m !== void 0 && m.length) || m === '.') {
          return r;
        } else if (m === '~') {
          r = _classPrivateFieldGet(_root, r);
          _classPrivateFieldSet(_last, r, r);
          _classPrivateFieldSet(_next, r, null);
        } else if (m === '^') {
          var _classPrivateFieldGet2;
          r = (_classPrivateFieldGet2 = _classPrivateFieldGet(_parent, r)) !== null && _classPrivateFieldGet2 !== void 0 ? _classPrivateFieldGet2 : r;
          _classPrivateFieldSet(_last, _classPrivateFieldGet(_root, r), r);
          _classPrivateFieldSet(_next, r, null);
        } else {
          var _classPrivateFieldGet3;
          var name = Route.find(_classPrivateFieldGet(_value, r), m);
          r = r.append(name, (_classPrivateFieldGet3 = _classPrivateFieldGet(_value, r)) === null || _classPrivateFieldGet3 === void 0 ? void 0 : _classPrivateFieldGet3[name]);
        }
        return r;
      }, source instanceof Route ? source.clone() : new Route(source));
    }
  }, {
    key: "assign",
    value: function assign(route, value) {
      if (!(route instanceof Route)) {
        throw new Error('Route.assign: route must be an instance of a Route.');
      }
      var result = new Route(_classPrivateFieldGet(_value, _classPrivateFieldGet(_root, route)));
      if (route.root.next == null || result.value == null) {
        return result;
      }
      for (var node = route.root.next; node; node = node.next) {
        var _result$value$name;
        var name = Route.find(result.value, node.name);
        result = result.append(name, (_result$value$name = result.value[name]) !== null && _result$value$name !== void 0 ? _result$value$name : result.value[name] = {});
      }
      _classPrivateFieldSet(_value, result, result.parent.value[result.name] = value);
      return result;
    }
  }]);
}();

},{}],5:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Binder = _interopRequireDefault(require("./Binder.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); } /**
 * @author Greenwald
 * @license PDL
 * @module TemplateBinder
 */
/**
 * @class TemplateBinder
 * @description Enables the use of {@link HTMLTemplateElement} elements as data-templates.
 * @memberof module:TemplateBinder
 * @example
 * ```html
 * <html>
 *  <body>
 *    <template bind="model.items">
 *      <h1 bind-textcontent="title"></h1>
 *      <p bind-textcontent="content"></p>
 *    </template>
 *  </body>
 * </html>
 * ```
 * 
 * ```javascript
 * var model = { items: [
 *  { title: 'Item 1', content: 'Item 1 content' },
 *  { title: 'Item 2', content: 'Item 2 content' },
 *  { title: 'Item 3', content: 'Item 3 content' },
 * ] };
 * var binder = new Binder(new TemplateBinder());
 * binder.bind(document.body, model);
 * ```
 */
var TemplateBinder = exports["default"] = /*#__PURE__*/function (_Binder$Extension) {
  function TemplateBinder() {
    _classCallCheck(this, TemplateBinder);
    return _callSuper(this, TemplateBinder, arguments);
  }
  _inherits(TemplateBinder, _Binder$Extension);
  return _createClass(TemplateBinder, [{
    key: "handleElement",
    value:
    /**
     * @method handleElement
     * @description Binds an {@link HTMLTemplateElement} to a data model.
     * @param {Binder} binder
     * @param {HTMLElement} element
     * @param {Route} route
     * @returns {boolean}
     */
    function handleElement(binder, element, route) {
      var _element$getAttribute, _instances$_, _element$_instances$_, _instances$at$at$next, _instances$at;
      if (element[_instance._]) {
        return true;
      }
      if (!(element instanceof HTMLTemplateElement)) {
        return false;
      }
      route = element.hasAttribute(_Binder["default"].ATTRIBUTE) ? route.select((_element$getAttribute = element.getAttribute(_Binder["default"].ATTRIBUTE)) === null || _element$getAttribute === void 0 ? void 0 : _element$getAttribute.split('.')) : route;
      var recurse = element.hasAttribute(_Binder["default"].ATTRIBUTE) && element.hasAttribute(TemplateBinder.RECURSE);
      var items = route.result == null ? [] : Array.isArray(route.result) ? route.result.map(function (v, i) {
        return route.clone().append(i.toString(), v);
      }) : [route];
      var instances = (_element$_instances$_ = element[_instances$_ = _instances._]) !== null && _element$_instances$_ !== void 0 ? _element$_instances$_ : element[_instances$_] = [];
      while (instances.length > items.length) {
        var instance = instances.pop();
        var _iterator = _createForOfIteratorHelper(instance),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var e = _step.value;
            e[_instance._] = false;
            if (e instanceof HTMLTemplateElement) {
              binder.bind(e, null);
            }
            e.remove();
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      var insert = (_instances$at$at$next = (_instances$at = instances.at(-1)) === null || _instances$at === void 0 || (_instances$at = _instances$at.at(-1)) === null || _instances$at === void 0 ? void 0 : _instances$at.nextSibling) !== null && _instances$at$at$next !== void 0 ? _instances$at$at$next : element.nextSibling;
      while (instances.length < items.length) {
        var instance = _toConsumableArray(element.content.cloneNode(true).childNodes);
        instances.push(instance);
        var _iterator2 = _createForOfIteratorHelper(instance),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var e = _step2.value;
            e[_instance._] = true;
            element.parentNode.insertBefore(e, insert);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        if (recurse) {
          var recursion = element.cloneNode(true);
          instance.push(recursion);
          element.parentNode.insertBefore(recursion, insert);
        }
      }
      for (var i = 0; i < items.length; i++) {
        var _iterator3 = _createForOfIteratorHelper(instances[i]),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var e = _step3.value;
            e[_instance._] = false;
            binder.bind(e, items[i]);
            e[_instance._] = true;
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
      return true;
    }
  }], [{
    key: "RECURSE",
    get:
    /**
     * @property RECURSE
     * @description The attribute for defining recursive data-templates.
     * @type {string}
     */
    function get() {
      return 'recurse';
    }
  }]);
}(_Binder["default"].Extension);
var _instances = {
  _: Symbol('template-instances')
};
var _instance = {
  _: Symbol('template-instance')
};

},{"./Binder.js":2}]},{},[1]);
