import React from 'react';
import Input from 'electron/app/renderer/main/components/Input/Input/Input'

// Styles
import classNames from 'classnames';
import classes from './Radio.css'

export default class extends React.Component{
  render(){
    const { value, model, modelValue, children } = this.props;
    return (
      <div className={classes.radio}>
        <label className="layout-row layout-align-start-center">
          <Input
            value={value}
            type="radio"
            className={classNames({[classes.checked] : modelValue == value})}
            model={model}
          />
          <span className="layout-column layout-align-center-center"></span>
          <div className="layout-row layout-align-start-center flex">{children}</div>
        </label>
      </div>
    );
  }
};
