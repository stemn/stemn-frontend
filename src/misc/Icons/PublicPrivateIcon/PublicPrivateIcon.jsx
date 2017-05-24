import React from 'react'
import MdPublic from 'react-icons/md/public'
import MdLockOutline from 'react-icons/md/lock-outline'

export default (props) => {
  const { style, private:priv, ...otherProps } = props

  return priv
    ? <MdLockOutline style={ Object.assign({}, { color: '#f5dbab' }, style) } { ...otherProps } />
    : <MdPublic      style={ Object.assign({}, { color: '#bbe8bb' }, style) } { ...otherProps } />
}
