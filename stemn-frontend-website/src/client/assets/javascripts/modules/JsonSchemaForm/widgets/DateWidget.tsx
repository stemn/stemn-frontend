import * as React from 'react';
import { FieldTemplateProps, WidgetProps } from 'react-jsonschema-form';
// import * as moment from 'moment';

import Date from 'stemn-shared/misc/Calendar/Date/Date'

export const DateWidget = (props: WidgetProps & FieldTemplateProps) => {

  // const initial : moment.Moment = props.value || moment();

  console.log({ props })
  return (

    <Date
      required={props.required}
      model={ '' }
      onChange={ () => {} }
      value={ '' }
    />

    // <Calendar
    //   onNextMonth={ () => {
    //     initial.add(1, 'month')
    //   } }
    //   onPrevMonth={ {} }
    //   selectedDate={ initial }
    //   viewDate={ initial }
    //   onPickDate={ (newDate : moment.Moment) => {
    //     console.log(newDate)
    //     props.onChange(newDate.clone())
    //   }}
    //   renderDay={ (day : any) => day.format('D') }
    //   type="datepicker"
    // />

    // <DatePicker
    //   onChange={(event : any) => {
    //     console.log('here')
    //     console.log(event)
    //     // props.onChange(event.target.value)
    //   }}
    //   value={ props.value ||  moment().toISOString() }
    // />
  );
};
