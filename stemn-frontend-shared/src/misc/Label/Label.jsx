// Component Core
import React from 'react'
import { middle as middleConcat } from 'stemn-shared/utils/stringConcat'
import { omit } from 'lodash'

// Styles
import classes from './Label.css'

// /////////////////////////////// COMPONENT /////////////////////////////////

export default class extends React.Component {
  render() {
    const { children } = this.props
    return (
      <span className={ classes.label } { ...omit(this.props, ['children']) } >
        {children}
      </span>
    )
  }
}
