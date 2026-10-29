import { connect } from 'react-redux'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import * as ToastsActions from './Toasts.actions.js'
import React from 'react'
import { MdError } from 'react-icons/md'
import { MdClose } from 'react-icons/md'
import cn from 'classnames'

// css-loader emits ES modules - require() returns { default: classes }
const classes = GLOBAL_ENV.APP_TYPE === 'web'
  ? require('./Toasts.web.css').default
  : require('./Toasts.desktop.css').default

const transitionClassNames = {
  enter: classes.enter,
  enterActive: classes.enterActive,
  exit: classes.leave,
  exitActive: classes.leaveActive,
  appear: classes.appear,
  appearActive: classes.appearActive,
}

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

  componentWillUnmount() {
    clearTimeout(this.hideTimeout)
  }

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
      <div ref={ this.props.nodeRef } className={ cn(classes.toast, 'layout-row', { [classes.error]: toast.type === 'error' }) } onMouseEnter={ this.mouseEnter } onMouseLeave={ this.mouseLeave }>
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

// TransitionGroup injects the transition props (in, onExited, ...) into this component
const ToastTransition = ({ toast, dispatch, ...transitionProps }) => {
  const nodeRef = React.useRef(null)
  return (
    <CSSTransition
      { ...transitionProps }
      nodeRef={ nodeRef }
      classNames={ transitionClassNames }
      timeout={ 300 }
    >
      <Toast nodeRef={ nodeRef } toast={ toast } dispatch={ dispatch } />
    </CSSTransition>
  )
}

export class Component extends React.Component {
  render() {
    const { toasts, dispatch } = this.props

    const hasToasts = toasts && toasts.stack && toasts.stack.length > 0

    return (
      <div className={ classes.toastContainer }>
        <TransitionGroup component="span" appear>
          { hasToasts
            ? toasts.stack.map(toast => <ToastTransition key={ toast.id } toast={ toast } dispatch={ dispatch } />)
            : null
          }
        </TransitionGroup>
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
