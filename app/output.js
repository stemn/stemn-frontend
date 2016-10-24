(function UMDish(name, context, definition, plugins) {
  context[name] = definition.call(context);
  for (var i = 0; i < plugins.length; i++) {
    plugins[i](context[name])
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = context[name];
  } else if (typeof define === "function" && define.amd) {
    define(function reference() { return context[name]; });
  }
})("Primus", this || {}, function wrapper() {
  var define, module, exports
    , Primus = ;
  return Primus;
},
[

]);
