
import React from 'react';

// Components
import Checkbox from 'stemn-shared/misc/Input/Checkbox/Checkbox';
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
