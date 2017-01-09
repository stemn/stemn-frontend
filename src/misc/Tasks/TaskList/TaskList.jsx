import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as TasksActions from '../Tasks.actions.js';

import TaskGroupParent     from './TaskGroup/TaskGroupParent.jsx';
import TaskGroupWrapped    from './TaskGroup/TaskGroupWrapped.jsx'
import TaskGroup           from './TaskGroup/TaskGroup.jsx'
import TaskListItemParent  from './TaskListItem/TaskListItemParent.jsx'
import TaskListItemWrapped from './TaskListItem/TaskListItemWrapped.jsx'
import TaskListItem        from './TaskListItem/TaskListItem.jsx'
import Input from 'stemn-frontend-shared/src/misc/Input/Input/Input';

import classNames from 'classnames'
import classes from './TaskList.css';

export const NewItem = React.createClass({
  render() {
    const { model, value, submitFn, placeholder, box, style } = this.props;
    return (
      <form style={style} name="form" onSubmit={submitFn}>
        <Input 
          model={model} 
          value={value}
          className={box ? classes.newItemBox : classes.newItem} 
          type="text" placeholder={placeholder}
        />
      </form>
    )
  }
});

export const TaskList = React.createClass({
  moveGroup({group, destinationGroup, after, save}) {
    this.props.TasksActions.moveGroup({
      boardId: this.props.board.data._id,
      group,
      destinationGroup,
      after,
      save
    })
  },
  moveCard({task, destinationTask, destinationGroup, after, save}) {
    this.props.TasksActions.moveTask({
      boardId: this.props.board.data._id,
      task,
      destinationTask,
      destinationGroup,
      after,
      save
    })
  },
  beginDrag(taskId) {
    this.props.TasksActions.beginDrag({
      boardId: this.props.board.data._id,
      taskId,
    })
  },
  endDrag(taskId) {
    this.props.TasksActions.endDrag({
      boardId: this.props.board.data._id,
      taskId,
    })
  },
  newTask(event, groupId){
    event.preventDefault();
    this.props.TasksActions.newTask({
      boardId: this.props.board.data._id,
      task: {
        name: this.props.board.newTaskString[groupId],
        group: groupId,
        boardId: this.props.board.data._id
      },
    })
  },
  newGroup(event){
    event.preventDefault();
    this.props.TasksActions.newGroup({
      boardId: this.props.board.data._id,
      group: {
        name: this.props.board.newGroupString
      },
    })
  },
  deleteGroup(groupId){
    this.props.TasksActions.deleteGroupConfirm({
      boardId: this.props.board.data._id,
      groupId: groupId
    })
  },
  updateGroup(group){
    this.props.TasksActions.updateGroup({
      group: group
    })
  },
  render() {
    const { board, layout, className } = this.props;
    const entityModel = `tasks.boards.${board.data._id}`;

    const outerClasses = classNames(className, layout == 'board' ? 'layout-column flex' : 'flex')
    return (
      <div className={outerClasses} style={layout == 'board' ? {overflowX : 'scroll'} : {overflowY : 'scroll'}}>
        <TaskGroupParent layout={layout}>
          {board.data.groups.map((group, groupIndex) =>
            <TaskGroupWrapped
              key={group._id}
              index={groupIndex}
              id={group._id}
              item={group}
              groups={board.data.groups.map((group)=>group._id)}
              moveGroup={this.moveGroup}
              layout={layout}>
              <TaskGroup
                item={group}
                layout={layout}
                entityModel={`${entityModel}.data.groups[${groupIndex}]`}
                deleteGroup={() => this.deleteGroup(group._id)}
                updateGroup={() => this.updateGroup(group)}>
                <TaskListItemParent
                 groupId={group._id}
                 moveCard={this.moveCard}
                 tasks={group.tasks}
                 layout={layout}>
                  {group.tasks ? group.tasks.map((taskId, cardIndex) =>
                    <TaskListItemWrapped
                      index={cardIndex}
                      id={taskId}
                      key={taskId}
                      item={taskId}
                      groupId={group._id}
                      tasks={group.tasks}
                      moveCard={this.moveCard}
                      beginDrag={this.beginDrag}
                      endDrag={this.endDrag}>
                      <TaskListItem item={taskId} draggable={true} layout={layout} />
                    </TaskListItemWrapped>
                  ) : ''}
                  <NewItem
                    style={layout == 'list' ? {marginLeft: '60px', zIndex: '1', position: 'relative'} : {zIndex: '1', position: 'relative'}}
                    model={`${entityModel}.newTaskString.${group._id}`}
                    value={board.newTaskString ? board.newTaskString[group._id] : ''}
                    placeholder="New Task"
                    submitFn={(event) => this.newTask(event, group._id)}
                    box={layout=='board'}
                  />
                </TaskListItemParent>
              </TaskGroup>
           </TaskGroupWrapped>
          )}
          <div>
            <TaskGroup layout={layout} simpleGroup={true}>
              <NewItem
                style={{zIndex: '1', position: 'relative'}}
                model={`${entityModel}.newGroupString`}
                value={board.newGroupString}
                placeholder="New Group"
                submitFn={this.newGroup}
                box={layout=='board'}
              />
            </TaskGroup>
          </div>
        </TaskGroupParent>
      </div>
    )
  }
});

////////////////////////////////////////////////////////////////////

function mapStateToProps() {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList)
