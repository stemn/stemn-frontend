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
    }
  },
  toggle(openStatus) {
    this.setState({'isOpen': openStatus || !this.state.isOpen})
  },
  selectDate(date) {
    this.props.dispatch(actions.change(this.props.model, date.format()));
    this.toggle(false)
  },
  render() {
    const { viewDate, isOpen } = this.state;
    const { model, value, dispatch } = this.props;
    const valueDate = moment(value);

    return (
      <div className="rel-box">
        <div className={classNames('dr-input', {'active' : isOpen})} onClick={()=>this.toggle()}>
          {valueDate ? valueDate.format('dddd, Do MMMM') : 'Select a due date'}
        </div>
        {
          isOpen
          ?
          <Calendar
            className={classes.popup}
            onNextMonth={() => this.setState({ viewDate: viewDate.clone().add(1, 'months') }) }
            onPrevMonth={() => this.setState({ viewDate: viewDate.clone().subtract(1, 'months') }) }
            selectedDate={valueDate}
            viewDate={viewDate}
            onPickDate={this.selectDate}
            renderDay={(day) => day.format('D')}
            type="datepicker"
          />
          :
          null
        }
      </div>
    );
  }
});

export default connect()(Component);
