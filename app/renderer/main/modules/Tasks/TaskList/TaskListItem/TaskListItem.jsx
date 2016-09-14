// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as TasksActions from '../../Tasks.actions.js';
import * as ModalActions from 'app/renderer/main/modules/Modal/Modal.actions.js';

// Component Core
import React from 'react';
import moment from 'moment';

// Styles
import classNames from 'classnames';
import classes from './TaskListItem.css';

// Sub Components
import Checkbox from 'app/renderer/main/components/Input/Checkbox/Checkbox';
import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx'
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'
import { MdMoreHoriz, MdOpenInNew } from 'react-icons/lib/md';
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import TaskLabelDots from 'app/renderer/main/modules/Tasks/TaskLabelDots/TaskLabelDots.jsx'


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////


export const Component = React.createClass({
  toggleComplete(model, value){
    this.props.TasksActions.toggleComplete({
      taskId: this.props.task._id,
      model,
      value
    })
  },
  showModal(){
    console.log('show');
    this.props.ModalActions.showModal({
      modalType: 'TASK',
      modalProps: {
        item: this.props.task
      }
    })
  },
  render() {
    const { task, entityModel } = this.props;

    if(!task){
      return <div>Task Loading</div>
    }

    return (
      <div className={classNames({[classes.isDragging]: task.isDragging})}>
        <div className={classNames(classes.taskListItem, 'layout-row flex layout-align-start-center')}>
          <Checkbox
            model={`${entityModel}.complete`}
            value={task.complete}
            changeAction={this.toggleComplete}
            className="text-primary" />
          <div className="flex text-ellipsis">{task.title}</div>
          <div className={classes.labels}>
            <TaskLabelDots labels={task.labels} labelInfo={this.context.project.data.labels} tag="true" />
          </div>
          <div className={classes.user + ' layout-row layout-align-start-center text ellipsis'}>
            <UserAvatar
              picture={task.users[0].picture}
              size="25px"/>
            <div style={{marginLeft: '10px'}}>{task.users[0].name}</div>
          </div>
          <div className={classes.date + ' text ellipsis'}>
            {moment(task.due).fromNow()}
          </div>
          <div className={classes.actions + ' text ellipsis layout-row layout-align-end-center'}>
            <SimpleIconButton onClick={this.showModal}>
              <MdOpenInNew size="20px"/>
            </SimpleIconButton>
            <PopoverMenu preferPlace="below">
              <SimpleIconButton>
                <MdMoreHoriz size="20px"/>
              </SimpleIconButton>
              <div className="PopoverMenu">
                <a>View Task</a>
                <a>Delete Task</a>
              </div>
            </PopoverMenu>
          </div>
        </div>
      </div>
    )
  }
});

Component.contextTypes = {
  project: React.PropTypes.object
}


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({ tasks }, {item}) {
  return {
    task: tasks.data[item._id],
    entityModel: `tasks.data[${item._id}]`
  };
}

function mapDispatchToProps(dispatch) {
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch),
    ModalActions : bindActionCreators(ModalActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
