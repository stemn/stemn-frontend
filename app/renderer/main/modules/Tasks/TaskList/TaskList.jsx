import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as TasksActions from '../Tasks.actions.js';

import { Field }           from 'react-redux-form';
import TaskGroupParent     from './TaskGroup/TaskGroupParent.jsx';
import TaskGroupWrapped    from './TaskGroup/TaskGroupWrapped.jsx'
import TaskGroup           from './TaskGroup/TaskGroup.jsx'
import TaskListItemParent  from './TaskListItem/TaskListItemParent.jsx'
import TaskListItemWrapped from './TaskListItem/TaskListItemWrapped.jsx'
import TaskListItem        from './TaskListItem/TaskListItem.jsx'

import classes from './TaskList.css';

export const NewItem = React.createClass({
  render() {
    const { model, submitFn, placeholder, box, style } = this.props;
    return (
      <form style={style} name="form" onSubmit={submitFn}>
        <Field model={model}>
          <input className={box ? classes.newItemBox : classes.newItem} type="text" placeholder={placeholder}/>
        </Field>
      </form>
    )
  }
});

export const Component = React.createClass({
  moveGroup({group, destinationGroup, save}) {
    this.props.TasksActions.moveGroup({
      boardId: this.props.board.data._id,
      group,
      destinationGroup,
      save
    })
  },
  moveCard({task, destinationTask, destinationGroup, save}) {
    this.props.TasksActions.moveTask({
      boardId: this.props.board.data._id,
      task,
      destinationTask,
      destinationGroup,
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
    this.props.TasksActions.deleteGroup({
      boardId: this.props.board.data._id,
      groupId: groupId
    })
  },
  render() {
    const { board, project, layout, className } = this.props;
    const entityModel = `tasks.boards.${board.data._id}`;

    return (
      <div className={className + ' layout-column flex'} style={layout == 'board' ? {overflowX : 'scroll'} : {overflowY : 'scroll'}}>
        <TaskGroupParent layout={layout}>
          {board.data.groups.map((group, groupIndex) =>
            <TaskGroupWrapped
              key={group._id}
              index={groupIndex}
              id={group._id}
              item={group}
              moveGroup={this.moveGroup}
              layout={layout}>
              <TaskGroup
               item={group}
               layout={layout}
               entityModel={`${entityModel}.data.groups[${groupIndex}]`}
               deleteGroup={() => this.deleteGroup(group._id)}>
                <TaskListItemParent
                 groupId={group._id}
                 moveCard={this.moveCard}
                 tasks={group.tasks}
                 layout={layout}>
                  {group.tasks.map((taksId, cardIndex) =>
                    <TaskListItemWrapped
                      key={taksId}
                      index={cardIndex}
                      id={taksId}
                      item={taksId}
                      groupId={group._id}
                      moveCard={this.moveCard}
                      beginDrag={this.beginDrag}
                      endDrag={this.endDrag}>
                      <TaskListItem item={taksId} draggable={true} layout={layout} />
                    </TaskListItemWrapped>
                  )}
                  <NewItem
                    style={layout == 'list' ? {marginLeft: '60px'} : {}}
                    model={`${entityModel}.newTaskString.${group._id}`}
                    placeholder="New Task"
                    submitFn={(event) => this.newTask(event, group._id)}
                    box={layout=='board'}
                  />
                </TaskListItemParent>
              </TaskGroup>
           </TaskGroupWrapped>
          )}
          <div style={{width: '350px', minWidth: '350px', padding: '0 15px'}}>
            <h3 className="text-mini-caps flex">&nbsp;</h3>
            <NewItem
              model={`${entityModel}.newGroupString`}
              placeholder="New Group"
              submitFn={this.newGroup}
              box={layout=='board'}
            />
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

export default connect(mapStateToProps, mapDispatchToProps)(Component)
