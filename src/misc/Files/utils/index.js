let loadedModule  = {};
if(GLOBAL_ENV.APP_TYPE == 'web'){
  loadedModule  = require('./index.web.js')
}
else{
  loadedModule  = require('./index.desktop.js')
}
module.exports = loadedModule ;
