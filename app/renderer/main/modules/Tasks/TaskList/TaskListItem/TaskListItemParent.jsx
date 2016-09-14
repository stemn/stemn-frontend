import React from 'react';
import EmptyWrapped from './EmptyWrapped.jsx';
import FlipMove from 'react-flip-move';

export default class Container extends React.Component {
  render() {
    const { groupId, children, moveCard, layout } = this.props;
    return (
      <div>
        <FlipMove enterAnimation="none" leaveAnimation="none" duration={200}>
          {children}
        </FlipMove>
        {children.length >= 1 ? null :
          <EmptyWrapped
            style={layout == 'list' ? {minHeight: '20px'} : {minHeight: '50vh'}}
            moveCard={moveCard}
            groupId={groupId}/>
        }
      </div>
    );
  }
}
