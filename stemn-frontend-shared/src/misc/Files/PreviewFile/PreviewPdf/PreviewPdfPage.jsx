import React from 'react'
import PropTypes from 'prop-types'
import classes from './PreviewPdf.css'
import PDFJSUtils from 'pdfjs-dist/web/pdf_viewer.js'
import Waypoint from 'react-waypoint'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'

class Page extends React.Component {
  state = {
    status: 'loading',
    page: undefined,
    width: 0,
    height: 0,
  };

  componentWillReceiveProps(nextProps) {
    const prevProps = this.props
    if (prevProps.pdf !== nextProps.pdf) {
      this._initPage(nextProps)
    }
    if (prevProps.scale !== nextProps.scale) {
      this.scale(nextProps.scale)
    }
  }

  componentDidMount() {
    this._initPage(this.props)
  }

  componentWillUnmount() {
    this.clearTimeouts()
  }

  renderTimeout = null;

  clearTimeouts = () => {
    clearTimeout(this.renderTimeout)
  };

  _initPage = (props) => {
    const { scale, index, pdf } = this.props
    const { page } = this.state
    if (!page) {
      pdf.getPage(index).then((page) => {
        const viewport = page.getViewport(scale)
        const { width, height } = viewport
        this.setState({
          status: 'loading',
          page,
          width,
          height,
        })
        //        this.renderTimeout = setTimeout(this._enterPage, index * 500);
        this._enterPage()
      })
    }
  };

  _enterPage = () => {
    const { status, page } = this.state
    if (status === 'loading' && page) {
      this._renderPage(page)
    }
  };

  scale = (scale) => {
    //    if(this.state.page){
    //      this._renderPage(this.state.page)
    //    }
  };

  context = undefined;
  viewport = undefined;
  textLayer = undefined;

  _renderPage = (page) => {
    const { scale, index } = this.props
    this.viewport = page.getViewport(scale)
    const { width, height } = this.viewport
    const canvas = this.refs.canvas
    const textEl = this.refs.text
    this.context = canvas.getContext('2d')

    // Create a HDPI canvas
    const ratio = 3
    canvas.width = width * ratio
    canvas.height = height * ratio
    this.context.scale(ratio, ratio)

    this.setState({
      status: 'rendered',
      width,
      height,
    })

    page.render({
      canvasContext: this.context,
      viewport: this.viewport,
    })
    page.getTextContent().then((textContent) => {
      this.textLayer = new PDFJSUtils.PDFJS.TextLayerBuilder({
        textLayerDiv: textEl,
        pageIndex: index - 1,
        viewport: this.viewport,
      })

      this.textLayer.setTextContent(textContent)
      this.textLayer.render()
    })
  };

  render() {
    const {
      scale,
    } = this.props
    const {
      width,
      height,
      status,
    } = this.state

    const sizeStyles = {
      width: width * scale,
      height: height * scale,
    }
    const textStyles = {
      transform: `scale(${scale})`,
      transformOrigin: '0% 0%',
    }

    return (
      <div className={ `${classes.page} ${status}` } style={ sizeStyles }>
        <LoadingOverlay show={ status === 'loading' } />
        <Waypoint onEnter={ this._enterPage } />
        <div style={ sizeStyles }>
          <canvas ref="canvas" style={ sizeStyles } />
        </div>
        <div ref="text" className={ classes.textLayer } style={ textStyles } />
      </div>
    )
  }
}

Page.propTypes = {
  index: PropTypes.number.isRequired,
}

export default Page
