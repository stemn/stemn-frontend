import React from 'react'

// Styles
import styles from './NavButton.css'
import classNames from 'classnames'

export default (props) => {
  const buttonClasses = classNames({
    [styles.navButton]: true,
    [styles.active]: props.isActive,
  })
  return (
    <button className={ buttonClasses }>{props.children}</button>
  )
}
