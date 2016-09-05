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
import classes from './ProjectSettingsPage.css'

// Sub Components
import { Field, actions } from 'react-redux-form';

import Tabs from 'app/renderer/main/components/Tabs/Tabs'
import Toggle from 'app/renderer/main/components/Input/Toggle/Toggle'
import UserSearch from 'app/renderer/main/modules/UserSearch/UserSearch.container.js'
import TeamMember from 'app/renderer/main/components/Project/TeamMember/TeamMember.jsx'
import ProjectPermissionsRadio from 'app/renderer/main/components/Project/ProjectPermissionsRadio/ProjectPermissionsRadio.jsx'
import ProjectLinkRemote from 'app/renderer/main/components/Project/ProjectLinkRemote/ProjectLinkRemote.jsx'
import FileSelectInput from 'app/renderer/main/modules/FileSelectInput/FileSelectInput.jsx'
import Button from 'app/renderer/main/components/Buttons/Button/Button'


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({
  selectFn(selection){
    if(!this.props.project.team.find((item)=>item._id == selection._id)){
      this.props.ProjectsActions.addTeamMember({
        projectId: this.props.project._id,
        user: selection
      })
    }
  },
  changePermissionsFn({role, userId}){
    this.props.ProjectsActions.changeUserPermissions({
      role,
      userId,
      projectId: this.props.project._id,
    })
  },
  removeTeamMemberFn({userId}){
    this.props.ProjectsActions.removeTeamMember({
      userId,
      projectId: this.props.project._id,
    })
  },
  linkRemote(){
    this.props.ProjectsActions.linkRemote({
      projectId: this.props.project._id,
      provider: 'drive',
      path_display: '',
      path: '',
      id: ''
    })
  },
  render() {
    const { entityModel, project, ProjectsActions, dispatch } = this.props;
    const PageStyles = {
      padding: '20px 40px'
    }

    return (
      <div className={classes.container+' layout-row layout-align-center flex scroll-box'}>
        <div style={{maxWidth: '600px'}}>

           <div className={classes.panel}>
            <h3>General Settings</h3>
            <p>Add your project name and blurb.</p>
            <Field model={`${entityModel}.name`}>
              <input className="dr-input" type="text" placeholder="Project Name"/>
            </Field>
            <br />
            <Field model={`${entityModel}.summary`}>
              <input className="dr-input" type="text" placeholder="Project Summary"/>
            </Field>
            <br />
            <div className="layout-row layout-align-end">
              <Button className="primary" onClick={()=>this.linkRemote()}>Update Project</Button>
            </div>
          </div>

          <div className={classes.panel}>
            <h3>File Store Settings</h3>
            <p>Connect your Dropbox or Drive to sync all files and changes. Only one Google Drive or one Dropbox can be connected to a project.</p>
            <ProjectLinkRemote model={`${entityModel}.remote.provider`} value={project.remote.provider}/>
            <br />
            { project.remote.provider == 'dropbox' || project.remote.provider == 'drive'
            ? <div>
                <FileSelectInput project={project} />
              </div>
            : ''}
            <br />
            <div className="layout-row layout-align-end">
              <Button className="primary" onClick={()=>this.linkRemote()}>Update File Store</Button>
            </div>
          </div>

          <div className={classes.panel}>
            <h3>Team Members</h3>
            <p>Invite your collaborators. If you've connected your project with Dropbox or Drive, your team members will be invited to edit.</p>
            <UserSearch select={this.selectFn} />
            <br />
            {project.team.map((item)=><div style={{marginBottom: '15px'}}><TeamMember item={item} changePermissionsFn={this.changePermissionsFn} removeTeamMemberFn={this.removeTeamMemberFn}/></div>)}
            <br />
            <div className="layout-row layout-align-end">
              <Button className="primary">Update team</Button>
            </div>
          </div>

          <div className={classes.panel}>
            <h3>Project Type</h3>
            <p>Is this a public or private project? Change your project to public to open-source your work.</p>
            <ProjectPermissionsRadio model={`${entityModel}.permissions.projectType`} />
          </div>

          <div className={classes.panel}>
            <h3>Delete Project</h3>
            <p>Once you delete a project, there is no going back. Please be certain.</p>
            <Button className="warn" onClick={()=>ProjectsActions.deleteProject({projectId: project._id})}>Delete Project</Button>
          </div>

        </div>
     </div>
    );
  }
});

//          <div className={classes.panel}>
//            <h3>General Settings</h3>
//            <Field model={`${entityModel}.name`}>
//              <input className="dr-input" type="text" placeholder="Project Name"/>
//            </Field>
//            <br />

//            <div className="layout-row layout-align-end">
//              <Button className="primary">Update team</Button>
//            </div>
//          </div>


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
    dispatch,
    ProjectActions: bindActionCreators(ProjectActions, dispatch),
    ProjectsActions: bindActionCreators(ProjectsActions, dispatch),
    ProjectSettingsActions: bindActionCreators(ProjectSettingsActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
