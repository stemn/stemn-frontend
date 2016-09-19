// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions

// Component Core
import React from 'react';
import moment from 'moment';
import { actions } from 'react-redux-form';

// Styles
import classNames from 'classnames';
import classes from './TaskMentionModal.css';

// Sub Components
import Checkbox from 'app/renderer/main/components/Input/Checkbox/Checkbox';
import Button from 'app/renderer/main/components/Buttons/Button/Button';
import TaskRow from './TaskRow/TaskRow.jsx';
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
    this.props.modalConfirm({
      payload: {
        mentions: [{
          entityId: '57c526c3e7c624f857828695',
          display: 'Task 1',
          mentionType: 'task',
          mentionId: '57c526c3e7c624f857828691'
        },{
          entityId: '57c526c3e7c624f857828693',
          display: 'Task 2',
          mentionType: 'task',
          mentionId: '57c526c3e7c624f857828692'
        }]
      }
    });
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
          {Object.keys(tasks).map((taskId) => <TaskRow key={taskId} taskId={taskId}/>)}
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
    tasks: tasks.data
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
