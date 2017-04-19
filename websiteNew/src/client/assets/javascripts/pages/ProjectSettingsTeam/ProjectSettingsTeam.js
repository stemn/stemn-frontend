import React, { Component, PropTypes } from 'react';

import TeamSettings from 'stemn-shared/misc/ProjectSettings/TeamSettings';
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel';

class ProjectSettingsTeam extends Component {
  static propTypes = {
    changePermissions: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
    removeTeamMember: PropTypes.func.isRequired,
    addTeamMember: PropTypes.func.isRequired,
    saveProject: PropTypes.func.isRequired,
  }
  selectFn = (selection) => {
    if(!this.props.project.data.team.find((item)=>item._id == selection._id)){
      this.props.addTeamMember({
        projectId: this.props.project.data._id,
        user: selection
      })
    }
  }
  changePermissions = ({role, userId}) => {
    this.props.changeUserPermissions({
      role,
      userId,
      projectId: this.props.project.data._id,
    })
  }
  removeTeamMember = ({userId}) => {
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
    const { project } = this.props

    return (
      <InfoPanel>
        <TeamSettings
          changePermissionsFn={ this.changePermissions }
          project={ project }
          removeTeamMemberFn={ this.removeTeamMember }
          saveProject={ this.saveProject }
          selectFn={ this.selectFn }
        />
      </InfoPanel>
    );
  }
}

export default ProjectSettingsTeam;
