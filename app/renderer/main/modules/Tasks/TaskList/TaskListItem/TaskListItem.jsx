// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as TasksActions from '../../Tasks.actions.js';
import * as ModalActions from 'app/renderer/main/modules/Modal/Modal.actions.js';

// Component Core
import React from 'react';
import moment from 'moment';
import { Field } from 'react-redux-form';

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
import Textarea from 'app/renderer/main/components/Input/Textarea/Textarea';
import UserSelect from 'app/renderer/main/components/Users/UserSelect/UserSelect.jsx';


///////////////////////////////// COMPONENT /////////////////////////////////

export const DueDate = React.createClass({
  svgEl: '',
  render() {
    const { due } = this.props;

    const day = 1000 * 60 * 60 * 24;
    const colorMap = [
      {
        period: 1 * day,
        color : 'red'
      },{
        period: 3 * day,
        color : 'orange'
      }
    ]
    const currentTime = moment().valueOf();
    const dueTime     = moment(due).valueOf();
    const difference  = dueTime - currentTime;
    const currentInfo = colorMap.find(({period, color}) => difference < period);
    const style       = currentInfo ? { color : currentInfo.color } : {color : 'rgba(0, 0, 0, 0.4)' };

    if(due){
      return (
        <div style={style}>Due {moment(due).fromNow()}</div>
      )
    }
    else {
      return null
    }
  }
});


const onMount = (nextProps, prevProps) => {
  if(!prevProps || prevProps.item != nextProps.item){
//    if(!nextProps.task || !nextProps.task.data){
      nextProps.TasksActions.getTask({
        taskId: nextProps.item
      })
//    }
  }
}

export const Component = React.createClass({
  // Mounting
  componentWillMount() { onMount(this.props) },
  componentWillReceiveProps(nextProps) { onMount(nextProps, this.props)},

  updateTask(){
    setTimeout(()=>this.props.TasksActions.updateTask({task: this.props.task.data}), 1);
  },
  toggleComplete(model, value){
    this.props.TasksActions.toggleComplete({
      taskId: this.props.task.data._id,
      model
    })
    this.updateTask();
  },
  deleteTask(){
    this.props.TasksActions.deleteTask({
      taskId: this.props.task.data._id,
      boardId: this.props.task.data.board,
    })
  },
  showModal(){
    this.props.ModalActions.showModal({
      modalType: 'TASK',
      modalProps: {
        taskId: this.props.item
      }
    })
  },
  render() {
    const { task, entityModel, draggable, layout, board } = this.props;
    if(!task || !task.data){
      return <div>Task Loading</div>
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
              <Field model={`${entityModel}.data.name`}>
                <input
                  onChange={this.updateTask}
                  className="input-plain"
                  type="text"
                  placeholder="Task description" />
              </Field>
            </div>
            { task.data.labels && task.data.labels.length > 0 && board && board.data && board.data.labels ?
              <TaskLabelDots labels={task.data.labels} labelInfo={board.data.labels} tag={true} />
              : null
            }
            <div className={classes.listUser + ' layout-row layout-align-start-center text-ellipsis'}>
              {task.data.users ? task.data.users.map( user =>
                <UserAvatar
                  picture={user.picture}
                  size="25px"/>
              ) : null}
            </div>
            <div className={classes.listDate + ' text-ellipsis'}>
              <DueDate due={task.data.due}/>
            </div>
            <div className={classes.listActions + ' text-ellipsis layout-row layout-align-end-center'}>
              <SimpleIconButton onClick={this.showModal}>
                <MdOpenInNew size="20px"/>
              </SimpleIconButton>
              <PopoverMenu preferPlace="below">
                <SimpleIconButton>
                  <MdMoreHoriz size="20px"/>
                </SimpleIconButton>
                <div className="PopoverMenu">
                  <a>View Task</a>
                  <a onClick={this.deleteTask}>Delete Task</a>
                </div>
              </PopoverMenu>
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

            {task.data.users && task.data.users.length > 0
              ? task.data.users.map( user =>
                <UserAvatar
                  key={user._id}
                  picture={user.picture}
                  size="25px"
                />
              )
              : null
            }
          </div>
            <div className={classes.cardFooter + ' layout-row layout-align-start-center'}>
              <div className="flex layout-row layout-align-start-center">
                { task.data.labels && task.data.labels.length > 0 && board && board.data && board.data.labels ?
                <TaskLabelDots labels={task.data.labels} labelInfo={board.data.labels} />
                  : null
                }
              </div>
              <div style={{padding: '0 5px'}}><DueDate due={task.data.due}/></div>
              <SimpleIconButton onClick={this.showModal}>
                <MdOpenInNew size="20px"/>
              </SimpleIconButton>
            </div>
        </div>
      );
    }
  }
});




///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ tasks }, {item}) {
  const task          = tasks.data[item];
  const board         = task && task.data && task.data.board ? tasks.boards[task.data.board] : {};
  const boardModel    = task && task.data && task.data.board ?`tasks.boards.${task.data.board}` : '';
  return {
    task: task,
    entityModel: `tasks.data.${item}`,
    board,
    boardModel
  };
}

function mapDispatchToProps(dispatch) {
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch),
    ModalActions : bindActionCreators(ModalActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
