import React from 'react'

import cn from 'classnames'
import classes from '../Tag/Tag.css'

import { middle as middleConcat } from 'stemn-shared/utils/stringConcat'

import MdClose from 'react-icons/md/close'

export default class TagEdit extends React.Component {
  render() {
    const { text, className, onClick, ...otherProps } = this.props
    return (
      <div className={ cn(classes.tag, classes.edit, className) } { ...otherProps }>
        <div className={ classes.tagInner }>
          { middleConcat(text, 30) }
        </div>
        <div 
          className={ cn(classes.close, 'layout-column layout-align-center-center') }
          onClick={ onClick }
        >
          <MdClose size={ 12 } />
        </div>
      </div>
    )
  }
}
