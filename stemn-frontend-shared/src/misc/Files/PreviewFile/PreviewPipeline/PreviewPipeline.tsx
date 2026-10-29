import * as React from 'react'
import file from 'stemn-shared/assets/images/pure-vectors/file.svg'
import { IFileData } from 'stemn-shared/misc/Files/Files.reducer'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import { PipelineGraph } from 'stemn-shared/misc/Pipelines/PipelineGraph'
import { load as loadYaml } from 'js-yaml'
import CodeViewer from '../PreviewCode/Viewer.jsx'

/**
 * The pipeline graph can only draw the node/link "flow" format. Pipeline files written against
 * the schemas.stemn.com/pipeline+v1 schema (triggers/stages/steps) have no links, so show them
 * as YAML instead of crashing the diagram deserializer.
 */
const isGraphFormat = (data: any) => {
  try {
    const config = typeof data === 'string' ? loadYaml(data) : data
    return !!config && typeof config === 'object' && Array.isArray((config as any).links) && !!(config as any).steps
  } catch (e) {
    return false
  }
}

export interface IPreviewPipelineProps {
  fileData?: IFileData,
  fileMeta?: any,
  downloadFn: any,
  previewId: string,
  editActive?: boolean,
}

export class PreviewPipeline extends React.Component<IPreviewPipelineProps> {
  public UNSAFE_componentWillMount () { this.onMount(this.props) }
  public UNSAFE_componentWillReceiveProps (nextProps: IPreviewPipelineProps) { this.onMount(nextProps, this.props) }
  public onMount = (nextProps: IPreviewPipelineProps, prevProps?: IPreviewPipelineProps) => {
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
  public render () {
    const { fileData, editActive, previewId } = this.props
    return (
      <div className='layout-column flex'>
        { fileData && fileData.data ? (
          isGraphFormat(fileData.data)
            ? <PipelineGraph
              diagramId={previewId}
              pipelineConfig={fileData.data}
              readOnly={!editActive}
            />
            : <CodeViewer extension='yaml' data={fileData.data} />
        ) : '' }
        {fileData ? <LoadingOverlay show={fileData.loading} /> : null}
        { fileData && !fileData.data && !fileData.loading
          ? <div className='layout-column layout-align-center-center flex text-center'>
            <img style={{ width: '100px' }} src={file} />
            <div className='text-title-4' style={{ marginBottom: '10px' }}>Nothing to display</div>
            <div className='text-title-5'>This file appears to be empty.</div>
          </div>
          : null }
      </div>
    )
  }
}
