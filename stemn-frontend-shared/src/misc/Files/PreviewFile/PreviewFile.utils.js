import { forEach } from 'lodash'
import i from 'icepick'
import codemirror from 'codemirror'
import 'codemirror/mode/meta.js'
import whatGerber from '@stemn/whats-that-gerber'

const getCodeMirrorExts = () => {
  let codeExts = ['pipeline', 'adoc', 'csv']
  forEach(codemirror.modeInfo, (mode) => {
    if (mode.ext) {
      codeExts = codeExts.concat(mode.ext)
    }
  })
  return codeExts
}

export const viewerFileTypes = {
  general: {
    gerber: ['gerber'],
    pcb: ['brd', 'pcb', 'kicad_pcb'],
    image: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp', 'ico'],
    code: getCodeMirrorExts(),
    autodesk: ['3dm', '3ds', 'asm', 'cam360', 'catpart', 'catproduct', 'cgr', 'collaboration', 'dae', 'dgn', 'dlv3', 'dwf', 'dwfx', 'dwg', 'dwt', 'dxf', 'exp',
      'f3d', 'fbx', 'g', 'gbxml', 'iam', 'idw', 'ifc', 'ige', 'iges', 'igs', 'ipt', 'jt', 'model', 'neu', 'nwc', 'nwd', 'obj', 'prt', 'rcp', 'rvt',
      'sab', 'sat', 'session', 'skp', 'sldasm', 'sldprt', 'smb', 'smt', 'ste', 'step', 'stl', 'stla', 'stlb', 'stp', 'wire', 'x_b', 'x_t', 'xas', 'xpr'],
    google: ['webm', 'mpeg4', '3gpp', 'mov', 'avi', 'mpegps', 'wmv', 'flv', // https://gist.github.com/izazueta/4961650
      'xls', 'xlsx',
      'pages',
      'psd', 'tiff',
      'eps', 'ps', 'ai',
      'ttf', 'xps',
    ],
    pdf: ['pdf'],
    //            pcb      : ['brd', 'pcb', 'kicad_pcb'],
  },
  dropbox: {
    pdf: ['docx', 'doc', 'docm', 'ppt', 'pps', 'ppsx', 'ppsm', 'pptx', 'pptm', 'rtf'],
  },
  drive: {
    google: ['docx', 'doc', 'docm', 'ppt', 'pps', 'ppsx', 'ppsm', 'pptx', 'pptm', 'rtf'],
    gdoc: ['gdoc', 'gsheet', 'gslides'],
  },
}

export const getViewerType = (fileName, provider) => {
  const extension = fileName.split('.').pop()

  const providers = ['dropbox', 'drive']
  if (!providers.includes(provider)) {
    console.error('Invalid provider type:', provider)
    return
  }
  const generalFileTypes = viewerFileTypes.general
  const providerFileTypes = viewerFileTypes[provider]

  // This merge resolver concats arrays.
  const mergeResolver = (targetVal, sourceVal) => (Array.isArray(targetVal) && sourceVal ? targetVal.concat(sourceVal) : sourceVal)
  const mergedFileTypes = i.merge(generalFileTypes, providerFileTypes, mergeResolver)

  console.log(whatGerber(fileName))
  if (whatGerber(fileName)) {
    return 'gerber'
  } 
  // Get the viewer type
  const extensionLower = extension ? extension.toLowerCase() : ''
  const viewerType = Object.keys(mergedFileTypes).find(viewerType => mergedFileTypes[viewerType].includes(extensionLower))
  return viewerType || 'other'
}
