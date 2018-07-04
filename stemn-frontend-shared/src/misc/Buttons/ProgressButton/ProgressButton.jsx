import React from 'react'

// Styles
import cn from 'classnames'
import classes from './ProgressButton.css'


export class AnimateSvg extends React.Component {
  svgEl = '';

  render() {
    const { children, draw } = this.props
    const newProps = {
      ref: 'svg',
    }
    if (!this.svgEl && this.refs.svg) {
      this.svgEl = new SVGEl(this.refs.svg)
    }
    if (this.svgEl) {
      this.svgEl.draw(draw)
    }
    return React.cloneElement(children, newProps)
  }
}

export default class Progressbutton extends React.Component {
  state = {
    status: '',
    disabled: false,
    drawLoading: 0,
    drawSuccess: 0,
  };

  componentWillReceiveProps(nextProps) {
    const prevProps = this.props

    // If we just began loading:
    if (nextProps.loading && (!prevProps || !prevProps.loading)) {
      this.startLoading()
    }
    // If we finished loading
    else if (prevProps && prevProps.loading && !nextProps.loading) {
      this.loadingComplete()
    }
  }

  partialLoadTimeout = null;
  completeTimeout = null;
  completeIconTimeout = null;
  resetTimeout = null;

  clearTimeouts = () => {
    clearTimeout(this.partialLoadTimeout)
    clearTimeout(this.completeTimeout)
    clearTimeout(this.completeIconTimeout)
    clearTimeout(this.resetTimeout)
  };

  componentWillUnmount() {
    this.clearTimeouts()
  }

  startLoading = () => {
    this.clearTimeouts()
    this.setState({
      status: 'loading',
      disabled: true,
      drawLoading: 0,
      drawComplete: 0,
    })
    this.partialLoadTimeout = setTimeout(() => { this.setState({ drawLoading: 0.7 }) }, 100)
  };

  loadingComplete = () => {
    this.clearTimeouts()
    this.setState({ drawLoading: 1 })

    this.completeTimeout = setTimeout(() => {
      this.setState(this.props.error ? { status: 'error' } : { status: 'success' })
      this.completeIconTimeout = setTimeout(() => {
        this.setState({ drawComplete: 1 })
      }, 100)
      this.resetTimeout = setTimeout(() => {
        this.setState({ status: '', disabled: false, drawLoading: 0 })
      }, 2000)
    }, 700)
  };

  render() {
    const { children, onClick, loading, className, href, error, ...otherProps } = this.props
    const { status, disabled, drawLoading, drawComplete } = this.state

    const Progress = (
      <svg className={ classes.progressCircle } width="40" height="40" viewBox="0 0 40 40">
        <path d="m1.5,20c0,-10.22099 8.27901,-18.5 18.5,-18.5c10.22099,0 18.5,8.27901 18.5,18.5c0,10.22099 -8.27901,18.5 -18.5,18.5c-10.22099,0 -18.5,-8.27901 -18.5,-18.5z" />
      </svg>
    )
    const Checkmark = (
      <svg className={ classes.checkmark } width="40" height="40" viewBox="0 0 70 70">
        <path d="m31.5,46.5l15.3,-23.2" />
        <path d="m31.5,46.5l-8.5,-7.1" />
      </svg>
    )
    const Cross = (
      <svg className={ classes.cross } width="40" height="40" viewBox="0 0 70 70">
        <path d="m35,35l-9.3,-9.3" />
        <path d="m35,35l9.3,9.3" />
        <path d="m35,35l-9.3,9.3" />
        <path d="m35,35l9.3,-9.3" />
      </svg>
    )

    const getIcon = () => {
      if (status === 'success') {
        return <AnimateSvg draw={ drawComplete }>{ Checkmark }</AnimateSvg>
      } else if (status === 'error') {
        return <AnimateSvg draw={ drawComplete }>{ Cross }</AnimateSvg>
      }
      
      return null
    }

    return (
      <div
        className={ cn(
          classes.progressButton, className,
          { [classes.loading]: status === 'loading' },
          { [classes.error]: status === 'error' },
          { [classes.success]: status === 'success' },
        ) }
      >
        { href
          ? <a href={ href }><button { ...otherProps }><span>{children}</span></button></a>
          : <button onClick={ () => { if (!disabled) { onClick() } } } { ...otherProps }><span>{children}</span></button>}
        <AnimateSvg draw={ drawLoading }>{Progress}</AnimateSvg>
        { getIcon() }
      </div>
    )
  }
}


// //////////////////////////////////////////////////////////

function SVGEl(el) {
  this.el = el
  // the path elements
  this.paths = [].slice.call(this.el.querySelectorAll('path'))
  // we will save both paths and its lengths in arrays
  this.pathsArr = new Array()
  this.lengthsArr = new Array()
  this._init()
}

SVGEl.prototype._init = function () {
  const self = this
  this.paths.forEach((path, i) => {
    self.pathsArr[i] = path
    path.style.strokeDasharray = self.lengthsArr[i] = path.getTotalLength()
  })
  // undraw stroke
  this.draw(0)
}

SVGEl.prototype.draw = function (val) {
  for (let i = 0, len = this.pathsArr.length; i < len; ++i) {
    this.pathsArr[i].style.strokeDashoffset = this.lengthsArr[i] * (1 - val)
  }
}
