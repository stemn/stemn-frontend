import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import * as ToastsActions from './Toasts.actions.js'
import React from 'react'
import MdError from 'react-icons/md/error'
import MdClose from 'react-icons/md/close'
import cn from 'classnames'

const classes = GLOBAL_ENV.APP_TYPE === 'web'
  ? require('./Toasts.web.css')
  : require('./Toasts.desktop.css')

class Toast extends React.Component {
  hideTimeout = null;

  mouseEnter = () => {
    clearTimeout(this.hideTimeout)
  };

  mouseLeave = () => {
    this.startHideTimeout()
  };

  startHideTimeout = () => {
    this.hideTimeout = setTimeout(this.closeToast, 5000)
  };

  closeToast = () => {
    this.props.dispatch(ToastsActions.hide({ id: this.props.toast.id }))
  };

  render() {
    const { toast, dispatch } = this.props
    if (!this.hideTimeout) { this.startHideTimeout() }

    const getIcon = () => {
      if (toast.type === 'error') {
        return <MdError size={ 20 } className={ classes.icon } />
      } 
      return null
    }

    const processAction = (action) => {
      if (action) {
        dispatch(action)
      }
    }

    const getActions = () => {
      if (toast.actions && toast.actions.length) {
        return (
          <span>
            {toast.actions.map((action, index) =>
              <a
                key={ index }
                onClick={ () => { processAction(action.action); this.closeToast() } }
                className="link-primary"
              >
                {action.text}
              </a>,
            )}
          </span>
        )
      }
      
      return null
    }

    return (
      <div className={ cn(classes.toast, 'layout-row', { [classes.error]: toast.type === 'error' }) } onMouseEnter={ this.mouseEnter } onMouseLeave={ this.mouseLeave }>
        <div className={ `${classes.toastInner} flex layout-row layout-align-start-center` }>
          {getIcon()}
          {toast.title}
          {getActions()}
          <div className="flex" />
          <a className={ classes.close } onClick={ this.closeToast }><MdClose size="20" /></a>
        </div>
      </div>
    )
  }
}


export class Component extends React.Component {
  render() {
    const { toasts, dispatch } = this.props

    const transitionName = {
      enter: classes.enter,
      enterActive: classes.enterActive,
      leave: classes.leave,
      leaveActive: classes.leaveActive,
      appear: classes.appear,
      appearActive: classes.appearActive,
    }

    const hasToasts = toasts && toasts.stack && toasts.stack.length > 0

    return (
      <div className={ classes.toastContainer }>
        <CSSTransitionGroup
          transitionName={ transitionName }
          transitionAppear
          transitionAppearTimeout={ 300 }
          transitionEnterTimeout={ 300 }
          transitionLeaveTimeout={ 300 }
        >
          { hasToasts
            ? toasts.stack.map(toast => <Toast key={ toast.id } toast={ toast } dispatch={ dispatch } />)
            : null
          }
        </CSSTransitionGroup>
      </div>
    )
  }
}


function mapStateToProps({ toasts }) {
  return {
    toasts,
  }
}

export default connect(mapStateToProps)(Component)
