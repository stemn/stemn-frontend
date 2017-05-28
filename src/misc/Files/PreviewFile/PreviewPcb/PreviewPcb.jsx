import React, { Component } from 'react'
import PreviewPcbViewer from './PreviewPcbViewer'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay'

export default class PreviewPcb extends Component {
  componentDidMount() {
    this.onMount(this.props)
  }
  componentWillReceiveProps(nextProps) {
    this.onMount(nextProps, this.props)
  }
  onMount = (nextProps, prevProps) => {
    if (!nextProps.fileData) {
      nextProps.downloadFn({
        projectId : nextProps.fileMeta.project._id,
        fileId : nextProps.fileMeta.fileId,
        revisionId : nextProps.fileMeta.revisionId,
        provider : nextProps.fileMeta.provider,
      })
    }
  }
  render() {
    const { fileData, fileMeta } = this.props
    const isLoading = !(fileData && fileData.data)
    return (
      <div className="rel-box flex layout-column">
        <LoadingOverlay show={ isLoading } />
        { !isLoading && <PreviewPcbViewer data={ fileData.data } name={ fileMeta.name } /> }
      </div>
    )
  }
}
