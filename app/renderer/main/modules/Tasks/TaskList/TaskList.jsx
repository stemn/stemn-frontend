import React from 'react';

import TaskGroupParent from './TaskGroup/TaskGroupParent.jsx';

export default React.createClass({
  render() {
    const { structure } = this.props;

    return (
      <div className="flex">
        <TaskGroupParent groups={structure}/>
      </div>
    )
  }
});
