import getUuid from 'app/shared/helpers/getUuid.js';
import _ from 'lodash';
import http from 'axios';

let oldState     = {viewport: { eye: [1]}};
const filter       = {viewport: true};
let syncIsActive = false;

const library = {  
  activeInstances : [],
  register : register,
  deregister : deregister,
}

export default library

////////////////////////////////////////////


function register(viewerEl){
  var id = getUuid();
  var instance = new window.Autodesk.Viewing.Private.GuiViewer3D(viewerEl, {});
  instance.id = id;
  library.activeInstances.push(instance);
  if(library.activeInstances.length > 1 && !syncIsActive){
      syncIsActive = true;
      document.on('mousemove vmousemove mousewheel click mousedown DOMMouseScroll scroll', onMove);
  }
  return instance;
}

function deregister(instance){
  if(instance){
      library.activeInstances.splice(_.findIndex(library.activeInstances, 'id', instance.id),1);
      if(library.activeInstances.length < 2 && syncIsActive){
          syncIsActive = false;
          document.off('mousemove vmousemove mousewheel click mousedown DOMMouseScroll scroll', onMove);
      }
      instance.finish();
  }
}

function onMove(){
    if(library.activeInstances && library.activeInstances.length > 1){
        var newState;
        var oldInstances = [];
        _.forEach(library.activeInstances, function(instance){
            if(instance.viewerState){
                var possibleNewState = instance.getState(filter);
                // If the state is different, this is the new state!
                if(possibleNewState.viewport.eye[0] != oldState.viewport.eye[0]){
                    newState = possibleNewState;
                }
                else{
                    oldInstances.push(instance);
                }
            }
        });

        // If there is a new state, update the old instances
        if(newState){
            if(oldInstances.length > 0){
                _.forEach(oldInstances, function(instance){
                    instance.restoreState(newState, filter, true)
                })
            }
            oldState = newState;
        }
    }
}