import React from 'react'

import classNames from 'classnames'
import classes from '../Tag/Tag.css'

import { middle as middleConcat } from 'stemn-shared/utils/stringConcat'

import MdClose from 'react-icons/md/close'

export default class extends React.Component {
  render() {
    const { text, className, onClick, ...otherProps } = this.props
    return (
      <div className={ classNames(classes.tag, classes.edit, className) } { ...otherProps }>
        <div className={ classes.tagInner }>
          { middleConcat(text, 30) }
        </div>
        <div 
          className={ classNames(classes.close, 'layout-column layout-align-center-center') }
          onClick={ onClick }
        >
          <MdClose size={ 12 } />
        </div>
      </div>
    )
  }
}
