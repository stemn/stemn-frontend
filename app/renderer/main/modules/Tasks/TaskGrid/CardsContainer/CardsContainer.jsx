import React, { Component, PropTypes } from 'react';
import { DropTarget, DragSource } from 'react-dnd';
import { Field } from 'react-redux-form';

import Cards from '../Cards/Cards.jsx';
import classes from './CardsContainer.css';

const listSource = {
  beginDrag(props) {
    return {
      id: props.id,
      x: props.x
    };
  },
  endDrag(props) {
    props.stopScrolling();
  }
};

const listTarget = {
  canDrop() {
    return false;
  },
  hover(props, monitor) {
    if (!props.isScrolling) {
      if (window.innerWidth - monitor.getClientOffset().x < 200) {
        props.startScrolling('toRight');
      } else if (monitor.getClientOffset().x < 200) {
        props.startScrolling('toLeft');
      }
    } else {
      if (window.innerWidth - monitor.getClientOffset().x > 200 &&
          monitor.getClientOffset().x > 200
      ) {
        props.stopScrolling();
      }
    }
    const { id: listId } = monitor.getItem();
    const { id: nextX } = props;
    if (listId !== nextX) {
      props.moveList(listId, props.x);
    }
  }
};

@DropTarget('list', listTarget, connectDragSource => ({
  connectDropTarget: connectDragSource.dropTarget(),
}))
@DragSource('list', listSource, (connectDragSource, monitor) => ({
  connectDragSource: connectDragSource.dragSource(),
  isDragging: monitor.isDragging()
}))

export default class CardsContainer extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    item: PropTypes.object,
    x: PropTypes.number,
    moveCard: PropTypes.func.isRequired,
    moveList: PropTypes.func.isRequired,
    isDragging: PropTypes.bool,
    startScrolling: PropTypes.func,
    stopScrolling: PropTypes.func,
    isScrolling: PropTypes.bool
  }


  render() {
    const { tasks, TasksActions, project, entityModel, connectDropTarget, connectDragSource, item, x, moveCard, isDragging, className} = this.props;
    const opacity = isDragging ? 0.5 : 1;

    const newTask = (event)=>{
      event.preventDefault();
      TasksActions.newTask({
        projectId: project._id,
        task: {
          title: tasks.newTaskString[item.id],
          group: item.id
        }
      })
    }

    console.log(this.props);
    return connectDragSource(connectDropTarget(
      <div className={className} style={{ opacity }}>
        <h3>{item.name}</h3>
        <Cards
          tasks={tasks} TasksActions={TasksActions} project={project} entityModel={entityModel}
          moveCard={moveCard}
          x={x}
          cards={item.cards}
          startScrolling={this.props.startScrolling}
          stopScrolling={this.props.stopScrolling}
          isScrolling={this.props.isScrolling}
        />
        <form name="form" onSubmit={newTask}>
          <Field model={`${entityModel}.newTaskString[${item.id}]`}>
            <input className={classes.newItem} type="text" placeholder="New Task"/>
          </Field>
        </form>
      </div>
    ));
  }
}
