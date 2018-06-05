import React, { Component } from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import { getToken } from 'stemn-shared/misc/Auth/Auth.actions'
import ModalContainer from 'stemn-shared/misc/Modal/ModalContainer.jsx'
import ToastContainer from 'stemn-shared/misc/Toasts/Toasts.jsx'
import RouteLoading from 'stemn-shared/misc/CodeSplitting/RouteLoading'

const stateToProps = ({ auth, userSettings }) => ({
  isLoggedIn: auth.authToken && auth.user._id,
  userSettingsMessages: userSettings.data.messages || {},
})

const dispatchToProps = {
  goLanding: () => replace('/landing'),
  goOnboarding: () => replace('/onboarding'),
  getToken,
}

@connect(stateToProps, dispatchToProps)
export default class LoginContainer extends Component {
  goSomewhere = (nextProps) => {
    const { userSettingsMessages, isLoggedIn, location, goLanding, goOnboarding } = nextProps
    const { pathname } = location
    const isHompage = pathname === '/'
    const notYetOnboarded = userSettingsMessages.onboarding === true

    if (!isLoggedIn && isHompage) {
      goLanding()
    } else if (isLoggedIn && notYetOnboarded && !pathname.includes('onboarding')) {
      goOnboarding()
    }
  }
  parseGlobalQueryParams = () => {
    const { location, isLoggedIn, getToken } = this.props
    const { query } = location
    // If we have query.id and we are not logged in, we use the id as an auth token
    if (query.id) {
      getToken(query.id)
    }
  }
  componentWillReceiveProps(nextProps) {
    this.goSomewhere(nextProps)
  }
  componentDidMount() {
    this.goSomewhere(this.props)
    this.parseGlobalQueryParams()
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
