import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as TasksActions from '../../Tasks.actions.js';

import TaskListItemWrapped from './TaskListItemWrapped.jsx';
import EmptyWrapped from './EmptyWrapped.jsx';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import classes from './TaskListItem.css';


function mapStateToProps(){
  return {};
}
function mapDispatchToProps(dispatch){
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch)
  }
}

@connect(mapStateToProps, mapDispatchToProps)
//@DragDropContext(HTML5Backend)
export default class Container extends React.Component {
  constructor(props) {
    super(props);
    this.moveCard  = this.moveCard.bind(this);
    this.beginDrag = this.beginDrag.bind(this);
    this.endDrag   = this.endDrag.bind(this);
  }
  static contextTypes = {
    project: React.PropTypes.object
  }

  moveCard({dragItem, hoverItem, destinationGroup}) {
    this.props.TasksActions.moveTask({
      projectId: this.context.project.data._id,
      dragItem,
      hoverItem,
      destinationGroup
    })
  }

  beginDrag(taskId) {
    this.props.TasksActions.beginDrag({
      projectId: this.context.project.data._id,
      taskId,
    })
  }

  endDrag(taskId) {
    this.props.TasksActions.endDrag({
      projectId: this.context.project.data._id,
      taskId,
    })
  }

  render() {
    const { cards, groupId } = this.props;

    const transitionName = {
      enter: classes.enter,
      enterActive: classes.enterActive,
      leave: classes.leave,
      leaveActive: classes.leaveActive,
      appear: classes.appear,
      appearActive: classes.appearActive
    };

    return (
      <div>
        {cards.map((card, i) =>
          <TaskListItemWrapped
            key={card._id}
            index={i}
            id={card._id}
            item={card}
            moveCard={this.moveCard}
            beginDrag={this.beginDrag}
            endDrag={this.endDrag} />
        )}
        {cards.length >= 1 ? null :
          <EmptyWrapped
            moveCard={this.moveCard}
            groupId={groupId}/>
        }
      </div>
    );
  }
}


//       <ReactCSSTransitionGroup
//          transitionName={transitionName}
//          transitionAppear={true}
//          transitionAppearTimeout={300}
//          transitionEnterTimeout={300}
//          transitionLeaveTimeout={300}>

//        </ReactCSSTransitionGroup>
