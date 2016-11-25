// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as TasksActions from '../../Tasks.actions.js';
import * as ModalActions from 'app/renderer/main/modules/Modal/Modal.actions.js';

// Component Core
import React from 'react';
import moment from 'moment';
import { has } from 'lodash';

// Styles
import classNames from 'classnames';
import classes from './TaskListItem.css';
import loadingClasses from 'app/shared/modules/Loading/LoadingPlaceholders/LoadingPlaceholders.css'

// Sub Components
import Checkbox from 'app/renderer/main/components/Input/Checkbox/Checkbox';
import Input from 'app/renderer/main/components/Input/Input/Input';
import UserAvatars from 'app/renderer/main/components/Avatar/UserAvatars/UserAvatars.jsx'
import SimpleIconButton from 'app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton'
import MdOpenInNew from 'react-icons/md/open-in-new';
import PopoverMenu from 'app/renderer/main/components/PopoverMenu/PopoverMenu';
import TaskLabelDots from 'app/renderer/main/modules/Tasks/TaskLabelDots/TaskLabelDots.jsx'
import Textarea from 'app/renderer/main/components/Input/Textarea/Textarea';
import UserSelect from 'app/renderer/main/components/Users/UserSelect/UserSelect.jsx';


///////////////////////////////// COMPONENT /////////////////////////////////

export const DueDate = React.createClass({
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
        <div className="text-ellipsis" style={style}>Due {moment(due).fromNow()}</div>
      )
    }
    else {
      return null
    }
  }
});


export const Component = React.createClass({
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
      modalType: 'TASK',
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
              <DueDate due={task.data.due}/>
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
            <div style={{padding: '0 5px'}}><DueDate due={task.data.due}/></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Component);
