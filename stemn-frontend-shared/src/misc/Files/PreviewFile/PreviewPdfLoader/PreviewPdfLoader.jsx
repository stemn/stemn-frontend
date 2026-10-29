import React from 'react'
import LoadSplitCode from 'stemn-shared/misc/CodeSplitting/LoadSplitCode'

const systemImport = () => import('../PreviewPdf/PreviewPdf')
const PreviewPdfLoader = props => (
  <LoadSplitCode
    cacheKey="PreviewPdf"
    systemImport={ systemImport }
    { ...props }
  />
)

export default PreviewPdfLoader
