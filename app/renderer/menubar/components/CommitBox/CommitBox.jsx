import React from 'react';
import styles from './CommitBox.css';
import { Field, Form } from 'react-redux-form';

import classNames from 'classnames';

// Components
import IconButton from 'app/renderer/main/components/Buttons/IconButton';
import {MdDone} from 'react-icons/lib/md';


export default class Commit extends React.Component {

  commitFiles() {
    if(this.name.value && this.description.value){
      this.props.commitFiles([], {
        name: this.name.value,
        description: this.description.value
      })
      this.name.value = '';
      this.description.value = '';
    }
  }

  render() {
    return (
      <div className="p-15">
        <Field model="changes.model.summary">
          <input className={styles.input} type="text" placeholder="Commit Summary" />
        </Field>
        <div className={classNames(styles.container, {[styles.containerShow]: this.props.changes.model.summary.length > 0})}>
          <Field model="changes.model.description">
            <textarea className={styles.textarea} placeholder="Detailed Description" ></textarea>
          </Field>
          <div className="layout-row layout-align-center">
            <IconButton onClick={()=>this.CommitFiles()}><MdDone size="22"/>Add Commit Message</IconButton>
          </div>
        </div>
      </div>
    );
  }
}
