import React from 'react';
import { Field, Form } from 'react-redux-form';

// Styles
import classes from './Checkbox.css';
import classNames from 'classNames';

export default (props) => {
  const id = Math.random().toString(36).substring(7);
  return (
    <div className={classNames(classes.checkbox, props.className)}>
      <Field model={props.model} changeAction={props.changeAction}>
        <input className={props.value ? 'checked' : ''} type="checkbox" id={id}/>
        <label htmlFor={id}></label>
      </Field>
    </div>
  )
}
