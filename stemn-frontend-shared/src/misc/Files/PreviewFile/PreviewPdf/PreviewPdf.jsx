import React from 'react'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import { get } from 'lodash'
import Viewer from './PreviewPdfViewer.jsx'
import classes from './PreviewPdf.module.css'
import ScrollZoom from 'stemn-shared/misc/Scroll/ScrollZoom/ScrollZoom.jsx'

// The pdf.js worker is emitted by webpack as a separate asset
GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

const propTypesObject = {
  //  src: React.PropTypes.string.isRequired
}

class PDF extends React.Component {
  state = {
    pdf: null,
    scale: 1,
  }

  UNSAFE_componentWillMount() {
    this.onMount(this.props)
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.onMount(nextProps, this.props)
  }

  onMount = (nextProps, prevProps) => {
    // If the previewId changes, download a new file
    if (!prevProps || nextProps.previewId !== prevProps.previewId) {
      // Get the file data
      nextProps.downloadFn({
        projectId: nextProps.fileMeta.project._id,
        provider: nextProps.fileMeta.provider,
        fileId: nextProps.fileMeta.fileId,
        revisionId: nextProps.fileMeta.revisionId,
        responseType: 'path',
      })
    }

    if (get(nextProps, 'fileData.data') !== get(prevProps, 'fileData.data')) {
      getDocument({ url: nextProps.fileData.data })
        .promise // pdf.js >= 6 requires an options object
        .then((pdf) => {
          this.setState({ pdf })
        })
        .catch((err) => console.error('Failed to load pdf', err))
    }
  }

  zoom = (direction) => {
    let newValue
    if (direction === 'in') {
      newValue = Math.round(this.state.scale * 1.1 * 100) / 100
    } else {
      newValue = Math.round(this.state.scale * 0.9 * 100) / 100
      newValue = newValue > 0 ? newValue : this.state.scale
    }
    this.setState({ scale: newValue })
  }

  render() {
    const { pdf, scale } = this.state

    return (
      <div className={`${classes.viewer} layout-column flex`}>
        <ScrollZoom zoomIn={() => this.zoom('in')} zoomOut={() => this.zoom('out')}>
          <Viewer pdf={pdf} scale={scale} />
        </ScrollZoom>
      </div>
    )
  }
}

PDF.propTypes = propTypesObject

export default PDF
