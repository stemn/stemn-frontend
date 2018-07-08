import { findDOMNode } from 'react-dom'
import { throttle } from 'lodash'

const throttleModelUpdate = throttle(throttledFn => throttledFn(), 100, {
  leading: true,
  trailing: false,
})

let endDragProps = {}
const beginDragProps = {}

export const cardHover = (props, monitor, component) => {
  const dragIndex = monitor.getItem().index
  const dragId = monitor.getItem().id

  const hoverIndex = props.index
  const hoverId = props.id

  // Don't replace items with themselves
  if (dragId === hoverId) {
    return
  }

  // Determine rectangle on screen
  const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

  // Get vertical middle
  const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

  // Determine mouse position
  const clientOffset = monitor.getClientOffset()

  // Get pixels to the top
  const hoverClientY = clientOffset.y - hoverBoundingRect.top

  // Only perform the move when the mouse has crossed half of the items height
  // When dragging downwards, only move when the cursor is below 50%
  // When dragging upwards, only move when the cursor is above 50%

  // Dragging downwards
  if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    return
  }

  // Dragging upwards
  if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    return
  }

  // Time to actually perform the action
  throttleModelUpdate(() => {
    endDragProps.id = props.id
    endDragProps.index = props.index
    endDragProps.groupId = props.groupId
    // If the dragged item index is less than the destination index, we set it to after
    const dragIndexInGroup = props.threads.findIndex(threadId => threadId === beginDragProps.id)
    endDragProps.after = dragIndexInGroup !== -1 ? dragIndexInGroup < endDragProps.index : false

    props.moveCard({
      thread: dragId,
      destinationThread: hoverId,
      destinationGroup: props.groupId,
    })
  })

  // Note: we're mutating the monitor item here!
  // Generally it's better to avoid mutations,
  // but it's good here for the sake of performance
  // to avoid expensive index searches.
  monitor.getItem().index = hoverIndex
}

export const cardDrop = (props, monitor, component) => {}

export const beginDrag = (props, monitor, component) => {
  props.beginDrag(props.id)

  beginDragProps.id = props.id
  beginDragProps.index = props.index
  beginDragProps.groupId = props.groupId

  endDragProps = {}
  return {
    id: props.id,
    groupId: props.groupId,
    index: props.index,
    threads: props.threads,
  }
}

export const endDrag = (props, monitor) => {
  if (endDragProps.groupId && (beginDragProps.groupId !== endDragProps.groupId || beginDragProps.index !== endDragProps.index)) {
    // We have done a real move, save
    props.moveCard({
      thread: beginDragProps.id,
      destinationThread: endDragProps.id,
      destinationGroup: endDragProps.groupId,
      after: endDragProps.after,
      save: true,
    })
  }
  props.endDrag(beginDragProps.id)
}

export const emptyHover = (props, monitor) => {
  throttleModelUpdate(() => {
    endDragProps.id = undefined
    endDragProps.index = 0
    endDragProps.groupId = props.groupId

    props.moveCard({
      thread: monitor.getItem().id,
      destinationGroup: props.groupId,
    })
  })
}
