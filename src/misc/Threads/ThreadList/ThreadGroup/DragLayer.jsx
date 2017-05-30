import React from 'react';
import { DragLayer } from 'react-dnd';

import ThreadGroup from './ThreadGroup.jsx';
import ThreadListItem from '../ThreadListItem/ThreadListItem.jsx';

var layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
};

function getItemStyles(props) {
  var currentOffset = props.currentOffset;
  if (!currentOffset) {
    return {
      display: 'none'
    };
  }
  var x = currentOffset.x;
  var y = currentOffset.y;
  var transform = 'translate(' + x + 'px, ' + y + 'px)';
  return {
    transform: transform,
    WebkitTransform: transform
  };
}

function collect(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  };
}

var CustomDragLayer = React.createClass({
  propTypes: {
    item: React.PropTypes.object,
    itemType: React.PropTypes.string,
    currentOffset: React.PropTypes.shape({
      x: React.PropTypes.number.isRequired,
      y: React.PropTypes.number.isRequired
    }),
    isDragging: React.PropTypes.bool.isRequired
  },

  renderItem: function (type, item) {
    switch (type) {
      case 'card':
        return (
          <ThreadListItem draggable={false} item={{_id: item.id}}/>
        )
      case 'group':
        return (
          <div>asfasfafs aafsafasf fsasafsaf</div>
        )
    }
  },

  render: function () {
    var item = this.props.item;
    var itemType = this.props.itemType;
    var isDragging = this.props.isDragging;
    if (!isDragging) {
      return null;
    }
    return (
      <div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          {this.renderItem(itemType, item)}
        </div>
      </div>
    );
  }
});

module.exports = DragLayer(collect)(CustomDragLayer);
