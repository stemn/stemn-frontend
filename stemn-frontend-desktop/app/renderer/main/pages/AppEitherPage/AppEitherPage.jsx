import { connect } from 'react-redux'

// Component Core
import React from 'react'

// Sub Components
import TitleBar from 'stemn-shared/misc/TitleBar/TitleBar'
import Sidebar  from 'stemn-shared/misc/Sidebar/Sidebar.jsx'

// /////////////////////////////// COMPONENT /////////////////////////////////

export class Component extends React.Component {
  render() {
    const { children, auth } = this.props
    const isAuthed = auth.authToken && auth.user._id

    return (
      <div className="layout-row flex">
        <div className="layout-column">
          { isAuthed ? <Sidebar params={ this.props.params } /> : null }
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
