import React from 'react'

import AutodeskLocalViewer from './AutodeskLocalViewer/AutodeskLocalViewer'

// The Autodesk viewer for a finished Autodesk render. PreviewCadSwitch requests the render and only mounts this
// (through PreviewCadLoader, which loads Autodesk's viewer scripts) once the render is ready.
export default class PreviewCad extends React.Component {
  render() {
    const { fileMeta, fileRender } = this.props
    return <AutodeskLocalViewer path={fileRender.data} linkKey={fileMeta.fileId} />
  }
}
