import { connect } from 'react-redux'
import { push } from 'react-router-redux'

// Component Core
import React from 'react'
import { has } from 'lodash'

// Sub Components
import Sidebar            from 'stemn-frontend-desktop/app/renderer/menubar/modules/Sidebar/Sidebar.jsx'

// /////////////////////////////// COMPONENT /////////////////////////////////

export class Component extends React.Component {
  onMount = (nextProps, prevProps) => {
    if (!nextProps.auth.authToken || !nextProps.auth.user._id) {
      nextProps.dispatch(push('/login'))
    }
    if (!has(nextProps, 'params.stub') || nextProps.activeProject != nextProps.params.stub) {
      nextProps.dispatch(push(`/project/${nextProps.activeProject}`))
    }
  };

  componentWillMount() { this.onMount(this.props) }
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props) }

  render() {
    const { children } = this.props

    return (
      <div className="layout-column flex">
        {children}
        <Sidebar />
      </div>
    )
  }
}


// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ auth, projects }) {
  return {
    auth,
    activeProject: projects.activeProject,
  }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
