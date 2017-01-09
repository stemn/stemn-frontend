import React, { Component, PropTypes } from 'react';
import classes from './EmptyWrapped.css';

import { emptyHover } from './TaskListItem.drag.config.js';
import { DragSource, DropTarget } from 'react-dnd';

const ItemTypes = {
  CARD: 'card'
}

const cardTarget = {
  hover: emptyHover,
};

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
export default class EmptyWrapped extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
  };
  render() {
    const { item, connectDropTarget, groupId, style, layout } = this.props;
    return connectDropTarget(
      <div className={layout == 'board' ? classes.wrapperBoard : classes.wrapperList}></div>
    );
  }
}
