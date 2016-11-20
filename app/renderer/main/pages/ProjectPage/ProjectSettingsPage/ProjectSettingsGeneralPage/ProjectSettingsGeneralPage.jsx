// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ProjectsActions from 'app/shared/actions/projects.js';
import * as ModalActions from 'app/renderer/main/modules/Modal/Modal.actions.js';

// Component Core
import React from 'react';
import { has } from 'lodash';
// Styles
import classNames from 'classnames';
import classes from '../ProjectSettingsPage.css'

// Sub Components
import { actions } from 'react-redux-form';

import Tabs from 'app/renderer/main/components/Tabs/Tabs'
import Toggle from 'app/renderer/main/components/Input/Toggle/Toggle'
import UserSearch from 'app/renderer/main/modules/UserSearch/UserSearch.container.js'
import TeamMember from 'app/renderer/main/components/Project/TeamMember/TeamMember.jsx'
//import ProjectPermissionsRadio from 'app/renderer/main/components/Project/ProjectPermissionsRadio/ProjectPermissionsRadio.jsx'
import ProjectLinkRemote from 'app/renderer/main/components/Project/ProjectLinkRemote/ProjectLinkRemote.jsx'
import FileSelectInput from 'app/renderer/main/modules/FileSelectInput/FileSelectInput.jsx'
import ProgressButton from 'app/renderer/main/components/Buttons/ProgressButton/ProgressButton'
import TaskLabelsEdit from 'app/renderer/main/modules/Tasks/TaskLabelsEdit/TaskLabelsEdit.jsx'
import NavPill from 'app/renderer/main/components/Buttons/NavPill/NavPill'
import Input from 'app/renderer/main/components/Input/Input/Input'

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
  linkRemote(){
    const { project } = this.props;
    // This is not wrapped in dispach!
    if(!project.formModels.fileStore.remote.provider){
      return {
        type: 'ALIASED',
        aliased: true,
        payload: {
          functionAlias: 'ProjectsActions.unlinkRemote',
          functionInputs: {
            projectId: project.data._id,
            prevProvider: project.data.remote.provider
          }
        }
      }
    }
    else{
      return {
        type: 'ALIASED',
        aliased: true,
        payload: {
          functionAlias: 'ProjectsActions.linkRemote',
          functionInputs: {
            projectId: project.data._id,
            provider: project.formModels.fileStore.remote.provider,
            path: project.formModels.fileStore.remote.root.path,
            id: project.formModels.fileStore.remote.root.fileId,
            prevProvider: project.data.remote.provider
          }
        }
      }
    }
  },
  confirmLinkRemote(){
    // If the store is connected - we confirm the change
    if(this.props.project.data.remote.connected){
      this.props.ModalActions.showConfirm({
        message: 'Changing your file store settings will delete your entire commit and change history. Are you sure you want to do this? Consider creating a new project.',
        modalConfirm: this.linkRemote()
      })
    }
    // Else change straight away.
    else{
      this.props.dispatch(this.linkRemote())
    }
  },
  saveProject(){
    this.props.ProjectsActions.saveProject({
      project: this.props.project.data
    })
  },
  render() {
    const { entityModel, project, ProjectsActions, dispatch } = this.props;
    return (
      <div>
        <div className={classes.panel}>
         <h3>General Settings</h3>
         <p>Add your project name and blurb.</p>
         <Input
           model={`${entityModel}.data.name`}
           value={project.data.name}
           className="dr-input"
           type="text"
           placeholder="Project Name"
         />
         <br />
         <Input
           model={`${entityModel}.data.summary`}
           value={project.data.summary}
           className="dr-input"
           type="text"
           placeholder="Project Summary"
         />
         <br />
         <div className="layout-row layout-align-end">
           <ProgressButton
           className="primary"
           onClick={()=>this.saveProject()}
           loading={project.savePending}
           >Update Project</ProgressButton>
         </div>
       </div>
       <div className={classes.panel}>
         <h3>Cloud Storage Folder</h3>
         <p>Select your project's cloud storage folder. STEMN will track all changes to files in this folder.</p>
         { has(project, 'formModels.fileStore.remote')
         ? <ProjectLinkRemote model={`${entityModel}.formModels.fileStore.remote.provider`} value={project.formModels.fileStore.remote.provider}/>
         : null }
         <br />
         { has(project, 'formModels.fileStore.remote.provider') && (project.formModels.fileStore.remote.provider == 'dropbox' || project.formModels.fileStore.remote.provider == 'drive')
         ? <div>
             <FileSelectInput
               projectId={project.data._id}
               provider={project.formModels.fileStore.remote.provider}
               model={`${entityModel}.formModels.fileStore.remote.root`}
               value={project.formModels.fileStore.remote.root}
             />
           </div>
         : ''}
         <br />
         <div className="layout-row layout-align-end">
           <ProgressButton
           className="primary"
           onClick={()=>this.confirmLinkRemote()}
           loading={project.linkPending}
           error={project.linkRejected}
           >Update Folder</ProgressButton>
         </div>
       </div>



       <div className={classes.panel}>
         <h3>Delete Project</h3>
         <p>Once you delete a project, there is no going back. Please be certain.</p>
         <div className="layout-row layout-align-end">
            <ProgressButton className="warn"
              onClick={()=>ProjectsActions.confirmDeleteProject({projectId: project.data._id})}>
              Delete Project
            </ProgressButton>
         </div>
       </div>
      </div>
    );
  }
});


//       <div className={classes.panel}>
//         <h3>Project Type</h3>
//         <p>Is this a public or private project? Change your project to public to open-source your work.</p>
//         <ProjectPermissionsRadio model={`${entityModel}.data.permissions.projectType`} />
//       </div>

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({projects}, otherProps) {
  return {
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
