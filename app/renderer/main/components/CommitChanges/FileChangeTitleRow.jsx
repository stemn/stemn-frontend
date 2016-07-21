
import React from 'react';
import { Field, Form } from 'react-redux-form';

// Components
import Checkbox from '../Input/Checkbox/Checkbox';

// Styles
import styles from './FileChangeTitleRow.css';

export default (props) => {
  const checkbox = props.model ? <Checkbox model={props.model} value={props.value} changeAction={props.changeAction}/> : '';
  return (
    <div className={styles.fileChangeTitleRow + ' layout-row'}>
      {checkbox}
      <span className={styles.text + ' flex'}>{props.text}</span>
    </div>
  )
}
