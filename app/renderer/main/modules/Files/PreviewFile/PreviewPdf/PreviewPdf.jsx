import React from 'react';
import PDFJS from 'pdfjs-dist'

import Viewer from './PreviewPdfViewer.jsx'
const PDF_URL = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
import classes from './PreviewPdf.css';

const propTypesObject = {
//  src: React.PropTypes.string.isRequired
};

export const ScrollZoom = React.createClass({
  componentDidMount () {
    this.refs.container.addEventListener('DOMMouseScroll', this.handleMouseWheel);
    this.refs.container.addEventListener('mousewheel',     this.handleMouseWheel);
  },
  componentWillUnmount () {
    this.refs.container.removeEventListener('DOMMouseScroll', this.handleMouseWheel);
    this.refs.container.removeEventListener('mousewheel',     this.handleMouseWheel);
  },
  handleMouseWheel (evt) {
    if(evt.ctrlKey){
      if(evt.wheelDelta < 0) { // Zoom Out
        if(this.props.zoomOut) this.props.zoomOut();
      }
      else if(evt.wheelDelta > 0){ // Zoom In
        if(this.props.zoomIn) this.props.zoomIn();
      }
      // Only zoom the pages, not the entire viewer.
      evt.preventDefault();
    }
  },
  render () {
    const { children } = this.props;

    return (
      <div ref="container" className="flex" style={{overflow: 'auto'}}>
        {children}
      </div>
    )
  }
})

const PDF = React.createClass({
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
  componentDidMount () {
    PDFJS.getDocument(PDF_URL).then((pdf) => {
      this.setState({ pdf })
    })
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
    const { pdf, scale } = this.state;
    return (
      <div className={classes.viewer + ' layout-column flex'}>
        <ScrollZoom zoomIn={() => this.zoom('in')} zoomOut={() => this.zoom('out') }>
          <Viewer pdf={pdf} scale={scale} />
        </ScrollZoom>
      </div>
    )
  }
});


PDF.propTypes = propTypesObject;

PDF.childContextTypes = {
  pdf: React.PropTypes.object,
  scale: React.PropTypes.number
}

export default PDF;



