import React from 'react';
import moment from 'moment';

import classNames from 'classnames';
import classes from './DatePicker.css';
import Calendar from '../Calendar.jsx'


export default React.createClass({
  getInitialState () {
    return {
      selectedDate: moment(),
      viewDate: moment(),
      isOpen: false,
    }
  },
  toggle(openStatus) {
    this.setState({'isOpen': openStatus || !this.state.isOpen})
  },
  render() {
    return (
      <div className="rel-box">
        <div className={classNames('dr-input', {'active' : this.state.isOpen})} onClick={()=>this.toggle()}>{this.state.selectedDate.format('dddd, Do MMMM')}</div>
        {
          this.state.isOpen
          ?
          <Calendar
            className={classes.popup}
            onNextMonth={() => this.setState({ viewDate: this.state.viewDate.clone().add(1, 'months') }) }
            onPrevMonth={() => this.setState({ viewDate: this.state.viewDate.clone().subtract(1, 'months') }) }
            selectedDate={this.state.selectedDate}
            viewDate={this.state.viewDate}
            onPickDate={(date) => { this.setState({selectedDate: date }); this.toggle(false) }}
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
