import getUuid from 'stemn-frontend-shared/src/utils/getUuid.js';
import { findIndex } from 'lodash';
import webGerber from './viewer/webGerber.js';

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
    previewPcbService.activeInstances.splice(findIndex(previewPcbService.activeInstances, 'id', instance.id),1);
  }
}
