// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as TasksActions from '../Tasks.actions.js';
import * as ProjectsActions from 'stemn-shared/misc/Projects/Projects.actions.js';
import * as ModalActions from 'stemn-shared/misc/Modal/Modal.actions.js';

// Component Core
import React from 'react';
import moment from 'moment';
import { actions } from 'react-redux-form';
import { has }     from 'lodash';

// Styles
import classNames from 'classnames';
import classes from './TaskDisplayModal.css';

// Sub Components
import Checkbox from 'stemn-shared/misc/Input/Checkbox/Checkbox';
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx';
import LabelSelect from './LabelSelect/LabelSelect.jsx';
import UserSelect from 'stemn-shared/misc/Users/UserSelect/UserSelect.jsx';
import TaskTimeline from '../TaskTimeline/TaskTimeline.jsx';
import DatePicker from 'stemn-shared/misc/Calendar/DatePicker/DatePicker.jsx';
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea';
import CommentNew from 'stemn-shared/misc/Comments/Comment/CommentNew.jsx';
import Popover from 'stemn-shared/misc/Popover';
import PopoverMenuList from 'stemn-shared/misc/PopoverMenu/PopoverMenuList';
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdMoreHoriz from 'react-icons/md/more-horiz';
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';


///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({

  // Mounting
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  onMount (nextProps, prevProps) {
    console.log(nextProps);
    // If we don't yet have the task (and it is not loading)
    if(!nextProps.task || !nextProps.task.data && !nextProps.task.loading){
      nextProps.TasksActions.getTask({taskId: nextProps.taskId});
    }    
    // If we don't yet have the board (and it is not loading) and we have the task (so we know what project we need)
    if(has(nextProps, 'task.data.board') && 
      (!nextProps.board || !nextProps.board.data && !nextProps.board.loading)){
      nextProps.TasksActions.getBoard({boardId: nextProps.task.data.board});
    }    
    // If we don't yet have the project (and it is not loading) and we have the task (so we know what project we need)
    if(has(nextProps, 'task.data.project._id') && 
      (!nextProps.project || !nextProps.project.data && !nextProps.project.loading)){
      nextProps.projectsActions.getProject({projectId: nextProps.task.data.project._id});
    }
  },

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
  deleteTask(){
    this.props.TasksActions.deleteTask({
      taskId: this.props.task.data._id,
      boardId: this.props.task.data.board,
    });
    this.props.modalConfirm();
  },
  render() {
    const { taskId, task, board, entityModel, project, modalCancel } = this.props;

    const getMain = () => {
      const menu = [{
        label: 'Refresh',
        onClick: () => {}
      },{
        label: 'Delete Task',
        onClick: this.deleteTask
      }];
      return (
        <div className="layout-column flex">
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
                  onChange={this.updateTask}
                  value={task.data.name}
                  className="input-plain"
                  type="text"
                  placeholder="Task description" />
              </div>
              <Popover preferPlace="below">
                <SimpleIconButton>
                  <MdMoreHoriz size="20px"/>
                </SimpleIconButton>
                <PopoverMenuList menu={menu}/>
              </Popover>
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
      )
    }
    
    const getSidebar = () => {
      return (
        <div className="layout-column flex">
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
                onChange={this.updateTask}
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
                onChange={this.updateTask}
                value={task.data.due}
              />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className={classNames(classes.taskDisplayModal, 'layout-column')}>
        <div className="layout-row flex">
          <div className="flex-70 layout-column rel-box">
            <LoadingOverlay show={!task || !task.data || !project || !project.data}/>
            {task && task.data && project && project.data ? getMain() : null}
          </div>
          <div className={classes.sidebar + ' flex'}>
            {task && task.data && project && project.data ? getSidebar() : null}
          </div>
        </div>
      </div>
    )
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ tasks, projects }, {taskId}) {
  const task          = tasks.data[taskId];
  const board         = has(task,  'data.board')   ? tasks.boards[task.data.board]     : {};
  const project       = has(board, 'data.project') ? projects.data[board.data.project] : {};
  const boardModel    = has(task,  'data.board')   ? `tasks.boards.${task.data.board}` : '';
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
    projectsActions: bindActionCreators(ProjectsActions, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
