//import React from 'react';
//import styles from './CommitBox.css';
//import { Field, Form } from 'react-redux-form';
//
//import classNames from 'classnames';
//
//// Components
//import IconButton from 'app/renderer/main/components/Buttons/IconButton';
//import {MdDone} from 'react-icons/lib/md';
//
//
//export default class Commit extends React.Component {
//
//  commitFiles() {
//    if(this.name.value && this.description.value){
//      this.props.commitFiles([], {
//        name: this.name.value,
//        description: this.description.value
//      })
//      this.name.value = '';
//      this.description.value = '';
//    }
//  }
//
//  render() {
//    return (
//      <div>a</div>
//    );
//  }
//}
//
////      <div className="p-15">
////        <Field model="changes.model.summary">
////          <input className={styles.input} type="text" placeholder="Commit Summary" />
////        </Field>
////        <div className={classNames(styles.container, {[styles.containerShow]: this.props.changes.model.summary.length > 0})}>
////          <Field model="changes.model.description">
////            <textarea className={styles.textarea} placeholder="Detailed Description" ></textarea>
////          </Field>
////          <div className="layout-row layout-align-center">
////            <IconButton onClick={()=>this.CommitFiles()}><MdDone size="22"/>Add Commit Message</IconButton>
////          </div>
////        </div>
////      </div>


import React from 'react';

import classNames from 'classnames';
import styles from './CommitBox.css';
import { Field } from 'react-redux-form';


// Components
import IconButton from 'app/renderer/main/components/Buttons/IconButton';
import {MdDone} from 'react-icons/lib/md';
import { MentionsInput, Mention } from 'react-mentions'

export default React.createClass({
  transformDisplay: function(id, display) {
    return "@" + display
  },
  render() {
    const data = (search, callback) => {
      return [
        {
          id: '1',
          display: search
        }, {
          id: '2',
          display: 'name2'
        }
      ]
    }
    return (
      <div className="p-15">
        <Field model={`changes.${this.props.project._id}.summary`}>
          <input className={styles.input} type="text" placeholder="Summary"/>
        </Field>
        <div className={classNames(styles.container, {[styles.containerShow]: this.props.changes.summary && this.props.changes.summary.length > 0})}>
          <MentionsInput
            className={styles.mentionsBox}
            placeholder="Detailed Description"
            value={this.props.changes.description}
            displayTransform={this.transformDisplay}
            onChange={this.handleChange}>
            <Mention
            data={ data }
            style={{background: 'rgba(68, 183, 211, 0.3)'}} />
          </MentionsInput>

          <div className="layout-row layout-align-center">
            <IconButton onClick={()=>this.props.commitFn()}><MdDone size="22"/>Add Commit Message</IconButton>
          </div>
        </div>
      </div>
    );
  }
})
