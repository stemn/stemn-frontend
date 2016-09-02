import React from 'react';

import { Field } from 'react-redux-form';
import Sortable from 'sortablejs';



import {groupTasks} from '../Tasks.utils.js';
import TaskGridItem from '../TaskGridItem/TaskGridItem.jsx';

import classes from './TaskGrid.css';


export default React.createClass({
  sortableContainersDecorator (componentBackingInstance) {
    // check if backing instance not null
    if (componentBackingInstance) {
      let options = {
        handle: ".group-title", // Restricts sort start click/touch to the specified element
        onMove: (event) => {
          console.log(event);
          return false
        }
      };
      Sortable.create(componentBackingInstance, options);
    }
  },

  sortableGroupDecorator (componentBackingInstance) {
    // check if backing instance not null
    if (componentBackingInstance) {
      let options = {
        draggable: "div", // Specifies which items inside the element should be sortable
        group: "shared",
        animation: 150,
        onMove: (event) => {
//          console.log(event);
          this.props.TasksActions.moveTask({
            projectId: this.props.project._id,
            group: event.from.id,
            taskId: event.dragged.id,
            beforeId: event.related.id
          })
          return false
        }
      };
      Sortable.create(componentBackingInstance, options);
    }
  },
  render() {
    const { tasks, project, TasksActions } = this.props;
    const entityModel = `tasks.${project._id}`;
    const groupedTasks = groupTasks(tasks.groups.map((item)=>item._id), tasks.items);

    const newGroup = (event) =>{
      console.log('new');
      event.preventDefault();
      TasksActions.newGroup({
        projectId: project._id,
        group: {
          name: tasks.newGroupString
        }
      })
    }

    return (
      <div className={classes.container + ' layout-row flex'}>
        <div className={classes.row + ' layout-row flex'}>
          {tasks.groups.map((group, index)=>{

            const newTask = (event)=>{
              event.preventDefault();
              TasksActions.newTask({
                projectId: project._id,
                task: {
                  title: tasks.newTaskString[group._id],
                  group: group._id
                }
              })
            }

            return (
              <div className={classes.column}>
                <h3>
                  <Field model={`${entityModel}.groups[${index}].name`}>
                    <input className="input-plain" type="text" placeholder="Title"/>
                  </Field>
                </h3>
                <div id={group._id} ref={this.sortableGroupDecorator}>
                  {groupedTasks[group._id].map((item)=><TaskGridItem key={item._id} item={item}></TaskGridItem>)}
                </div>
                <form name="form" onSubmit={newTask}>
                  <Field model={`${entityModel}.newTaskString[${group._id}]`}>
                    <input className={classes.newItem} type="text" placeholder="New Task"/>
                  </Field>
                </form>
              </div>
            )
          })}
          <div className={classes.column}>
            <h3>&nbsp;</h3>
            <form name="form" onSubmit={newGroup}>
              <Field model={`${entityModel}.newGroupString`}>
                <input className={classes.newItem} type="text" placeholder="New Section"/>
              </Field>
            </form>
          </div>
        </div>
      </div>
    )
  }
});


//export default class SortableExampleEsnext extends React.Component {
//
//
//
//  render() {
//    return (
//      <div className="container" ref={this.sortableContainersDecorator}>
//        <div className="group">
//          <h2 className="group-title">Group 1</h2>
//          <div className="group-list" ref={this.sortableGroupDecorator}>
//            <div>Swap them around</div>
//            <div>Swap us around</div>
//            <div>Swap things around</div>
//            <div>Swap everything around</div>
//          </div>
//        </div>
//        <div className="group">
//          <h2 className="group-title">Group 2</h2>
//          <div className="group-list" ref={this.sortableGroupDecorator}>
//            <div>Swap them around</div>
//            <div>Swap us around</div>
//            <div>Swap things around</div>
//            <div>Swap everything around</div>
//          </div>
//        </div>
//      </div>
//    );
//  }
//}
