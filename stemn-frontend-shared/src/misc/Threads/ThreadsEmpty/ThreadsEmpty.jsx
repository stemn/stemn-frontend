import React, { Component } from 'react'
import cn from 'classnames'
import comments from 'stemn-shared/assets/images/pure-vectors/comments.svg'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'

export default class ThreadTimelineEmpty extends Component {
  render() {
    const { className } = this.props
    return (
      <InfoPanel
        className={ cn('layout-column layout-align-center-center text-center', className) }
        style={ { padding: '60px 20px' } }
      >
        <img src={ comments } style={ { width: '80px' } } />
        <div className="text-title-4" style={ { marginBottom: '10px' } }>Project Threads</div>
        <div className="text-title-5">Threads are used to track threads and questions related to this project.</div>
        <div className="text-title-5">There are no threads here yet.</div>
      </InfoPanel>
    )
  }
}
