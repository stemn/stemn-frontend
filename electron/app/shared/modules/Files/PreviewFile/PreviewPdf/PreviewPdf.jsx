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
      if(!nextProps.fileData){
        nextProps.downloadFn({
          projectId    : nextProps.fileMeta.project._id,
          provider     : nextProps.fileMeta.provider,
          fileId       : nextProps.fileMeta.fileId,
          revisionId   : nextProps.fileMeta.revisionId,
          responseType : 'arraybuffer'
        })
      }
      if(nextProps.fileData && nextProps.fileData.data){
        const arrayBuffer = nextProps.fileData.data;
        PDFJS.getDocument(arrayBuffer).then((pdf) => {
          this.setState({ pdf })
        })
      }
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


//function str2ab(str) {
//  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
//  var bufView = new Uint16Array(buf);
//  for (var i=0, strLen=str.length; i<strLen; i++) {
//    bufView[i] = str.charCodeAt(i);
//  }
//  return buf;
//}

function str2ab(str) {
  var raw = str;
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for(var i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

var BASE64_MARKER = ';base64,';
function convertDataURIToBinary(dataURI) {
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for(var i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

PDF.propTypes = propTypesObject;

PDF.childContextTypes = {
  pdf: React.PropTypes.object,
  scale: React.PropTypes.number
}

export default PDF;
