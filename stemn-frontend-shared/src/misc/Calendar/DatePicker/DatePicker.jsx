import React from 'react'
import { addMonths, calendar, dayjs } from 'stemn-shared/utils/date'

import { connect } from 'react-redux'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions'

import cn from 'classnames'
import classes from './DatePicker.module.css'
import Calendar from '../Calendar.jsx'
import PopoverFit from 'stemn-shared/misc/PopoverMenu/PopoverFit'
import { MdExpandMore, MdClose } from 'react-icons/md'
import Button from 'stemn-shared/misc/Buttons/Button/Button'

export class Component extends React.Component {
  state = {
    viewDate: dayjs(),
    calendarIsOpen: false,
  }

  toggleCalendar = (openStatus) => {
    this.setState((state) => ({ calendarIsOpen: openStatus === undefined ? !state.calendarIsOpen : openStatus }))
  }

  selectDate = (date) => {
    const value = date ? date.format() : ''
    // Model-bound use writes the store; controlled use (no model) only gets onChange(value)
    if (this.props.model) this.props.dispatch(storeChange(this.props.model, value))
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  render() {
    const { viewDate, calendarIsOpen } = this.state
    const { model, value, dispatch, onChange, className, style, ...otherProps } = this.props
    const valueDate = value ? dayjs(value) : ''
    const currentTime = dayjs()

    const options = [
      {
        name: 'Later today',
        value: dayjs().startOf('day').add(15, 'hours'),
      },
      {
        name: 'Tomorrow',
        value: dayjs().add(1, 'day').startOf('day').add(10, 'hours'),
      },
      {
        name: 'In a few days',
        value: dayjs().add(3, 'days').startOf('day').add(10, 'hours'),
      },
      {
        name: 'In a week',
        value: dayjs().add(1, 'week'),
      },
    ]

    const filteredOptions = options.filter((option) => option.value > currentTime)

    const content = (
      <div className={classes.popup}>
        {calendarIsOpen ? (
          <Calendar
            onNextMonth={() => this.setState({ viewDate: addMonths(viewDate, 1) })}
            onPrevMonth={() => this.setState({ viewDate: addMonths(viewDate, -1) })}
            selectedDate={valueDate}
            viewDate={viewDate}
            onPickDate={this.selectDate}
            renderDay={(day) => day.format('D')}
            type="datepicker"
          />
        ) : (
          filteredOptions.map((option, index) => (
            <a
              key={index}
              className={`${classes.fixedOption} layout-row layout-align-start-center`}
              onClick={() => this.selectDate(option.value)}
            >
              <div className="flex">{option.name}</div>
              <div className={classes.fixedOptionTime}>{calendar(option.value)}</div>
            </a>
          ))
        )}
        <a
          onClick={() => this.toggleCalendar()}
          className={cn(classes.fixedOption, classes.divider, 'layout-row layout-align-start-center')}
        >
          <div className="flex">{calendarIsOpen ? 'Simple selector...' : 'Other...'}</div>
        </a>
      </div>
    )
    return (
      <PopoverFit max disableClickClose {...otherProps} style={{ width: '100%' }}>
        <Button
          className={cn('layout-row layout-align-start-center flex rel-box light', className)}
          style={{ width: '100%' }}
        >
          {valueDate ? calendar(valueDate) : 'Select a due date'}
          <div className="flex" />
          {valueDate && <MdClose onClick={() => this.selectDate()} style={{ marginLeft: '5px' }} size={12} />}
          <MdExpandMore style={{ marginLeft: '5px' }} size={15} />
        </Button>
        {content}
      </PopoverFit>
    )
  }
}

export default connect()(Component)
