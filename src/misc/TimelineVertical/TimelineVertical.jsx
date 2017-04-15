import React, { Component, PropTypes } from 'react';
import TimelineItem from './TimelineItem/TimelineItem'

export default class TimelineVertical extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['feed', 'user', 'file', 'task', 'project']),
    items: PropTypes.array,
  }
  render() {
    const { items, type } = this.props;
    return (
      <div>
        {items.map(item => <TimelineItem key={ item._id } item={ item } type={ type } />)}
      </div>
    )
  }
};
