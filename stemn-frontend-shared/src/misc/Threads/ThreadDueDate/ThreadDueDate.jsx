import React, { Component } from 'react'
import { dayjs, fromNow } from 'stemn-shared/utils/date'

export default class DueDate extends Component {
  render() {
    const { due } = this.props
    const day = 1000 * 60 * 60 * 24
    const colorMap = [
      {
        period: 1 * day,
        color: 'red',
      },
      {
        period: 3 * day,
        color: 'orange',
      },
    ]
    const currentTime = dayjs().valueOf()
    const dueTime = dayjs(due).valueOf()
    const difference = dueTime - currentTime
    const currentInfo = colorMap.find(({ period, color }) => difference < period)
    const style = currentInfo ? { color: currentInfo.color } : { color: 'rgba(0, 0, 0, 0.4)' }

    if (due) {
      return (
        <span className="text-ellipsis" style={style}>
          Due {fromNow(due)}
        </span>
      )
    }
    return null
  }
}
