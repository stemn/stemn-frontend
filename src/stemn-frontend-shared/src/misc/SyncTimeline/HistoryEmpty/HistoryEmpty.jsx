import React, { Component } from 'react'
import cn from 'classnames'
import timelineVector from 'stemn-shared/assets/images/pure-vectors/timeline.svg'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import Link from 'stemn-shared/misc/Router/Link'

export default class HistoryEmpty extends Component {
  render() {
    const { className, isPublic, projectRouteParams } = this.props
    return (
      <InfoPanel
        className={ cn('layout-column layout-align-center-center text-center', className) }
        style={ { padding: '60px 20px' } }
      >
        <img src={ timelineVector } style={ { width: '80px' } } />
        <div className="text-title-4" style={ { marginBottom: '10px' } }>Project History</div>
        <div className="text-title-5">Here you'll find events related to your files and threads.</div>
        { isPublic
          ? <div className="text-title-5">Unfortunately, there is nothing here yet.</div>
          : <div className="text-title-5">
            <Link className="link-primary" name="projectThreadsRoute"  params={ projectRouteParams }>Create a thread</Link>
              &nbsp;or link a&nbsp;
            <Link className="link-primary" name="projectSettingsRoute" params={ projectRouteParams }>cloud file store</Link>
              &nbsp;to get started.
          </div>
        }
      </InfoPanel>
    )
  }
}
