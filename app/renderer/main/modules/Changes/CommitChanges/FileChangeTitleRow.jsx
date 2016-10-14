
import React from 'react';
import { Field, Form } from 'react-redux-form';

// Components
import Checkbox from 'app/renderer/main/components/Input/Checkbox/Checkbox';

// Styles
import styles from './FileChangeTitleRow.css';

export default React.createClass({
  render(){
    const { model, value, checkbox, changeAction, children, text } = this.props;
    return (
      <div className={styles.fileChangeTitleRow + ' layout-row layout-align-start-center'}>
        {checkbox ? <Checkbox className="text-primary" model={model} value={value} changeAction={changeAction}/> : null}
        <span className={styles.text + ' flex text-ellipsis'}>{text}</span>
        <div className="flex"></div>
        {children}
      </div>
    )
  }
});
