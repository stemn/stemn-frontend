import React from 'react'
import Drive from 'stemn-shared/assets/icons/providers/drive.js'
import Dropbox from 'stemn-shared/assets/icons/providers/dropbox.js'

export default ({ provider, ...otherProps }) => {
  if (provider === 'drive') {
    return <Drive { ...otherProps } />
  } else if (provider === 'dropbox') {
    return <Dropbox { ...otherProps } />
  } 
  return <div { ...otherProps } />
}

