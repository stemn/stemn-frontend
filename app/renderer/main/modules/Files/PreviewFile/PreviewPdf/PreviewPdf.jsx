import React from 'react';
import PDFJS from 'pdfjs-dist/build/pdf.combined.js'

import Viewer from './PreviewPdfViewer.jsx'
import classes from './PreviewPdf.css';
import ScrollZoom from 'app/shared/modules/Scroll/ScrollZoom/ScrollZoom.jsx';
import { getDownloadUrl } from '../../Files.utils.js';

// Link to the workerSrc bundle (See example here https://github.com/mozilla/pdf.js/blob/master/examples/webpack/main.js)
PDFJS.PDFJS.workerSrc = process.env.HOT ? 'http://localhost:3001/dist/pdfWorker/index.js' : '../../pdfWorker/index.js';

const propTypesObject = {
//  src: React.PropTypes.string.isRequired
};

const PDF = React.createClass({
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  onMount(nextProps, prevProps) {
    // If the previewId changes, download a new file
    if(!prevProps || nextProps.previewId !== prevProps.previewId){
      // If we don't already have the file, get it
      const { fileMeta } = nextProps;

      PDFJS.getDocument(getDownloadUrl(fileMeta)).then((pdf) => {
        this.setState({ pdf })
      })

//      if(!nextProps.fileData){
//        nextProps.downloadFn({
//          projectId  : nextProps.fileMeta.project._id,
//          fileId     : nextProps.fileMeta.fileId,
//          revisionId : nextProps.fileMeta.revisionId
//        })
//      }
    }
  },

  getInitialState () {
    return {
      pdf: null,
      scale: 1
    }
  },
  getChildContext () {
    return {
      pdf: this.state.pdf,
      scale: this.state.scale
    }
  },
  zoom (direction) {
    let newValue = 0;
    if(direction == 'in'){
      newValue = Math.round( (this.state.scale * 1.1) * 100) / 100;
    }
    else{
      newValue = Math.round( (this.state.scale * 0.9) * 100) / 100;
      newValue = newValue > 0 ? newValue : this.state.scale;
    }
    this.setState({scale: newValue})
  },
  render () {
    const { fileMeta, fileData } = this.props;
    const { pdf, scale } = this.state;

    return (
      <div className={classes.viewer + ' layout-column flex'}>
        <ScrollZoom zoomIn={() => this.zoom('in')} zoomOut={() => this.zoom('out') }>
          <Viewer pdf={pdf} scale={scale}/>
        </ScrollZoom>
      </div>
    )
  }
});


function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

PDF.propTypes = propTypesObject;

PDF.childContextTypes = {
  pdf: React.PropTypes.object,
  scale: React.PropTypes.number
}

export default PDF;
