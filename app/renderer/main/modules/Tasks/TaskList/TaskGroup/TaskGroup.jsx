import React from 'react';
import { connect } from 'react-redux';

import TaskListItemParent from '../TaskListItem/TaskListItemParent.jsx';

class Component extends React.Component {
  render() {
    const { item } = this.props;
    return (
      <div style={{marginBottom: '20px'}}>
        <h3 className="text-mini-caps">{item.name}</h3>
        <TaskListItemParent cards={item.children} groupId={item._id}/>
      </div>
    );
  }
}

export default connect()(Component)
