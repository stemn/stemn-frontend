import { connect } from 'react-redux'
import { push } from 'react-router-redux'

// Component Core
import React from 'react'

// Sub Components
import TitleBar from 'stemn-shared/misc/TitleBar/TitleBar'
import Sidebar  from 'stemn-shared/misc/Sidebar/Sidebar.jsx'

// /////////////////////////////// COMPONENT /////////////////////////////////

export class Component extends React.Component {
  componentWillReceiveProps(nextProps, prevProps) {
    if (!nextProps.auth.authToken || !nextProps.auth.user._id) {
      nextProps.dispatch(push('/login'))
    }
  }

  componentDidMount() {
    if (!this.props.auth.authToken || !this.props.auth.user._id) {
      this.props.dispatch(push('/login'))
    }

    // If the user is not in the beta... Pop the beta modal.
    //    if (this.props.auth.user && this.props.auth.user._id && !this.props.auth.user.beta) {
    //      this.props.dispatch(showModal({
    //        modalType: betaModalName,
    //        modalOptions: {
    //          noClickClose: true,
    //        },
    //        limit: 1,
    //      }))
    //    }
  }

  render() {
    const { children } = this.props
    return (
      <div className="layout-row flex">
        <div className="layout-column">
          <Sidebar params={ this.props.params } />
        </div>
        <div className="layout-column flex rel-box">
          <TitleBar theme="dark" />
          {children}
        </div>
      </div>
    )
  }
}


// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ auth }) {
  return { auth }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
