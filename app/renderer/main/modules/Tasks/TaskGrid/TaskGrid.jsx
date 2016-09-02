import React from 'react';


import {groupTasks} from '../Tasks.utils.js';
import TaskGridItem from '../TaskGridItem/TaskGridItem.jsx';

import classes from './TaskGrid.css';


export default React.createClass({
  render() {
    const { tasks, groups } = this.props;
    const groupedTasks = groupTasks(groups, tasks);

    return (
      <div className={classes.container + ' layout-row flex'}>
        <div className={classes.row + ' layout-row flex'}>
          {groups.map((group)=>{
            return (
              <div className={classes.column}>
                <h3>{group}</h3>
                {groupedTasks[group].map((item)=><TaskGridItem key={item._id} item={item}></TaskGridItem>)}
                <input className={classes.newItem} type="text" placeholder="New Task"/>
              </div>
            )
          })}
          <div className={classes.column}>
            <h3>&nbsp;</h3>
            <input className={classes.newItem} type="text" placeholder="New Section"/>
          </div>
        </div>
      </div>
    )
  }
});
