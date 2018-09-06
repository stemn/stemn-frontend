import React from 'react'
import Input from 'stemn-shared/misc/Input/Input/Input'
import MdDone from 'react-icons/md/done'

// Styles
import classes from './RadioAlt.css'
import cn from 'classnames'

/** *******************************************

******************************************** */

export default class RadioAlt extends React.Component {
  render() {
    const {
      value,
      model,
      className,
      children,
    } = this.props
    const statusClass = value === true ? 'checked' : ''
    return (
      <div className={ cn(classes.radio, className) }>
        <label>
          <Input
            value={ value }
            type="radio"
            className={ statusClass }
            model={ model }
          />
          <div className="layout-row layout-align-start-center flex">
            <div className="flex">{children}</div>
            <MdDone size="16" />
          </div>
        </label>
      </div>
    )
  }
}
