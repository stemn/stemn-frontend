// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ProjectsActions from 'app/shared/actions/projects.js';

// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from '../ProjectSettingsPage.css'

// Sub Components
import { Field, actions } from 'react-redux-form';

import Button from 'app/renderer/main/components/Buttons/Button/Button'
import TaskLabelsEdit from 'app/renderer/main/modules/Tasks/TaskLabelsEdit/TaskLabelsEdit.jsx'

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const onMount = (nextProps, prevProps) => {
  if(nextProps.project && nextProps.project.data){
    if(!prevProps || nextProps.project.data._id !== prevProps.project.data._id){
      // Init the TaskSettings object
      nextProps.dispatch(actions.load(`${nextProps.entityModel}.formModels.TaskSettings.labels`, nextProps.project.data.labels))
    }
  }
}

export const Component = React.createClass({

  // Mounting
  componentWillMount() { onMount(this.props) },
  componentWillReceiveProps(nextProps) { onMount(nextProps, this.props)},

  submit(){
    // Merge props back to the main project data
    this.props.dispatch(actions.change(`${this.props.entityModel}.data.labels`, this.props.project.formModels.TaskSettings.labels));
    // Save the project
    this.props.ProjectsActions.saveProject({
      project: this.props.project.data
    })
  },

  render() {
    const { entityModel, project, ProjectsActions, dispatch } = this.props;

    return (
      <div className={classes.panel}>
        <h3>Task Label Settings</h3>
        <p>Labels are used to classify tasks. If you delete a label, it will be removed from all existing tasks.</p>
        <TaskLabelsEdit model={`${entityModel}.formModels.TaskSettings.labels`} value={project.formModels.TaskSettings.labels} />
        <br />
        <div className="layout-row">
          <div className="flex"></div>
          <Button className="primary" onClick={this.submit}>Save Labels</Button>
        </div>
      </div>
    );
  }
});



/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({projects}, otherProps) {
  return {
    project: projects[otherProps.params.stub],
    entityModel: `projects.${otherProps.params.stub}`
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ProjectsActions: bindActionCreators(ProjectsActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
