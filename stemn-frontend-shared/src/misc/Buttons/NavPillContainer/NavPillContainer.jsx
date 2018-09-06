import React from 'react'
import cn from 'classnames'
import classes from './NavPillContainer.css'

const NavPillContainer = (props) => {
  const { className, children, ...otherProps } = props
  return (
    <div className={ cn(classes.root, className) } { ...otherProps } data-tag="nav-pills">
      { props.children }
    </div>
  )
}

export default NavPillContainer