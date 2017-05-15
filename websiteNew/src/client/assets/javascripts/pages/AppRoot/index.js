import React, { Component } from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import ModalContainer from 'stemn-shared/misc/Modal/ModalContainer.jsx'
import ToastContainer from 'stemn-shared/misc/Toasts/Toasts.jsx'
import RouteLoading from 'stemn-shared/misc/CodeSplitting/RouteLoading'

const stateToProps = ({ auth, userSettings }) => ({
  authToken: auth.authToken,
  userId: auth.user._id,
  userSettingsMessages: userSettings.data.messages || {},
});

const dispatchToProps = {
  goLanding: () => replace('/landing'),
  goOnboarding: () => replace('/onboarding'),
};

@connect(stateToProps, dispatchToProps)
export default class LoginContainer extends Component {
  goSomewhere = (nextProps) => {
    const { userSettingsMessages, authToken, location, userId, goLanding, goOnboarding } = nextProps
    const { pathname } = location
    const isLoggedIn = authToken && userId
    const isHompage = pathname === '/'
    const notYetOnboarded = userSettingsMessages.onboarding === true

    if (!isLoggedIn && isHompage) {
      goLanding()
    } else if (isLoggedIn && notYetOnboarded && !pathname.includes('onboarding')) {
      goOnboarding()
    }
  }
  componentWillReceiveProps(nextProps) {
    this.goSomewhere(nextProps)
  }
  componentDidMount() {
    this.goSomewhere(this.props)
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
