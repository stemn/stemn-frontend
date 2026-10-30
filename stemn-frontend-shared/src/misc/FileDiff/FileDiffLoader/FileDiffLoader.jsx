import React from 'react'
import LoadSplitCode from 'stemn-shared/misc/CodeSplitting/LoadSplitCode'

// the diff viewer, three.js and the glTF loader are only downloaded when a CAD diff is opened
const systemImport = () => import('../FileDiffView/FileDiffView')

const FileDiffLoader = (props) => <LoadSplitCode cacheKey="FileDiffView" systemImport={systemImport} {...props} />

export default FileDiffLoader
