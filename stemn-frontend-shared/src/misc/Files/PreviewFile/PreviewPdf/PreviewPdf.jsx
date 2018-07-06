import React from 'react'
import PropTypes from 'prop-types'
import PDFJS from 'pdfjs-dist/build/pdf.combined.js'
import { get } from 'lodash'
import Viewer from './PreviewPdfViewer.jsx'
import classes from './PreviewPdf.css'
import ScrollZoom from 'stemn-shared/misc/Scroll/ScrollZoom/ScrollZoom.jsx'

// Link to the workerSrc bundle (See example here https://github.com/mozilla/pdf.js/blob/master/examples/webpack/main.js)
PDFJS.PDFJS.workerSrc = process.env.HOT ? 'http://localhost:3001/dist/pdfWorker/index.js' : '../../pdfWorker/index.js'

const propTypesObject = {
//  src: React.PropTypes.string.isRequired
}

class PDF extends React.Component {
  state = {
    pdf: null,
    scale: 1,
  };

  componentWillMount() { this.onMount(this.props) }
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props) }

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

    if (get(nextProps, 'fileData.data') !==  get(prevProps, 'fileData.data')) {
      PDFJS.getDocument(nextProps.fileData.data).then((pdf) => {
        this.setState({ pdf })
      })
    }
  };

  getChildContext() {
    return {
      pdf: this.state.pdf,
      scale: this.state.scale,
    }
  }

  zoom = (direction) => {
    let newValue = 0
    if (direction === 'in') {
      newValue = Math.round((this.state.scale * 1.1) * 100) / 100
    } else {
      newValue = Math.round((this.state.scale * 0.9) * 100) / 100
      newValue = newValue > 0 ? newValue : this.state.scale
    }
    this.setState({ scale: newValue })
  };

  render() {
    const { pdf, scale } = this.state

    return (
      <div className={ `${classes.viewer} layout-column flex` }>
        <ScrollZoom zoomIn={ () => this.zoom('in') } zoomOut={ () => this.zoom('out') }>
          <Viewer pdf={ pdf } scale={ scale } />
        </ScrollZoom>
      </div>
    )
  }
}


PDF.propTypes = propTypesObject

PDF.childContextTypes = {
  pdf: PropTypes.object,
  scale: PropTypes.number,
}

export default PDF
