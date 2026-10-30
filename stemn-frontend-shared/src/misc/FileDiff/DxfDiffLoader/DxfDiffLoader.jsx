import React from 'react'
import LoadSplitCode from 'stemn-shared/misc/CodeSplitting/LoadSplitCode'

// the 2d diff viewer is only downloaded when a diff of a dxf or dwg drawing is opened (no three.js in it)
const systemImport = () => import('../DxfDiffView/DxfDiffView')

const DxfDiffLoader = (props) => <LoadSplitCode cacheKey="DxfDiffView" systemImport={systemImport} {...props} />

export default DxfDiffLoader
