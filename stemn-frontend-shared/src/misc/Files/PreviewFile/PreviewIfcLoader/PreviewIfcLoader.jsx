import React from 'react'
import LoadSplitCode from 'stemn-shared/misc/CodeSplitting/LoadSplitCode'

// three.js and the ifc property panel are only downloaded when an ifc model is shown
const systemImport = () => import('../PreviewIfc/PreviewIfc')

const PreviewIfcLoader = (props) => <LoadSplitCode cacheKey="PreviewIfc" systemImport={systemImport} {...props} />

export default PreviewIfcLoader
