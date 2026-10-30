import React from 'react'
import LoadSplitCode from 'stemn-shared/misc/CodeSplitting/LoadSplitCode'

// the 2d diff viewer is only downloaded when a diff of a board, schematic, gerber or drill file is opened
const systemImport = () => import('../PcbDiffView/PcbDiffView')

const PcbDiffLoader = (props) => <LoadSplitCode cacheKey="PcbDiffView" systemImport={systemImport} {...props} />

export default PcbDiffLoader
