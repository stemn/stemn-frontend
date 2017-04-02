import React, { Component, PropTypes } from 'react';

import { has } from 'lodash';
import ProjectPermissionsRadio from 'stemn-shared/misc/Project/ProjectPermissionsRadio/ProjectPermissionsRadio.jsx'
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea';
import Input from 'stemn-shared/misc/Input/Input/Input';
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton';

export default class GeneralSettings extends Component {
  static propTypes = {
    entityModel: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    saveProject: PropTypes.func.isRequired,
  }
  saveProject = () => {
    this.props.saveProject({
      project: this.props.project.data
    })
  }
  render() {
    const { entityModel, project, saveProject } = this.props;
    return (
      <div>
         <h3>General Settings</h3>
         <p>Set your project name and blurb.</p>
         <Input
           model={`${entityModel}.data.name`}
           value={project.data.name}
           className="dr-input"
           type="text"
           placeholder="Project Name"
         />
         <br />
         <Textarea
           model={`${entityModel}.data.summary`}
           value={project.data.summary}
           className="dr-input"
           style={{minHeight: '60px'}}
           placeholder="Project Summary"
         />
         <br />
         <ProjectPermissionsRadio 
           model={`${entityModel}.data.permissions.projectType`} 
           value={ 
            has(project, 'data.permissions.projectType') 
            ? project.data.permissions.projectType 
            : '' } 
         />
         <div className="layout-row layout-align-end">
           <ProgressButton
           className="primary"
           onClick={this.saveProject}
           loading={project.savePending}
           >Update Project</ProgressButton>
         </div>
      </div>
    )
  }
}
