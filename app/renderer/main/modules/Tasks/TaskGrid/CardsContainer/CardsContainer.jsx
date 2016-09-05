import React, { Component, PropTypes } from 'react';
import { DropTarget, DragSource } from 'react-dnd';
import { Field } from 'react-redux-form';

import { throttle } from 'lodash';

import Cards from '../Cards/Cards.jsx';
import classes from './CardsContainer.css';

import classNames from 'classNames';

const listSource = {
  beginDrag(props) {
    return {
      _id: props.item._id,
      x  : props.x
    };
  },
  endDrag(props) {
    props.stopScrolling();
  }
};


let throttleModelUpdate = throttle((throttledFn)=>throttledFn(), 100, {
  leading:true,
  trailing:false
});

const listTarget = {
  canDrop() {
    return false;
  },
  drop(props, monitor, component) {
  },
  hover(props, monitor, component) {
//    if (!props.isScrolling) {
//      if (window.innerWidth - monitor.getClientOffset().x < 200) {
//        props.startScrolling('toRight');
//      } else if (monitor.getClientOffset().x < 200) {
//        props.startScrolling('toLeft');
//      }
//    } else {
//      if (window.innerWidth - monitor.getClientOffset().x > 200 &&
//          monitor.getClientOffset().x > 200
//      ) {
//        props.stopScrolling();
//      }
//    }
    const activeId = monitor.getItem()._id;
    const destinId = props.id;
    if (activeId !== destinId) {
      throttleModelUpdate(()=>{
        props.moveList(activeId, props.x)
      })
    }
//    const activeElement = document.getElementById(activeId);
//    if(activeElement){
//      console.log(activeElement);
//      activeElement.style.opacity = 1;
//    }
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

    const newTask = (event) => {
      event.preventDefault();
      TasksActions.newTask({
        projectId: project._id,
        task: {
          title: tasks.newTaskString[item._id],
          group: item._id
        }
      })
    }

    const colClasses = classNames(className, {[classes.placeholderCol] : isDragging})

    return connectDragSource(connectDropTarget(
      <div className={colClasses} id={item._id}>
        <h3>
          <Field model={`${entityModel}.structure[${x}].name`}>
            <input className="input-plain" type="text" placeholder="Title"/>
          </Field>
        </h3>
        <div className="rel-box">
          <Cards
            tasks={tasks} TasksActions={TasksActions} project={project} entityModel={entityModel}
            moveCard={moveCard}
            x={x}
            cards={item.children}
            startScrolling={this.props.startScrolling}
            stopScrolling={this.props.stopScrolling}
            isScrolling={this.props.isScrolling}
          />
        </div>
        <form name="form" onSubmit={newTask}>
          <Field model={`${entityModel}.newTaskString[${item._id}]`}>
            <input className={classes.newItem} type="text" placeholder="New Task"/>
          </Field>
        </form>
      </div>
    ));
  }
}

