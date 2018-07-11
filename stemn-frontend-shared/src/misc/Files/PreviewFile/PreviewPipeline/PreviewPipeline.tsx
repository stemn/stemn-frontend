import * as React from 'react'
import * as LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import file from 'stemn-shared/assets/images/pure-vectors/file.svg'
import { PipelineGraph } from 'stemn-shared/misc/Pipelines/PipelineGraph'

export interface IPreviewPipelineProps {
  fileData?: {
    data: any,
    loading: boolean,
  },
  fileMeta?: any,
  downloadFn: any,
  previewId: string,
}

export default class PreviewPipeline extends React.Component<IPreviewPipelineProps> {
  componentWillMount() { this.onMount(this.props) }
  componentWillReceiveProps(nextProps: IPreviewPipelineProps) { this.onMount(nextProps, this.props) }
  onMount = (nextProps: IPreviewPipelineProps, prevProps?: IPreviewPipelineProps) => {
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
    const { fileData } = this.props
    return (
      <div className="layout-column flex">
        { fileData && fileData.data ? <PipelineGraph pipeline={ fileData.data } /> : '' }
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

