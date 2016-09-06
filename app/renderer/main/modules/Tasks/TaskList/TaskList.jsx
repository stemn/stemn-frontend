import React from 'react';

import TaskListItem from './TaskListItem/TaskListItem.jsx';

export default React.createClass({
  render() {
    const { structure } = this.props;

    return (
      <div className="flex">
        {structure.map((group)=>{
          return (
            <div style={{marginBottom: '20px'}}>
              <h3 className="text-mini-caps">{group.name}</h3>
              {group.children.map((item)=><TaskListItem key={item._id} item={item}></TaskListItem>)}
            </div>
          )
        })}
      </div>
    )
  }
});
