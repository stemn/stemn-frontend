import React from 'react';
import Input from 'app/renderer/main/components/Input/Input/Input'
import MdDone from 'react-icons/md/done';

// Styles
import classes from './RadioAlt.css';
import classNames from 'classnames';

/*********************************************

*********************************************/

export default React.createClass({
  render(){
    const { value, model, className, changeAction, children} = this.props;
    const statusClass = value === true ? 'checked' : '';
    return (
      <div className={classNames(classes.radio, className)}>
        <label>
          <Input
            value={value}
            type="radio"
            className={statusClass}
            model={model}
          />
          <div className="layout-row layout-align-start-center flex">
            <div className="flex">{children}</div>
            <MdDone size="16"/>
          </div>
        </label>
      </div>
    )
  }
})
