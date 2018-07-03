import React from 'react'
import PropTypes from 'prop-types'
import { DragLayer } from 'react-dnd'
import PropTypes from 'prop-types'
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

function getItemStyles(props) {
  const currentOffset = props.currentOffset
  if (!currentOffset) {
    return {
      display: 'none',
    }
  }
  const x = currentOffset.x
  const y = currentOffset.y
  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}

function collect(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }
}

class CustomDragLayer extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    itemType: PropTypes.string,
    currentOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),
    isDragging: PropTypes.bool.isRequired,
  };

  renderItem = (type, item) => {
    switch (type) {
      case 'card':
        return (
          <ThreadListItem draggable={ false } item={ { _id: item.id } } />
        )
      case 'group':
        return (
          <div>asfasfafs aafsafasf fsasafsaf</div>
        )
    }
  };

  render() {
    const item = this.props.item
    const itemType = this.props.itemType
    const isDragging = this.props.isDragging
    if (!isDragging) {
      return null
    }
    return (
      <div style={ layerStyles }>
        <div style={ getItemStyles(this.props) }>
          {this.renderItem(itemType, item)}
        </div>
      </div>
    )
  }
}

module.exports = DragLayer(collect)(CustomDragLayer)
