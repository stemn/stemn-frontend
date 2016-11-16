import React from 'react';
import classes from './PreviewPdf.css';

import PDFJS from 'pdfjs-dist'
import PDFJSUtils from 'pdfjs-dist/web/pdf_viewer.js';
import Waypoint from 'react-waypoint';
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';

const Page = React.createClass({
  getInitialState () {
    return {
      status: 'loading',
      page: undefined,
      width: 0,
      height: 0
    }
  },
  componentWillReceiveProps(nextProps) {
    const prevProps = this.props;
    if(prevProps.pdf != nextProps.pdf){
      this._initPage(nextProps)
    }
    if(prevProps.scale != nextProps.scale){
      this.scale(nextProps.scale)
    }
  },
  componentDidMount () {
    this._initPage(this.props)
  },
  componentWillUnmount(){
    this.clearTimeouts();
  },
  renderTimeout: null,
  clearTimeouts() {
    clearTimeout(this.renderTimeout);
  },
  _initPage (props){
    const { scale, index, pdf } = this.props;
    const { page } = this.state;
    if(!page){
      pdf.getPage(index).then(page => {

        const viewport = page.getViewport(scale);
        const { width, height } = viewport;
        this.setState({
          status: 'loading',
          page, width, height
        })
//        this.renderTimeout = setTimeout(this._enterPage, index * 500);
        this._enterPage();
      })
    }
  },
  _enterPage () {
    const { status, page } = this.state;
    if(status == 'loading' && page){
      this._renderPage(page)
    }
  },
  scale (scale){
    console.log(scale);
//    if(this.state.page){
//      this._renderPage(this.state.page)
//    }
  },
  _renderPage (page) {
    const { scale, index } = this.props;
    const viewport = page.getViewport(scale);
    const { width, height } = viewport;
    const canvas = this.refs.canvas
    const textEl = this.refs.text;
    const context = canvas.getContext('2d');

    // Create a HDPI canvas
    const ratio = 3;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.scale(ratio, ratio);

    this.setState({
      status: 'rendered',
      width,
      height,
    })

    page.render({
      canvasContext: context,
      viewport: viewport
    })
    page.getTextContent().then(function(textContent){
      var textLayer = new PDFJSUtils.PDFJS.TextLayerBuilder({
        textLayerDiv : textEl,
        pageIndex : index - 1,
        viewport : viewport
      });

      textLayer.setTextContent(textContent);
      textLayer.render();
    });
  },
  render () {
    const { pdf, scale, index } = this.props;
    const { width, height, status, page } = this.state;

    const size = {
      width: width * scale,
      height: height * scale,
    };

    return (
      <div className={classes.page + ' ' + status} style={size}>
        <LoadingOverlay show={status == 'loading'}/>
        <Waypoint onEnter={this._enterPage}/>
        <div style={size}>
          <canvas ref="canvas" style={size}/>
        </div>
        <div ref="text" className={classes.textLayer} style={{transform: `scale(${scale})`}}></div>
      </div>
    )
  }
})

Page.propTypes = {
  index: React.PropTypes.number.isRequired
}

export default Page
