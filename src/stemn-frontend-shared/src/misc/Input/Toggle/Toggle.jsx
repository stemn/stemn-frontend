import React from 'react'
import Input from 'stemn-shared/misc/Input/Input/Input'
import cn from 'classnames'

// Styles
import styles from './Toggle.css'

export default class Toggle extends React.Component {
  render() {
    const { value, model, title, className, disabled, changeAction } = this.props

    const getStatusClass = () => {
      if (value === 'semi') {
        return 'semi'
      } else if (value) {
        return 'checked'
      } 
      return ''
    }

    const id = Math.random().toString(36).substring(7)
    return (
      <div
        title={ title }
        className={ cn(className, styles.toggle, { disabled }) }
      >
        <Input
          type="checkbox"
          value={ value }
          model={ model }
          changeAction={ changeAction }
          className={ getStatusClass() }
          id={ id }
        />
        <label htmlFor={ id } />
      </div>
    )
  }
}
