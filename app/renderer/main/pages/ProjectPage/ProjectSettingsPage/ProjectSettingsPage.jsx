// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ProjectActions from 'app/shared/actions/project.js';
import * as ProjectsActions from 'app/shared/actions/projects.js';
import * as ProjectSettingsActions from 'app/shared/actions/projectSettings.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Sub Components
import { Field } from 'react-redux-form';
import Tabs from 'app/renderer/main/components/Tabs/Tabs'
import Toggle from 'app/renderer/main/components/Input/Toggle/Toggle'
import UserSearch from 'app/renderer/main/modules/UserSearch/UserSearch.container.js'
import TeamMember from 'app/renderer/main/components/Project/TeamMember/TeamMember.jsx'
import ProjectPermissionsRadio from 'app/renderer/main/components/Project/ProjectPermissionsRadio/ProjectPermissionsRadio.jsx'
import ProjectLinkRemote from 'app/renderer/main/components/Project/ProjectLinkRemote/ProjectLinkRemote.jsx'
import FileSelect from 'app/renderer/main/modules/FileSelect/FileSelect.jsx'

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  selectFn(selection){
    if(!this.props.project.team.find((item)=>item._id == selection._id)){
      this.props.ProjectsActions.addTeamMember({
        stub: this.props.project.stub,
        user: selection
      })
    }
  },
  render() {
    const { entityModel, project } = this.props;
    const PageStyles = {
      padding: '20px 40px'
    }

    return (
      <div className="layout-row flex" style={PageStyles}>
        <div className="flex-50">
          <FileSelect projectId={project._id} path="" storeKey="ProjectSettingsPage" options={{allowFolder: true, foldersOnly: true}} />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />

          <ProjectLinkRemote model={`${entityModel}.remote`} />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <h3>Team Members</h3>
          {project.team.map((item)=><div style={{marginBottom: '15px'}}><TeamMember item={item}/></div>)}
          <br />
          <UserSearch select={this.selectFn} />
          <br />
          <Field model={`${entityModel}.name`}>
            <input className="dr-input" type="text" placeholder="Project Name"/>
          </Field>
          <br />
          <Field model={`${entityModel}.summary`}>
            <input className="dr-input" type="text" placeholder="Project Summary"/>
          </Field>
          <br />
          <br />
          <h3>Project Permissions</h3>
          <ProjectPermissionsRadio model={`${entityModel}.permissions.projectType`} />
        </div>
     </div>
    );
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({projects, projectSettings}, otherProps) {
  return {
    project: projects[otherProps.params.stub],
    projectSettings: projectSettings,
    entityModel: `projects.${otherProps.params.stub}`
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ProjectActions: bindActionCreators(ProjectActions, dispatch),
    ProjectsActions: bindActionCreators(ProjectsActions, dispatch),
    ProjectSettingsActions: bindActionCreators(ProjectSettingsActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
