// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ChangesActions from 'stemn-frontend-shared/src/misc/Changes/Changes.actions.js';
import * as ProjectsActions from 'stemn-frontend-shared/src/redux/actions/projects.js';

// Component Core
import React from 'react';
import { has } from 'lodash';
// Styles
import classNames from 'classnames';

// Sub Components
import LoadingOverlay     from 'stemn-frontend-shared/src/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';
import CommitChanges      from 'stemn-frontend-shared/src/misc/Changes/CommitChanges/CommitChanges.jsx';
import CommitBox          from 'stemn-frontend-shared/src/misc/Changes/CommitBox/CommitBox.jsx'
import Toolbar            from 'electron/app/renderer/menubar/modules/Toolbar/Toolbar.jsx'
import MdOpenInNew from 'react-icons/md/open-in-new';
import { Link }           from 'react-router';
import cloudLocked          from 'stemn-frontend-shared/src/assets/images/pure-vectors/cloud-locked.svg';


import * as stringConcat  from 'stemn-frontend-shared/src/utils/stringConcat';

export const Component = React.createClass({
  onMount(nextProps, prevProps){
    // If project has changed
    if(!prevProps || nextProps.projectId != prevProps.projectId){
      // Set the project to active
      nextProps.projectsActions.setActiveProject({projectId: nextProps.projectId});
      // If project is connected
      if(has(nextProps, 'project.data.remote.connected')){
        nextProps.changesActions.fetchChanges({projectId: nextProps.projectId})
      }
    }
  },
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  refresh(){
    this.props.changesActions.fetchChanges({
      projectId: this.props.project.data._id
    })
  },

  toggleAll(value){
    return this.props.changesActions.toggleAll({
      value,
      projectId: this.props.project.data._id
    })
  },

  commitFn(){
    this.props.changesActions.commit({
      projectId: this.props.project.data._id,
      summary: this.props.changes.summary,
      description: this.props.changes.description
    })
  },
  deselect(){
    this.props.changesActions.deselect({
      projectId: this.props.project.data._id
    })
  },
  render() {
    const { changes, project, changesActions, entityModel, projectId } = this.props;

    const addStoreLink = {
      pathname: `/project/${projectId}/settings`,
      state: {meta : {scope: ['main']}}
    }

    const projectNotConnected = () => {
      return (
        <div className="layout-column layout-align-center-center flex">
          <img src={cloudLocked}/>
          <div className="text-title-5 text-center">Project not connected to a file store</div>
          <div className="text-title-5 text-center link-primary" style={{marginTop: '10px'}}>
            <Link to={addStoreLink}>Add File Store</Link>
          </div>
        </div>
      )
    }

    const getInnerContent = () => {
      if(project && project.data.remote.connected){
        return getChangesAndBox();
      }
      else{
        return projectNotConnected()
      }
    }

    const getChangesAndBox = () => {
      if(changes && changes.data){
        const commitBoxStyles = (changes.summary && changes.summary.length > 0) ? {
          height: '200px',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          background: 'rgba(0, 0, 0, 0.03)',
          transition: 'height 0.3s ease'
        } : {
          height: '60px',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          background: 'rgba(0, 0, 0, 0.03)',
          transition: 'height 0.3s ease'
        };
        return (
          <div className="layout-column flex">
            <CommitChanges
              changes={changes}
              project={project.data}
              toggleAll={this.toggleAll}
              selectedFileChange={changesActions.selectedFileChange}
              deselect={this.deselect}
              refresh={this.refresh}/>
            <div style={commitBoxStyles}>
              <CommitBox
                entityModel={entityModel}
                changes={changes}
                changesActions={changesActions}
                commitFn={()=>this.commitFn()}
                project={project.data}/>
            </div>
          </div>
        )
      }
    }


    return (
      <div className="layout-column flex">
        <Toolbar menu={true}>
          <div className="flex">{project && project.data && project.data.name ? stringConcat.end(project.data.name, 28) : ''}</div>
        </Toolbar>
        {getInnerContent()}
        <LoadingOverlay show={project && project.loading} />
      </div>
    )
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({changes, projects}, {params}) {
  const project = projects.data[params.stub];
  return {
    projectId: params.stub,
    project: project,
    changes: changes[params.stub],
    entityModel: `changes.${params.stub}`,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    changesActions: bindActionCreators(ChangesActions, dispatch),
    projectsActions: bindActionCreators(ProjectsActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
