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
  moveGroup({dragItem, hoverItem}) {
    this.props.TasksActions.moveGroup({
      projectId: this.props.project.data._id,
      dragItem,
      hoverItem
    })
  },
  moveCard({dragItem, hoverItem, destinationGroup}) {
    this.props.TasksActions.moveTask({
      projectId: this.props.project.data._id,
      dragItem,
      hoverItem,
      destinationGroup
    })
  },
  beginDrag(taskId) {
    this.props.TasksActions.beginDrag({
      projectId: this.props.project.data._id,
      taskId,
    })
  },
  endDrag(taskId) {
    this.props.TasksActions.endDrag({
      projectId: this.props.project.data._id,
      taskId,
    })
  },
  newTask(event, groupId){
    event.preventDefault();
    this.props.TasksActions.newTask({
      projectId: this.props.project.data._id,
      task: {
        title: this.props.tasks.newTaskString[groupId],
        group: groupId,
        project: {
          _id: this.props.project.data._id
        }
      },
    })
  },
  newGroup(event){
    event.preventDefault();
    this.props.TasksActions.newGroup({
      projectId: this.props.project.data._id,
      group: {
        name: this.props.tasks.newGroupString
      },
    })
  },

  render() {
    const { tasks, project, layout, className } = this.props;
    const entityModel = `tasks.projects.${project.data._id}`;

    return (
      <div className={className + ' layout-column flex'} style={layout == 'board' ? {overflowX : 'scroll'} : {overflowY : 'scroll'}}>
        <TaskGroupParent layout={layout}>
          {tasks.structure.map((group, i) =>
            <TaskGroupWrapped
              key={group._id}
              index={i}
              id={group._id}
              item={group}
              moveGroup={this.moveGroup}
              layout={layout}>
              <TaskGroup
               item={group}
               layout={layout}>
                <TaskListItemParent
                 groupId={group._id}
                 moveCard={this.moveCard}
                 layout={layout}>
                  {group.children.map((card, i) =>
                    <TaskListItemWrapped
                      key={card._id}
                      index={i}
                      id={card._id}
                      item={card}
                      moveCard={this.moveCard}
                      beginDrag={this.beginDrag}
                      endDrag={this.endDrag}>
                      <TaskListItem item={card} draggable={true} layout={layout} />
                    </TaskListItemWrapped>
                  )}
                  <NewItem
                    style={layout == 'list' ? {marginLeft: '40px'} : {}}
                    model={`${entityModel}.newTaskString.${group._id}`}
                    placeholder="New Task"
                    submitFn={(event) => this.newTask(event, group._id)}
                    box={layout=='board'}
                  />
                </TaskListItemParent>
              </TaskGroup>
           </TaskGroupWrapped>
          )}
          <div style={{width: '350px', padding: '0 15px'}}>
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
