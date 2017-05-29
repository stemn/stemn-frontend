import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import { groupBy, orderBy } from 'lodash'
import TimelineItem from './TimelineItem/TimelineItem'
import classes from './TimelineVertical.css'

const groupByDay = (data) => {
  const groupedObject = groupBy(data, item => moment(item.timestamp).format('YY/MM/DD'))
  const groupedArray = Object.keys(groupedObject).map(key => ({
    date: key,
    items: groupedObject[key],
  }))
  const groupedArrayOrdered = orderBy(groupedArray, 'date', 'desc')
  return groupedArrayOrdered
}

const getCalendarText = (time) => (moment(time).calendar().split(' at'))[0]

export default class TimelineVertical extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['feed', 'user', 'file', 'task', 'project']),
    items: PropTypes.array,
    group: PropTypes.bool,
    entity: PropTypes.object,
    timelineCacheKey: PropTypes.string,
  }
  renderItems = (items) => {
    return items.map((item, idx) => (
       <TimelineItem
         key={ item._id }
         item={ item }
         type={ this.props.type }
         entity={ this.props.entity }
         isFirst={ idx === 0 }
         isLast={ idx + 1 === items.length }
         timelineCacheKey={ this.props.timelineCacheKey }
        />
    ))
  }
  render() {
    const { items, type, group, entity, timelineCacheKey, ...otherProps } = this.props

    if (!items || items.length === 0) return <div className="text-title-5">Timeline empty</div>

    if (group) {
      const groupedByDay = groupByDay(items)
      return (
        <div { ...otherProps }>
          { groupedByDay.map((group) => (
            <div className={ classes.group } key={ group.date }>
              <div className={ classes.groupTitle + ' text-mini-caps' }>{ getCalendarText(group.items[0].timestamp) }</div>
              { this.renderItems(group.items) }
            </div>
          ))}
        </div>
      )
    } else {
      const orderedItems = orderBy(items, 'timestamp', 'desc')
      return <div>{ this.renderItems(orderedItems) }</div>
    }
  }
}
