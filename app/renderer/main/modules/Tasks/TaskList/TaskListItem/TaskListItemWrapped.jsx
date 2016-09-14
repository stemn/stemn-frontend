import React, { Component, PropTypes } from 'react';
import TaskListItem from './TaskListItem.jsx'

import { hover } from './TaskListItem.drag.config.js';
import { DragSource, DropTarget } from 'react-dnd';

const ItemTypes = {
  CARD: 'card'
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

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
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
    moveCard: PropTypes.func.isRequired
  };

  render() {
    const { item, isDragging, connectDragSource, connectDropTarget } = this.props;
    const outerStyles = isDragging ? {outline: '2px dashed rgba(0, 0, 0, 0.4)'} : null;
    const innerStyles = isDragging ? {opacity: '0'} : {opacity: '1'};
    return connectDragSource(connectDropTarget(
      <div style={outerStyles}>
        <div style={innerStyles}>
          <TaskListItem item={item}/>
        </div>
      </div>
    ));
  }
}
