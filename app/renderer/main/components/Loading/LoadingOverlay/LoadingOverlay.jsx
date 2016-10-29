import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// Components
import LoadingSpinner from 'app/renderer/main/components/Loading/LoadingSpinner/LoadingSpinner';
import LoadingLinear  from 'app/renderer/main/components/Loading/LoadingLinear/LoadingLinear.jsx';

// Styles
import classes from './LoadingOverlay.css';
import classNames from 'classnames';

export default React.createClass({
    getInitialState () {
    return {
      loading: false,
    }
  },
  componentWillReceiveProps(nextProps) {
    const prevProps = this.props;
    // If we just began loading:
    if(nextProps.show && (!prevProps || !prevProps.show)){
      this.startLoading();
    }
    // If we finished loading
    else if(prevProps && prevProps.show && !nextProps.show){
      this.endLoading();
    }
  },
  startLoading(){
    console.log('start-loading');
  },  
  endLoading(){
    console.log('end-loading');
  },
  render() {
    const { size, show, children, style, linear, hideBg } = this.props; // size == 'xs'
    const { loading } = this.state;

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
        {
          show ?
          <div className={classNames(classes.loadingOverlay, hideBg ? '' : classes.bgWhite)} style={style}>
            { linear
            ? <LoadingLinear />
            : <div className={classes.loaderContainer}>
                <LoadingSpinner size={size}/>
                {children ? <div className={classes.text}>{children}</div> : null}
              </div>
            }
          </div>
          : null
        }
      </ReactCSSTransitionGroup>
    )
  }
})



