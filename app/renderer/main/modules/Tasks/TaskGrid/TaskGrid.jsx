import React from 'react';

import { Field } from 'react-redux-form';

import {groupTasks} from '../Tasks.utils.js';
import TaskGridItem from '../TaskGridItem/TaskGridItem.jsx';

import classes from './TaskGrid.css';


export default React.createClass({
  render() {
    const { tasks, project, TasksActions } = this.props;
    const entityModel = `tasks.${project._id}`;
    const groupedTasks = groupTasks(tasks.groups, tasks.items);

    return (
      <div className={classes.container + ' layout-row flex'}>
        <div className={classes.row + ' layout-row flex'}>
          {tasks.groups.map((group)=>{
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
            <Field model={`${entityModel}.newGroupString`}>
              <input className={classes.newItem} type="text" placeholder="New Section"/>
            </Field>
            <button onClick={()=>TasksActions.newGroup({
              projectId: project._id,
              group: tasks.newGroupString
            })}>Submit</button>
          </div>
        </div>
      </div>
    )
  }
});
