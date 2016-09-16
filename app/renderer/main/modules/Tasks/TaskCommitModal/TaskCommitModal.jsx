// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as TasksActions from '../Tasks.actions.js';
import * as ProjectsActions from 'app/shared/actions/projects.js';
import * as ModalActions from 'app/renderer/main/modules/Modal/Modal.actions.js';

// Component Core
import React from 'react';
import moment from 'moment';
import { actions } from 'react-redux-form';

// Styles
import classNames from 'classnames';
import classes from './TaskCommitModal.css';

// Sub Components
import Checkbox from 'app/renderer/main/components/Input/Checkbox/Checkbox';
import Button from 'app/renderer/main/components/Buttons/Button/Button';
import TaskCommitRow from './TaskCommitRow/TaskCommitRow.jsx';
import { MdSearch } from 'react-icons/lib/md';

///////////////////////////////// COMPONENT /////////////////////////////////

const onMount = (nextProps, prevProps) => {
  if(nextProps.task){
    if(!prevProps || nextProps.task.project._id !== prevProps.task.project._id){
    }
  }
}

export const Component = React.createClass({

  // Mounting
  componentWillMount() { onMount(this.props) },
  componentWillReceiveProps(nextProps) { onMount(nextProps, this.props)},

  submit(){
    this.props.modalConfirm();
    this.props.modalHide();
  },
  cancel(){
    this.props.modalCancel();
    this.props.modalHide();
  },

  render() {
    const { tasks } = this.props;
    if(!tasks){
      return <div>Loading</div>
    }
    return (
      <div className={classes.modal + ' layout-column'}>
        <div className="modal-title">
          Select tasks
        </div>
        <div className={classes.header + ' layout-row layout-align-start-center'}>
          <div className="flex">Task Title</div>
          <div className={classes.search}>
            <input className="dr-input" placeholder="Search tasks"/>
            <MdSearch size="20"/>
          </div>
        </div>
        <div className="flex scroll-box">
          {Object.keys(tasks).map((taskId) => <TaskCommitRow key={taskId} taskId={taskId}/>)}
        </div>
        <div className="modal-footer layout-row layout-align-end">
          <Button style={{marginRight: '10px'}} onClick={this.cancel}>Cancel</Button>
          <Button className="primary" onClick={this.submit}>Add Tasks</Button>
        </div>
      </div>
    )
  }
});




/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({tasks}, {projectId}) {
  return {
//    tasks: tasks.projects[projectId]
    tasks: tasks.data
  };
}

function mapDispatchToProps(dispatch) {
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch),
    ModalActions: bindActionCreators(ModalActions, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
