import React from 'react'
import cn from 'classnames'
import { middle as middleConcat } from 'stemn-shared/utils/stringConcat'
import classes from './Tag.css'

export default class Tag extends React.Component {
  render() {
    const { text, className, children, ...otherProps } = this.props
    return (
      <div className={ cn(classes.tag, className) } { ...otherProps }>
        <div className={ cn(classes.tagInner, 'layout-row layout-align-start-center') }>
          { children }
          { middleConcat(text, 30) }
        </div>
      </div>
    )
  }
}
