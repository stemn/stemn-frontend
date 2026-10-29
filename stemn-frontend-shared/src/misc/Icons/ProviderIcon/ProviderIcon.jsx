import React from 'react'
import Drive from 'stemn-shared/assets/icons/providers/drive.jsx'
import Dropbox from 'stemn-shared/assets/icons/providers/dropbox.jsx'
import { MdCloudOff } from 'react-icons/md'

const ProviderIcon = ({ provider, ...otherProps }) => {
  if (provider === 'drive') {
    return <Drive {...otherProps} />
  } else if (provider === 'dropbox') {
    return <Dropbox {...otherProps} />
  }
  return <MdCloudOff {...otherProps} />
}

export default ProviderIcon
