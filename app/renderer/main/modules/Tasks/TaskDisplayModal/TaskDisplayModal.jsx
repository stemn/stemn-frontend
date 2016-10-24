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
import { has }     from 'lodash';

// Styles
import classNames from 'classnames';
import classes from './TaskDisplayModal.css';

// Sub Components
import Checkbox from 'app/renderer/main/components/Input/Checkbox/Checkbox';
import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx';
import LabelSelect from './LabelSelect/LabelSelect.jsx';
import UserSelect from 'app/renderer/main/components/Users/UserSelect/UserSelect.jsx';
import TaskTimeline from '../TaskTimeline/TaskTimeline.jsx';
import DatePicker from 'app/renderer/main/modules/Calendar/DatePicker/DatePicker.jsx';
import Textarea from 'app/renderer/main/components/Input/Textarea/Textarea';
import CommentNew from 'app/renderer/main/modules/Comments/Comment/CommentNew.jsx';


///////////////////////////////// COMPONENT /////////////////////////////////

const onMount = (nextProps, prevProps) => {
  if(nextProps.task){
//    if(!prevProps || nextProps.task.project._id !== prevProps.task.project._id){
////      nextProps.ProjectsActions.getProject({projectId: nextProps.task.project._id});
//    }
  }
}

export const Component = React.createClass({

  // Mounting
  componentWillMount() { onMount(this.props) },
  componentWillReceiveProps(nextProps) { onMount(nextProps, this.props)},

  showLabelEditModal(){
    this.props.TasksActions.showLabelEditModal({
      boardId: this.props.task.data.board
    })
  },
  toggleComplete(model, value){
    this.props.TasksActions.toggleComplete({
      taskId: this.props.task.data._id,
      model,
      value
    })
    this.updateTask();
  },
  updateTask(){
    setTimeout(()=>this.props.TasksActions.updateTask({task: this.props.task.data}), 1);
  },
  render() {
    const { taskId, task, board, entityModel, project, modalCancel, modalHide } = this.props;

    if(!task){
      return <div>Task Loading</div>
    }

    return (
      <div className={classNames(classes.taskDisplayModal, 'layout-column')}>
        <div className="layout-row flex">
          <div className="flex-70 layout-column">
            <div className={classes.header}>
              <div className="layout-row layout-align-start-center">
                <Checkbox
                  model={`${entityModel}.data.complete`}
                  value={task.data.complete}
                  changeAction={this.toggleComplete}
                  className="text-primary"
                  circle={true} />
                <div className="text-title-4 flex" style={{marginLeft: '15px'}}>
                  <Textarea
                    model={`${entityModel}.data.name`}
                    value={task.data.name}
                    className="input-plain"
                    type="text"
                    placeholder="Task description" />
                </div>
              </div>
              <div className="text-grey-3" style={{padding: '15px 0 20px'}}>
                Created {moment(task.data.created).fromNow()} <b className="text-interpunct"></b> By <a className="link-primary">{task.data.owner.name}</a>
              </div>
            </div>
            <div className={classes.timeline + ' flex scroll-box'}>
              <TaskTimeline taskId={taskId} board={board} />
            </div>
            <div className={classes.newComment}>
              <CommentNew taskId={taskId} />
            </div>
          </div>
          <div className={classes.sidebar + ' flex'}>
            <div className={classes.well}>
              <div className={classes.settingTitle + ' text-mini-caps layout-row layout-align-start-center'}>
                <div className="flex">Labels</div>
                <a className={classes.add} title="Edit labels" onClick={this.showLabelEditModal}>+</a>
              </div>
              <div style={{maxHeight: '200px', overflowY: 'auto'}}>
                {board && board.data && board.data.labels
                  ?
                  <LabelSelect
                    model={`${entityModel}.data.labels`}
                    value={task.data.labels}
                    onChange={this.updateTask}
                    labelInfo={board.data.labels}
                  />
                  : ''
                }
              </div>
            </div>
            <div className={classes.well}>
              <div className={classes.settingTitle + ' text-mini-caps layout-row layout-align-start-center'}>
                <div className="flex">Asignees</div>
              </div>
              <div style={{padding: '15px'}}>
                <UserSelect
                  model={`${entityModel}.data.users`}
                  value={task.data.users}
                  users={project.data.team}
                />
              </div>
            </div>
            <div className={classes.well}>
              <div className={classes.settingTitle + ' text-mini-caps layout-row layout-align-start-center'}>
                Due Date
              </div>
              <div style={{padding: '15px'}}>
                <DatePicker
                  model={`${entityModel}.data.due`}
                  value={task.data.due}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ tasks, projects }, {taskId}) {
  const task          = tasks.data[taskId];
  const board         = has(task, 'data.board') ? tasks.boards[task.data.board] : {};
  const boardModel    = has(task, 'data.board') ? `tasks.boards.${task.data.board}` : '';
  const project       = has(board, 'data.project') ? projects.data[board.data.project] : {};
  return {
    task,
    entityModel: `tasks.data.${taskId}`,
    board,
    boardModel,
    project
  };
}

function mapDispatchToProps(dispatch) {
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch),
    ModalActions: bindActionCreators(ModalActions, dispatch),
    ProjectsActions: bindActionCreators(ProjectsActions, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
