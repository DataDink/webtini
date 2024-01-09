/*
 * @Author: Greenwald
 * @Documentation: https://github.com/DataDink/webtini/blob/main/docs/DOMTokenList.prototype.tokens.md
 */
Object.defineProperty(DOMTokenList.prototype, 'tokens', {
  get: function() { return new Proxy(this, {
    ownKeys: target => [...target.values()],
    has: (target, key) => target.contains(key),
    get: (target, key) => target.contains(key),
    set: (target, key, value) => {
      if (value) { target.add(key); }
      else { target.remove(key); }
      return true;
    },
  }); }
});