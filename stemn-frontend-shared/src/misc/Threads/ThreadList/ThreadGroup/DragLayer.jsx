import React from 'react'
import { useDragLayer } from 'react-dnd'
import ThreadListItem from '../ThreadListItem/ThreadListItem.jsx'

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
}

function getItemStyles(currentOffset) {
  if (!currentOffset) {
    return {
      display: 'none',
    }
  }
  const { x, y } = currentOffset
  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}

const renderItem = (type, item) => {
  switch (type) {
    case 'card':
      return (
        <ThreadListItem draggable={ false } item={ { _id: item.id } } />
      )
    case 'group':
      return (
        <div>asfasfafs aafsafasf fsasafsaf</div>
      )
    default:
      return null
  }
}

export default function CustomDragLayer() {
  const { item, itemType, currentOffset, isDragging } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  if (!isDragging) {
    return null
  }
  return (
    <div style={ layerStyles }>
      <div style={ getItemStyles(currentOffset) }>
        {renderItem(itemType, item)}
      </div>
    </div>
  )
}
