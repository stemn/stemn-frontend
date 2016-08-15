import getUuid from 'app/shared/helpers/getUuid.js';
import _ from 'lodash';
import webGerber from 'app/renderer/assets/other/gerber/js/webGerber.js';

const previewPcbService = {
  activeInstances : [],
  register : register,
  deregister : deregister,
}

export default previewPcbService

////////////////////////////////////////////

function register(){
  var id = getUuid();
  var instance = webGerber();
  instance.id = id;
  previewPcbService.activeInstances.push(instance);
  return instance;
}

function deregister(instance){
  if(instance){
    instance.destroy();
    previewPcbService.activeInstances.splice(_.findIndex(previewPcbService.activeInstances, 'id', instance.id),1);
  }
}
