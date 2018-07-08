import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as FilesActions from '../Files.actions.js'
import React from 'react'
import classes from './PreviewFile.css'
import PreviewCode from './PreviewCode'
import PreviewCadLoader from './PreviewCadLoader'
import PreviewPdfLoader from './PreviewPdfLoader'
import PreviewPcbLoader from './PreviewPcbLoader'
import PreviewImage from './PreviewImage/PreviewImage'
import PreviewGoogle from './PreviewGoogle/PreviewGoogle'
import PreviewGdoc from './PreviewGdoc/PreviewGdoc'
import laptopSpanner from 'stemn-shared/assets/images/pure-vectors/laptop-spanner.svg'
import { getViewerType } from './PreviewFile.utils.js'
import { isAssembly } from './PreviewCad/PreviewCad.utils.js'
import DownloadFile from '../DownloadFile/DownloadFile.jsx'
import ErrorMessages from './Messages/Messages.jsx'
import { PipelineGraph } from 'stemn-shared/misc/Pipelines/PipelineGraph'

// /////////////////////////////// COMPONENT /////////////////////////////////

export class Component extends React.Component {
  render() {
    const { file, fileData, fileRender, filesActions, header, event } = this.props
    const previewId = `${file.project._id}-${file.fileId}-${file.revisionId}`

    const renderFn = () => {
      filesActions.renderFile({
        projectId: file.project._id,
        fileId: file.fileId,
        revisionId: file.revisionId,
        provider: file.provider,
        timestamp: event && isAssembly(file.extension) ? event.timestamp : '',
      })
    }

    const getPreview = () => {
      const viewerType = getViewerType(file.name, file.provider)

      return <PipelineGraph />
      
      if (fileData && fileData.error || fileRender && fileRender.error) {
        return (
          <ErrorMessages
            error={ fileData && fileData.error ? fileData.error : fileRender.error }
            fileMeta={ file }
          />
        )
      } else if (viewerType === 'gerber' || viewerType === 'pcb') {
        return (
          <PreviewPcbLoader
            previewId={ previewId }
            fileMeta={ file }
            fileData={ fileData }
            downloadFn={ filesActions.getFile }
          />
        )
      } else if (viewerType === 'code') {
        return (
          <PreviewCode
            previewId={ previewId }
            fileMeta={ file }
            fileData={ fileData }
            downloadFn={ filesActions.getFile }
          />
        )
      } else if (viewerType === 'autodesk') {
        return (
          <PreviewCadLoader
            previewId={ previewId }
            fileMeta={ file }
            fileRender={ fileRender }
            renderFn={ renderFn }
          />
        )
      } else if (viewerType === 'google') {
        return (
          <PreviewGoogle
            previewId={ previewId }
            fileMeta={ file }
          />
        )
      } else if (viewerType === 'gdoc') {
        return (
          <PreviewGdoc
            previewId={ previewId }
            fileMeta={ file }
          />
        )
      } else if (viewerType === 'image') {
        return (
          <PreviewImage
            previewId={ previewId }
            fileMeta={ file }
            fileData={ fileData }
            downloadFn={ filesActions.getFile }
          />
        )
      } else if (viewerType === 'pdf') {
        return (
          <PreviewPdfLoader
            previewId={ previewId }
            fileMeta={ file }
            fileData={ fileData }
            downloadFn={ filesActions.getFile }
          />
        )
      } 
      return (
        <div className="layout-column layout-align-center-center flex">
          <img src={ laptopSpanner } style={ { width: '100px' } } />
          <div className="text-title-5 text-center" style={ { marginTop: '10px' } }>Cannot preview this file type.</div>
        </div>
      )
    }
    return (
      <div className="layout-column flex rel-box">
        { header
          ? <div className={ `${classes.header} layout-row layout-align-start-center rel-box` }>
            <div>Version: {file.revisionNumber}</div>
            <div className="flex" />
            <DownloadFile file={ file } title={ `Download Version ${file.revisionNumber} of this file.` }>Download</DownloadFile>
          </div>
          : null }
        { getPreview() }
      </div>
    )
  }
}


// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ files }, { project, file, event }) {
  // If the file has sub-parts, it is a gerber assembly - we need to fetch multiple files
  if (file.parts) {
    const fileData = file.parts.map(file => files.fileData[`${file.fileId}-${file.revisionId}`])
    return {
      fileData,
    }
  } 
  const cacheKey = event && event.timestamp && isAssembly(file.extension)
    ? `${file.fileId}-${file.revisionId}-${event.timestamp}`
    : `${file.fileId}-${file.revisionId}`

  const fileData = files.fileData[cacheKey]
  return {
    fileData,
    fileRender: files.fileRenders[cacheKey],
  }
}

function mapDispatchToProps(dispatch) {
  return {
    filesActions: bindActionCreators(FilesActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
