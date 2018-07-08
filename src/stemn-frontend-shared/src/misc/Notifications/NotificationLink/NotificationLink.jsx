import React, { Component } from 'react'
import Link from 'stemn-shared/misc/Router/Link'

const entityToRouteMap = {
  thread: 'projectThreadRoute',
  project: 'projectRoute',
  user: 'userRoute',
  commit: 'commitRoute',
  comment: 'projectThreadRoute',
}

const getRouteNameFromEntity = (entity) => {
  const routeName = entityToRouteMap[entity]
  if (routeName) {
    return routeName
  } 
  console.error('Route name not found for entity: ', entity)
  return undefined
}

export default class NotificationLink extends Component {
  render() {
    const { entity, children } = this.props
    if (entity) {
      return (
        <Link className="link-primary" name={ getRouteNameFromEntity(entity.entityType) } params={ entity }>
          { children }
        </Link>
      )
    } 
    return null
  }
}
