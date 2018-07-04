import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragSource, DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'

const ItemTypes = {
  GROUP: 'group',
}

const endDragProps = {}
const beginDragProps = {}

const cardSource = {
  beginDrag(props) {
    beginDragProps.id = props.id
    beginDragProps.index = props.index
    return {
      id: props.id,
      index: props.index,
    }
  },

  endDrag(props) {
    // If the group has moved, save it
    if (endDragProps.index && beginDragProps.index !== endDragProps.index) {
      props.moveGroup({
        group: beginDragProps.id,
        destinationGroup: endDragProps.id,
        after: endDragProps.after,
        save: true,
      })
    }
  },
}

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index
    const hoverIndex = props.index
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return
    }
    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()
    const clientOffset = monitor.getClientOffset() // Determine mouse position

    if (props.layout === 'list') {
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2 // Get vertical middle
      const hoverClientY = clientOffset.y - hoverBoundingRect.top // Get pixels to the top
      // Only perform the move when the mouse has crossed half of the items height
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) { return } // Dragging down
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) { return } // Dragging upwards
    }
    // Else this is a board (horizontal drag)
    else {
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2
      const hoverClientX = clientOffset.x - hoverBoundingRect.left // Get pixels to the left
      // Only perform the move when the mouse has crossed half of the items height
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) { return } // Dragging left
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) { return } // Dragging right
    }


    // Set the end params
    endDragProps.id = props.id
    endDragProps.index = props.index
    // If the dragged item index is less than the destination index, we set it to after
    const dragIndexInGroup = props.groups.findIndex(groupId => groupId === beginDragProps.id)
    endDragProps.after = dragIndexInGroup !== -1 ? dragIndexInGroup < endDragProps.index : false

    // Time to actually perform the action
    props.moveGroup({
      group: monitor.getItem().id,
      destinationGroup: props.id,
    })
    monitor.getItem().index = hoverIndex
  },
}

@DropTarget(ItemTypes.GROUP, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.GROUP, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class ThreadGroupWrapped extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired,
    moveGroup: PropTypes.func.isRequired,
    layout: PropTypes.string.isRequired, // Required to determine drag direction, horizontal or veritcal
  };

  render() {
    const { item, isDragging, connectDragSource, connectDropTarget, children, id } = this.props
    const outerStyles = isDragging ? { opacity: '0.5' } : { opacity: '1', transform: 'translate3d(0,0,0)' }
    return connectDragSource(connectDropTarget(
      <div style={ outerStyles } key={ id } className="layout-column rel-box">
        {children}
      </div>,
    ))
  }
}
