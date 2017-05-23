import React from 'react'
import LoadSplitCode from 'stemn-shared/misc/CodeSplitting/LoadSplitCode'

const otherModules = [{
  global: 'Autodesk',
  src: '/static/other/autodesk/viewer/viewer3D.min.js',
}, {
  global: 'THREE',
  src: '/static/other/autodesk/viewer/three.min.js',
}, {
  src: '/static/other/autodesk/viewer/style.min.css',
}]
const systemImport = () => System.import('../PreviewCad/PreviewCad')

export default (props) => (
  <LoadSplitCode
    cacheKey="PreviewCad"
    systemImport={ systemImport }
    otherModules={ otherModules }
    { ...props }
  />
)
