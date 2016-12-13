import React from 'react';
import EmptyWrapped from './EmptyWrapped.jsx';
import FlipMove from 'react-flip-move';

export default class TaskListItemParent extends React.Component {
  render() {
    const { groupId, tasks, children, moveCard, layout } = this.props;
    return (
      <div style={layout == 'list' ? {position: 'relative'} : {}}>
        <FlipMove enterAnimation="none" leaveAnimation="none" duration={100}>
          {children}
        </FlipMove>
        {tasks && tasks.length >= 1 ? null :
          <EmptyWrapped
            layout={layout}
            moveCard={moveCard}
            groupId={groupId}
          />
        }
      </div>
    );
  }
}
