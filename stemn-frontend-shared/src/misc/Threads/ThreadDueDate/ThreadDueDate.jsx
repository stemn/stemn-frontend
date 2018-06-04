import React, { Component } from 'react'
import moment from 'moment'

export default class DueDate extends Component {
  render() {
    const { due } = this.props
    const day = 1000 * 60 * 60 * 24
    const colorMap = [{
      period: 1 * day,
      color: 'red',
    }, {
      period: 3 * day,
      color: 'orange',
    },
    ]
    const currentTime = moment().valueOf()
    const dueTime     = moment(due).valueOf()
    const difference  = dueTime - currentTime
    const currentInfo = colorMap.find(({ period, color }) => difference < period)
    const style       = currentInfo
      ? { color: currentInfo.color }
      : { color: 'rgba(0, 0, 0, 0.4)' }

    if (due) {
      return (
        <span
          className="text-ellipsis"
          style={ style }
        >
          Due {moment(due).fromNow()}
        </span>
      )
    } 
    return null
  }
}
