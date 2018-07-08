import React from 'react'
import cn from 'classnames'
import classes from './NavPillContainer.css'

const NavPillContainer = (props) => {
  const { className, children, ...otherProps } = props
  return (
    <div className={ cn(classes.root, className) } { ...otherProps }>
      { props.children }
    </div>
  )
}

export default NavPillContainer