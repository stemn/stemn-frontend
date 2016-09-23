// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ProjectsActions from 'app/shared/actions/projects.js';
import { actions } from 'react-redux-form';
// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './ProjectNewModal.css';

// Sub Components
import { Field } from 'react-redux-form';
import Button from 'app/renderer/main/components/Buttons/Button/Button';
import ProjectLinkRemote from 'app/renderer/main/components/Project/ProjectLinkRemote/ProjectLinkRemote.jsx'
import FileSelectInput from 'app/renderer/main/modules/FileSelectInput/FileSelectInput.jsx'
import Textarea from 'app/renderer/main/components/Input/Textarea/Textarea';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  createProject(){
    this.props.projectsActions.createProject(this.props.newProject);
    this.props.dispatch(actions.change(this.props.entityModel, {}))
    this.props.modalHide();
  },
  render() {
    const { newProject, entityModel, modalCancel, modalHide } = this.props;
    return (
      <div style={{width: '500px'}}>
        <div className="modal-title">Create New Project</div>
        <div className="modal-body">
          <Field model={`${entityModel}.name`}>
            <input className="dr-input" type="text" placeholder="Project Name"/>
          </Field>
          <Textarea model={`${entityModel}.summary`}
            value={newProject.summary}
            className="dr-input"
            type="text"
            placeholder="Project Summary (Optional)"
            style={{marginTop: '15px', minHeight: '70px'}} />
        </div>
        <div className="modal-footer-no-line layout-row layout-align-end">
          <Button style={{marginRight: '10px'}} onClick={() => {modalCancel(); modalHide()}}>Cancel</Button>
          <Button className="primary" onClick={this.createProject}>Create Project</Button>
        </div>
      </div>
    )
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({projects}) {
  return {
    newProject: projects.newProject,
    entityModel: 'projects.newProject',
  };
}

function mapDispatchToProps(dispatch) {
  return {
    projectsActions: bindActionCreators(ProjectsActions, dispatch),
    dispatch
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Component);
