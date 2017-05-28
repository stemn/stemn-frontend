import React from 'react'
import LoadSplitCode from 'stemn-shared/misc/CodeSplitting/LoadSplitCode'
import getRootPath from 'get-root-path'

const otherModules = [{
  global: 'Autodesk',
  src: getRootPath('/static/other/autodesk/viewer/viewer3D.min.js'),
}, {
  global: 'THREE',
  src: getRootPath('/static/other/autodesk/viewer/three.min.js'),
}, {
  src: getRootPath('/static/other/autodesk/viewer/style.min.css'),
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
