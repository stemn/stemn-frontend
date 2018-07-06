import { connect } from 'react-redux'
import { push } from 'react-router-redux'

// Component Core
import React from 'react'

// Sub Components
import TitleBar from 'stemn-shared/misc/TitleBar/TitleBar'


// /////////////////////////////// COMPONENT /////////////////////////////////

export class Component extends React.Component {
  componentWillReceiveProps(nextProps, prevProps) {
    if (nextProps.auth.authToken && nextProps.auth.user._id) {
      nextProps.dispatch(push('/'))
    }
  }

  componentDidMount() {
    if (this.props.auth.authToken && this.props.auth.user._id) {
      this.props.dispatch(push('/'))
    }
  }

  render() {
    const { children } = this.props
    return (
      <div className="layout-column flex">
        <TitleBar theme="light" />
        {children}
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
