import React, { Component, PropTypes } from 'react';
import TaskGroup from './TaskGroup.jsx'
import { hover } from './TaskGroup.drag.config.js';
import { DragSource, DropTarget } from 'react-dnd';

const ItemTypes = {
  GROUP: 'group'
}
const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
};

const cardTarget = {
  hover
};

@DropTarget(ItemTypes.GROUP, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(ItemTypes.GROUP, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class Card extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired,
    moveGroup: PropTypes.func.isRequired
  };

  render() {
    const { item, isDragging, connectDragSource, connectDropTarget } = this.props;
    const outerStyles = isDragging ? {outline: '2px dashed rgba(0, 0, 0, 0.4)'} : null;
    const innerStyles = isDragging ? {opacity: '0'} : {opacity: '1'};
    return connectDragSource(connectDropTarget(
      <div style={outerStyles}>
        <div style={innerStyles}>
          <TaskGroup item={item}/>
        </div>
      </div>
    ));
  }
}
