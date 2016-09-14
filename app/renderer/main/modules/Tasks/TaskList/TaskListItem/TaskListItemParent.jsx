import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as TasksActions from '../../Tasks.actions.js';

import Card from './TaskListItemWrapped.jsx';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

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
    this.moveCard = this.moveCard.bind(this);
  }
  static contextTypes = {
    project: React.PropTypes.object
  }

  moveCard({dragItem, hoverItem}) {
    this.props.TasksActions.moveTask({
      projectId: this.context.project.data._id,
      dragItem,
      hoverItem
    })
  }

  render() {
    const { cards } = this.props;
    return (
      <div>
        {cards.map((card, i) => {
          return (
            <Card
              key={card._id}
              index={i}
              id={card._id}
              item={card}
              moveCard={this.moveCard} />
          );
        })}
      </div>
    );
  }
}
