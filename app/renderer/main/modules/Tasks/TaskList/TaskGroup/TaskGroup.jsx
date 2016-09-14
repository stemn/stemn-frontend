import React from 'react';

import TaskListItemParent from '../TaskListItem/TaskListItemParent.jsx';

export default class Container extends React.Component {
  render() {
    const { item } = this.props;
    return (
      <div>
        <h3 className="text-mini-caps">{item.name}</h3>
        <TaskListItemParent cards={item.children} groupId={item._id}/>
      </div>
    );
  }
}
