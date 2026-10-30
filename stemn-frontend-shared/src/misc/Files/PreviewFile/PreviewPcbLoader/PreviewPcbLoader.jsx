import React from 'react'
import LoadSplitCode from 'stemn-shared/misc/CodeSplitting/LoadSplitCode'

// the PCB and electronics viewer (layered SVG drawings of the API's PCB converter) is only downloaded when a PCB, schematic,
// Gerber or drill file is opened
const systemImport = () => import('../PreviewPcb')
const PreviewPcbLoader = (props) => <LoadSplitCode cacheKey="PreviewPcb" systemImport={systemImport} {...props} />

export default PreviewPcbLoader
