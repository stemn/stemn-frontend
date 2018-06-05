import React, { Component } from 'react'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import file from 'stemn-shared/assets/images/pure-vectors/file.svg'
import Viewer from './Viewer'

export default class PreviewCode extends Component {
  componentWillMount() { this.onMount(this.props) }
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props) }
  onMount = (nextProps, prevProps) => {
    // If the previewId changes, download a new file
    if (!prevProps || nextProps.previewId !== prevProps.previewId) {
      // If we don't already have the file, get it
      if (!nextProps.fileData || !nextProps.fileData.data) {
        nextProps.downloadFn({
          projectId: nextProps.fileMeta.project._id,
          fileId: nextProps.fileMeta.fileId,
          revisionId: nextProps.fileMeta.revisionId,
          provider: nextProps.fileMeta.provider,
        })
      }
    }
  }
  render() {
    const { fileData, fileMeta, previewMarkdown } = this.props
    return (
      <div className="layout-column flex">
        { fileData && fileData.data ? <Viewer extension={ fileMeta.extension } data={ fileData.data } previewMarkdown={ previewMarkdown } /> : '' }
        { fileData ? <LoadingOverlay show={ fileData.loading } /> : null }
        { fileData && !fileData.data && !fileData.loading
          ? <div className="layout-column layout-align-center-center flex text-center">
            <img style={ { width: '100px' } } src={ file } />
            <div className="text-title-4" style={ { marginBottom: '10px' } }>Nothing to display</div>
            <div className="text-title-5">This file appears to be empty.</div>
          </div>
          : null }
      </div>
    )
  }
}

