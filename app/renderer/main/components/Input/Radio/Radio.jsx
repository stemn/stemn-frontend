import React from 'react';
import { Field } from 'react-redux-form';


// Styles
import classNames from 'classnames';
import classes from './Radio.css'

export default class extends React.Component{
  render(){
    const id = Math.random().toString(36).substring(7);
    return (
      <div className={classes.radio}>
        <Field model={this.props.model} changeAction={this.props.changeAction}>
          <label className="layout-row layout-align-start-center">
            <input type="radio" value={this.props.value} /> <span></span>
            <div className="layout-row layout-align-start-center flex">{this.props.children}</div>
          </label>
        </Field>
      </div>
    );
  }
};

//          <input className={this.props.value ? 'checked' : ''} type="radio" value={this.props.value} id={id}/>
//          <label htmlFor={id}>{this.props.children}</label>
