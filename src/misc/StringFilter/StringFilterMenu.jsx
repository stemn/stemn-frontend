import React from 'react';
import { connect } from 'react-redux';

import { isFilterActive, addFilter } from './StringFilter.utils.js';

import classNames from 'classnames';

export const Component = React.createClass({
  render() {
    const { filter, model, value, dispatch } = this.props;
    return (
      <div>
      {filter.map((item, index) =>
         <a key={index}
           className={classNames({'active' : isFilterActive(filter, item.value, value)})}
           onClick={()=>addFilter({
              dispatch,
              model,
              value,
              filterArray: filter,
              filterString: item.value
            })}>
           {item.text}
         </a>
        )}
    </div>
   )
  }
})

export default connect()(Component);
