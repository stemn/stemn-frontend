import React from 'react'
import { CSSTransition } from 'react-transition-group'
import LoadingSpinner from 'stemn-shared/misc/Loading/LoadingSpinner/LoadingSpinner'
import LoadingLinear from 'stemn-shared/misc/Loading/LoadingLinear/LoadingLinear.jsx'
import classes from './LoadingOverlay.module.css'
import cn from 'classnames'

export default class LoadingOverlay extends React.Component {
  overlayRef = React.createRef()

  UNSAFE_componentWillReceiveProps(nextProps) {
    const prevProps = this.props
    // If we just began loading:
    if (nextProps.show && (!prevProps || !prevProps.show)) {
      this.startLoading()
    }
    // If we finished loading
    else if (prevProps && prevProps.show && !nextProps.show) {
      this.endLoading()
    }
  }

  startLoading = () => {
    //    console.log('start-loading');
  }

  endLoading = () => {
    //    console.log('end-loading');
  }

  render() {
    const { size, show, children, style, linear, hideBg, noOverlay, background, progress } = this.props

    const transitionName = {
      enter: classes.enter,
      enterActive: classes.enterActive,
      exit: classes.leave,
      exitActive: classes.leaveActive,
      appear: classes.appear,
      appearActive: classes.appearActive,
    }

    const backgroundStyles = background
      ? {
          background,
        }
      : {}

    const noOverlayStyles = noOverlay
      ? {
          height: '5px',
          bottom: 'auto',
        }
      : {}

    const allStyles = Object.assign({}, backgroundStyles, noOverlayStyles, style)

    return (
      <CSSTransition
        in={!!show}
        nodeRef={this.overlayRef}
        classNames={transitionName}
        timeout={300}
        appear
        mountOnEnter
        unmountOnExit
      >
        <div
          ref={this.overlayRef}
          className={cn(classes.loadingOverlay, hideBg ? '' : classes.bgWhite)}
          style={allStyles}
        >
          {linear ? (
            <LoadingLinear />
          ) : (
            <div className={classes.loaderContainer}>
              <LoadingSpinner size={size} progress={progress} />
              {children ? <div className={classes.text}>{children}</div> : null}
            </div>
          )}
        </div>
      </CSSTransition>
    )
  }
}
