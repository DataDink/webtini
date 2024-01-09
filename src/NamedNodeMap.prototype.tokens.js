/*
 * @Author: Greenwald
 * @Documentation: https://github.com/DataDink/webtini/blob/main/docs/NamedNodeMap.prototype.tokens.md
 */
Object.defineProperty(NamedNodeMap.prototype, 'tokens', {
  get: function() { return new Proxy(this, {
    ownKeys: target => [...target].map(attr => attr.localName),
    has: (target, key) => target.getNamedItem(key) != null,
    get: (target, key) => target.getNamedItem(key)?.value,
    set: (target, key, value) => {
      if (value == null) { target.removeNamedItem(key); }
      else { 
        const attr = target.getNamedItem(key) ?? target.setNamedItem(document.createAttribute(key));
        attr.value = value;
      }
    },
  }); }
});