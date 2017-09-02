import React, { Component } from 'react'
import classNames from 'classnames'
import comments from 'stemn-shared/assets/images/pure-vectors/comments.svg'

export default class ThreadTimelineEmpty extends Component {
  render() {
    const { className } = this.props
    return (
      <div className={ classNames('layout-column layout-align-center-center text-center', className) }>
        <img src={ comments } style={ { width: '80px' } } />
        <div className="text-title-4" style={ { marginBottom: '10px' } }>Thread timeline is empty</div>
        <div className="text-title-5">Items will appear here when you commit, <br />modify or comment on this thread.</div>
      </div>
    )
  }
}
