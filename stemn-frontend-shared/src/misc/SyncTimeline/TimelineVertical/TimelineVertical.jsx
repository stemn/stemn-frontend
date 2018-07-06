import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { sum, get, groupBy, orderBy } from 'lodash'
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

// This will group events by type. It will produce an array of grouped events
// [event, event, event, { eventsGrouped: [ event, event ] }]
const eventsToGroup = ['revision', 'thread']
const groupByIdential = data => data.reduce((accum, currentItem, idx) => {
  const prevItem = data[idx - 1] || {}
  const isIdenticalToPrev = prevItem.event === currentItem.event
  const isInSameProject = get(prevItem, 'data.project._id') && get(prevItem, 'data.project._id') === get(currentItem, 'data.project._id')
  const isGroupable = eventsToGroup.includes(currentItem.event)
  if (isIdenticalToPrev && isInSameProject && isGroupable) {
    const indexInGroupedArray = accum.length - 1
    const itemInGroupedArray = accum[indexInGroupedArray]
    const prevItemIsGroup = itemInGroupedArray.eventsGrouped

    // If the previous item in the grouped array is a group.
    // We add this item to the group. Otherwise we init the group
    accum[indexInGroupedArray] = prevItemIsGroup
      ? {
        ...itemInGroupedArray,
        eventsGrouped: [
          ...itemInGroupedArray.eventsGrouped,
          currentItem,
        ],
      }
      : {
        ...itemInGroupedArray,
        eventsGrouped: [
          prevItem,
          currentItem,
        ],
      }
  } else {
    accum.push(currentItem)
  }
  return accum
}, [])

const getCalendarText = time => (moment(time).calendar().split(' at'))[0]

const getNumberOfGroupedItems = dayGroups => sum(dayGroups.map(dayGroup => dayGroup.items.length))

export default class TimelineVertical extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['feed', 'user', 'file', 'thread', 'project']),
    items: PropTypes.array,
    group: PropTypes.bool,
    entity: PropTypes.object,
    timelineCacheKey: PropTypes.string,
  }
  renderItems = (items, forceExpand) => 
    // We force the group to be expanded if there are
    // only a few groups to display on the page
    items.map((item, idx) => (
      <TimelineItem
        key={ item._id }
        item={ item }
        type={ this.props.type }
        entity={ this.props.entity }
        isFirst={ idx === 0 }
        isLast={ idx + 1 === items.length }
        timelineCacheKey={ this.props.timelineCacheKey }
        forceExpand={ forceExpand }
      />
    ))
  
  render() {
    const { items, type, group, entity, timelineCacheKey, ...otherProps } = this.props

    if (!items || items.length === 0) return <div className="text-title-5">Timeline empty</div>

    if (group) {
      const groupedByDay = groupByDay(items)
      const groupedByDayAndEvent = groupedByDay.map(group => ({
        ...group,
        items: groupByIdential(group.items),
      }))

      const numberOfGroupedItems = getNumberOfGroupedItems(groupedByDayAndEvent)
      // We force all the groups to be expanded if there are fewer than 15 timeline items.
      const forceExpand = numberOfGroupedItems < 15

      return (
        <div { ...otherProps }>
          { groupedByDayAndEvent.map(group => (
            <div className={ classes.group } key={ group.date }>
              <div className={ `${classes.groupTitle} text-mini-caps` }>{ getCalendarText(group.items[0].timestamp) }</div>
              { this.renderItems(group.items, forceExpand) }
            </div>
          ))}
        </div>
      )
    } 
    // Items are ordered with most recent at bottom (thread)
    // otherwise, most recent up top.
    const orderedItems = orderBy(items, 'timestamp', type === 'thread' ? 'asc' : 'desc')
    return <div>{ this.renderItems(orderedItems, false) }</div>
  }
}
