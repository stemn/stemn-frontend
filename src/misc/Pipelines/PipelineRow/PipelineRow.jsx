import React, { Component } from 'react'

import classNames from 'classnames'
import classes from './PipelineRow.css'
import Label from 'stemn-shared/misc/Label/Label'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx'

export default class PipelineRow extends Component {
  render() {
    return (
      <div className={ classNames(classes.row, 'layout-row layout-align-start-center') }>
        <UserAvatar
          style={ { marginRight: '10px' } }
          name="David Revay"
          size={ 25 }
          shape="square"
        />
        <div className={ classes.title }>Build and email STL files <span className={ classes.number }>#P1234</span></div>
        <div className="flex" />
        <Label>Passed</Label>
      </div>
    )
  }
}
