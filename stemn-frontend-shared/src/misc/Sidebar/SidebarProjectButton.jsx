import React from 'react'
import { get } from 'lodash'

import cn from 'classnames'
import styles from './SidebarProjectButton.css'

import { Link } from 'react-router'
import book   from 'stemn-shared/assets/images/pure-vectors/book.svg'
import tutorial   from 'stemn-shared/assets/images/pure-vectors/monitor-click.svg'
import Drive   from 'stemn-shared/assets/icons/providers/drive.js'
import Dropbox   from 'stemn-shared/assets/icons/providers/dropbox.js'

export default (props) => {
  const iconStyle = { width: '22px', height: '22px' }
  const { item, key, to, clickFn, icon } = props

  const getIcon = (provider) => {
    if (provider === 'dropbox') {
      return <Dropbox size={ 14 } />
    } else if (provider === 'drive') {
      return <Drive size={ 14 } />
    }
    
    return <img src={ icon === 'tutorial' ? tutorial : book } style={ iconStyle } />
  }

  const inner = (
    <div className="layout-row layout-align-start-center">
      <div style={ iconStyle } className="layout-column layout-align-center-center">
        { getIcon(get(item, 'remote.provider')) }
      </div>
      <div className={ `${styles.text} flex` }>{ item.name }</div>
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
