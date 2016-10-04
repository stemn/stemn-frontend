import React from 'react';
import { Control } from 'react-redux-form';

// Styles
import classes from './Checkbox.css';
import classNames from 'classnames';

export default (props) => {
  const id = Math.random().toString(36).substring(7);
  return (
    <div
      className={classNames(classes.checkbox, props.className, {[classes.checkboxCircle] : props.circle})}>
      <Control.checkbox
        className={props.value ? 'checked' : ''}
        id={id}
        model={props.model}
        changeAction={props.changeAction}/>
      <label htmlFor={id}></label>
    </div>
  )
}


//import React from 'react';
//import { Control } from 'react-redux-form';
//
//// Styles
//import classes from './Checkbox.css';
//import classNames from 'classnames';
//
//export default (props) => {
//  const id = Math.random().toString(36).substring(7);
//  return (
//    <Field
//      className={classNames(classes.checkbox, props.className, {[classes.checkboxCircle] : props.circle})}
//      model={props.model}
//      changeAction={props.changeAction}>
//      <input className={props.value ? 'checked' : ''} type="checkbox" id={id}/>
//      <label htmlFor={id}></label>
//    </Field>
//  )
//}
