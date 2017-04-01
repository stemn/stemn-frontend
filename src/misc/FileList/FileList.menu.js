let loadedModule  = {};
if(GLOBAL_ENV.APP_TYPE == 'web'){
  loadedModule  = require('./FileList.menu.web.js')
}
else{
  loadedModule  = require('./FileList.menu.desktop.js')
}
module.exports = loadedModule;
