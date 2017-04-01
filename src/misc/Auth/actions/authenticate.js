let loadedModule  = {};
if(GLOBAL_ENV.APP_TYPE == 'web'){
  loadedModule  = require('./authenticate.web.js')
}
else{
  loadedModule  = require('./authenticate.desktop.js')
}
module.exports = loadedModule ;
