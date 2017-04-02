// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ProjectsActions from 'stemn-shared/misc/Projects/Projects.actions.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from '../ProjectSettingsPage.css'

// Sub Components
import { actions } from 'react-redux-form';

import TeamSettings from 'stemn-shared/misc/ProjectSettings/TeamSettings';
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  selectFn(selection){
    if(!this.props.project.data.team.find((item)=>item._id == selection._id)){
      this.props.ProjectsActions.addTeamMember({
        projectId: this.props.project.data._id,
        user: selection
      })
    }
  },
  changePermissionsFn({role, userId}){
    this.props.ProjectsActions.changeUserPermissions({
      role,
      userId,
      projectId: this.props.project.data._id,
    })
  },
  removeTeamMemberFn({userId}){
    this.props.ProjectsActions.removeTeamMember({
      userId,
      projectId: this.props.project.data._id,
    })
  },
  saveProject(){
    this.props.ProjectsActions.saveProject({
      project: this.props.project.data
    })
  },
  render() {
    const { project } = this.props;

    return (
      <InfoPanel>
        <TeamSettings
          changePermissionsFn={ this.changePermissionsFn }
          project={ project }
          removeTeamMemberFn={ this.removeTeamMemberFn }
          saveProject={ this.saveProject }
          selectFn={ this.selectFn }
        />
      </InfoPanel>
    );
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({projects}, otherProps) {
  return {
    project: projects.data[otherProps.params.stub],
    entityModel: `projects.data.${otherProps.params.stub}`
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ProjectsActions: bindActionCreators(ProjectsActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
