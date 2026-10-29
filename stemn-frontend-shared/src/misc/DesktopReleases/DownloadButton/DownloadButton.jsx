import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import classes from './DownloadButton.css'

import WindowsIcon from 'stemn-shared/assets/icons/os/windows'
import LinuxIcon from 'stemn-shared/assets/icons/os/linux'
import AppleIcon from 'stemn-shared/assets/icons/os/apple'

const getIcon = (platform, size) => {
  if (platform === 'mac') {
    return <AppleIcon className={ classes.icon } size={ size } />
  } else if (platform === 'linux') {
    return <LinuxIcon className={ classes.icon } size={ size } />
  } 
  return <WindowsIcon className={ classes.icon } size={ size } />
}

const determinePlatform = () => {
  const platform = window.navigator.platform.toUpperCase()
  if (platform.includes('MAC')) {
    return 'mac'
  } else if (platform.includes('WIN')) {
    return 'windows'
  } else if (platform.includes('LINUX')) {
    return 'linux'
  } 
  console.error('Unknown Platform', platform)
  return 'windows'
}

export default class DownloadButton extends Component {
  static propTypes = {
    platform: PropTypes.oneOf(['windows', 'mac', 'linux', 'auto']).isRequired,
    latest: PropTypes.object.isRequired,
    size: PropTypes.number,
  }

  static defaultProps = {
    size: 20,
    platform: 'auto',
  }

  render() {
    const { platform, size, latest, children, ...otherProps } = this.props

    const platformActual = platform === 'auto'
      ? determinePlatform()
      : platform

    return (
      <Button { ...otherProps } download href={ latest[platformActual] ? latest[platformActual].browser_download_url : '' }>
        { getIcon(platformActual, size) }
        { children }
      </Button>
    )
  }
}
