import React from 'react'
import Input from 'stemn-shared/misc/Input/Input/Input'

// Styles
import classes from './Checkbox.css'
import cn from 'classnames'

/** *******************************************
Works as either a 2-state checkbox or 3-state.

3-state checkbox requires !props.model
states: true || false || 'other';
******************************************** */

export default class Checkbox extends React.Component {
  render() {
    const { value, model, title, circle, className, changeAction } = this.props
    const id = Math.random().toString(36).substring(7)
    const statusClass = value === 'other' ? 'semi' : (value === true ? 'checked' : '')
    return (
      <div
        title={ title }
        className={ cn(classes.checkbox, className, { [classes.checkboxCircle]: circle }) }
      >
        <Input
          type="checkbox"
          className={ statusClass }
          id={ id }
          model={ model }
          value={ value }
          changeAction={ changeAction }
        />
        <label htmlFor={ id } />
      </div>
    )
  }
}
