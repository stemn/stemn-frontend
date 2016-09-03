import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import Card from './Card.jsx';


function getStyles(isDragging) {
  return {
    display: isDragging ? 0.5 : 1
  };
}

const cardSource = {
  beginDrag(props, monitor, component) {
    // dispatch to redux store that drag is started
    const { item, x, y } = props;
    const { _id } = item;
    const { clientWidth, clientHeight } = findDOMNode(component);

    return { _id, item, x, y, clientWidth, clientHeight };
  },
  endDrag(props, monitor) {
    document.getElementById(monitor.getItem()._id).style.display = 'flex';
    props.stopScrolling();
  },
  isDragging(props, monitor) {
    const isDragging = props.item && props.item._id === monitor.getItem().id;
    return isDragging;
  }
};

// options: 4rd param to DragSource https://gaearon.github.io/react-dnd/docs-drag-source.html
const OPTIONS = {
  arePropsEqual: function arePropsEqual(props, otherProps) {
    let isEqual = true;
    if (props.item._id === otherProps.item._id &&
        props.x === otherProps.x &&
        props.y === otherProps.y
       ) {
      isEqual = true;
    } else {
      isEqual = false;
    }
    return isEqual;
  }
};

function collectDragSource(connectDragSource, monitor) {
  return {
    connectDragSource: connectDragSource.dragSource(),
    connectDragPreview: connectDragSource.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

@DragSource('card', cardSource, collectDragSource, OPTIONS)
export default class CardComponent extends Component {
  static propTypes = {
    item: PropTypes.object,
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number,
    stopScrolling: PropTypes.func
  }

  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage(), {
      captureDraggingState: true
    });
  }

  render() {
    const { tasks, TasksActions, project, entityModel, isDragging, connectDragSource, item, x, y } = this.props;
    return connectDragSource(
      <div>
        <Card tasks={tasks} TasksActions={TasksActions} project={project} entityModel={entityModel}
        x={x} y={y}
        style={getStyles(isDragging)} item={item} />
      </div>
    );
  }
}
