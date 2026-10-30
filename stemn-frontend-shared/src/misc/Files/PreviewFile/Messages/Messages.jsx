import React from 'react'
import PreviewExpired from './PreviewExpired/PreviewExpired.jsx'
import AssemblyPartNotFound from './AssemblyPartNotFound/AssemblyPartNotFound.jsx'
import File404 from './File404/File404.jsx'

export default class Messages extends React.Component {
  render() {
    const { error, fileMeta } = this.props

    if (error.type === 'REVISION_NOT_FOUND') {
      return <PreviewExpired provider={fileMeta.provider} />
    } else if (error.type === 'ASSEMBLY_PART_NOT_FOUND') {
      return <AssemblyPartNotFound parts={error.data.parts} />
    }
    // This 404 is a special case
    // This is produced in the fileCache - it is a wierd structure because it is stream related
    else if (error.statusCode === 404) {
      return <File404 />
    } else if (error.type === 'RENDER_FAILED') {
      // the CAD conversion failed (either provider); the message says why
      return (
        <div className="layout-column layout-align-center-center flex text-center" data-testid="cad-render-failed">
          <div className="text-title-4" style={{ marginBottom: '10px' }}>
            This file could not be converted for preview.
          </div>
          <div className="text-title-5">{error.message}</div>
        </div>
      )
    }

    return (
      <div className="layout-column layout-align-center-center flex">
        <div className="text-title-5">{error.message}</div>
      </div>
    )
  }
}
