import React from 'react';
import { connect } from 'react-redux';
import { isFilterActive, addFilter } from '../Tasks.utils.js';

import classNames from 'classnames';

const statusFilter = [{
  text: 'Status: Complete',
  value: 'is:complete',
},{
  text: 'Status: Incomplete',
  value: 'is:incomplete',
},{
  text: 'Status: All',
  value: ''
}];

const ownerFilter = [{
  text: 'My Tasks',
  value: 'author:DavidRevay'
},{
  text: 'All Tasks',
  value: ''
}];

export const Component = React.createClass({
  render() {
    const { model, value, dispatch } = this.props;

    /****************************************************
    model: the model representing the search string:
         : 'tasks.boards.123456789.searchString'
    value: the value of the search string
         : board.searchString
    ****************************************************/

    return (
      <div className="PopoverMenu">
        {statusFilter.map((item, index) =>
         <a key={index}
           className={classNames({'active' : isFilterActive(statusFilter, item.value, value)})}
           onClick={()=>addFilter({
              dispatch,
              model,
              value,
              filterArray: statusFilter,
              filterString: item.value
            })}>
           {item.text}
         </a>
        )}
        <div className="divider"></div>
        {ownerFilter.map((item, index) =>
         <a key={index}
           className={classNames({'active' : isFilterActive(ownerFilter, item.value, value)})}
           onClick={()=>addFilter({
             dispatch,
             model,
             value,
             filterArray: ownerFilter,
             filterString: item.value
           })}>
           {item.text}
         </a>
        )}
      </div>
    )
  }
});

export default connect()(Component);
