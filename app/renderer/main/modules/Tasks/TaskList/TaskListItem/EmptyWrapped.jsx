import React, { Component, PropTypes } from 'react';
import TaskListItem from './TaskListItem.jsx'

import { hover } from './TaskListItem.drag.config.js';
import { DragSource, DropTarget } from 'react-dnd';

const ItemTypes = {
  CARD: 'card'
}
const cardTarget = {
  hover(props, monitor, component){
    const dragItem = {
      id: monitor.getItem().id,
      index: monitor.getItem().index
    };
    props.moveCard({
      dragItem,
      destinationGroup: props.groupId
    })
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
    const { item, connectDropTarget, groupId } = this.props;
    return connectDropTarget(
      <div style={{minHeight: '20px'}}></div>
    );
  }
}
