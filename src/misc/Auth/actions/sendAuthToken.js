let loadedModule  = {};
if(GLOBAL_ENV.APP_TYPE == 'web'){
  loadedModule  = require('./sendAuthToken.web.js')
}
else{
  loadedModule  = require('./sendAuthToken.desktop.js')
}
module.exports = loadedModule ;
