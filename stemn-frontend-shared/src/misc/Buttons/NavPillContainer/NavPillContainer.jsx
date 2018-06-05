import React from 'react'
import classNames from 'classnames'
import classes from './NavPillContainer.css'

const NavPillContainer = (props) => {
  const { className, children, ...otherProps } = props
  return (
    <div className={ classNames(classes.root, className) } { ...otherProps }>
      { props.children }
    </div>
  )
}

export default NavPillContainer