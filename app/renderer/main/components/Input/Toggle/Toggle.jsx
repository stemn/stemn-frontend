import React from 'react';
import { Field } from 'react-redux-form';

// Styles
import styles from './Toggle.css';

export default React.createClass({
  render(){
    const { value, model, title, className, changeAction} = this.props;

    const id = Math.random().toString(36).substring(7);

    return (
      <div
        title={title}
        className={styles.toggle}>
        { model
        ? (
        <Field
          model={model}
          changeAction={changeAction}>
          <input
            type="checkbox"
            className={value ? 'checked' : ''}
            id={id}
          />
          <label htmlFor={id}></label>
        </Field>)
        : (
        <input
          type="checkbox"
          value={value}
          onChange={()=>{changeAction(!value)}}
          className={value ? 'checked' : ''}
          id={id}
        />)}
        <label htmlFor={id}></label>
      </div>
    )
  }
})
