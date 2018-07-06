import React, { Component } from 'react'
import cn from 'classnames'
import timelineVector from 'stemn-shared/assets/images/pure-vectors/timeline.svg'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import Link from 'stemn-shared/misc/Router/Link'

export default class PipelinesEmpty extends Component {
  render() {
    const { className, isPublic } = this.props
    return (
      <InfoPanel
        className={ cn('layout-column layout-align-center-center text-center', className) }
        style={ { padding: '60px 20px' } }
      >
        <img src={ timelineVector } style={ { width: '80px' } } />
        <div className="text-title-4" style={ { marginBottom: '10px' } }>Project Pipelines</div>
        <div className="text-title-5">Here you'll find the automation pipeline results.</div>
        { isPublic
          ? <div className="text-title-5">Unfortunately, there is nothing here yet.</div>
          : <div className="text-title-5">
              No pipleines have been triggered.&nbsp;
            <Link className="link-primary" name="helpAutomationPipelines">Learn more.</Link>
          </div>
        }
      </InfoPanel>
    )
  }
}
