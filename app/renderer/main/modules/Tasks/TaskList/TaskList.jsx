import React from 'react';

import {groupTasks} from '../Tasks.utils.js';
import TaskListItem from '../TaskListItem/TaskListItem.jsx';

export default React.createClass({
  render() {
    const { tasks, groups } = this.props;
    const groupedTasks = groupTasks(groups, tasks);

    return (
      <div className="flex">
        {groups.map((group)=>{
          return (
            <div>
              <h3>{group}</h3>
              {groupedTasks[group].map((item)=><TaskListItem key={item._id} item={item}></TaskListItem>)}
            </div>
          )
        })}
      </div>
    )
  }
});
