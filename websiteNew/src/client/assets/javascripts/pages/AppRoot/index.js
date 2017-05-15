import React, { Component } from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import ModalContainer from 'stemn-shared/misc/Modal/ModalContainer.jsx'
import ToastContainer from 'stemn-shared/misc/Toasts/Toasts.jsx'
import RouteLoading from 'stemn-shared/misc/CodeSplitting/RouteLoading'

const stateToProps = ({ auth }) => ({
  authToken: auth.authToken,
  userId: auth.user._id
});

const dispatchToProps = {
  goLanding: () => replace('/landing')
};

@connect(stateToProps, dispatchToProps)
export default class LoginContainer extends Component {
  maybeGolanding = (nextProps) => {
    const isLoggedIn = nextProps.authToken && nextProps.userId
    const isHompage = nextProps.location.pathname === '/'
    if (!isLoggedIn && isHompage) {
      nextProps.goLanding()
    }
  }
  componentWillReceiveProps(nextProps) {
    this.maybeGolanding(nextProps)
  }
  componentDidMount() {
    this.maybeGolanding(this.props)
  }
  render() {
    const { children } = this.props
    return (
      <div className="layout-column flex" style={ { minHeight: '100vh' } }>
        <div className="layout-column flex">
          { children }
        </div>
        <ToastContainer />
        <ModalContainer />
        <RouteLoading />
      </div>
    )
  }
}
