import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'
import LoadingSpinner from 'stemn-shared/misc/Loading/LoadingSpinner/LoadingSpinner'
import LoadingLinear  from 'stemn-shared/misc/Loading/LoadingLinear/LoadingLinear.jsx'
import classes from './LoadingOverlay.css'
import cn from 'classnames'

const propTypesObject = {
  size: PropTypes.string,               // 'sm' || 'lg' - Changes the size of the spinner
  show: PropTypes.bool,                 // Should we show the overlay?
  children: PropTypes.node,                 // Text to show under the spinner
  style: PropTypes.object,               // Styles object
  linear: PropTypes.bool,                 // Change the spinner to a linear bar
  hideBg: PropTypes.bool,                 // Make the bg transparent
  noOverlay: PropTypes.bool,                 // Makes the overlay just at the top (for use with the linear === true)
  background: PropTypes.string,               // Custom background colour
  progress: PropTypes.number,               // Progress percentage - makes the spinner determinate
}


export default class LoadingOverlay extends React.Component {
  static propTypes = propTypesObject;

  componentWillReceiveProps(nextProps) {
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
  };

  endLoading = () => {
    //    console.log('end-loading');
  };

  render() {
    const { size, show, children, style, linear, hideBg, noOverlay, background, progress } = this.props

    const transitionName = {
      enter: classes.enter,
      enterActive: classes.enterActive,
      leave: classes.leave,
      leaveActive: classes.leaveActive,
      appear: classes.appear,
      appearActive: classes.appearActive,
    }

    const backgroundStyles = background ? {
      background,
    } : {}

    const noOverlayStyles = noOverlay ? {
      height: '5px',
      bottom: 'auto',
    } : {}

    const allStyles = Object.assign({}, backgroundStyles, noOverlayStyles, style)

    return (
      <CSSTransitionGroup
        transitionName={ transitionName }
        transitionAppear
        transitionAppearTimeout={ 300 }
        transitionEnterTimeout={ 300 }
        transitionLeaveTimeout={ 300 }
      >
        { show
          ? <div className={ cn(classes.loadingOverlay, hideBg ? '' : classes.bgWhite) } style={ allStyles }>
            { linear
              ? <LoadingLinear />
              : <div className={ classes.loaderContainer }>
                <LoadingSpinner size={ size } progress={ progress } />
                {children ? <div className={ classes.text }>{children}</div> : null}
              </div>
            }
          </div>
          : null }
      </CSSTransitionGroup>
    )
  }
}

