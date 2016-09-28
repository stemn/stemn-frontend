import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// Components
import LoadingSpinner from 'app/renderer/main/components/Loading/LoadingSpinner/LoadingSpinner';

// Styles
import classes from './LoadingOverlay.css';

export default class extends Component {
  render() {
    const { size, show, children, style } = this.props; // size == 'xs'

    const transitionName = {
      enter: classes.enter,
      enterActive: classes.enterActive,
      leave: classes.leave,
      leaveActive: classes.leaveActive,
      appear: classes.appear,
      appearActive: classes.appearActive
    };

    return (
      <ReactCSSTransitionGroup
       transitionName={transitionName}
        transitionAppear={true}
        transitionAppearTimeout={300}
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}>
        {show ?
          <div className={classes.loadingOverlay + ' overlay'} style={style}>
              <div className={classes.loaderContainer}>
                <LoadingSpinner size={size}/>
                {children ? <div className={classes.text}>{children}</div> : ''}
              </div>
          </div>
          : ''
        }
      </ReactCSSTransitionGroup>
    )
  }
}
