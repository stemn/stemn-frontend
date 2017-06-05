import React, { Component, PropTypes } from 'react'
import Link from 'stemn-shared/misc/Router/Link'

const entityToRouteMap = {
  thread: 'threadRoute',
  project: 'projectRoute',
  user: 'userRoute',
  commit: 'commitRoute',
  comment: 'threadRoute',
}

const getRouteNameFromEntity = (entity) => {
  const routeName = entityToRouteMap[entity]
  if (routeName) {
    return routeName
  } else {
    console.error('Route name not found for entity: ', entity)
    return undefined
  }
}

export default class NotificationLink extends Component {
  render () {
    const { entity } = this.props
    if (entity) {
      return (
        <Link className="link-primary" name={ getRouteNameFromEntity(entity.entityType) } params={ entity }>
          { entity.display || 'untitled' }
        </Link>
      )
    } else {
      return null
    }
  }
}
