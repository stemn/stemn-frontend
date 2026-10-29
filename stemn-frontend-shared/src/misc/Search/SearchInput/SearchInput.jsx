import React from 'react'
import cn from 'classnames'
import classes from './SearchInput.module.css'
import { MdSearch } from 'react-icons/md'
import Input from 'stemn-shared/misc/Input/Input/Input'

const SearchInput = (props) => {
  const { style, className, ...otherProps } = props
  return (
    <div className={cn(classes.search, 'layout-row layout-align-start-center', className)} style={style}>
      <Input className="flex" {...otherProps} />
      <MdSearch className={classes.icon} size={20} />
    </div>
  )
}

export default SearchInput
