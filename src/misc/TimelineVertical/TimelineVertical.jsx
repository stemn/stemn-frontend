// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';

// Sub Components
import TimelineItem from './TimelineItem/TimelineItem'

///////////////////////////////// COMPONENT /////////////////////////////////

export default React.createClass({
  render() {
    const { items } = this.props;
    return (
      <div>
        {items.map(item => <TimelineItem key={item._id} item={item}/>)}
      </div>
    )
  }
});
