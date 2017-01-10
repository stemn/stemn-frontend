import React from 'react';
import { connect } from 'react-redux';
import { isFilterActive, addFilter } from 'stemn-shared/misc/StringFilter/StringFilter.utils.js';
import StringFilterMenu from 'stemn-shared/misc/StringFilter/StringFilterMenu.jsx';
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


export const Component = React.createClass({
  render() {
    const { model, value, dispatch, auth } = this.props;

    const ownerFilter = [{
      text: 'My Tasks',
      value: `assignee:${auth.user.stub}`
    },{
      text: 'All Tasks',
      value: ''
    }];

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

function mapStateToProps({ auth }) {
  return {
    auth
  };
}

export default connect(mapStateToProps)(Component);
