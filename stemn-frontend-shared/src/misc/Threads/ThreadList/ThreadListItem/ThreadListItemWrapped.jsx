import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { cardHover, cardDrop, beginDrag, endDrag } from './ThreadListItem.drag.config.js'
import { DragSource, DropTarget } from 'react-dnd'
const ItemTypes = {
  CARD: 'card',
}
const cardSource = {
  beginDrag,
  endDrag,
}

const cardTarget = {
  hover: cardHover,
  drop: cardDrop,
}

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}))
export default class ThreadListItemWrapped extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    item: PropTypes.string.isRequired,
    moveCard: PropTypes.func.isRequired,
    beginDrag: PropTypes.func.isRequired,
    endDrag: PropTypes.func.isRequired,
  };

  render() {
    const { isDragging, connectDragSource, connectDropTarget, children, id } = this.props
    return connectDragSource(connectDropTarget(
      <div key={ id }>
        {children}
      </div>,
    ))
  }
}

// style={{transform: 'translate3d(0,0,0)'}}
