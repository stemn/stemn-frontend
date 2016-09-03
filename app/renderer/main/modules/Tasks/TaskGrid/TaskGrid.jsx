import React, { Component, PropTypes } from 'react';
import { Field } from 'react-redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import * as TasksActions from '../Tasks.actions.js';

import CardsContainer from './CardsContainer/CardsContainer.jsx';
import CustomDragLayer from './CustomDragLayer';

import classes from './TaskGrid.css';

function mapStateToProps({tasks}, {params, project}) {
  return {
    project: project,
    tasks: tasks[project._id],
    entityModel: `tasks.${project._id}`
  };
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
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.moveList = this.moveList.bind(this);
    this.findList = this.findList.bind(this);
    this.scrollRight = this.scrollRight.bind(this);
    this.scrollLeft = this.scrollLeft.bind(this);
    this.stopScrolling = this.stopScrolling.bind(this);
    this.startScrolling = this.startScrolling.bind(this);
    this.state = { isScrolling: false };
  }

  startScrolling(direction) {
    console.log('SCROLL!');
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
    this.props.TasksActions.moveTask({
      projectId: this.props.project._id,
      lastX, lastY, nextX, nextY
    });
  }

  moveList(listId, nextX) {
    const { lastX } = this.findList(listId);
    this.props.TasksActions.moveGroup({
      projectId: this.props.project._id,
      lastX, nextX
    });
  }

  findList(id) {
    const { tasks } = this.props;
    const list = tasks.structure.filter(l => l._id === id)[0];

    return {
      list,
      lastX: tasks.structure.indexOf(list)
    };
  }

  render() {
    const { tasks, TasksActions, project, entityModel } = this.props;

    const newGroup = (event) => {
      event.preventDefault();
      TasksActions.newGroup({
        projectId: project._id,
        group: {
          name: tasks.newGroupString
        }
      })
    }

    return (
      <main className={classes.container}>
        <CustomDragLayer project={project}/>
        <div className={classes.row + ' layout-row'}>
          {tasks.structure.map((item, i) =>
            <CardsContainer
              tasks={tasks}
              TasksActions={TasksActions}
              project={project}
              entityModel={entityModel}

              className={classes.column}
              key={item._id}
              id={item._id}
              item={item}
              moveCard={this.moveCard}
              moveList={this.moveList}
              startScrolling={this.startScrolling}
              stopScrolling={this.stopScrolling}
              isScrolling={this.state.isScrolling}
              x={i}
            />
          )}
          <div className={classes.column}>
            <h3>&nbsp;</h3>
            <form name="form" onSubmit={newGroup}>
              <Field model={`${entityModel}.newGroupString`}>
                <input className={classes.newItem} type="text" placeholder="New Section"/>
              </Field>
            </form>
          </div>
        </div>
      </main>
    );
  }
}
