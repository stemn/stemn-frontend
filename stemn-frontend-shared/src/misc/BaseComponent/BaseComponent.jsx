import React from 'react'
import cn from 'classnames'

const BaseComponent = rootClass => (props) => {
  const { className, children, ...otherProps } = props
  return (
    <div className={ cn(rootClass, className) } { ...otherProps }>
      { props.children }
    </div>
  )
}

export default BaseComponent