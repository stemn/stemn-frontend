let loadedModule  = {};
if(GLOBAL_ENV.APP_TYPE == 'web'){
  loadedModule  = require('./FileCompareMenu.web.jsx')
}
else{
  loadedModule  = require('./FileCompareMenu.desktop.jsx')
}
module.exports = loadedModule;
