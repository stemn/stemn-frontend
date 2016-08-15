(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(function () {
            return factory();
        });
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        root.webGerberConstants = factory();
    }
}(this, function () {
  return {
      colors: {
          board      : '#103410',
          boardDark  : '#0a1f0a',
          boardLight : '#133b13',
      }
  }
}))
