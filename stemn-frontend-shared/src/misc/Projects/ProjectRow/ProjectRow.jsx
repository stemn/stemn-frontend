import React, { Component } from 'react'
import classes from './ProjectRow.css'
import cn from 'classnames'
import moment from 'moment'
import Link from 'stemn-shared/misc/Router/Link'
import LoadingPlaceholder from 'stemn-shared/misc/Loading/LoadingPlaceholder'
import LoadingAnimation from 'stemn-shared/misc/Loading/LoadingAnimation'

class Project extends Component {
  render() {
    const { project, className, size } = this.props

    if (project && project.data) {
      const { _id: projectId, name, blurb, picture, updated } = project.data

      return (
        <div className={ cn(classes.project, 'layout-row', className) } >
          <div className="layout-column flex">
            <Link
              className={ cn('link-primary', classes.title) }
              name="projectRoute"
              params={ { projectId } }
            >
              { name || 'Untitled Project' }
            </Link>
            <div className={ cn('flex', classes.blurb) }>{ blurb }</div>
            <div className={ classes.meta }>{ moment(updated).fromNow() }</div>
          </div>
          { size === 'wide' && picture
            ? <Link name="projectRoute" params={ { projectId } }>
              <img
                className={ classes.picture }
                src={ `${GLOBAL_ENV.API_SERVER}${picture}?size=feed-sm&crop=true` }
              />
            </Link>
            : null }
        </div>
      )
    } 
    return (
      <LoadingAnimation className={ cn(classes.project, 'layout-row', className) } >
        <div className="layout-column flex">
          <LoadingPlaceholder width={ 200 } className={ classes.title } />
          <div className={ classes.blurb }>
            <LoadingPlaceholder width={ 320 } style={ { marginBottom: '5px' } } />
            <LoadingPlaceholder width={ 300 } />
          </div>
          <LoadingPlaceholder width={ 200 } className={ classes.meta } />
        </div>
      </LoadingAnimation>
    )
  }
}

export default Project
