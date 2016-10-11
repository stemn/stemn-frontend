
import React from 'react';
import { Field, Form } from 'react-redux-form';

// Components
import Checkbox from 'app/renderer/main/components/Input/Checkbox/Checkbox';

// Styles
import styles from './FileChangeTitleRow.css';

export default (props) => {
  const checkbox = props.model ? <Checkbox className="text-primary" model={props.model} value={props.value} changeAction={props.changeAction}/> : '';
  return (
    <div className={styles.fileChangeTitleRow + ' layout-row layout-align-start-center'}>
      {checkbox}
      <span className={styles.text + ' flex text-ellipsis'}>{props.text}</span>
      <div className="flex"></div>
      {props.children}
    </div>
  )
}
