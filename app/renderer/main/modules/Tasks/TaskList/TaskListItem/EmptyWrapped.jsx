import React, { Component, PropTypes } from 'react';

import { hover } from './TaskListItem.drag.config.js';
import { DragSource, DropTarget } from 'react-dnd';

const ItemTypes = {
  CARD: 'card'
}

const cardTarget = {
  hover(props, monitor, component){
    props.moveCard({
      task: monitor.getItem().id,
      destinationGroup: props.groupId
    })
  },

  drop(props, monitor){
    props.moveCard({
      task: monitor.getItem().id,
      destinationGroup: props.groupId,
      save: true,
    });
    props.endDrag(props.id)
  }
};

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
export default class Card extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
  };
  render() {
    const { item, connectDropTarget, groupId, style } = this.props;
    return connectDropTarget(
      <div style={style}></div>
    );
  }
}
