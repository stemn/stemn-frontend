import React from 'react'
import MdPublic from 'react-icons/md/public'
import MdLockOutline from 'react-icons/md/lock-outline'

export default (props) => {
  const { type, style, ...otherProps } = props

  return props.type === 'public'
    ? <MdPublic      style={ Object.assign({}, { color: '#bbe8bb' }, style) } { ...otherProps } />
    : <MdLockOutline style={ Object.assign({}, { color: '#f5dbab' }, style) } { ...otherProps }/>
}
