import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as ChangesActions  from 'stemn-shared/misc/Changes/Changes.actions.js'
import * as ProjectsActions from 'stemn-shared/misc/Projects/Projects.actions.js'

import React from 'react'
import { has } from 'lodash'

import cn from 'classnames'
import classes from './ProjectPage.scss'

import LoadingOverlay     from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx'
import CommitChanges      from 'stemn-shared/misc/Changes/CommitChanges/CommitChanges.jsx'
import CommitBox          from 'stemn-shared/misc/Changes/CommitBox/CommitBox.jsx'
import Toolbar            from 'stemn-frontend-desktop/app/renderer/menubar/modules/Toolbar/Toolbar.jsx'
import { Link }           from 'react-router'
import cloudLocked        from 'stemn-shared/assets/images/pure-vectors/cloud-locked.svg'


import * as stringConcat  from 'stemn-shared/utils/stringConcat'

export class Component extends React.Component {
  onMount = (nextProps, prevProps) => {
    // If project has changed
    if (!prevProps || nextProps.projectId != prevProps.projectId) {
      // Set the project to active
      nextProps.projectsActions.setActiveProject({ projectId: nextProps.projectId })
      // If project is connected
      if (has(nextProps, 'project.data.remote.connected')) {
        nextProps.changesActions.fetchChanges({ projectId: nextProps.projectId })
      }
    }
  };

  componentWillMount() { this.onMount(this.props) }
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props) }

  refresh = () => {
    this.props.changesActions.fetchChanges({
      projectId: this.props.project.data._id,
    })
  };

  toggleAll = ({ value }) => this.props.changesActions.toggleAll({
    value,
    projectId: this.props.project.data._id,
  });

  commitFn = () => {
    this.props.changesActions.commit({
      projectId: this.props.project.data._id,
      name: this.props.changes.name,
      body: this.props.changes.body,
    })
  };

  deselect = () => {
    this.props.changesActions.deselect({
      projectId: this.props.project.data._id,
    })
  };

  render() {
    const { changes, project, changesActions, entityModel, projectId, dispatch } = this.props

    const addStoreLink = {
      pathname: `/project/${projectId}/settings`,
      state: { meta: { scope: ['main'] } },
    }

    const projectNotConnected = () => (
      <div className="layout-column layout-align-center-center flex">
        <img src={ cloudLocked } />
        <div className="text-title-5 text-center">Project not connected to a file store</div>
        <div className="text-title-5 text-center link-primary" style={ { marginTop: '10px' } }>
          <Link to={ addStoreLink }>Add File Store</Link>
        </div>
      </div>
    )

    const getInnerContent = () => {
      if (has(project, 'data.remote.connected')) {
        return getChangesAndBox()
      } 
      return projectNotConnected()
    }

    const getChangesAndBox = () => {
      if (changes && changes.data) {
        return (
          <div className="layout-column flex">
            <CommitChanges
              initialSync={ !project.data.remote.lastSynced }
              changes={ changes }
              project={ project.data }
              toggleAll={ this.toggleAll }
              selectedFileChange={ changesActions.selectedFileChange }
              deselect={ this.deselect }
              refresh={ this.refresh }
              dispatch={ dispatch }
            />
            <CommitBox
              className={ cn(classes.commitBox, { [classes.open]: changes.name && changes.name.length > 0 }) }
              entityModel={ entityModel }
              changes={ changes }
              changesActions={ changesActions }
              commitFn={ () => this.commitFn() }
              project={ project.data }
            />
          </div>
        )
      }
    }

    return (
      <div className="layout-column flex">
        <Toolbar menu>
          <div className="flex">{project && project.data && project.data.name ? stringConcat.end(project.data.name || 'Untitled Project', 28) : ''}</div>
        </Toolbar>
        <div className="layout-column flex rel-box">
          { getInnerContent() }
          <LoadingOverlay show={ project && project.loading } />
        </div>
      </div>
    )
  }
}

// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ changes, projects }, { params }) {
  const project = projects.data[params.stub]
  return {
    projectId: params.stub,
    project,
    changes: changes[params.stub],
    entityModel: `changes.${params.stub}`,
  }
}


function mapDispatchToProps(dispatch) {
  return {
    changesActions: bindActionCreators(ChangesActions, dispatch),
    projectsActions: bindActionCreators(ProjectsActions, dispatch),
    dispatch,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
