import React, { Component, PropTypes } from 'react'
import classes from './Project.css'
import classNames from 'classnames'

import moment from 'moment'

import Link from 'stemn-shared/misc/Router/Link'

class Project extends Component {
  render () {
    const { project, className, size } = this.props;
    if (project && project.data) {
      const { _id: projectId, name, blurb, picture, updated } = project.data;

      return (
        <div className={ classNames(classes.project, 'layout-row', className) } >
          <div className="layout-column flex">
            <Link 
              className={ classNames('link-primary', classes.title) }
              name="projectRoute"
              params={ { projectId } }>
              { name }
            </Link>
            <div className={ classNames('flex', classes.blurb) }>{ blurb }</div>
            <div className={ classes.meta }>{ moment(updated).fromNow() }</div>
          </div>
          { size === 'wide' && picture
          ? <Link name="projectRoute" params={ { projectId } }>
              <img
                className={ classes.picture }
                src={`${GLOBAL_ENV.API_SERVER}${picture}?size=feed-sm&crop=true`}
              />
            </Link>
          : null }
        </div>
      )
    } else {
      return null;
    }
  }
}

export default Project
