import React from 'react'
import LoadSplitCode from 'stemn-shared/misc/CodeSplitting/LoadSplitCode'

// the G-code layer diff viewer is only downloaded when a diff of a G-code file is opened (three.js is the CAD viewer's)
const systemImport = () => import('../GcodeDiffView/GcodeDiffView')

const GcodeDiffLoader = (props) => <LoadSplitCode cacheKey="GcodeDiffView" systemImport={systemImport} {...props} />

export default GcodeDiffLoader
