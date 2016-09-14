import { findDOMNode } from 'react-dom';
import { throttle } from 'lodash';

let throttleModelUpdate = throttle((throttledFn)=>throttledFn(), 100, {
  leading:true,
  trailing:false
});

export const hover = (props, monitor, component) => {
  const dragIndex = monitor.getItem().index;
  const dragId = monitor.getItem().id;

  const hoverIndex = props.index;
  const hoverId = props.id;

  // Don't replace items with themselves
  if (dragId === hoverId) {
    return;
  }

  // Determine rectangle on screen
  const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

  // Get vertical middle
  const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

  // Determine mouse position
  const clientOffset = monitor.getClientOffset();

  // Get pixels to the top
  const hoverClientY = clientOffset.y - hoverBoundingRect.top;

  // Only perform the move when the mouse has crossed half of the items height
  // When dragging downwards, only move when the cursor is below 50%
  // When dragging upwards, only move when the cursor is above 50%

  // Dragging downwards
  if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    return;
  }

  // Dragging upwards
  if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    return;
  }

  // Time to actually perform the action
   throttleModelUpdate(()=>{
    props.moveCard({
      dragItem: {
        id: dragId,
        index: dragIndex
      },
      hoverItem: {
        id: hoverId,
        index: hoverIndex
      }
    });
  })

  // Note: we're mutating the monitor item here!
  // Generally it's better to avoid mutations,
  // but it's good here for the sake of performance
  // to avoid expensive index searches.
  monitor.getItem().index = hoverIndex;
}

export const beginDrag = (props, monitor, component) => {
  props.beginDrag(props.id)
  return {
    id: props.id,
    index: props.index
  };
}

export const endDrag = (props, monitor) => {
  props.endDrag(props.id)
}

