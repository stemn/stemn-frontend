// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ProjectsActions from 'app/shared/actions/projects.js';

// Component Core
import React from 'react';
import moment from 'moment';
import { get } from 'lodash';
import { actions } from 'react-redux-form';

// Styles
import classNames from 'classnames';

// Sub Components
import TaskLabelsEdit from '../TaskLabelsEdit/TaskLabelsEdit.jsx'
import Button from 'app/renderer/main/components/Buttons/Button/Button'

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////


export const Component = React.createClass({
  submit() {
    this.props.dispatch(actions.change(`${this.props.projectModel}.data.labels`, value));
//    this.props.ProjectsActions.saveProject({project: this.props.project.data})
  },
  render() {
    const { model, value, modalCancel, modalConfirm, modalHide } = this.props;
    return (
      <div style={{width: '500px'}}>
        <div className="modal-title">Edit Labels</div>
        <div className="modal-body">
          <TaskLabelsEdit model={model} value={value} />
        </div>
        <div className="modal-footer layout-row layout-align-end">
          <Button style={{marginRight: '10px'}} onClick={() => {modalCancel(); modalHide()}}>Cancel</Button>
          <Button className="primary" onClick={() => {modalConfirm(); modalHide()}}>Update Labels</Button>
        </div>
      </div>
    )
  }
});

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps(state, { model }) {
  return {
    value: get(state, model) // Get the value from the model
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ProjectsActions: bindActionCreators(ProjectsActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
