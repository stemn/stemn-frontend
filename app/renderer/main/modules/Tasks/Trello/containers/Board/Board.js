import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import * as TasksActions from '../../../Tasks.actions.js';

import CardsContainer from './Cards/CardsContainer';
import CustomDragLayer from './CustomDragLayer';

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch)
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@DragDropContext(HTML5Backend)
export default class Board extends Component {
  static propTypes = {
    tasks: PropTypes.object.isRequired,
  }

  constructor(props) {
    console.log(props);
    super(props);
    this.moveCard = this.TasksActions.moveTask.bind(this);
    this.moveList = this.TasksActions.moveGroup.bind(this);
    this.findList = this.findList.bind(this);
    this.scrollRight = this.scrollRight.bind(this);
    this.scrollLeft = this.scrollLeft.bind(this);
    this.stopScrolling = this.stopScrolling.bind(this);
    this.startScrolling = this.startScrolling.bind(this);
    this.state = { isScrolling: false };
  }

  startScrolling(direction) {
    // if (!this.state.isScrolling) {
    switch (direction) {
      case 'toLeft':
        this.setState({ isScrolling: true }, this.scrollLeft());
        break;
      case 'toRight':
        this.setState({ isScrolling: true }, this.scrollRight());
        break;
      default:
        break;
    }
    // }
  }

  scrollRight() {
    function scroll() {
      document.getElementsByTagName('main')[0].scrollLeft += 10;
    }
    this.scrollInterval = setInterval(scroll, 10);
  }

  scrollLeft() {
    function scroll() {
      document.getElementsByTagName('main')[0].scrollLeft -= 10;
    }
    this.scrollInterval = setInterval(scroll, 10);
  }

  stopScrolling() {
    this.setState({ isScrolling: false }, clearInterval(this.scrollInterval));
  }

  moveCard(lastX, lastY, nextX, nextY) {
    this.props.moveCard(lastX, lastY, nextX, nextY);
  }

  moveList(listId, nextX) {
    const { lastX } = this.findList(listId);
    this.props.moveList(lastX, nextX);
  }

  findList(id) {
    const { tasks } = this.props;
    const list = tasks.items.filter(l => l.id === id)[0];

    return {
      list,
      lastX: tasks.items.indexOf(list)
    };
  }

  render() {
    const { tasks } = this.props;

    console.log(tasks);

    return (
      <div style={{ height: '100%' }}>
        <CustomDragLayer />
        {tasks.items.map((item, i) =>
          <CardsContainer
            key={item.id}
            id={item.id}
            item={item}
            moveCard={this.moveCard}
            moveList={this.moveList}
            startScrolling={this.startScrolling}
            stopScrolling={this.stopScrolling}
            isScrolling={this.state.isScrolling}
            x={i}
          />
        )}
      </div>
    );
  }
}
