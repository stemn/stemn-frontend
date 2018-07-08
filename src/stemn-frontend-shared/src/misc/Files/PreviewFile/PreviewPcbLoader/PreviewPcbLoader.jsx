import React from 'react'
import LoadSplitCode from 'stemn-shared/misc/CodeSplitting/LoadSplitCode'

const systemImport = () => System.import('../PreviewPcb')
export default props => (
  <LoadSplitCode
    cacheKey="PreviewPcb"
    systemImport={ systemImport }
    { ...props }
  />
)
