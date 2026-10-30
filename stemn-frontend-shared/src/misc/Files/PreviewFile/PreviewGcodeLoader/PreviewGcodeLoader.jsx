import React from 'react'
import LoadSplitCode from 'stemn-shared/misc/CodeSplitting/LoadSplitCode'

// the G-code layer viewer and three.js are only downloaded when a G-code file is opened
const systemImport = () => import('../PreviewGcode/PreviewGcode')

const PreviewGcodeLoader = (props) => <LoadSplitCode cacheKey="PreviewGcode" systemImport={systemImport} {...props} />

export default PreviewGcodeLoader
