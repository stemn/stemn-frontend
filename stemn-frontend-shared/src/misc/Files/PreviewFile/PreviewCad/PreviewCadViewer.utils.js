import getUuid from 'stemn-shared/utils/getUuid.js'
import 'javascript-detect-element-resize' // addResizeListener && removeResizeListener

const filter       = { viewport: true }

const library = {
  activeInstances: [],
  register,
}

export default library

// //////////////////////////////////////////

function register(viewerEl, linkKey) {
  // linkKey is used to link viewers of the same file so they move at the same time.
  const id = getUuid()
  const instance = new window.Autodesk.Viewing.Private.GuiViewer3D(viewerEl)

  const onResize = () => {
    instance.resize()
  }

  // Add the resize listener
  window.addResizeListener(viewerEl, onResize)

  // Create the onMove function that will be used to sync instances
  let lastState = {}
  const onMove = (event) => {
    // Get the instances linked to this one (not including this one)
    const linkedInstances = library.activeInstances.filter(item => item.linkKey === linkKey && item.id !== id)
    // If we have 1 or more linked instance
    if (linkedInstances.length >= 1 && instance.viewerState) {
      // Get the new state
      const newState = instance.getState(filter)
      // Apply the new state to the linked instances
      linkedInstances.forEach((item) => {
        const lastStateString = JSON.stringify(lastState)
        const newStateString  = JSON.stringify(newState)
        const stateHasChanges = !(newStateString === lastStateString)
        if (stateHasChanges) {
          item.restoreState(newState, filter, true)
        }
      })
      lastState = newState
    }
  }

  const deregister = () => {
    // Remove ithe instance from the activeInstances array
    const instanceIndex = library.activeInstances.findIndex(item => item.id === instance.id)
    library.activeInstances.splice(instanceIndex, 1)
    // Remove the event listeners
    instance.removeEventListener(window.Autodesk.Viewing.CAMERA_CHANGE_EVENT, onMove)
    // Remove the resize listener
    if (viewerEl) {
      window.removeResizeListener(viewerEl, onResize)
    }

    // Call the Autodesk finish function
    instance.finish()
  }

  // Add some additional meta and functions to the instance
  instance.id         = id
  instance.linkKey    = linkKey
  instance.deregister = deregister

  // Add the onMove listener
  instance.addEventListener(window.Autodesk.Viewing.CAMERA_CHANGE_EVENT, onMove)

  // Push this instance onto the activeInstances array
  library.activeInstances.push(instance)

  return instance
}
