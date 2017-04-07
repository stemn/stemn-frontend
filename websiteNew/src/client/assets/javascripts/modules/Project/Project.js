import React, { Component, PropTypes } from 'react'
import classes from './Project.css'
import classNames from 'classnames'

import { projectRoute } from 'route-actions'
import moment from 'moment'

import { Link } from 'react-router'

class Project extends Component {
  render () {
    const { project, className, size } = this.props;
console.log(this.props)
    if (project && project.data) {
      const { _id: projectId, name, blurb, picture, updated } = project.data;

      return (
        <div className={ classNames(classes.project, 'layout-row', className) } >
          <div className='layout-column flex'>
            <Link className={ classNames('link-primary', classes.title) } to={ projectRoute({projectId}) }>{ name }</Link>
            <div className={ classNames('flex', classes.blurb )}>{ blurb }</div>
            <div className={ classes.meta }>{ moment(updated).fromNow() }</div>
          </div>
          { size === 'wide' && picture
          ? <Link to={ projectRoute({ projectId }) }>
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
