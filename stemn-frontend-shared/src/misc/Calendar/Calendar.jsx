import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import createDateObjects from './createDateObjects'

import cn from 'classnames'
import classes from './Calendar.css'

export default class Calendar extends Component {
  static propTypes = {
    weekOffset: PropTypes.number.isRequired,
    type: PropTypes.string, // 'datepicker'

    selectedDate: PropTypes.object.isRequired,
    viewDate: PropTypes.object.isRequired,

    renderDay: PropTypes.func,
    onNextMonth: PropTypes.func.isRequired,
    onPrevMonth: PropTypes.func.isRequired,
    onPickDate: PropTypes.func,
  }

  static defaultProps = {
    weekOffset: 0,
    renderDay: day => day.format('YYYY-MM-D'),
  }


  render() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const { className, selectedDate, viewDate, type, weekOffset, renderDay, onNextMonth, onPrevMonth, onPickDate } = this.props

    const calendarObject = createDateObjects(viewDate, weekOffset)

    calendarObject.forEach((item) => {
      if (selectedDate && item.day.format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')) {
        item.cn = item.cn ? `${item.cn} selected` : 'selected'
      }
      if (item.day.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
        item.cn = item.cn ? `${item.cn} current` : 'current'
      }
    })


    return (
      <div className={ cn(className, classes.calendar, { [classes.calendarDatepicker]: type === 'datepicker' }) }>

        {
          type === 'datepicker'
            ?
              <div className={ classes.calendarHeader }>
              <button onClick={ onPrevMonth }>&laquo;</button>
              <div className={ classes.calendarHeaderCurrentDate }>{viewDate.format('MMMM YYYY')}</div>
              <button onClick={ onNextMonth }>&raquo;</button>
            </div>
            :
            null
        }
        <div className={ classes.calendarGrid }>
          {days.map(day =>
            <div key={ day } className={ cn(classes.calendarGridItem, classes.dayHeader) }>
              {day}
            </div>,
          )}
          {calendarObject.map((day, i) =>
            <div
              key={ `day-${i}` }
              className={ cn(day.cn, classes.calendarGridItem) }
              onClick={ e => onPickDate(day.day) }
            >
              <span>{renderDay(day.day)}</span>
            </div>,
          )}
        </div>
      </div>
    )
  }
}
