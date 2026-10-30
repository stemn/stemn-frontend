import * as codemirror from 'codemirror'
import 'codemirror/mode/meta.js'
import { forEach } from 'lodash'
import { pcbExtensions } from './PreviewPcb/pcb.utils'

const codemirrorTsOverride = codemirror as any // TODO - Codemirror plugin mutation

const getCodeMirrorExts = () => {
  let codeExts = ['adoc', 'csv']
  forEach(codemirrorTsOverride.modeInfo, (mode) => {
    if (mode.ext) {
      codeExts = codeExts.concat(mode.ext)
    }
  })
  return codeExts
}

export const viewerFileTypes = {
  general: {
    pipeline: ['pipeline'],
    // a folder's Gerber files shown as one board (the API's gerber assemblies)
    gerber: ['gerber'],
    // rendered by the API's PCB converter: KiCad, Eagle, Gerber and Excellon files and zips of a Gerber set
    pcb: pcbExtensions,
    image: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp', 'ico'],
    code: getCodeMirrorExts(),
    // G-code (3D printing and milling): converted by the open-source converter into a toolpath and shown by the layer
    // viewer (PreviewGcode). Before 'autodesk', whose list has BRL-CAD's .g
    gcode: ['gcode', 'gco', 'g', 'nc'],
    // CAD: converted by the deployment's CAD provider (Autodesk or the open-source OpenCascade converter) and shown
    // by the viewer that matches the render (PreviewCadSwitch). brep, brp, ply and 3mf are OpenCascade only.
    autodesk: [
      '3dm',
      '3mf',
      '3ds',
      'asm',
      'brep',
      'brp',
      'cam360',
      'catpart',
      'catproduct',
      'cgr',
      'collaboration',
      'dae',
      'dgn',
      'dlv3',
      'dwf',
      'dwfx',
      'dwg',
      'dwt',
      'dxf',
      'exp',
      'f3d',
      'fbx',
      'g',
      'gbxml',
      'iam',
      'idw',
      'ifc',
      'ige',
      'iges',
      'igs',
      'ipt',
      'jt',
      'model',
      'neu',
      'nwc',
      'nwd',
      'obj',
      'ply',
      'prt',
      'rcp',
      'rvt',
      'sab',
      'sat',
      'session',
      'skp',
      'sldasm',
      'sldprt',
      'smb',
      'smt',
      'ste',
      'step',
      'stl',
      'stla',
      'stlb',
      'stp',
      'wire',
      'x_b',
      'x_t',
      'xas',
      'xpr',
    ],
    google: [
      'webm',
      'mpeg4',
      '3gpp',
      'mov',
      'avi',
      'mpegps',
      'wmv',
      'flv', // https://gist.github.com/izazueta/4961650
      'xls',
      'xlsx',
      'pages',
      'psd',
      'tiff',
      'eps',
      'ps',
      'ai',
      'ttf',
      'xps',
    ],
    pdf: ['pdf'],
  },
  dropbox: {
    pdf: ['docx', 'doc', 'docm', 'ppt', 'pps', 'ppsx', 'ppsm', 'pptx', 'pptm', 'rtf'],
  },
  drive: {
    google: ['docx', 'doc', 'docm', 'ppt', 'pps', 'ppsx', 'ppsm', 'pptx', 'pptm', 'rtf'],
    gdoc: ['gdoc', 'gsheet', 'gslides'],
  },
}

export type IPreviewType =
  'other' | 'gdoc' | 'google' | 'pipeline' | 'gerber' | 'pcb' | 'image' | 'code' | 'gcode' | 'autodesk' | 'pdf'

export const getViewerType = (fileName, provider): IPreviewType => {
  const extension = fileName.split('.').pop()

  // 'stemn' is the built-in storage provider; it has no provider-specific viewers
  const providers = ['dropbox', 'drive', 'stemn']
  if (!providers.includes(provider)) {
    console.error('Invalid provider type:', provider)
    return 'other'
  }
  const generalFileTypes = viewerFileTypes.general
  const providerFileTypes = viewerFileTypes[provider] || {}

  // Merge the provider file types into the general ones, concatenating the extension arrays.
  const mergedFileTypes: Record<string, string[]> = { ...generalFileTypes }
  forEach(providerFileTypes, (extensions: string[], type) => {
    const generalExtensions = mergedFileTypes[type]
    mergedFileTypes[type] = Array.isArray(generalExtensions) ? generalExtensions.concat(extensions) : extensions
  })

  // Get the viewer type
  const extensionLower = extension ? extension.toLowerCase() : ''
  const viewerType = Object.keys(mergedFileTypes).find((type) =>
    mergedFileTypes[type].includes(extensionLower),
  ) as IPreviewType
  return viewerType || 'other'
}
