import React from 'react'

// Styles
import styles from './NavButton.module.css'
import cn from 'classnames'

const NavButton = (props) => {
  const buttonClasses = cn({
    [styles.navButton]: true,
    [styles.active]: props.isActive,
  })
  return <button className={buttonClasses}>{props.children}</button>
}

export default NavButton
