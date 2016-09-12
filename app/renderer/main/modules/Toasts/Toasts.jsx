// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import * as ToastsActions from './Toasts.actions.js';

// Component Core
import React from 'react';

// Styles
import classes from './Toasts.css'
import classNames from 'classnames';

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const Toast = React.createClass({
  hideTimeout: null,
  mouseEnter(){
    clearTimeout(this.hideTimeout);
  },
  mouseLeave(){
    this.startHideTimeout()
  },
  startHideTimeout(){
    this.hideTimeout = setTimeout(()=>this.props.dispatch(ToastsActions.hide({id: this.props.toast.id})), 5000)
  },
  render() {
    const { toast, dispatch } = this.props;

    if(!this.hideTimeout){this.startHideTimeout()}

    return (
      <div className={classNames(classes.toast, 'layout-row', { [classes.error] : toast.type=='error' })} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
        <div className={classes.toastInner + ' flex layout-row layout-align-start-center'}>
          {!toast.actions || !toast.actions.length > 0 ? null :
            toast.actions.map((action, index) => <a key={index} onClick={()=>dispatch(action.action)} className="link-primary">{action.text}&nbsp;&nbsp;</a>)
          }
          {toast.title}
        </div>
      </div>
    )
  }
});


export const Component = React.createClass({
  render() {
    const { toasts, dispatch } = this.props;

    const transitionName = {
      enter: classes.enter,
      enterActive: classes.enterActive,
      leave: classes.leave,
      leaveActive: classes.leaveActive,
      appear: classes.appear,
      appearActive: classes.appearActive
    };
    return (
      <div className={classes.toastContainer}>
        <ReactCSSTransitionGroup
          transitionName={transitionName}
          transitionAppear={true}
          transitionAppearTimeout={300}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}>
          {
            toasts && toasts.stack && toasts.stack.length > 0
            ? toasts.stack.map((toast) => <Toast key={toast.id} toast={toast} dispatch={dispatch}></Toast>)
            : null
          }
        </ReactCSSTransitionGroup>
      </div>
    );

  }
});

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({toasts}) {
  return {
    toasts
  };
}

export default connect(mapStateToProps)(Component);
