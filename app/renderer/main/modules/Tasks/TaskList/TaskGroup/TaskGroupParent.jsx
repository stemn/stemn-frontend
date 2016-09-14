import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as TasksActions from '../../Tasks.actions.js';

import TaskGroupWrapped from './TaskGroupWrapped.jsx';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import FlipMove from 'react-flip-move';

function mapStateToProps(){
  return {};
}
function mapDispatchToProps(dispatch){
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch)
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@DragDropContext(HTML5Backend)
export default class Container extends React.Component {
  constructor(props) {
    super(props);
    this.moveGroup = this.moveGroup.bind(this);
  }
  static contextTypes = {
    project: React.PropTypes.object
  }
  moveGroup({dragItem, hoverItem}) {
    this.props.TasksActions.moveGroup({
      projectId: this.context.project.data._id,
      dragItem,
      hoverItem
    })
  }

  render() {
    const { groups } = this.props;
    return (
      <div>
        <FlipMove enterAnimation="none" leaveAnimation="none" duration={200}>
          {groups.map((group, i) => {
            return (
              <TaskGroupWrapped
                key={group._id}
                index={i}
                id={group._id}
                item={group}
                moveGroup={this.moveGroup} />
            );
          })}
        </FlipMove>
      </div>
    );
  }
}
