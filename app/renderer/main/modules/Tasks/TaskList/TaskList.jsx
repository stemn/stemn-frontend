import React from 'react';

//import TaskListItem from './TaskListItem/TaskListItem.jsx';
//import TaskGroup from './TaskGroup/TaskGroup.jsx';
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

//        {structure.map((group)=>{
//          return (
//            <div style={{marginBottom: '20px'}}>
//              <h3 className="text-mini-caps">{group.name}</h3>
//              <TaskGroup cards={group.children} groupId={group._id}/>
//            </div>
//          )
//        })}
//              {group.children.map((item)=><TaskListItem key={item._id} item={item}></TaskListItem>)}
