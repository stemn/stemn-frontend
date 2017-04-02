import React, { Component, PropTypes } from 'react';

import TeamSettings from 'stemn-shared/misc/ProjectSettings/TeamSettings';
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel';

class ProjectSettingsTeam extends Component {
  static propTypes = {
    changePermissionsFn: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
    removeTeamMemberFn: PropTypes.func.isRequired,
    saveProject: PropTypes.func.isRequired,
    selectFn: PropTypes.func.isRequired,
  }
  selectFn = (selection) => {
    if(!this.props.project.data.team.find((item)=>item._id == selection._id)){
      this.props.addTeamMember({
        projectId: this.props.project.data._id,
        user: selection
      })
    }
  }
  changePermissionsFn = ({role, userId}) => {
    this.props.changeUserPermissions({
      role,
      userId,
      projectId: this.props.project.data._id,
    })
  }
  removeTeamMemberFn = ({userId}) => {
    this.props.removeTeamMember({
      userId,
      projectId: this.props.project.data._id,
    })
  }
  saveProject = () =>{
    this.props.saveProject({
      project: this.props.project.data
    })
  }
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
}

export default ProjectSettingsTeam;
