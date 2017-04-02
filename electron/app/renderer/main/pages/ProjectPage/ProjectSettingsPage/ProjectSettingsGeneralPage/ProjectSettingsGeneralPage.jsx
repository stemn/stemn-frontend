// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ProjectsActions from 'stemn-shared/misc/Projects/Projects.actions.js';
import * as ModalActions from 'stemn-shared/misc/Modal/Modal.actions.js';

// Component Core
import React from 'react';
import { has } from 'lodash';
// Styles
import classNames from 'classnames';
import classes from '../ProjectSettingsPage.css'

// Sub Components
import { actions } from 'react-redux-form';

import GeneralSettings from 'stemn-shared/misc/ProjectSettings/GeneralSettings';
import DeleteSettings from 'stemn-shared/misc/ProjectSettings/DeleteSettings';
import CloudSettings from 'stemn-shared/misc/ProjectSettings/CloudSettings';
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel';

///////////////////////////////// COMPONENT /////////////////////////////////

const onMount = (nextProps, prevProps) => {
  if(nextProps.project && nextProps.project.data){
    if(!prevProps || nextProps.project.data._id !== prevProps.project.data._id){
      // Init the filestore form model
      nextProps.dispatch(actions.load(`${nextProps.entityModel}.formModels.fileStore.remote`, nextProps.project.data.remote))
    }
  }
}

export const Component = React.createClass({

  // Mounting
  componentWillMount() { onMount(this.props) },
  componentWillReceiveProps(nextProps) { onMount(nextProps, this.props)},
  confirmLinkRemote() {
    const { project, auth } = this.props;
    ProjectsActions.confirmLinkRemote({
      userId: auth.user._id,
      isConnected: project.data.remote.connected,
      projectId: project.data._id,
      provider: project.formModels.fileStore.remote.provider,
      prevProvider: project.data.remote.provider,
      id: project.formModels.fileStore.remote.root.fileId,
      path: project.formModels.fileStore.remote.root.path,
    })
  },
  deleteProject() {
    ProjectsActions.confirmDeleteProject({
      projectId: this.props.project.data._id,
      name: this.props.project.data.name
    })
  },
  render() {
    const { entityModel, project, ProjectsActions, dispatch } = this.props;
    return (
      <div>
        <InfoPanel>
          <GeneralSettings
            project={ project }
            entityModel={ entityModel }
            saveProject={ this.props.ProjectsActions.saveProject }
          />
        </InfoPanel>
        <InfoPanel>
          <CloudSettings
            project={ project }
            entityModel={ entityModel }
            confirmLinkRemote={ this.confirmLinkRemote }
          />
        </InfoPanel>
        <InfoPanel>
          <DeleteSettings
            deleteProject={ this.deleteProject }
          />
        </InfoPanel>
     </div>
    );
  }
});


///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({auth, projects}, otherProps) {
  return {
    auth,
    project: projects.data[otherProps.params.stub],
    entityModel: `projects.data.${otherProps.params.stub}`
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ProjectsActions : bindActionCreators(ProjectsActions, dispatch),
    ModalActions    : bindActionCreators(ModalActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
