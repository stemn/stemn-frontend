import React from 'react'

// Styles
import styles from './NavButton.css'
import cn from 'classnames'

export default (props) => {
  const buttonClasses = cn({
    [styles.navButton]: true,
    [styles.active]: props.isActive,
  })
  return (
    <button className={ buttonClasses }>{props.children}</button>
  )
}
