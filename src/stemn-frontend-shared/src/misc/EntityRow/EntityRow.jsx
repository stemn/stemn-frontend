import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classes from './EntityRow.css'
import cn from 'classnames'
import Highlight from 'stemn-shared/misc/Autosuggest/Highlight'
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar'
import Link from 'stemn-shared/misc/Router/Link'
import LoadingPlaceholder from 'stemn-shared/misc/Loading/LoadingPlaceholder'
import LoadingAnimation from 'stemn-shared/misc/Loading/LoadingAnimation'
import SocialButton from 'stemn-shared/misc/Social/SocialButton'

const getRouteNameAndParams = (data) => {
  if (data.entityType === 'project') {
    return {
      name: 'projectRoute',
      params: {
        projectId: data._id,
      },
    }
  } else if (data.entityType === 'thread') {
    return {
      name: 'threadRoute',
      params: {
        threadId: data._id,
      },
    }
  } else if (data.entityType === 'commit') {
    return {
      name: 'commitRoute',
      params: {
        commitId: data._id,
      },
    }
  } else if (data.entityType === 'field') {
    return {
      name: 'fieldRoute',
      params: {
        fieldId: data._id,
      },
    }
  } 
  return {
    name: 'userRoute',
    params: {
      userId: data._id,
    },
  }
}

export default class EntityRow extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired, // The Entity's data
    query: PropTypes.string,  // Search query (used to highlight the name)
    nofollow: PropTypes.bool, // Should the follow button be hidden
    children: PropTypes.node, // Children to be displayed in the far right
  }
  static defaultProps = {
    data: {},
  }
  render() {
    const { data, query, loading, className, nofollow, children } = this.props
    const route = getRouteNameAndParams(data)

    if (loading || !data._id) {
      return (
        <LoadingAnimation className={ cn('layout-row layout-align-start-center', classes.row, className) } >
          <UserAvatar size={ 40 } shape="square" className={ classes.avatar } />
          <div className="flex">
            <LoadingPlaceholder width={ 200 } className={ classes.link } />
            <LoadingPlaceholder width={ 300 } className={ classes.blurb } />
          </div>
        </LoadingAnimation>
      )
    } 
    return (
      <div className={ cn('layout-row layout-align-start-center', classes.row, className) } >
        <UserAvatar
          size={ 40 }
          shape="square"
          name={ data.name }
          picture={ data.picture }
          className={ classes.avatar }
        />
        <div className="flex">
          <Link className={ cn(classes.link, 'link-primary') } name={ route.name } params={ route.params }>
            <Highlight
              className="text-ellipsis"
              text={ data.name || 'Untitled' }
              query={ query }
              hightlightClass={ classes.highlight }
            />
          </Link>
          <div className={ `${classes.blurb} text-ellipsis` }>{ data.blurb }</div>
        </div>
        { nofollow
          ? null
          : <SocialButton
            className={ classes.socialButton }
            type="follow"
            entityType={ data.entityType }
            entityId={ data._id }
          /> }
        { children }
      </div>
    )
  }
}
