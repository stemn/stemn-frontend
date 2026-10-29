import React from 'react'
import { MdPublic } from 'react-icons/md'
import { MdLockOutline } from 'react-icons/md'

const PublicPrivateIcon = (props) => {
  const { style, noColor, private: priv, ...otherProps } = props

  return priv
    ? <MdLockOutline style={ noColor ? style : { ...style, color: '#f5dbab' } } { ...otherProps } />
    : <MdPublic      style={ noColor ? style : { ...style, color: '#bbe8bb' } } { ...otherProps } />
}

export default PublicPrivateIcon
