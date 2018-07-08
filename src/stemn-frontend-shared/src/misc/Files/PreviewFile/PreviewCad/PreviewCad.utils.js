import { viewerFileTypes } from '../PreviewFile.utils'

export const isWebGlSupported = (return_context) => {
  if (window.WebGLRenderingContext) {
    let canvas = document.createElement('canvas'),
      names = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'],
      context = false

    for (let i = 0; i < 4; i++) {
      try {
        context = canvas.getContext(names[i])
        if (context && typeof context.getParameter === 'function') {
          // WebGL is enabled
          if (return_context) {
            // return WebGL object if the function's argument is present
            return { name: names[i], gl: context }
          }
          // else, return just true
          return true
        }
      } catch (e) {}
    }
    // WebGL is supported, but disabled
    return false
  }
  // WebGL not supported
  return false
}

export const isAssembly = (fileType) => {
  const assemblyFileTypes = ['sldasm', 'catproduct', 'iam']
  return assemblyFileTypes.includes(fileType.toLowerCase())
}

export const isCad = fileType => viewerFileTypes.general.autodesk.includes(fileType)
