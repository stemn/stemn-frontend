import React from 'react'
import classes from './PreviewPdf.module.css'
import { TextLayer } from 'pdfjs-dist'
import Waypoint from 'stemn-shared/misc/Waypoint'
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'

class Page extends React.Component {
  state = {
    status: 'loading',
    page: undefined,
    width: 0,
    height: 0,
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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

  renderTimeout = null

  clearTimeouts = () => {
    clearTimeout(this.renderTimeout)
  }

  _initPage = (props) => {
    const { scale, index, pdf } = this.props
    const { page } = this.state
    if (!page) {
      pdf.getPage(index).then((page) => {
        const viewport = page.getViewport({ scale })
        const { width, height } = viewport
        // Render once the page is in state (setState is asynchronous since React 18: calling
        // _enterPage right after it read the old state and the page sometimes never rendered)
        this.setState(
          {
            status: 'loading',
            page,
            width,
            height,
          },
          this._enterPage,
        )
      })
    }
  }

  _enterPage = () => {
    const { status, page } = this.state
    if (status === 'loading' && page) {
      this._renderPage(page)
    }
  }

  scale = (scale) => {
    //    if(this.state.page){
    //      this._renderPage(this.state.page)
    //    }
  }

  viewport = undefined
  textLayer = undefined

  _renderPage = (page) => {
    const { scale } = this.props
    this.viewport = page.getViewport({ scale })
    const { width, height } = this.viewport
    const canvas = this.canvasRef
    const textEl = this.textRef
    if (!canvas || !textEl) return

    // Create a HDPI canvas
    const ratio = 3
    canvas.width = width * ratio
    canvas.height = height * ratio

    this.setState({
      status: 'rendered',
      width,
      height,
    })

    page.render({
      canvas,
      viewport: this.viewport,
      transform: [ratio, 0, 0, ratio, 0, 0],
    })
    textEl.replaceChildren()
    textEl.style.setProperty('--total-scale-factor', String(this.viewport.scale))
    this.textLayer = new TextLayer({
      textContentSource: page.streamTextContent(),
      container: textEl,
      viewport: this.viewport,
    })
    this.textLayer.render().catch((err) => console.error('Failed to render pdf text layer', err))
  }

  render() {
    const { scale } = this.props
    const { width, height, status } = this.state

    const sizeStyles = {
      width: width * scale,
      height: height * scale,
    }
    const textStyles = {
      transform: `scale(${scale})`,
      transformOrigin: '0% 0%',
    }

    return (
      <div className={`${classes.page} ${status}`} style={sizeStyles}>
        <LoadingOverlay show={status === 'loading'} />
        <Waypoint onEnter={this._enterPage} />
        <div style={sizeStyles}>
          <canvas
            ref={(el) => {
              this.canvasRef = el
            }}
            style={sizeStyles}
          />
        </div>
        <div
          ref={(el) => {
            this.textRef = el
          }}
          className={classes.textLayer}
          style={textStyles}
        />
      </div>
    )
  }
}

export default Page
