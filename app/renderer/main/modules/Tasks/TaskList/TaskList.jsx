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
import TaskCard            from './TaskCard/TaskCard.jsx'

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
  render() {
    const { structure, project, layout } = this.props;

    return (
      <div className="layout-column flex">
        <TaskGroupParent layout={layout}>
          {structure.map((group, i) =>
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
                      { layout == 'list'
                        ? <TaskListItem item={card} draggable={true} />
                        : <TaskCard item={card} draggable={true}></TaskCard>
                      }
                    </TaskListItemWrapped>
                  )}
                </TaskListItemParent>
              </TaskGroup>
           </TaskGroupWrapped>
          )}
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
