import React from 'react';
import { connect } from 'react-redux';
import { isFilterActive, addFilter } from 'app/renderer/main/modules/StringFilter/StringFilter.utils.js';
import StringFilterMenu from 'app/renderer/main/modules/StringFilter/StringFilterMenu.jsx';
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
        <StringFilterMenu filter={statusFilter} model={model} value={value}/>
        <div className="divider"></div>
        <StringFilterMenu filter={ownerFilter} model={model} value={value}/>
      </div>
    )
  }
});

export default connect()(Component);
