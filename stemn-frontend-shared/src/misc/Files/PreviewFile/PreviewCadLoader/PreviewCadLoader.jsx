import React from 'react'
import LoadSplitCode from 'stemn-shared/misc/CodeSplitting/LoadSplitCode'

const otherModules = [{
  global: 'Autodesk',
  src: 'https://developer.api.autodesk.com/viewingservice/v1/viewers/viewer3D.min.js?v=4.2.*',
}, {
  src: 'https://developer.api.autodesk.com/viewingservice/v1/viewers/style.min.css?v=4.2.*',
}]
const systemImport = () => import('../PreviewCad/PreviewCad')

const PreviewCadLoader = props => (
  <LoadSplitCode
    cacheKey="PreviewCad"
    systemImport={ systemImport }
    otherModules={ otherModules }
    { ...props }
  />
)

export default PreviewCadLoader
