import getUuid from 'app/shared/helpers/getUuid.js';
import { forEach } from 'lodash';

let oldState       = {viewport: { eye: [1]}};
const filter       = {viewport: true};

const library = {
  activeInstances : [],
  register        : register,
}

export default library

////////////////////////////////////////////

const onMoveTriggers = 'mousemove vmousemove mousewheel click mousedown DOMMouseScroll scroll';

function register(viewerEl, linkKey){
  // linkKey is used to link viewers of the same file so they move at the same time.

  const id = getUuid();
  const instance = new window.Autodesk.Viewing.Private.GuiViewer3D(viewerEl);

  // Create the onMove function that will be used to sync instances
  const onMove = () => {
    console.log(library.activeInstances);
    // Get the instances linked to this one (not including this one)
    const linkedInstances = library.activeInstances.filter(item => item.linkKey == linkKey && item.id != id);
    // If we have 1 or more linked instance
    if(linkedInstances.length >= 1 && instance.viewerState){
      // Get the new state
      const newState = instance.getState(filter);
      // Apply the new state to the linked instances
      linkedInstances.forEach(item => item.restoreState(newState, filter, true))
    }
  }

  const deregister = () => {
    // Remove ithe instance from the activeInstances array
    const instanceIndex = library.activeInstances.findIndex(item => item.id == instance.id);
    library.activeInstances.splice(instanceIndex, 1);
    // Remove the event listeners
    removeListenerMulti(viewerEl, onMoveTriggers, onMove);
    // Call the Autodesk finish function
    instance.finish();
  }

  // Add some additional meta and functions to the instance
  instance.id         = id;
  instance.linkKey    = linkKey;
  instance.deregister = deregister;

  // Add the onMove listener
  addListenerMulti(viewerEl, onMoveTriggers, onMove);

  // Push this instance onto the activeInstances array
  library.activeInstances.push(instance);

  return instance;
}

function addListenerMulti(el, events, fn) {
  events.split(' ').forEach(event => el.addEventListener(event, fn));
}
function removeListenerMulti(el, events, fn) {
  events.split(' ').forEach(event => el.removeEventListener(event, fn));
}
