import * as React from 'react';
import laptopSpanner from 'stemn-shared/assets/images/pure-vectors/laptop-spanner.svg';
import { IFileData, IFileRender } from 'stemn-shared/misc/Files/Files.reducer';

import DownloadFile from '../DownloadFile/DownloadFile.jsx';
import ErrorMessages from './Messages/Messages.jsx';
import { isAssembly } from './PreviewCad/PreviewCad.utils.js';
import PreviewCadLoader from './PreviewCadLoader';
import PreviewCode from './PreviewCode';
import { dispatchToProps, IPreviewFileContainerProps } from './PreviewFile.container';
import * as classes from './PreviewFile.scss';
import { getViewerType } from './PreviewFile.utils';
import PreviewGdoc from './PreviewGdoc/PreviewGdoc';
import PreviewGoogle from './PreviewGoogle/PreviewGoogle';
import PreviewImage from './PreviewImage/PreviewImage';
import PreviewPcbLoader from './PreviewPcbLoader';
import PreviewPdfLoader from './PreviewPdfLoader';
import { PreviewPipeline } from './PreviewPipeline';

export interface IPreviewFileComponentProps extends IPreviewFileContainerProps {
  getFile: typeof dispatchToProps['getFile'],
  renderFile: typeof dispatchToProps['renderFile'],
  fileData: IFileData,
  fileRender?: IFileRender
}

export class PreviewFileComponent extends React.Component<IPreviewFileComponentProps> {
  public render () {
    const { file, fileData, fileRender, getFile, renderFile, header, event, editActive } = this.props
    const previewId = `${file.project._id}-${file.fileId}-${file.revisionId}`

    const renderFn = () => renderFile({
      projectId: file.project._id,
      fileId: file.fileId,
      revisionId: file.revisionId,
      provider: file.provider,
      timestamp: event && isAssembly(file.extension) ? event.timestamp : '',
    })

    const getPreview = () => {
      const viewerType = getViewerType(file.name, file.provider)

      const fileDataError = fileData && fileData.error
      const fileRenderError = fileRender && fileRender.error

      if (fileDataError || fileRenderError) {
        return (
          <ErrorMessages
            error={fileDataError || fileRenderError}
            fileMeta={file}
          />
        )
      } else if (viewerType === 'pipeline') {
        return (
          <PreviewPipeline
            editActive={editActive}
            previewId={`${file.fileId}-${file.revisionId}`} // This previewId should match the one used in the Pipeline Graph sidebar
            fileMeta={file}
            fileData={fileData}
            downloadFn={getFile}
          />
        )
      } else if (viewerType === 'gerber' || viewerType === 'pcb') {
        return (
          <PreviewPcbLoader
            previewId={previewId}
            fileMeta={file}
            fileData={fileData}
            downloadFn={getFile}
          />
        )
      } else if (viewerType === 'code') {
        return (
          <PreviewCode
            previewId={previewId}
            fileMeta={file}
            fileData={fileData}
            downloadFn={getFile}
          />
        )
      } else if (viewerType === 'autodesk') {
        return (
          <PreviewCadLoader
            previewId={previewId}
            fileMeta={file}
            fileRender={fileRender}
            renderFn={renderFn}
          />
        )
      } else if (viewerType === 'google') {
        return (
          <PreviewGoogle
            previewId={previewId}
            fileMeta={file}
          />
        )
      } else if (viewerType === 'gdoc') {
        return (
          <PreviewGdoc
            previewId={previewId}
            fileMeta={file}
          />
        )
      } else if (viewerType === 'image') {
        return (
          <PreviewImage
            previewId={previewId}
            fileMeta={file}
            fileData={fileData}
            downloadFn={getFile}
          />
        )
      } else if (viewerType === 'pdf') {
        return (
          <PreviewPdfLoader
            previewId={previewId}
            fileMeta={file}
            fileData={fileData}
            downloadFn={getFile}
          />
        )
      }
      return (
        <div className='layout-column layout-align-center-center flex'>
          <img src={laptopSpanner} style={{ width: '100px' }} />
          <div className='text-title-5 text-center' style={{ marginTop: '10px' }}>Cannot preview this file type.</div>
        </div>
      )
    }
    return (
      <div className='layout-column flex rel-box'>
        { header
          ? <div className={`${classes.header} layout-row layout-align-start-center rel-box`}>
            <div>Version: {file.revisionNumber}</div>
            <div className='flex' />
            <DownloadFile
              file={file}
              title={`Download Version ${file.revisionNumber} of this file.`}
            >
              Download
            </DownloadFile>
          </div>
          : null }
        {getPreview()}
      </div>
    )
  }
}
