import React from 'react';
import moment from 'moment';

import { connect } from 'react-redux';
import { actions } from 'react-redux-form';

import classNames from 'classnames';
import classes from './DatePicker.css';
import Calendar from '../Calendar.jsx'


export const Component = React.createClass({
  getInitialState() {
    return {
      viewDate: moment(),
      isOpen: false,
      calendarIsOpen: false,
    }
  },
  toggle(openStatus) {
    this.setState({isOpen: openStatus === undefined ? !this.state.isOpen : openStatus})
  },
  toggleCalendar(openStatus) {
    this.setState({calendarIsOpen: openStatus === undefined ? !this.state.calendarIsOpen : openStatus})
  },
  selectDate(date) {
    this.props.dispatch(actions.change(this.props.model, date ? date.format() : ''));
    this.toggle(false);
    if(this.props.onChange){ this.props.onChange() }
  },
  render() {
    const { viewDate, isOpen, calendarIsOpen } = this.state;
    const { model, value, dispatch, onChange } = this.props;
    const valueDate = value ? moment(value) : '';
    const currentTime = moment();

    const options = [{
      name: 'Later today',
      value: moment().startOf('day').add(15, 'hours')
    },{
      name: 'Tomorrow',
      value: moment().add(1, 'day').startOf('day').add(10, 'hours')
    },{
      name: 'In a few days',
      value: moment().add(3, 'days').startOf('day').add(10, 'hours')
    },{
      name: 'In a week',
      value: moment().add(1, 'week')
    }];

    const filteredOptions = options.filter((option) => option.value > currentTime);

    const content = (
      <div className={classes.popup}>
        { calendarIsOpen
        ? <Calendar
            onNextMonth={() => this.setState({ viewDate: viewDate.clone().add(1, 'months') }) }
            onPrevMonth={() => this.setState({ viewDate: viewDate.clone().subtract(1, 'months') }) }
            selectedDate={valueDate}
            viewDate={viewDate}
            onPickDate={this.selectDate}
            renderDay={(day) => day.format('D')}
            type="datepicker"
          />
        : filteredOptions.map((option, index) => (
          <a key={index} className={classes.fixedOption + ' layout-row layout-align-start-center'} onClick={() => this.selectDate(option.value)}>
            <div className="flex">{option.name}</div>
            <div className={classes.fixedOptionTime}>{option.value.calendar()}</div>
          </a>)
        )}
        <a onClick={() => this.toggleCalendar()} className={classNames(classes.fixedOption, classes.divider, 'layout-row layout-align-start-center')}>
          <div className="flex">{calendarIsOpen ? 'Simple selector...' : 'Other...'}</div>
        </a>
      </div>
    )
    return (
      <div className="rel-box">
        <div className={classNames('dr-input', classes.input, {'active' : isOpen})} onClick={()=>this.toggle()}>
          {valueDate ? valueDate.calendar() : 'Select a due date'}
        </div>
        { valueDate ? <a className={classes.close} onClick={() => this.selectDate()}>×</a> : null}
        { isOpen ? content : null }
      </div>
    );
  }
});



export default connect()(Component);
