import React from 'react';
import classNames from 'classnames';

// Components
import Checkbox from 'stemn-frontend-shared/src/misc/Input/Checkbox/Checkbox';

// Styles
import styles from './FileChangeRow.css';

export default (props) => {
  // Classes
  const rowClasses = classNames({
    [styles.fileChangeRow]: true,
    'layout-row' : true,
    'layout-align-start-center' : true
  });

  // Template
  return (
    <div className={rowClasses}>
      <div className={styles.checkbox}>
        <Checkbox model={props.model} value={props.value}/>
      </div>
      <div className={styles.text + ' flex'}>{props.text}</div>
    </div>
  )
}
