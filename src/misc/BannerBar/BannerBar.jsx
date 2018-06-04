import React from 'react'

import cn from 'classnames'
import s from './BannerBar.scss'

export default (props) => {
  const { children, className, type, ...otherProps } = props

  const c = cn(s.banner, { 
    [s.warn]: type === 'warn',
    [s.success]: type === 'success',
  }, className)
  
  return (
    <div
      className={ c } { ...otherProps }
    >
      { children }
    </div>
  )
}