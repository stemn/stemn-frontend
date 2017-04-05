let loadedModule  = {};
if(GLOBAL_ENV.APP_TYPE == 'web'){
  loadedModule  = require('./renderFile.web.js')
}
else{
  loadedModule  = require('./renderFile.desktop.js')
}
module.exports = loadedModule ;
