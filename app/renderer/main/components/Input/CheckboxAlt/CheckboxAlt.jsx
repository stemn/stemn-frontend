import React from 'react';
import { Field } from 'react-redux-form';
import {MdDone} from 'react-icons/lib/md';


// Styles
import classNames from 'classnames';
import classes from './CheckboxAlt.css'

export default class extends React.Component{
  render(){
    const id = Math.random().toString(36).substring(7);
    return (
      <div className={classes.radio}>
        <Field model={this.props.model} changeAction={this.props.changeAction}>
          <label className="layout-row layout-align-start-center">
            <input type="checkbox" value={this.props.value} />
            <div className="layout-row layout-align-start-center flex">
              <div className={classNames('flex', this.props.className)}>{this.props.children}</div>
              <MdDone size="16"/>
            </div>
          </label>
        </Field>
      </div>
    );
  }
};
