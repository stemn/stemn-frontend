let loadedModule  = {};
if(GLOBAL_ENV.APP_TYPE == 'web'){
  loadedModule  = require('./getFile.web.js')
}
else{
  loadedModule  = require('./getFile.desktop.js')
}
module.exports = loadedModule ;
