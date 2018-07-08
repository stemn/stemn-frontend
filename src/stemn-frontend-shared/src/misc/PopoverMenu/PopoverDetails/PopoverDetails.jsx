import React from 'react'
import classes from './PopoverDetails.css'

class PopoverDetails extends React.Component {
  render() {
    const { children } = this.props
    return (
      <div className={ classes.body } { ...this.props }>
        {children}
      </div>
    )
  }
}

export default PopoverDetails
