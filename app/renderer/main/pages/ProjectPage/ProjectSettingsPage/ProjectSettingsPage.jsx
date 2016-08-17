import React from 'react';

// Components
import Tabs from 'app/renderer/main/components/Tabs/Tabs'
import Toggle from 'app/renderer/main/components/Input/Toggle/Toggle'
import UserSearch from 'app/renderer/main/modules/UserSearch/UserSearch.container.js'
import TeamMember from 'app/renderer/main/components/Project/TeamMember/TeamMember.jsx'

import ProjectPermissionsRadio from 'app/renderer/main/components/Project/ProjectPermissionsRadio/ProjectPermissionsRadio.jsx'

// Styles
import classNames from 'classnames';


const PageStyles = {
  padding: '20px 40px'
}

export default React.createClass({
  selectFn(selection){
    if(!this.props.project.team.find((item)=>item._id == selection._id)){
      this.props.ProjectsActions.addTeamMember({
        stub: this.props.project.stub,
        user: selection
      })
    }
  },
  render() {
    return (
      <div className="layout-row flex" style={PageStyles}>
        <div className="flex-50">
        <h3>Team Members</h3>
        {this.props.project.team.map((item)=><div style={{marginBottom: '15px'}}><TeamMember item={item}/></div>)}
        <br />
        <br />
        <UserSearch select={this.selectFn} />
        <br />
          <h3>Project Permissions</h3>
          <ProjectPermissionsRadio model={this.props.projectSettings} />
        </div>
     </div>
    );
  }
});

//        <Toggle />
