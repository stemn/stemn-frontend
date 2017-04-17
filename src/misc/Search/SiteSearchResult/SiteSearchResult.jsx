import React, { Component, PropTypes } from 'react'
import classes from './SiteSearchResult.css'
import classNames from 'classnames';
import Highlight from 'stemn-shared/misc/Autosuggest/Highlight'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import Link from 'stemn-shared/misc/Router/Link'

const getRouteNameAndParams = (result) => {
  console.log(result);
  if (result.entityType === 'project') {
    return {
      name: 'projectRoute',
      params: {
        projectId: result._id,
      },
    }
  } else if (result.entityType === 'task') {
    return {
      name: 'taskRoute',
      params: {
        taskId: result._id,
      },
    }
  } else if (result.entityType === 'commit') {
    return {
      name: 'commitRoute',
      params: {
        commitId: result._id,
      },
    }
  } else if (result.entityType === 'field') {
    return {
      name: 'fieldRoute',
      params: {
        fieldId: result._id,
      },
    }
  } else {
    return {
      name: 'userRoute',
      params: {
        userId: result._id,
      },
    }
  }
}

export default class SiteSearchResult extends Component {
  render() {
    const { result, searchQuery } = this.props
    const route = getRouteNameAndParams(result)

    return (
      <div className={ classNames('layout-row layout-align-start-center', classes.result) } >
        <UserAvatar
          size={ 40 }
          shape="square"
          name={ result.name }
          picture={ result.picture }
          className={ classes.avatar }
        />
        <div className="flex">
          <Link className="link-primary" name={ route.name } params={ route.params }>
            <Highlight
              className="text-ellipsis"
              text={ result.name }
              query={ searchQuery }
              hightlightClass={ classes.highlight }
            />
          </Link>
          <div className={ classes.blurb + ' text-ellipsis'}>{ result.blurb }</div>
        </div>
      </div>
    )
  }
}
