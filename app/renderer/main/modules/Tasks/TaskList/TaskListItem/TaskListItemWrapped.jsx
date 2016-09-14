import React, { Component, PropTypes } from 'react';
import TaskListItem from './TaskListItem.jsx'

import { hover, beginDrag, endDrag } from './TaskListItem.drag.config.js';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

const ItemTypes = {
  CARD: 'card'
}
const cardSource = {
  beginDrag,
  endDrag
};

const cardTarget = {
  hover,
};

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))
export default class Card extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired,
    moveCard: PropTypes.func.isRequired,
    beginDrag: PropTypes.func.isRequired,
    endDrag: PropTypes.func.isRequired
  };

//  componentDidMount() {
//    this.props.connectDragPreview(getEmptyImage(), {
//      captureDraggingState: true
//    });
//  }

  render() {
    const { item, isDragging, connectDragSource, connectDropTarget } = this.props;
    return connectDragSource(connectDropTarget(
      <div style={{transform: 'translate3d(0,0,0)'}}>
        <TaskListItem item={item} draggable={true}/>
      </div>
    ));
  }
}
