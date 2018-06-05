import getUuid from 'stemn-shared/utils/getUuid.js'
import { findIndex } from 'lodash'
import webGerber from './viewer/webGerber.js'

export const activeInstances = []

export const register = () => {
  const id = getUuid()
  const instance = webGerber()
  instance.id = id
  activeInstances.push(instance)
  return instance
}

export const deregister = (instance) => {
  if (instance) {
    instance.destroy()
    activeInstances.splice(findIndex(activeInstances, 'id', instance.id), 1)
  }
}
