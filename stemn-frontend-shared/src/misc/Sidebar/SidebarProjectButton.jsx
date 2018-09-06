import React from 'react'
import { get } from 'lodash'
import cn from 'classnames'
import styles from './SidebarProjectButton.css'
import { Link } from 'react-router'
import Drive   from 'stemn-shared/assets/icons/providers/drive.js'
import Dropbox   from 'stemn-shared/assets/icons/providers/dropbox.js'
import MdContentCopy from 'react-icons/md/content-copy'
import MdCloudOff from 'react-icons/md/cloud-off'

export default (props) => {
  const iconStyle = { width: '22px', height: '22px' }
  const { item, key, to, clickFn, icon } = props

  const isClone = item.clone && item.clone.source

  const getIcon = (provider) => {
    if (provider === 'dropbox') {
      return <Dropbox size={ 14 } />
    } else if (provider === 'drive') {
      return <Drive size={ 14 } />
    }
    return <MdCloudOff size={ 14 } />
  }

  const inner = (
    <div className="layout-row layout-align-start-center">
      <div style={ iconStyle } className="layout-column layout-align-center-center">
        { getIcon(get(item, 'remote.provider')) }
      </div>
      <div className={ `${styles.text} flex` }>{ item.name }</div>
      { isClone && <span title="Cloned project"><MdContentCopy /></span> }
    </div>
  )

  if (item) {
    if (to) {
      return (
        <Link
          className={ cn(styles.sidebarButton) }
          activeClassName="active"
          key={ key }
          to={ to }
          onClick={ () => { if (clickFn) { clickFn() } } }
        >
          { inner }
        </Link>
      )
    } 
    return (
      <a
        className={ cn(styles.sidebarButton) }
        key={ key }
        onClick={ () => { if (clickFn) { clickFn() } } }
      >
        { inner }
      </a>
    )
  } 
  return null
}

// <img src={props.icon === 'tutorial' ? tutorial : book} style={iconStyle}/>
