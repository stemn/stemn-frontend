import React, { Component, PropTypes } from 'react';

import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton';
import TeamMember from 'stemn-shared/misc/Project/TeamMember/TeamMember.jsx'
import UserSearch from 'stemn-shared/misc/UserSearch/UserSearch.container.js'

export default class GeneralSettings extends Component {
  static propTypes = {
    changePermissionsFn: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
    removeTeamMemberFn: PropTypes.func.isRequired,
    saveProject: PropTypes.func.isRequired,
    selectFn: PropTypes.func.isRequired,
  }
  render() {
    const { 
      changePermissionsFn, 
      project, 
      removeTeamMemberFn,
      saveProject, 
      selectFn, 
    } = this.props;
    
    return (
      <div>
        <h3>Team Members</h3>
        <p>Invite your team to your project. STEMN adds your team members to your shared cloud storage folder.</p>
        <UserSearch select={selectFn} />
        <br />
        {project.data.team.map((item) => (
          <div style={{marginBottom: '15px'}}  key={item._id}>
            <TeamMember
              item={item}
              changePermissionsFn={changePermissionsFn}
              removeTeamMemberFn={removeTeamMemberFn}
            />
          </div>)
        )}
        <br />
        <div className="layout-row layout-align-end">
          <ProgressButton
           className="primary"
           onClick={saveProject}
           loading={project.savePending}>
            Update Team
          </ProgressButton>
        </div>
      </div>
    )
  }
}
