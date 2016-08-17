import React from 'react';

// Components
import Tabs from 'app/renderer/main/components/Tabs/Tabs'
import Toggle from 'app/renderer/main/components/Input/Toggle/Toggle'
import UserSearch from 'app/renderer/main/modules/UserSearch/UserSearch.container.js'
import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx'

import ProjectPermissionsRadio from 'app/renderer/main/components/Project/ProjectPermissionsRadio/ProjectPermissionsRadio.jsx'

// Styles
import classNames from 'classnames';


const PageStyles = {
  padding: '20px 40px'
}

export default class extends React.Component{
  componentWillMount() {
  }
  componentWillReceiveProps(nextProps) {

  }
  selectFn(selection){
    console.log(selection);
  }
  render() {
    const team = this.props.project.team.map((item)=>
      <div className="layout-row layout-align-start-center">
        <UserAvatar picture={item.picture} size="50px"/>
        <div className="flex">
          <div>{item.name}</div>
          <div>Owner: Can do everything</div>
        </div>
      </div>
    )
    return (
      <div className="layout-column flex rel-box" style={PageStyles}>
        <h3>Team Members</h3>
        {team}
        <br />
        <br />
        <UserSearch select={this.selectFn} />
        <br />
        <h3>Project Permissions</h3>
        <ProjectPermissionsRadio style={{width: '300px'}} model={this.props.projectSettings} />
     </div>
    );
  }
};

//        <Toggle />
