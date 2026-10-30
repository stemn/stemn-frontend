import React from 'react'
import LoadSplitCode from 'stemn-shared/misc/CodeSplitting/LoadSplitCode'

// the 2d drawing viewer (no three.js) is only downloaded when a dxf or dwg render is shown
const systemImport = () => import('../PreviewDrawing/PreviewDrawing')

const PreviewDrawingLoader = (props) => (
  <LoadSplitCode cacheKey="PreviewDrawing" systemImport={systemImport} {...props} />
)

export default PreviewDrawingLoader
