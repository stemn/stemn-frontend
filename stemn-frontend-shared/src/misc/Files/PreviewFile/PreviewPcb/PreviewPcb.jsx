import React, { Component } from 'react'
import { get, every } from 'lodash'
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
    const { fileMeta, fileData, downloadFn } = nextProps

    const download = file => downloadFn({
      projectId: file.project._id,
      fileId: file.fileId,
      revisionId: file.revisionId,
      provider: file.provider,
    })

    const hasNoData = fileData && fileData.constructor === Array
      ? !fileData[0]
      : !fileData

    if (hasNoData) {
      if (fileMeta.parts) {
        // We fetch the data for each subpart
        fileMeta.parts.forEach(download)
      } else {
        download(fileMeta)
      }
    }
  }
  render() {
    const { fileData, fileMeta } = this.props

    const isLoading = fileData && fileData.constructor === Array
      ? !every(fileData, item => item && item.loading === false)
      : get(fileData, ['loading'], true)

    const layers = fileMeta.parts
      ? fileMeta.parts.map((item, idx) => ({
        data: get(fileData, [idx, 'data']),
        name: item.name,
      }))
      : [{
        data: fileData && fileData.data,
        name: fileMeta.name,
      }]

    return (
      <div className="rel-box flex layout-column">
        <LoadingOverlay show={ isLoading } />
        { !isLoading && <PreviewPcbViewer layers={ layers } /> }
      </div>
    )
  }
}
