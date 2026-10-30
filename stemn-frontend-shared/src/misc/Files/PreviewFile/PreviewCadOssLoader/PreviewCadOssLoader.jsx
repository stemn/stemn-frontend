import React from 'react'
import LoadSplitCode from 'stemn-shared/misc/CodeSplitting/LoadSplitCode'

// three.js is only downloaded when an open-source (OpenCascade) render is shown
const systemImport = () => import('../PreviewCadOss/PreviewCadOss')

const PreviewCadOssLoader = (props) => <LoadSplitCode cacheKey="PreviewCadOss" systemImport={systemImport} {...props} />

export default PreviewCadOssLoader
