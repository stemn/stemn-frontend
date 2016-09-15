import React, { Component, PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';

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
  hover(props, monitor, component){
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }
    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const clientOffset = monitor.getClientOffset(); // Determine mouse position

    if(props.layout == 'list'){
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2; // Get vertical middle
      const hoverClientY = clientOffset.y - hoverBoundingRect.top; // Get pixels to the top
      // Only perform the move when the mouse has crossed half of the items height
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) { return } // Dragging down
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) { return } // Dragging upwards
    }
    // Else this is a board (horizontal drag)
    else{
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const hoverClientX = clientOffset.x - hoverBoundingRect.left; // Get pixels to the left
      // Only perform the move when the mouse has crossed half of the items height
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) { return } // Dragging left
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) { return } // Dragging right
    }

    // Time to actually perform the action
    props.moveGroup({
      dragItem: {
        id: monitor.getItem().id,
        index: monitor.getItem().index
      },
      hoverItem: {
        id: props.id,
        index: props.index
      }
    });
    monitor.getItem().index = hoverIndex;
  }
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
    moveGroup: PropTypes.func.isRequired,
    layout: PropTypes.string.isRequired // Required to determine drag direction, horizontal or veritcal
  };

  render() {
    const { item, isDragging, connectDragSource, connectDropTarget, children } = this.props;
    const outerStyles = isDragging ? {opacity: '0.5'} : {opacity: '1', transform: 'translate3d(0,0,0)'};
    return connectDragSource(connectDropTarget(
      <div style={outerStyles}>
        {children}
      </div>
    ));
  }
}
