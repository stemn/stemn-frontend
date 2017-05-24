import React from 'react'
import LoadSplitCode from 'stemn-shared/misc/CodeSplitting/LoadSplitCode'
import getStaticPath from 'get-static-path'

const otherModules = [{
  global: 'Autodesk',
  src: getStaticPath('/other/autodesk/viewer/viewer3D.min.js'),
}, {
  global: 'THREE',
  src: getStaticPath('/other/autodesk/viewer/three.min.js'),
}, {
  src: getStaticPath('/other/autodesk/viewer/style.min.css'),
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
