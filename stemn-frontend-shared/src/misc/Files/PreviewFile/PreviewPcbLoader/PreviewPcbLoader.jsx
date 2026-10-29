import React from 'react'
import LoadSplitCode from 'stemn-shared/misc/CodeSplitting/LoadSplitCode'

const systemImport = () => import('../PreviewPcb')
const PreviewPcbLoader = (props) => <LoadSplitCode cacheKey="PreviewPcb" systemImport={systemImport} {...props} />

export default PreviewPcbLoader
