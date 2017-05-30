// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as TasksActions from '../../Tasks.actions.js';
import * as ModalActions from 'stemn-shared/misc/Modal/Modal.actions.js';

// Component Core
import React from 'react';
import { has } from 'lodash';

// Styles
import classNames from 'classnames';
import classes from './TaskListItem.css';
import loadingClasses from 'stemn-shared/misc/Loading/LoadingPlaceholders/LoadingPlaceholders.css'

// Sub Components
import Checkbox from 'stemn-shared/misc/Input/Checkbox/Checkbox';
import Input from 'stemn-shared/misc/Input/Input/Input';
import UserAvatars from 'stemn-shared/misc/Avatar/UserAvatars/UserAvatars.jsx'
import SimpleIconButton from 'stemn-shared/misc/Buttons/SimpleIconButton/SimpleIconButton.jsx'
import MdOpenInNew from 'react-icons/md/open-in-new';
import TaskLabelDots from 'stemn-shared/misc/Tasks/TaskLabelDots/TaskLabelDots.jsx'
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea';
import UserSelect from 'stemn-shared/misc/Users/UserSelect/UserSelect.jsx';
import DueDate from 'stemn-shared/misc/Tasks/TaskDueDate'


export const TaskListItem = React.createClass({
  // Mounting
  onMount(nextProps, prevProps) {
    if(!prevProps || prevProps.item != nextProps.item){
      if(!nextProps.task || !nextProps.task.data){
        nextProps.TasksActions.getTask({
          taskId: nextProps.item
        })
      }
    }
  },
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},

  updateTask(){
    setTimeout(()=>this.props.TasksActions.updateTask({task: this.props.task.data}), 1);
  },
  toggleComplete({model, value}){
    this.props.TasksActions.toggleComplete({
      taskId: this.props.task.data._id,
      model,
      value
    })
    this.updateTask();
  },
  showModal(){
    this.props.ModalActions.showModal({
      modalType: 'TASK_DISPLAY',
      limit: 1,
      modalProps: {
        taskId: this.props.item
      }
    })
  },
  render() {
    const { task, entityModel, draggable, layout, board, project } = this.props;
    if(!task || !task.data){
      if(layout == 'list'){
        return (
          <div className={loadingClasses.loading}>
            <div className={classNames(classes.listItem, 'layout-row flex layout-align-start-center')}>
              <Checkbox
                className="text-primary"
                circle={true} />
              <div className="flex text-ellipsis" style={{lineHeight: '1.4em'}}>
                Some placeholder hidden with blokk font
              </div>
              <div className={classes.listUser + ' layout-row layout-align-start-center text-ellipsis'}>
                <UserAvatars users={[{}]} limit={3}/>
              </div>
              <div className={classes.listDate}></div>
              <div className={classes.listActions + ' text-ellipsis layout-row layout-align-end-center'}></div>
            </div>
          </div>
        )
      }
      else{
        return (
          <div className={classNames(classes.card, loadingClasses.loading, 'layout-column flex')}>
            <div className={classes.cardBody + ' layout-row'}>
              <Checkbox className="text-primary" circle={true}/>
              <div className={classes.cardText + ' flex'}>Some placeholder hidden with blokk font</div>
              <UserAvatars users={[{}]}/>
            </div>
            <div className={classes.cardFooter + ' layout-row layout-align-start-center'}></div>
          </div>
        );
      }
    }
    if(layout == 'list'){
      return (
        <div className={classNames({[classes.isDragging]: task.isDragging && draggable})}>
          <div className={classNames(classes.listItem, 'layout-row flex layout-align-start-center')}>
            <Checkbox
              title={task.data.complete ? 'Mark as incomplete' : 'Mark as complete'}
              model={`${entityModel}.data.complete`}
              value={task.data.complete}
              changeAction={this.toggleComplete}
              className="text-primary"
              circle={true} />
            <div className="flex text-ellipsis" style={{lineHeight: '1.4em'}}>
              <Input
                model={`${entityModel}.name`}
                value={task.data.name}
                onChange={this.updateTask}
                className="input-plain"
                type="text"
                placeholder="Task description" 
              />
            </div>
            { task.data.labels && task.data.labels.length > 0 && board && board.data && board.data.labels ?
              <TaskLabelDots labels={task.data.labels} labelInfo={board.data.labels} tag={true} />
              : null
            }
            <div className={classes.listUser + ' layout-row layout-align-start-center text-ellipsis'}>
              <UserAvatars users={task.data.users} limit={3}/>
            </div>
            <div className={classes.listDate}>
              { !task.data.complete ? <DueDate due={task.data.due}/> : null }
            </div>
            <div className={classes.listActions + ' text-ellipsis layout-row layout-align-end-center'}>
              <SimpleIconButton onClick={this.showModal} title="Show Task">
                <MdOpenInNew size="20px"/>
              </SimpleIconButton>
            </div>
          </div>
        </div>
      )
    }
    else{
      return (
        <div className={classNames(classes.card, 'layout-column flex')}>
          <div className={classes.cardBody + ' layout-row'}>
            <Checkbox
              title={task.data.complete ? 'Mark as incomplete' : 'Mark as complete'}
              model={`${entityModel}.data.complete`}
              value={task.data.complete}
              changeAction={this.toggleComplete}
              className="text-primary"
              circle={true}
            />
            <div className={classes.cardText + ' flex'}>
              <Textarea
                onChange={this.updateTask}
                model={`${entityModel}.data.name`}
                value={task.data.name}
                className="input-plain"
                type="text"
                placeholder="Task description"
              />
            </div>
            <UserAvatars users={task.data.users} limit={2}/>
          </div>
          <div className={classes.cardFooter + ' layout-row layout-align-start-center'} onClick={this.showModal}>
            <div className="flex layout-row layout-align-start-center">
              { task.data.labels && task.data.labels.length > 0 && board && board.data && board.data.labels ?
              <TaskLabelDots labels={task.data.labels} labelInfo={board.data.labels} />
                : null
              }
            </div>
            <div style={{padding: '0 5px'}}>{ !task.data.complete ? <DueDate due={task.data.due}/> : null }</div>
            <SimpleIconButton title="Show Task">
              <MdOpenInNew size="20px"/>
            </SimpleIconButton>
          </div>
        </div>
      );
    }
  }
});




///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ tasks, projects }, {item}) {
  const task          = tasks.data[item];
  const board         = has(task, 'data.board') ? tasks.boards[task.data.board] : {};
  const boardModel    = has(task, 'data.board') ? `tasks.boards.${task.data.board}` : '';
  const project       = has(board, 'data.project') ? projects.data[board.data.project] : {};

  return {
    task,
    entityModel: `tasks.data.${item}`,
    board,
    boardModel,
    project
  };
}

function mapDispatchToProps(dispatch) {
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch),
    ModalActions : bindActionCreators(ModalActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskListItem);
